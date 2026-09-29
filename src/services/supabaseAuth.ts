// ============================================================================
// CrowdIQ - Supabase Authentication & Security Service
// Handles JWT-based identity, session management, and RBAC synchronization
// ============================================================================

import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { UserRole, UserProfile } from '../types/platform';
import { ROLES_CONFIG, INITIAL_PROFILES } from './dbClient';

export interface SupabaseAuthConfig {
  url: string;
  anonKey: string;
}

const STORAGE_KEY = 'crowdiq_supabase_auth_config';

class SupabaseAuthService {
  private client: SupabaseClient | null = null;
  private currentSession: Session | null = null;
  private listeners: Array<(session: Session | null, user: User | null) => void> = [];

  constructor() {
    this.initClient();
  }

  public getConfig(): SupabaseAuthConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.url && parsed.anonKey) return parsed;
      }
    } catch {
      // ignore JSON parse errors
    }

    // Default to Vite environment variables if present
    const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    return {
      url: envUrl,
      anonKey: envKey
    };
  }

  public saveConfig(config: SupabaseAuthConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save Supabase config in localStorage', e);
    }
    this.initClient();
  }

  public clearConfig(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove Supabase config', e);
    }
    this.client = null;
    this.currentSession = null;
  }

  private initClient(): void {
    const { url, anonKey } = this.getConfig();
    if (url && anonKey) {
      try {
        this.client = createClient(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: window.localStorage
          }
        });

        // Listen for auth state changes from Supabase
        this.client.auth.onAuthStateChange((_event, session) => {
          this.currentSession = session;
          this.notifyListeners(session, session?.user || null);
        });

        // Check active session
        this.client.auth.getSession().then(({ data }) => {
          this.currentSession = data.session;
          if (data.session) {
            this.notifyListeners(data.session, data.session.user);
          }
        });
      } catch (err) {
        console.error('Failed to instantiate Supabase client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public isConfigured(): boolean {
    const { url, anonKey } = this.getConfig();
    return Boolean(url && anonKey && this.client);
  }

  public onAuthStateChange(callback: (session: Session | null, user: User | null) => void): () => void {
    this.listeners.push(callback);
    // Immediate callback with current state
    callback(this.currentSession, this.currentSession?.user || null);

    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(session: Session | null, user: User | null) {
    this.listeners.forEach(cb => {
      try {
        cb(session, user);
      } catch (e) {
        console.error('Error in auth state change listener', e);
      }
    });
  }

  /**
   * Real Supabase Email/Password Sign Up with Role Metadata
   */
  public async signUp(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    organization?: string;
  }): Promise<{ success: boolean; user?: User | null; message: string }> {
    if (!this.client) {
      return {
        success: false,
        message: 'Supabase is not configured. Please enter your Supabase Project URL and Anon Key in Settings.'
      };
    }

    try {
      const { data, error } = await this.client.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            role: params.role,
            phone: params.phone || '',
            organization: params.organization || 'CrowdIQ Platform'
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        user: data.user,
        message: data.session 
          ? 'Account created and authenticated successfully!' 
          : 'Registration successful! Please check your email to verify your account.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'An unexpected error occurred during Supabase registration.'
      };
    }
  }

  /**
   * Real Supabase Email/Password Sign In
   */
  public async signIn(params: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; session?: Session | null; user?: User | null; message: string; role?: UserRole }> {
    if (!this.client) {
      return {
        success: false,
        message: 'Supabase is not configured. Please enter your Supabase credentials in Settings.'
      };
    }

    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: params.email,
        password: params.password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      this.currentSession = data.session;
      const userMeta = data.user?.user_metadata || {};
      const detectedRole = (userMeta.role as UserRole) || 'EVENT_ATTENDEE';

      return {
        success: true,
        session: data.session,
        user: data.user,
        role: detectedRole,
        message: 'Authenticated securely with Supabase JWT.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Supabase authentication failed.'
      };
    }
  }

  /**
   * Sign Out from Supabase
   */
  public async signOut(): Promise<{ success: boolean; message: string }> {
    if (!this.client) {
      return { success: true, message: 'Signed out locally.' };
    }

    try {
      const { error } = await this.client.auth.signOut();
      if (error) return { success: false, message: error.message };
      this.currentSession = null;
      return { success: true, message: 'Signed out from Supabase successfully.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Sign out failed.' };
    }
  }

  /**
   * Password Reset
   */
  public async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!this.client) {
      return { success: false, message: 'Supabase is not configured.' };
    }
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/profile`
      });
      if (error) return { success: false, message: error.message };
      return { success: true, message: 'Password recovery email dispatched.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Reset failed.' };
    }
  }

  /**
   * Test Connection to a Supabase project
   */
  public async testConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!url || !anonKey) {
      return { success: false, message: 'Please provide both Project URL and Public Anon Key.' };
    }

    const start = performance.now();
    try {
      const testClient = createClient(url, anonKey);
      const { data, error } = await testClient.auth.getSession();
      const latencyMs = Math.round(performance.now() - start);

      if (error) {
        return { success: false, message: `Auth ping error: ${error.message}`, latencyMs };
      }

      return {
        success: true,
        message: `Successfully connected to Supabase Auth (${latencyMs}ms)!`,
        latencyMs
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Connection failed: ${err.message || String(err)}`
      };
    }
  }

  /**
   * Helper: Maps a Supabase User object into a CrowdIQ UserProfile
   */
  public mapSupabaseUserToProfile(user: User): UserProfile {
    const meta = user.user_metadata || {};
    const role: UserRole = meta.role || 'EVENT_ATTENDEE';

    return {
      id: user.id,
      email: user.email || '',
      fullName: meta.full_name || user.email?.split('@')[0] || 'Authenticated Operator',
      avatarUrl: meta.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phone: meta.phone || '+1 (555) 019-2834',
      role: role,
      organization: meta.organization || 'CrowdIQ Platform Operations',
      designation: meta.designation || ROLES_CONFIG[role]?.name || 'Platform User',
      employeeOrOfficerId: meta.employee_or_officer_id || `SB-${user.id.substring(0, 6).toUpperCase()}`,
      certifications: meta.certifications || ['Supabase Verified Identity'],
      isActive: true,
      lastLoginAt: new Date().toISOString()
    };
  }
}

export const supabaseAuth = new SupabaseAuthService();
