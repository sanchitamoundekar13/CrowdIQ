// ============================================================================
// CrowdIQ - Global Platform Relational Context & RBAC State Provider
// ============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  EventItem, 
  ZoneItem, 
  CameraItem, 
  AlertRecord, 
  IncidentRecord, 
  IncidentStatus,
  EventRegistration, 
  AuditLogEntry, 
  SystemHealthService, 
  NotificationItem,
  UserRole,
  PermissionKey,
  RiskSeverity
} from '../types/platform';
import { 
  ROLES_CONFIG, 
  INITIAL_PROFILES, 
  INITIAL_EVENTS, 
  INITIAL_ZONES, 
  INITIAL_CAMERAS, 
  INITIAL_ALERTS, 
  INITIAL_INCIDENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SYSTEM_HEALTH, 
  INITIAL_NOTIFICATIONS 
} from '../services/dbClient';

interface PlatformContextType {
  // Auth & RBAC State
  currentUser: UserProfile;
  userRole: UserRole;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  loginAsRole: (role: UserRole) => void;
  loginWithEmail: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  hasPermission: (permission: PermissionKey) => boolean;
  updateCurrentUserProfile: (fields: Partial<UserProfile>) => void;

  // Selected Event Context
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  currentEvent: EventItem | undefined;

  // Events
  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id' | 'createdAt' | 'registeredAttendeesCount' | 'zonesCount' | 'camerasCount' | 'assignedStaffCount'>) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  // Zones
  zones: ZoneItem[];
  addZone: (zone: Omit<ZoneItem, 'id'>) => void;
  updateZone: (id: string, updates: Partial<ZoneItem>) => void;

  // Cameras
  cameras: CameraItem[];
  addCamera: (camera: Omit<CameraItem, 'id'>) => void;
  updateCamera: (id: string, updates: Partial<CameraItem>) => void;
  toggleCameraStatus: (id: string) => void;

  // Alerts
  alerts: AlertRecord[];
  activeAlertsCount: number;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  escalateAlertToIncident: (alertId: string) => void;

  // Incidents
  incidents: IncidentRecord[];
  activeIncidentsCount: number;
  createIncident: (incident: {
    eventId: string;
    zoneId?: string;
    zoneName: string;
    location: string;
    type: string;
    severity: RiskSeverity;
    description: string;
    assignedOfficers?: string[];
  }) => IncidentRecord;
  updateIncidentStatus: (incidentId: string, newStatus: IncidentStatus, notes?: string) => void;
  assignIncidentResponse: (incidentId: string, commander: string, officers: string[]) => void;
  resolveIncident: (incidentId: string, resolution: string) => void;

  // Event Registrations & Attendee Digital Passes
  registrations: EventRegistration[];
  registerForEvent: (data: {
    eventId: string;
    fullName: string;
    email: string;
    phone: string;
    attendanceDate: string;
    expectedArrivalTime: string;
    accompanyingPeople: number;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship: string;
    accessibilityAssistance: boolean;
    consentAgreed: boolean;
  }) => EventRegistration;
  cancelRegistration: (registrationId: string) => void;

  // User Management
  users: UserProfile[];
  createUser: (user: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  toggleUserStatus: (id: string) => void;
  updateUserRole: (id: string, newRole: UserRole) => void;

  // Roles & Permissions Matrix Management
  rolePermissions: Record<UserRole, PermissionKey[]>;
  updateRolePermission: (role: UserRole, permission: PermissionKey, enabled: boolean) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  logAction: (action: string, resource: string, description: string, status?: 'SUCCESS' | 'FAILED' | 'WARNING') => void;

  // System Health
  systemHealth: SystemHealthService[];

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
}

const PlatformContext = createContext<PlatformContextType | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth & Profiles
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_PROFILES);
  // Default active user is ADMIN (Marcus Vance) for comprehensive overview
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_PROFILES[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // 2. Events & Selected Event Context
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string>('evt-001');

  // 3. Zones & Cameras
  const [zones, setZones] = useState<ZoneItem[]>(INITIAL_ZONES);
  const [cameras, setCameras] = useState<CameraItem[]>(INITIAL_CAMERAS);

  // 4. Alerts & Incidents
  const [alerts, setAlerts] = useState<AlertRecord[]>(INITIAL_ALERTS);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(INITIAL_INCIDENTS);

  // 5. Registrations & Passes
  const [registrations, setRegistrations] = useState<EventRegistration[]>(INITIAL_REGISTRATIONS);

  // 6. Audit Logs & System Health
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [systemHealth] = useState<SystemHealthService[]>(INITIAL_SYSTEM_HEALTH);

  // 7. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // 8. RBAC Matrix
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, PermissionKey[]>>({
    ADMIN: [...ROLES_CONFIG.ADMIN.permissions],
    INCIDENT_COMMANDER: [...ROLES_CONFIG.INCIDENT_COMMANDER.permissions],
    SECURITY_OFFICER: [...ROLES_CONFIG.SECURITY_OFFICER.permissions],
    OPERATIONS_DIRECTOR: [...ROLES_CONFIG.OPERATIONS_DIRECTOR.permissions],
    EVENT_ATTENDEE: [...ROLES_CONFIG.EVENT_ATTENDEE.permissions],
  });

  const userRole = currentUser.role;

  // Active counts
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
  const unreadNotificationsCount = notifications.filter(n => !n.isRead && (!n.targetRole || n.targetRole === userRole)).length;

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  // RBAC Permission Check
  const hasPermission = (permission: PermissionKey): boolean => {
    if (userRole === 'ADMIN') return true;
    const permissionsForRole = rolePermissions[userRole] || [];
    return permissionsForRole.includes(permission);
  };

  // Switch active role smoothly
  const switchRole = (role: UserRole) => {
    const profile = users.find(u => u.role === role) || {
      ...INITIAL_PROFILES[0],
      id: `usr-${role.toLowerCase()}`,
      role: role,
      fullName: `Authorized ${ROLES_CONFIG[role].name}`
    };
    setCurrentUser(profile);
    setIsAuthenticated(true);
    logAction('ROLE_SWITCH', `ROLE:${role}`, `User session switched role to ${role}`);
  };

  const loginAsRole = (role: UserRole) => {
    switchRole(role);
  };

  const loginWithEmail = (email: string, role?: UserRole): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      logAction('USER_LOGIN', `USER:${found.id}`, `User ${found.email} logged in successfully`);
      return true;
    }
    if (role) {
      switchRole(role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    logAction('USER_LOGOUT', `USER:${currentUser.id}`, `User ${currentUser.email} logged out`);
  };

  const updateCurrentUserProfile = (fields: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...fields }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...fields } : u));
    logAction('PROFILE_UPDATE', `USER:${currentUser.id}`, `User profile updated`);
  };

  // Action Logger for Audit Trail
  const logAction = (action: string, resource: string, description: string, status: 'SUCCESS' | 'FAILED' | 'WARNING' = 'SUCCESS') => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    const dateFormatted = now.toISOString().split('T')[0];
    
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: `${dateFormatted} ${timeFormatted}`,
      user: currentUser.fullName,
      userEmail: currentUser.email,
      role: currentUser.role,
      action,
      resource,
      description,
      ipAddress: '192.168.10.' + (Math.floor(Math.random() * 80) + 10),
      status
    };
    setAuditLogs(prev => [newEntry, ...prev.slice(0, 99)]);
  };

  // Events CRUD
  const addEvent = (eventData: Omit<EventItem, 'id' | 'createdAt' | 'registeredAttendeesCount' | 'zonesCount' | 'camerasCount' | 'assignedStaffCount'>) => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-00${events.length + 1}`,
      registeredAttendeesCount: 0,
      zonesCount: 4,
      camerasCount: 16,
      assignedStaffCount: 20,
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
    logAction('EVENT_CREATED', `EVENT:${newEvent.id}`, `Created event "${newEvent.name}"`);
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    logAction('EVENT_UPDATED', `EVENT:${id}`, `Updated event settings for ${id}`);
  };

  const deleteEvent = (id: string) => {
    const ev = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    logAction('EVENT_DELETED', `EVENT:${id}`, `Deleted event "${ev?.name || id}"`);
  };

  // Zones CRUD
  const addZone = (zoneData: Omit<ZoneItem, 'id'>) => {
    const newZone: ZoneItem = {
      ...zoneData,
      id: `zone-${Date.now().toString().slice(-4)}`
    };
    setZones(prev => [...prev, newZone]);
    logAction('ZONE_CREATED', `ZONE:${newZone.id}`, `Added zone "${newZone.name}"`);
  };

  const updateZone = (id: string, updates: Partial<ZoneItem>) => {
    setZones(prev => prev.map(z => z.id === id ? { ...z, ...updates } : z));
    logAction('ZONE_UPDATED', `ZONE:${id}`, `Updated zone parameters for ${id}`);
  };

  // Cameras CRUD
  const addCamera = (cameraData: Omit<CameraItem, 'id'>) => {
    const newCam: CameraItem = {
      ...cameraData,
      id: `cam-${Date.now().toString().slice(-4)}`
    };
    setCameras(prev => [...prev, newCam]);
    logAction('CAMERA_ADDED', `CAMERA:${newCam.cameraCode}`, `Added camera node ${newCam.name}`);
  };

  const updateCamera = (id: string, updates: Partial<CameraItem>) => {
    setCameras(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logAction('CAMERA_UPDATED', `CAMERA:${id}`, `Updated camera parameters for ${id}`);
  };

  const toggleCameraStatus = (id: string) => {
    setCameras(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        logAction('CAMERA_STATUS_TOGGLED', `CAMERA:${c.cameraCode}`, `Set status to ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Alerts Management
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'ACKNOWLEDGED',
          acknowledgedBy: currentUser.fullName,
          acknowledgedAt: 'Just now'
        };
      }
      return a;
    }));
    logAction('ALERT_ACKNOWLEDGED', `ALERT:${alertId}`, `Acknowledged by ${currentUser.fullName}`);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'RESOLVED',
          resolvedBy: currentUser.fullName,
          resolvedAt: 'Just now'
        };
      }
      return a;
    }));
    logAction('ALERT_RESOLVED', `ALERT:${alertId}`, `Marked resolved by ${currentUser.fullName}`);
  };

  const escalateAlertToIncident = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    acknowledgeAlert(alertId);
    createIncident({
      eventId: alert.eventId,
      zoneId: alert.zoneId,
      zoneName: alert.zoneName,
      location: alert.location,
      type: alert.type,
      severity: alert.severity,
      description: `Escalated from Alert ${alertId}: ${alert.description}`,
      assignedOfficers: ['Squad Alpha']
    });
  };

  // Incidents Management
  const createIncident = (incidentData: {
    eventId: string;
    zoneId?: string;
    zoneName: string;
    location: string;
    type: string;
    severity: RiskSeverity;
    description: string;
    assignedOfficers?: string[];
  }): IncidentRecord => {
    const incNumber = `INC-2026-${String(incidents.length + 82).padStart(3, '0')}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    
    const newInc: IncidentRecord = {
      id: `inc-${Date.now()}`,
      incidentNumber: incNumber,
      eventId: incidentData.eventId,
      zoneId: incidentData.zoneId,
      zoneName: incidentData.zoneName,
      location: incidentData.location,
      type: incidentData.type,
      severity: incidentData.severity,
      description: incidentData.description,
      detectedTime: nowTime,
      reportedBy: `${currentUser.fullName} (${currentUser.role})`,
      reportedById: currentUser.id,
      assignedCommander: userRole === 'INCIDENT_COMMANDER' ? currentUser.fullName : 'Cmdr. Sarah Keller',
      assignedOfficers: incidentData.assignedOfficers || ['Officer K. Reyes'],
      status: 'DETECTED',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          action: 'INCIDENT_DETECTED',
          performedBy: currentUser.fullName,
          description: `Incident logged: ${incidentData.description}`,
          timestamp: nowTime
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIncidents(prev => [newInc, ...prev]);
    logAction('INCIDENT_CREATED', `INCIDENT:${incNumber}`, `Logged incident ${incNumber} (${incidentData.type})`);
    
    // Auto broadcast notification
    addNotification({
      category: 'INCIDENT',
      title: `New Incident Logged: ${incNumber}`,
      message: `${incidentData.severity} severity incident reported at ${incidentData.location}.`,
      actionLink: 'incidents'
    });

    return newInc;
  };

  const updateIncidentStatus = (incidentId: string, newStatus: IncidentStatus, notes?: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const newTimelineEntry = {
          id: `tl-${Date.now()}`,
          action: newStatus,
          performedBy: currentUser.fullName,
          description: notes || `Status changed from ${inc.status} to ${newStatus}`,
          timestamp: nowTime
        };
        return {
          ...inc,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          timeline: [...inc.timeline, newTimelineEntry]
        };
      }
      return inc;
    }));

    logAction('INCIDENT_STATUS_CHANGE', `INCIDENT:${incidentId}`, `Status changed to ${newStatus}`);
  };

  const assignIncidentResponse = (incidentId: string, commander: string, officers: string[]) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          assignedCommander: commander,
          assignedOfficers: officers,
          status: inc.status === 'DETECTED' ? 'RESPONSE_ASSIGNED' : inc.status,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...inc.timeline,
            {
              id: `tl-${Date.now()}`,
              action: 'RESPONSE_ASSIGNED',
              performedBy: currentUser.fullName,
              description: `Assigned Commander ${commander} and Officers: ${officers.join(', ')}`,
              timestamp: nowTime
            }
          ]
        };
      }
      return inc;
    }));

    logAction('INCIDENT_ASSIGNMENT', `INCIDENT:${incidentId}`, `Assigned response team`);
  };

  const resolveIncident = (incidentId: string, resolution: string) => {
    updateIncidentStatus(incidentId, 'RESOLVED', resolution);
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, resolution } : inc));
    logAction('INCIDENT_RESOLVED', `INCIDENT:${incidentId}`, `Resolution: ${resolution}`);
  };

  // Event Registration Flow (Major Feature)
  const registerForEvent = (data: {
    eventId: string;
    fullName: string;
    email: string;
    phone: string;
    attendanceDate: string;
    expectedArrivalTime: string;
    accompanyingPeople: number;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship: string;
    accessibilityAssistance: boolean;
    consentAgreed: boolean;
  }): EventRegistration => {
    const event = events.find(e => e.id === data.eventId) || events[0];
    const regCode = `CQ-${event.name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const assignedGate = event.recommendedGates && event.recommendedGates.length > 0 
      ? event.recommendedGates[Math.floor(Math.random() * event.recommendedGates.length)]
      : 'Gate 1 (Main Entrance)';

    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      registrationCode: regCode,
      eventId: data.eventId,
      eventName: event.name,
      eventLocation: event.location,
      eventDate: data.attendanceDate,
      eventStartTime: '09:00 AM IST',
      attendeeId: currentUser.id,
      attendeeName: data.fullName,
      attendeeEmail: data.email,
      attendeePhone: data.phone,
      attendanceDate: data.attendanceDate,
      expectedArrivalTime: data.expectedArrivalTime,
      accompanyingPeople: data.accompanyingPeople,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhone: data.emergencyContactPhone,
      emergencyContactRelationship: data.emergencyContactRelationship,
      accessibilityAssistance: data.accessibilityAssistance,
      consentAgreed: data.consentAgreed,
      assignedGate,
      qrCodeData: `CROWDIQ-PASS:${event.id}:${regCode}:${assignedGate}:${data.fullName}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    setRegistrations(prev => [newReg, ...prev]);

    // Increment registered attendees count on event
    setEvents(prev => prev.map(e => e.id === data.eventId ? { ...e, registeredAttendeesCount: e.registeredAttendeesCount + 1 + data.accompanyingPeople } : e));

    logAction('EVENT_REGISTRATION', `EVENT:${event.id}`, `Attendee ${data.fullName} confirmed pass ${regCode}`);
    
    addNotification({
      category: 'REGISTRATION',
      title: 'Event Registration Confirmed!',
      message: `Your pass for ${event.name} is ready. Entry gate: ${assignedGate}.`,
      targetRole: 'EVENT_ATTENDEE',
      actionLink: 'dashboard'
    });

    return newReg;
  };

  const cancelRegistration = (registrationId: string) => {
    setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, status: 'CANCELLED' } : r));
    logAction('REGISTRATION_CANCELLED', `REG:${registrationId}`, `Registration cancelled by attendee`);
  };

  // User Management
  const createUser = (userData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    logAction('USER_CREATED', `USER:${newUser.email}`, `Created user account with role ${newUser.role}`);
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    logAction('USER_UPDATED', `USER:${id}`, `Updated user details`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = !u.isActive;
        logAction(nextStatus ? 'USER_ENABLED' : 'USER_DISABLED', `USER:${u.email}`, `Account ${nextStatus ? 'activated' : 'deactivated'}`);
        return { ...u, isActive: nextStatus };
      }
      return u;
    }));
  };

  const updateUserRole = (id: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        logAction('ROLE_CHANGED', `USER:${u.email}`, `Changed role from ${u.role} to ${newRole}`);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  // Roles & Permissions Matrix
  const updateRolePermission = (role: UserRole, permission: PermissionKey, enabled: boolean) => {
    setRolePermissions(prev => {
      const currentPerms = prev[role] || [];
      const updated = enabled 
        ? Array.from(new Set([...currentPerms, permission]))
        : currentPerms.filter(p => p !== permission);
      return { ...prev, [role]: updated };
    });
    logAction('ROLE_PERMISSION_CHANGED', `ROLE:${role}`, `${enabled ? 'Granted' : 'Revoked'} permission: ${permission}`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <PlatformContext.Provider value={{
      currentUser,
      userRole,
      isAuthenticated,
      switchRole,
      loginAsRole,
      loginWithEmail,
      logout,
      hasPermission,
      updateCurrentUserProfile,

      selectedEventId,
      setSelectedEventId,
      currentEvent,

      events,
      addEvent,
      updateEvent,
      deleteEvent,

      zones,
      addZone,
      updateZone,

      cameras,
      addCamera,
      updateCamera,
      toggleCameraStatus,

      alerts,
      activeAlertsCount,
      acknowledgeAlert,
      resolveAlert,
      escalateAlertToIncident,

      incidents,
      activeIncidentsCount,
      createIncident,
      updateIncidentStatus,
      assignIncidentResponse,
      resolveIncident,

      registrations,
      registerForEvent,
      cancelRegistration,

      users,
      createUser,
      updateUser,
      toggleUserStatus,
      updateUserRole,

      rolePermissions,
      updateRolePermission,

      auditLogs,
      logAction,

      systemHealth,

      notifications,
      unreadNotificationsCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      addNotification
    }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
