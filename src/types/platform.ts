// ============================================================================
// CrowdIQ - Core TypeScript Domain Models & RBAC Types
// ============================================================================

export type UserRole = 
  | 'ADMIN'
  | 'INCIDENT_COMMANDER'
  | 'SECURITY_OFFICER'
  | 'OPERATIONS_DIRECTOR'
  | 'EVENT_ATTENDEE';

export type PermissionKey =
  | 'users.read'
  | 'users.manage'
  | 'events.read'
  | 'events.create'
  | 'events.manage'
  | 'zones.read'
  | 'zones.manage'
  | 'cameras.read'
  | 'cameras.manage'
  | 'alerts.read'
  | 'alerts.manage'
  | 'incidents.read'
  | 'incidents.create'
  | 'incidents.manage'
  | 'analytics.read'
  | 'reports.read'
  | 'reports.generate'
  | 'system.read'
  | 'system.manage'
  | 'audit.read';

export interface RoleConfig {
  id: UserRole;
  name: string;
  badge: string;
  description: string;
  defaultPermissions: PermissionKey[];
  homeRoute: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  role: UserRole;
  organization?: string;
  designation?: string;
  employeeOrOfficerId?: string;
  assignedEvents?: string[];
  assignedZoneId?: string;
  currentShift?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  preferredLanguage?: string;
  accessibilityPreference?: string;
  certifications?: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export type EventStatus = 'Upcoming' | 'Live' | 'Paused' | 'Completed' | 'Cancelled';

export interface EventItem {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  expectedCapacity: number;
  maxCapacity: number;
  status: EventStatus;
  organizer: string;
  publicStatus: 'NORMAL' | 'HIGH CROWD' | 'RESTRICTED';
  publicSafetyAnnouncement?: string;
  recommendedGates?: string[];
  registeredAttendeesCount: number;
  zonesCount: number;
  camerasCount: number;
  assignedStaffCount: number;
  createdAt: string;
}

export type RiskSeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ZoneItem {
  id: string;
  eventId: string;
  name: string;
  shortName: string;
  category: 'GATE' | 'STAGE' | 'FACILITY' | 'EXIT' | 'SECURITY' | 'CONCOURSE';
  location: string;
  capacity: number;
  currentCrowd: number;
  density: number; // percentage
  flowDirection: string;
  inflowRate: number;
  outflowRate: number;
  riskLevel: RiskSeverity;
  riskScore: number;
  riskReason: string;
  assignedCamerasCount: number;
  assignedOfficers: string[];
}

export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';

export interface CameraItem {
  id: string;
  cameraCode: string;
  name: string;
  location: string;
  zoneId: string;
  zoneName: string;
  eventId: string;
  status: CameraStatus;
  fps: number;
  resolution: string;
  lastHeartbeat: string;
  currentPeopleCount: number;
  densityEstimate: number;
  flowVector: { x: number; y: number; magnitude: number; direction: string };
  streamUrl?: string;
}

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface AlertRecord {
  id: string;
  eventId: string;
  zoneId: string;
  zoneName: string;
  cameraName?: string;
  severity: RiskSeverity;
  type: string;
  location: string;
  description: string;
  timestamp: string;
  status: AlertStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export type IncidentStatus = 
  | 'DETECTED'
  | 'ACKNOWLEDGED'
  | 'INVESTIGATING'
  | 'RESPONSE_ASSIGNED'
  | 'RESPONSE_IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

export interface IncidentTimelineEntry {
  id: string;
  action: string;
  performedBy: string;
  description: string;
  timestamp: string;
}

export interface IncidentRecord {
  id: string;
  incidentNumber: string;
  eventId: string;
  zoneId?: string;
  zoneName: string;
  location: string;
  type: string;
  severity: RiskSeverity;
  description: string;
  detectedTime: string;
  reportedBy: string;
  reportedById?: string;
  assignedCommander?: string;
  assignedOfficers: string[];
  status: IncidentStatus;
  resolution?: string;
  attachments?: { name: string; url: string; type: string }[];
  timeline: IncidentTimelineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  registrationCode: string;
  eventId: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  eventStartTime: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  attendanceDate: string;
  expectedArrivalTime: string;
  accompanyingPeople: number;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  accessibilityAssistance: boolean;
  consentAgreed: boolean;
  assignedGate: string;
  qrCodeData: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  role: string;
  action: string;
  resource: string;
  description: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface SystemHealthService {
  id: string;
  serviceName: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  uptimePercentage: number;
  latencyMs: number;
  lastHeartbeat: string;
  details?: Record<string, any>;
}

export type NotificationCategory = 'SECURITY' | 'EVENT' | 'INCIDENT' | 'SYSTEM' | 'REGISTRATION';

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetRole?: UserRole;
  actionLink?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'EVENT_SUMMARY' | 'CROWD_DENSITY' | 'INCIDENT_AUDIT' | 'ALERT_ANALYSIS' | 'CAMERA_TELEMETRY' | 'SECURITY_OPERATIONS';
  generatedAt: string;
  generatedBy: string;
  fileFormat: 'CSV' | 'PDF' | 'JSON';
  recordCount: number;
  fileSize: string;
}
