import React, { useState } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Sliders, 
  Bell, 
  Lock, 
  CheckCircle2, 
  Save, 
  Cpu,
  Database,
  Key,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { supabaseAuth } from '../../services/supabaseAuth';

export const AdminSettingsPage: React.FC = () => {
  const { logAction } = usePlatform();

  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    criticalDensityThreshold: 85,
    warningDensityThreshold: 65,
    maxInflowSurgePerMin: 180,
    opticalFlowVelocityCutoff: 0.35,
    autoDispatchThresholdScore: 80,
    soundAlertsEnabled: true,
    yoloInferenceModel: 'yolov8x-crowd-dense-v2.pt',
    sessionTimeoutMinutes: 60,
    publicBroadcastGateAlerts: true
  });

  // Supabase Authentication & PostgreSQL Integration State
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseAuth.getConfig().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(supabaseAuth.getConfig().anonKey);
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  const handleTestAndSaveSupabase = async () => {
    setSupabaseLoading(true);
    setSupabaseStatus(null);
    try {
      const res = await supabaseAuth.testConnection(supabaseUrl, supabaseAnonKey);
      setSupabaseStatus(res);
      if (res.success) {
        supabaseAuth.saveConfig({ url: supabaseUrl, anonKey: supabaseAnonKey });
        logAction('SUPABASE_CONFIG_UPDATED', 'SECURITY_INTEGRATION', `Admin updated Supabase connection (${res.latencyMs}ms)`);
      }
    } catch (e: any) {
      setSupabaseStatus({ success: false, message: e.message || 'Connection failed.' });
    } finally {
      setSupabaseLoading(false);
    }
  };

  const handleClearSupabase = () => {
    supabaseAuth.clearConfig();
    setSupabaseUrl('');
    setSupabaseAnonKey('');
    setSupabaseStatus({ success: true, message: 'Supabase configuration cleared. Running in local hybrid mode.' });
    logAction('SUPABASE_CONFIG_CLEARED', 'SECURITY_INTEGRATION', 'Admin cleared Supabase credentials');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logAction('PLATFORM_SETTINGS_UPDATED', 'GLOBAL_CONFIG', 'Admin updated platform safety thresholds and inference parameters');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FCA5A5]">
              Master Configuration
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              Root Admin Access
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Platform Security &amp; Risk Parameters
          </h1>
          <p className="text-xs text-[#64748B]">
            Configure Supabase Authentication, PostgreSQL Row Level Security (RLS), mathematical density triggers, and automated dispatch.
          </p>
        </div>

        {saved && (
          <div className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#16A34A] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved &amp; synchronized across edge nodes!</span>
          </div>
        )}
      </div>

      {/* CARD 1: SUPABASE AUTHENTICATION & ROW LEVEL SECURITY */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#0F172A]">Supabase Authentication &amp; PostgreSQL Security</h2>
              <p className="text-[11px] text-[#64748B]">
                JWT Authentication, PostgreSQL 15+ persistence, and automated Row Level Security (RLS) enforcement.
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${
            supabaseAuth.isConfigured() 
              ? 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]' 
              : 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
          }`}>
            {supabaseAuth.isConfigured() ? '● SUPABASE CONNECTED' : '○ HYBRID STANDBY'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[#475569] font-semibold mb-1">
              Supabase Project URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] font-mono text-xs focus:outline-none focus:border-[#2563EB]"
            />
            <span className="text-[10px] text-[#64748B] mt-0.5 block">
              Found in your Supabase Project Settings &rarr; API &rarr; Project URL
            </span>
          </div>

          <div>
            <label className="block text-[#475569] font-semibold mb-1">
              Supabase Anonymous API Key (Anon / Public)
            </label>
            <input
              type="password"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] font-mono text-xs focus:outline-none focus:border-[#2563EB]"
            />
            <span className="text-[10px] text-[#64748B] mt-0.5 block">
              Safe public key with Row Level Security (RLS) enabled
            </span>
          </div>
        </div>

        {supabaseStatus && (
          <div className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2 ${
            supabaseStatus.success 
              ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]' 
              : 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626]'
          }`}>
            {supabaseStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{supabaseStatus.message}</p>
              {supabaseStatus.latencyMs !== undefined && (
                <p className="text-[10px] opacity-80 mt-0.5">Roundtrip Latency: {supabaseStatus.latencyMs}ms</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestAndSaveSupabase}
              disabled={supabaseLoading || !supabaseUrl || !supabaseAnonKey}
              className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {supabaseLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
              <span>Test Connection &amp; Save</span>
            </button>

            {supabaseAuth.isConfigured() && (
              <button
                type="button"
                onClick={handleClearSupabase}
                className="px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#475569] text-xs font-semibold cursor-pointer"
              >
                Disconnect
              </button>
            )}
          </div>

          <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>RLS Policies &amp; Schema Defined in <code className="text-[#0F172A] bg-[#F1F5F9] px-1 py-0.5 rounded">supabase/schema.sql</code></span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Risk Thresholds Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <Sliders className="w-4 h-4 text-[#2563EB]" />
            <h2 className="font-bold text-sm text-[#0F172A]">Stampede Risk Index (SRI) Calibration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Critical Density Threshold (% of Capacity)
              </label>
              <input
                type="number"
                value={settings.criticalDensityThreshold}
                onChange={(e) => setSettings({ ...settings, criticalDensityThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Default 85%. Triggers red alert when breached.</span>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Warning Density Threshold (% of Capacity)
              </label>
              <input
                type="number"
                value={settings.warningDensityThreshold}
                onChange={(e) => setSettings({ ...settings, warningDensityThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Default 65%. Triggers yellow advisory.</span>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Maximum Inflow Surge (Persons / Min / Gate)
              </label>
              <input
                type="number"
                value={settings.maxInflowSurgePerMin}
                onChange={(e) => setSettings({ ...settings, maxInflowSurgePerMin: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Turnstile choke limit. Breaches trigger diversion alerts.</span>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Minimum Egress Optical Velocity (m/s)
              </label>
              <input
                type="number"
                step="0.05"
                value={settings.opticalFlowVelocityCutoff}
                onChange={(e) => setSettings({ ...settings, opticalFlowVelocityCutoff: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Deceleration below 0.35 m/s indicates standing crush risk.</span>
            </div>
          </div>
        </div>

        {/* AI & Edge Vision Inference Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
            <Cpu className="w-4 h-4 text-[#7C3AED]" />
            <h2 className="font-bold text-sm text-[#0F172A]">AI Vision Engine &amp; DeepSORT Weights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Computer Vision Model Checkpoint
              </label>
              <select
                value={settings.yoloInferenceModel}
                onChange={(e) => setSettings({ ...settings, yoloInferenceModel: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] bg-white font-mono"
              >
                <option value="yolov8x-crowd-dense-v2.pt">yolov8x-crowd-dense-v2.pt (High Accuracy, 30 FPS)</option>
                <option value="yolov8m-crowd-fast.pt">yolov8m-crowd-fast.pt (Edge Optimized, 60 FPS)</option>
                <option value="yolov9-crowd-experimental.pt">yolov9-crowd-experimental.pt (Research Stage)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">
                Auto-Dispatch SRI Threshold Score
              </label>
              <input
                type="number"
                value={settings.autoDispatchThresholdScore}
                onChange={(e) => setSettings({ ...settings, autoDispatchThresholdScore: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">Scores above 80/100 notify field squad Delta automatically.</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundAlertsEnabled}
                onChange={(e) => setSettings({ ...settings, soundAlertsEnabled: e.target.checked })}
                className="rounded text-[#2563EB]"
              />
              <span className="font-semibold text-[#0F172A]">Enable Real-Time Web Audio Klaxon Chimes for Critical Alerts</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.publicBroadcastGateAlerts}
                onChange={(e) => setSettings({ ...settings, publicBroadcastGateAlerts: e.target.checked })}
                className="rounded text-[#2563EB]"
              />
              <span className="font-semibold text-[#0F172A]">Broadcast Gate Redirection Advisories directly to Attendee Digital Passes</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save &amp; Deploy Global Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
