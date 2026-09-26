// ============================================================================
// CrowdIQ - Supabase & Relational Store Service
// Graceful hybrid client: Connects to live Supabase PostgreSQL when environment 
// variables exist, and falls back to a high-fidelity in-memory relational store.
// ============================================================================

import { 
  UserProfile, 
  EventItem, 
  ZoneItem, 
  CameraItem, 
  AlertRecord, 
  IncidentRecord, 
  EventRegistration, 
  AuditLogEntry, 
  SystemHealthService, 
  NotificationItem,
  UserRole,
  PermissionKey
} from '../types/platform';

// RBAC Role Definition Map
export const ROLES_CONFIG: Record<UserRole, {
  name: string;
  badge: string;
  description: string;
  permissions: PermissionKey[];
  homeRoute: string;
}> = {
  ADMIN: {
    name: 'Administrator',
    badge: 'ROOT ADMIN',
    description: 'Master access across all platform nodes, user provisioning, security policies, and audit logs.',
    permissions: [
      'users.read', 'users.manage',
      'events.read', 'events.create', 'events.manage',
      'zones.read', 'zones.manage',
      'cameras.read', 'cameras.manage',
      'alerts.read', 'alerts.manage',
      'incidents.read', 'incidents.create', 'incidents.manage',
      'analytics.read',
      'reports.read', 'reports.generate',
      'system.read', 'system.manage',
      'audit.read'
    ],
    homeRoute: 'dashboard'
  },
  INCIDENT_COMMANDER: {
    name: 'Incident Commander',
    badge: 'COMMANDER',
    description: 'High-clearance incident response, squad tactical dispatch, hazard triage, and emergency control.',
    permissions: [
      'events.read',
      'zones.read',
      'cameras.read',
      'alerts.read', 'alerts.manage',
      'incidents.read', 'incidents.create', 'incidents.manage',
      'analytics.read',
      'reports.read', 'reports.generate'
    ],
    homeRoute: 'dashboard'
  },
  SECURITY_OFFICER: {
    name: 'Security Officer',
    badge: 'FIELD OFFICER',
    description: 'Action-oriented on-the-ground sector security, perimeter patrol, incident logging, and gate scans.',
    permissions: [
      'events.read',
      'zones.read',
      'cameras.read',
      'alerts.read',
      'incidents.read', 'incidents.create'
    ],
    homeRoute: 'dashboard'
  },
  OPERATIONS_DIRECTOR: {
    name: 'Operations Director',
    badge: 'OPERATIONS',
    description: 'Strategic event oversight, multi-zone capacity planning, macro analytics, and executive compliance.',
    permissions: [
      'events.read', 'events.create', 'events.manage',
      'zones.read',
      'cameras.read',
      'alerts.read',
      'incidents.read',
      'analytics.read',
      'reports.read', 'reports.generate'
    ],
    homeRoute: 'dashboard'
  },
  EVENT_ATTENDEE: {
    name: 'Event Attendee',
    badge: 'PUBLIC ATTENDEE',
    description: 'Public event attendee with access to digital entrance QR pass, safety advisories, and gate directions.',
    permissions: [
      'events.read'
    ],
    homeRoute: 'dashboard'
  }
};

// Seed Profiles for instant 1-click role testing
export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'usr-admin-01',
    email: 'admin@crowdiq.security',
    fullName: 'Chief Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 019-2834',
    role: 'ADMIN',
    organization: 'CrowdIQ Core Security Operations',
    designation: 'Principal Security Architect & Root Administrator',
    employeeOrOfficerId: 'ADM-ROOT-901',
    certifications: ['CISSP', 'FEMA ICS-400 Incident Command', 'Crowd Safety Mgmt Level 5'],
    isActive: true,
    lastLoginAt: 'Just now',
    createdAt: '2025-01-10T08:00:00Z'
  },
  {
    id: 'usr-ic-02',
    email: 'commander.keller@metropolitan.gov',
    fullName: 'Cmdr. Sarah Keller',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 349-8812',
    role: 'INCIDENT_COMMANDER',
    organization: 'Metropolitan Emergency Management Bureau',
    designation: 'Lead Incident Commander',
    employeeOrOfficerId: 'IC-DELTA-44',
    assignedEvents: ['evt-001', 'evt-002'],
    emergencyContactName: 'Deputy Chief Davis',
    emergencyContactPhone: '+1 (555) 991-0023',
    certifications: ['FEMA ICS-300', 'Mass Gathering Crowd Safety Protocol', 'Tactical Evacuation'],
    isActive: true,
    lastLoginAt: '12 min ago',
    createdAt: '2025-02-14T09:30:00Z'
  },
  {
    id: 'usr-so-03',
    email: 'officer.reyes@fieldsec.com',
    fullName: 'Officer Kevin Reyes',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 672-1190',
    role: 'SECURITY_OFFICER',
    organization: 'Apex Protective Field Services',
    designation: 'Field Security Specialist - Sector Alpha',
    employeeOrOfficerId: 'SO-SECTOR-A18',
    assignedEvents: ['evt-001'],
    assignedZoneId: 'zone-01',
    currentShift: 'Day Shift (08:00 - 18:00 IST)',
    emergencyContactName: 'Maria Reyes (Spouse)',
    emergencyContactPhone: '+1 (555) 672-9900',
    isActive: true,
    lastLoginAt: '35 min ago',
    createdAt: '2025-03-01T11:00:00Z'
  },
  {
    id: 'usr-od-04',
    email: 'director.chen@metropolitanarena.com',
    fullName: 'Director David Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 819-3342',
    role: 'OPERATIONS_DIRECTOR',
    organization: 'Metropolitan Arena Authority',
    designation: 'VP of Venue Operations & Crowd Intelligence',
    employeeOrOfficerId: 'OD-EXEC-09',
    assignedEvents: ['evt-001', 'evt-002', 'evt-003', 'evt-004'],
    isActive: true,
    lastLoginAt: '1 hour ago',
    createdAt: '2025-01-20T14:15:00Z'
  },
  {
    id: 'usr-att-05',
    email: 'elena.rostova@gmail.com',
    fullName: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 438-7721',
    role: 'EVENT_ATTENDEE',
    emergencyContactName: 'Viktor Rostova',
    emergencyContactPhone: '+1 (555) 438-9900',
    preferredLanguage: 'English',
    accessibilityPreference: 'Near Level Ground Egress',
    isActive: true,
    lastLoginAt: 'Today, 14:20',
    createdAt: '2025-04-10T16:00:00Z'
  }
];

// Seed Events (6 Active & Upcoming Events)
export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-001',
    name: 'Metropolitan Arena Grand Prix',
    description: 'Premier international motorsports championship and fan expo with 45,000+ expected visitors.',
    location: 'Metropolitan Grand Circuit & Arena Bowl, Sector 4',
    startDate: '2026-10-15T09:00:00Z',
    endDate: '2026-10-18T22:00:00Z',
    expectedCapacity: 45000,
    maxCapacity: 50000,
    status: 'Live',
    organizer: 'Metropolitan Sports Authority',
    publicStatus: 'NORMAL',
    publicSafetyAnnouncement: 'Welcome to Metropolitan Grand Prix! Please enter via your designated gate shown on your digital pass.',
    recommendedGates: ['Gate 1 (North)', 'Gate 3 (East)', 'Gate 5 (South)'],
    registeredAttendeesCount: 42381,
    zonesCount: 6,
    camerasCount: 32,
    assignedStaffCount: 84,
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'evt-002',
    name: 'Neon Horizon Music Festival',
    description: '3-day multi-stage electronic music festival across open meadow amphitheaters.',
    location: 'East Meadow Festival Grounds, Green Valley',
    startDate: '2026-11-04T14:00:00Z',
    endDate: '2026-11-06T23:59:00Z',
    expectedCapacity: 28000,
    maxCapacity: 30000,
    status: 'Upcoming',
    organizer: 'SoundWave Live Entertainment',
    publicStatus: 'NORMAL',
    publicSafetyAnnouncement: 'Hydration stations are free throughout Zones B & D. Keep aisles clear.',
    recommendedGates: ['Main Meadow Arch', 'West Transit Express'],
    registeredAttendeesCount: 24910,
    zonesCount: 5,
    camerasCount: 24,
    assignedStaffCount: 48,
    createdAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'evt-003',
    name: 'Tech Global Summit 2026',
    description: 'International technology conference & exhibition showcasing AI, robotics, and cyber systems.',
    location: 'Pacific Convention Center, Hall A & B',
    startDate: '2026-11-20T08:30:00Z',
    endDate: '2026-11-22T18:00:00Z',
    expectedCapacity: 15000,
    maxCapacity: 16500,
    status: 'Upcoming',
    organizer: 'Global Tech Consortium',
    publicStatus: 'NORMAL',
    registeredAttendeesCount: 13240,
    zonesCount: 4,
    camerasCount: 18,
    assignedStaffCount: 26,
    createdAt: '2026-03-05T09:00:00Z'
  },
  {
    id: 'evt-004',
    name: 'National Athletics Championship',
    description: 'Olympic trial track and field events with multi-tier seating and stadium bowl influx.',
    location: 'Civic Olympic Stadium, Sector 1',
    startDate: '2026-12-02T10:00:00Z',
    endDate: '2026-12-05T20:00:00Z',
    expectedCapacity: 38000,
    maxCapacity: 40000,
    status: 'Upcoming',
    organizer: 'National Sports Federation',
    publicStatus: 'NORMAL',
    registeredAttendeesCount: 31050,
    zonesCount: 6,
    camerasCount: 28,
    assignedStaffCount: 55,
    createdAt: '2026-04-12T11:30:00Z'
  },
  {
    id: 'evt-005',
    name: 'City Lights Cultural Carnival',
    description: 'Downtown street festival celebrating arts, crafts, street foods, and live musical parades.',
    location: 'Central Promenade & Riverside Esplanade',
    startDate: '2026-12-18T16:00:00Z',
    endDate: '2026-12-20T23:00:00Z',
    expectedCapacity: 20000,
    maxCapacity: 25000,
    status: 'Upcoming',
    organizer: 'Downtown Community Arts Board',
    publicStatus: 'NORMAL',
    registeredAttendeesCount: 17800,
    zonesCount: 4,
    camerasCount: 12,
    assignedStaffCount: 30,
    createdAt: '2026-05-18T15:00:00Z'
  },
  {
    id: 'evt-006',
    name: 'World Urban Mobility Expo',
    description: 'Electric transportation, aerial mobility, and smart city infrastructure exposition.',
    location: 'World Trade & Exposition Complex, Hall 3',
    startDate: '2026-12-28T09:00:00Z',
    endDate: '2026-12-30T19:00:00Z',
    expectedCapacity: 12000,
    maxCapacity: 14000,
    status: 'Upcoming',
    organizer: 'Urban Mobility Alliance',
    publicStatus: 'NORMAL',
    registeredAttendeesCount: 9420,
    zonesCount: 4,
    camerasCount: 16,
    assignedStaffCount: 22,
    createdAt: '2026-06-01T10:00:00Z'
  }
];

// Seed Zones for Metropolitan Arena (Event evt-001)
export const INITIAL_ZONES: ZoneItem[] = [
  {
    id: 'zone-01',
    eventId: 'evt-001',
    name: 'Gate A - North Entry Plaza',
    shortName: 'GATE A',
    category: 'GATE',
    location: 'North Concourse Perimeter',
    capacity: 5000,
    currentCrowd: 3950,
    density: 79,
    flowDirection: 'NORTH -> SOUTH',
    inflowRate: 184,
    outflowRate: 92,
    riskLevel: 'HIGH',
    riskScore: 84,
    riskReason: 'High density surge + opposing movement detected near Turnstiles 3 & 4.',
    assignedCamerasCount: 6,
    assignedOfficers: ['Officer K. Reyes', 'Officer M. Santos']
  },
  {
    id: 'zone-02',
    eventId: 'evt-001',
    name: 'Main Stage Arena Floor',
    shortName: 'ARENA FLOOR',
    category: 'STAGE',
    location: 'Central Arena Bowl',
    capacity: 12000,
    currentCrowd: 9400,
    density: 78,
    flowDirection: 'BIDIRECTIONAL',
    inflowRate: 145,
    outflowRate: 110,
    riskLevel: 'HIGH',
    riskScore: 78,
    riskReason: 'Compressed standing density near front barrier barricade.',
    assignedCamerasCount: 8,
    assignedOfficers: ['Sgt. L. Torres', 'Officer D. Vance', 'Officer J. Smith']
  },
  {
    id: 'zone-03',
    eventId: 'evt-001',
    name: 'West Egress Chokepoint & Stairwell',
    shortName: 'WEST EGRESS',
    category: 'EXIT',
    location: 'West Corridor Wing B',
    capacity: 4000,
    currentCrowd: 1350,
    density: 34,
    flowDirection: 'EAST -> WEST',
    inflowRate: 65,
    outflowRate: 70,
    riskLevel: 'LOW',
    riskScore: 24,
    riskReason: 'Flow nominal; unobstructed passage through emergency fire gates.',
    assignedCamerasCount: 4,
    assignedOfficers: ['Officer T. Baker']
  },
  {
    id: 'zone-04',
    eventId: 'evt-001',
    name: 'East Food Court & Promenade',
    shortName: 'EAST FOOD',
    category: 'FACILITY',
    location: 'Level 2 East Terrace',
    capacity: 4500,
    currentCrowd: 2850,
    density: 63,
    flowDirection: 'CIRCULATING',
    inflowRate: 98,
    outflowRate: 95,
    riskLevel: 'MODERATE',
    riskScore: 56,
    riskReason: 'Steady queue buildup around beverage kiosks.',
    assignedCamerasCount: 4,
    assignedOfficers: ['Officer C. Diaz']
  },
  {
    id: 'zone-05',
    eventId: 'evt-001',
    name: 'South Transit Turnstiles & Bus Bay',
    shortName: 'SOUTH TRANSIT',
    category: 'EXIT',
    location: 'Ground Level South Port',
    capacity: 6500,
    currentCrowd: 2600,
    density: 40,
    flowDirection: 'SOUTHBOUND',
    inflowRate: 85,
    outflowRate: 120,
    riskLevel: 'LOW',
    riskScore: 28,
    riskReason: 'Rapid turnstile throughput; continuous shuttle bus departures.',
    assignedCamerasCount: 6,
    assignedOfficers: ['Officer R. Washington', 'Officer A. Patel']
  },
  {
    id: 'zone-06',
    eventId: 'evt-001',
    name: 'VIP Hospitality & Press Balcony',
    shortName: 'VIP SUITE',
    category: 'FACILITY',
    location: 'Skybox Level 4',
    capacity: 1500,
    currentCrowd: 620,
    density: 41,
    flowDirection: 'RESTRICTED',
    inflowRate: 18,
    outflowRate: 15,
    riskLevel: 'LOW',
    riskScore: 16,
    riskReason: 'Controlled badge credentials access; zero congestion.',
    assignedCamerasCount: 4,
    assignedOfficers: ['Officer G. Morris']
  }
];

// Seed Cameras (120 cameras represented, key CCTV nodes displayed)
export const INITIAL_CAMERAS: CameraItem[] = [
  {
    id: 'cam-01',
    cameraCode: 'CAM-01',
    name: 'Gate A North Turnstile Ultra-Wide PTZ',
    location: 'North Entry Gate Overhead Truss #1',
    zoneId: 'zone-01',
    zoneName: 'Gate A - North Entry Plaza',
    eventId: 'evt-001',
    status: 'ONLINE',
    fps: 30,
    resolution: '4K Ultra-HD',
    lastHeartbeat: '3s ago',
    currentPeopleCount: 1842,
    densityEstimate: 79,
    flowVector: { x: 0.12, y: -0.68, magnitude: 0.70, direction: 'INFLOW_SOUTH' }
  },
  {
    id: 'cam-02',
    cameraCode: 'CAM-02',
    name: 'Main Stage Central Barricade Sensor',
    location: 'Stage Front Lighting Rig Center',
    zoneId: 'zone-02',
    zoneName: 'Main Stage Arena Floor',
    eventId: 'evt-001',
    status: 'ONLINE',
    fps: 30,
    resolution: '4K Ultra-HD',
    lastHeartbeat: '2s ago',
    currentPeopleCount: 3950,
    densityEstimate: 78,
    flowVector: { x: 0.45, y: -0.15, magnitude: 0.47, direction: 'COMPRESSION' }
  },
  {
    id: 'cam-03',
    cameraCode: 'CAM-03',
    name: 'West Egress Corridor Thermal Scanner',
    location: 'Corridor 2B Junction Ceiling',
    zoneId: 'zone-03',
    zoneName: 'West Egress Chokepoint & Stairwell',
    eventId: 'evt-001',
    status: 'ONLINE',
    fps: 25,
    resolution: '1080p Full-HD',
    lastHeartbeat: '5s ago',
    currentPeopleCount: 890,
    densityEstimate: 34,
    flowVector: { x: -0.85, y: 0.05, magnitude: 0.86, direction: 'WESTWARD_EGRESS' }
  },
  {
    id: 'cam-04',
    cameraCode: 'CAM-04',
    name: 'East Food Court Panoramic 360',
    location: 'Food Court Central Atrium Pillar',
    zoneId: 'zone-04',
    zoneName: 'East Food Court & Promenade',
    eventId: 'evt-001',
    status: 'ONLINE',
    fps: 30,
    resolution: '1080p Full-HD',
    lastHeartbeat: '4s ago',
    currentPeopleCount: 1420,
    densityEstimate: 63,
    flowVector: { x: 0.22, y: 0.31, magnitude: 0.38, direction: 'DIFFUSE_QUEUE' }
  },
  {
    id: 'cam-05',
    cameraCode: 'CAM-05',
    name: 'South Bus Hub Egress Gate Scanner',
    location: 'Transit Plaza Gate 6 Cantilever',
    zoneId: 'zone-05',
    zoneName: 'South Transit Turnstiles & Bus Bay',
    eventId: 'evt-001',
    status: 'ONLINE',
    fps: 30,
    resolution: '1080p Full-HD',
    lastHeartbeat: '1s ago',
    currentPeopleCount: 1105,
    densityEstimate: 40,
    flowVector: { x: 0.05, y: -0.92, magnitude: 0.93, direction: 'SOUTH_TRANSIT' }
  },
  {
    id: 'cam-06',
    cameraCode: 'CAM-06',
    name: 'VIP Skybox Skybridge Optical',
    location: 'North-East Bridge Access Stanchion',
    zoneId: 'zone-06',
    zoneName: 'VIP Hospitality & Press Balcony',
    eventId: 'evt-001',
    status: 'ONLINE',
    fps: 30,
    resolution: '1080p Full-HD',
    lastHeartbeat: '6s ago',
    currentPeopleCount: 310,
    densityEstimate: 41,
    flowVector: { x: 0.15, y: 0.10, magnitude: 0.18, direction: 'STABLE' }
  },
  {
    id: 'cam-07',
    cameraCode: 'CAM-07',
    name: 'Perimeter Gate 3 Turnstile Auxiliary',
    location: 'Outer Security Checkpoint East',
    zoneId: 'zone-01',
    zoneName: 'Gate A - North Entry Plaza',
    eventId: 'evt-001',
    status: 'MAINTENANCE',
    fps: 0,
    resolution: '1080p Full-HD',
    lastHeartbeat: '15m ago',
    currentPeopleCount: 0,
    densityEstimate: 0,
    flowVector: { x: 0, y: 0, magnitude: 0, direction: 'OFFLINE' }
  }
];

// Seed Alerts
export const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: 'ALT-9041',
    eventId: 'evt-001',
    zoneId: 'zone-01',
    zoneName: 'Gate A - North Entry Plaza',
    cameraName: 'CAM-01 (Gate A PTZ)',
    severity: 'CRITICAL',
    type: 'CROWD_COMPRESSION_SURGE',
    location: 'Gate A - Turnstiles 3 & 4',
    description: 'Inflow rate spiked to 184 persons/min with 84% turnstile bottleneck. Opposing egress vectors detected causing crowd stagnation.',
    timestamp: '2 min ago',
    status: 'ACTIVE'
  },
  {
    id: 'ALT-9038',
    eventId: 'evt-001',
    zoneId: 'zone-02',
    zoneName: 'Main Stage Arena Floor',
    cameraName: 'CAM-02 (Central Rig)',
    severity: 'CRITICAL',
    type: 'CHOKEPOINT_CONGESTION',
    location: 'Stage Front Center Barricade',
    description: 'Standing density surged past 4.2 pers/m² (78% of critical threshold). Stage perimeter barriers under elevated mechanical pressure.',
    timestamp: '7 min ago',
    status: 'ACTIVE'
  },
  {
    id: 'ALT-9032',
    eventId: 'evt-001',
    zoneId: 'zone-04',
    zoneName: 'East Food Court & Promenade',
    cameraName: 'CAM-04 (Promenade Atrium)',
    severity: 'MODERATE',
    type: 'QUEUE_OVERFLOW',
    location: 'Kiosk Row 3 & Restroom Passage',
    description: 'Queue length exceeding 35 meters, partially restricting secondary egress corridor toward Stairwell 4.',
    timestamp: '22 min ago',
    status: 'ACKNOWLEDGED',
    acknowledgedBy: 'Officer C. Diaz',
    acknowledgedAt: '18 min ago'
  },
  {
    id: 'ALT-9025',
    eventId: 'evt-001',
    zoneId: 'zone-03',
    zoneName: 'West Egress Chokepoint & Stairwell',
    cameraName: 'CAM-03 (Thermal Scanner)',
    severity: 'LOW',
    type: 'TEMPORARY_STOPPAGE',
    location: 'Stairwell B Landing',
    description: 'Stroller obstruction on lower landing momentarily halted downward flow. Security team cleared pathway.',
    timestamp: '1 hour ago',
    status: 'RESOLVED',
    acknowledgedBy: 'Officer T. Baker',
    acknowledgedAt: '55 min ago',
    resolvedBy: 'Cmdr. Sarah Keller',
    resolvedAt: '45 min ago'
  }
];

// Seed Incidents (Full lifecycle representation)
export const INITIAL_INCIDENTS: IncidentRecord[] = [
  {
    id: 'inc-001',
    incidentNumber: 'INC-2026-081',
    eventId: 'evt-001',
    zoneId: 'zone-01',
    zoneName: 'Gate A - North Entry Plaza',
    location: 'Turnstile Bank 4, North Entrance',
    type: 'CROWD_SURGE_BOTTLENECK',
    severity: 'CRITICAL',
    description: 'A sudden influx of 400+ attendees from the metro concourse created sudden pressure against turnstiles 3 and 4. Barricade flex detected by sensor B-4.',
    detectedTime: '14:28:10 IST',
    reportedBy: 'AI Vision Engine (YOLOv8 Detection #9041)',
    assignedCommander: 'Cmdr. Sarah Keller',
    assignedOfficers: ['Officer K. Reyes', 'Officer M. Santos', 'Squad Delta (4 members)'],
    status: 'RESPONSE_IN_PROGRESS',
    timeline: [
      {
        id: 'tl-1',
        action: 'INCIDENT_DETECTED',
        performedBy: 'YOLOv8 Vision Edge Node',
        description: 'Automated optical surge triggered threshold alert (>180 pers/min).',
        timestamp: '14:28:10 IST'
      },
      {
        id: 'tl-2',
        action: 'ACKNOWLEDGED',
        performedBy: 'Cmdr. Sarah Keller',
        description: 'Incident Commander acknowledged severity and pulled up live CAM-01 stream.',
        timestamp: '14:29:05 IST'
      },
      {
        id: 'tl-3',
        action: 'RESPONSE_ASSIGNED',
        performedBy: 'Cmdr. Sarah Keller',
        description: 'Dispatched Field Squad Delta to open overflow auxiliary bypass gates.',
        timestamp: '14:30:15 IST'
      },
      {
        id: 'tl-4',
        action: 'RESPONSE_IN_PROGRESS',
        performedBy: 'Officer K. Reyes',
        description: 'Squad on site; directing crowd into Gates 1 & 2 to relieve bank 4 pressure.',
        timestamp: '14:32:00 IST'
      }
    ],
    createdAt: '2026-09-26T14:28:10Z',
    updatedAt: '2026-09-26T14:32:00Z'
  },
  {
    id: 'inc-002',
    incidentNumber: 'INC-2026-080',
    eventId: 'evt-001',
    zoneId: 'zone-02',
    zoneName: 'Main Stage Arena Floor',
    location: 'Front of House Barricade Left',
    type: 'PHYSICAL_BARRIER_STRAIN',
    severity: 'HIGH',
    description: 'Surge from opening DJ act caused localized compaction against barrier stanchion 8.',
    detectedTime: '13:50:00 IST',
    reportedBy: 'Sgt. L. Torres (Field Security)',
    assignedCommander: 'Cmdr. Sarah Keller',
    assignedOfficers: ['Sgt. L. Torres', 'Officer D. Vance'],
    status: 'INVESTIGATING',
    timeline: [
      {
        id: 'tl-21',
        action: 'INCIDENT_DETECTED',
        performedBy: 'Sgt. L. Torres',
        description: 'Manual report logged via mobile security radio terminal.',
        timestamp: '13:50:00 IST'
      },
      {
        id: 'tl-22',
        action: 'INVESTIGATING',
        performedBy: 'Cmdr. Sarah Keller',
        description: 'Cross-verifying with CAM-02 optical density vectors. Assessing need for buffer zone.',
        timestamp: '13:52:30 IST'
      }
    ],
    createdAt: '2026-09-26T13:50:00Z',
    updatedAt: '2026-09-26T13:52:30Z'
  },
  {
    id: 'inc-003',
    incidentNumber: 'INC-2026-079',
    eventId: 'evt-001',
    zoneId: 'zone-04',
    zoneName: 'East Food Court & Promenade',
    location: 'Beverage Kiosk Sector 3',
    type: 'MEDICAL_FAINTING',
    severity: 'MODERATE',
    description: 'Attendee suffered heat exhaustion in food court queue. First aid responder summoned.',
    detectedTime: '12:40:00 IST',
    reportedBy: 'Officer C. Diaz',
    assignedCommander: 'Cmdr. Sarah Keller',
    assignedOfficers: ['Medic Team Bravo (2 personnel)'],
    status: 'RESOLVED',
    resolution: 'Patient treated with electrolyte hydration at Medical Tent 2; fully stabilized and rested.',
    timeline: [
      {
        id: 'tl-31',
        action: 'INCIDENT_DETECTED',
        performedBy: 'Officer C. Diaz',
        description: 'Reported attendee in distress.',
        timestamp: '12:40:00 IST'
      },
      {
        id: 'tl-32',
        action: 'RESOLVED',
        performedBy: 'Cmdr. Sarah Keller',
        description: 'Medical report verified; zone cleared.',
        timestamp: '13:05:00 IST'
      }
    ],
    createdAt: '2026-09-26T12:40:00Z',
    updatedAt: '2026-09-26T13:05:00Z'
  },
  {
    id: 'inc-004',
    incidentNumber: 'INC-2026-078',
    eventId: 'evt-001',
    zoneId: 'zone-03',
    zoneName: 'West Egress Chokepoint & Stairwell',
    location: 'Stairwell B Landing',
    type: 'OBSTRUCTION_HAZARD',
    severity: 'LOW',
    description: 'Unattended stroller and equipment crate blocking secondary egress width.',
    detectedTime: '11:15:00 IST',
    reportedBy: 'Officer T. Baker',
    assignedCommander: 'Cmdr. Sarah Keller',
    assignedOfficers: ['Officer T. Baker'],
    status: 'CLOSED',
    resolution: 'Obstacle relocated to designated baggage storage; stairwell pathway cleared.',
    timeline: [
      {
        id: 'tl-41',
        action: 'RESOLVED',
        performedBy: 'Officer T. Baker',
        description: 'Pathway fully restored.',
        timestamp: '11:25:00 IST'
      }
    ],
    createdAt: '2026-09-26T11:15:00Z',
    updatedAt: '2026-09-26T11:25:00Z'
  },
  {
    id: 'inc-005',
    incidentNumber: 'INC-2026-077',
    eventId: 'evt-001',
    zoneId: 'zone-05',
    zoneName: 'South Transit Turnstiles & Bus Bay',
    location: 'Transit Platform 2',
    type: 'SUSPICIOUS_UNATTENDED_BAG',
    severity: 'MODERATE',
    description: 'Unattended backpack identified beside bench 4. K9 inspection conducted.',
    detectedTime: '10:05:00 IST',
    reportedBy: 'Officer R. Washington',
    assignedCommander: 'Cmdr. Sarah Keller',
    assignedOfficers: ['Officer R. Washington', 'K9 Unit 3'],
    status: 'CLOSED',
    resolution: 'Bag inspected and verified safe (personal belongings left by student); claimed at lost & found.',
    timeline: [
      {
        id: 'tl-51',
        action: 'CLOSED',
        performedBy: 'Cmdr. Sarah Keller',
        description: 'Verified clear by security team.',
        timestamp: '10:30:00 IST'
      }
    ],
    createdAt: '2026-09-26T10:05:00Z',
    updatedAt: '2026-09-26T10:30:00Z'
  }
];

// Seed Registrations (for Elena Rostova attendee)
export const INITIAL_REGISTRATIONS: EventRegistration[] = [
  {
    id: 'reg-001',
    registrationCode: 'CQ-GP26-88192',
    eventId: 'evt-001',
    eventName: 'Metropolitan Arena Grand Prix',
    eventLocation: 'Metropolitan Grand Circuit & Arena Bowl, Sector 4',
    eventDate: '2026-10-15',
    eventStartTime: '09:00 AM IST',
    attendeeId: 'usr-att-05',
    attendeeName: 'Elena Rostova',
    attendeeEmail: 'elena.rostova@gmail.com',
    attendeePhone: '+1 (555) 438-7721',
    attendanceDate: '2026-10-15',
    expectedArrivalTime: '08:45 AM',
    accompanyingPeople: 2,
    emergencyContactName: 'Viktor Rostova',
    emergencyContactPhone: '+1 (555) 438-9900',
    emergencyContactRelationship: 'Brother',
    accessibilityAssistance: false,
    consentAgreed: true,
    assignedGate: 'Gate 1 (North Entry)',
    qrCodeData: 'CROWDIQ-PASS:EVT-001:USR-05:REG-88192:GATE-1:SEC-A',
    status: 'CONFIRMED',
    createdAt: '2026-09-20T10:15:00Z'
  },
  {
    id: 'reg-002',
    registrationCode: 'CQ-NH26-33910',
    eventId: 'evt-002',
    eventName: 'Neon Horizon Music Festival',
    eventLocation: 'East Meadow Festival Grounds, Green Valley',
    eventDate: '2026-11-04',
    eventStartTime: '02:00 PM IST',
    attendeeId: 'usr-att-05',
    attendeeName: 'Elena Rostova',
    attendeeEmail: 'elena.rostova@gmail.com',
    attendeePhone: '+1 (555) 438-7721',
    attendanceDate: '2026-11-04',
    expectedArrivalTime: '01:30 PM',
    accompanyingPeople: 1,
    emergencyContactName: 'Viktor Rostova',
    emergencyContactPhone: '+1 (555) 438-9900',
    emergencyContactRelationship: 'Brother',
    accessibilityAssistance: false,
    consentAgreed: true,
    assignedGate: 'Main Meadow Arch Gate',
    qrCodeData: 'CROWDIQ-PASS:EVT-002:USR-05:REG-33910:GATE-ARCH:SEC-M',
    status: 'CONFIRMED',
    createdAt: '2026-09-22T14:40:00Z'
  }
];

// Seed Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-09-26 14:32:00 IST',
    user: 'Cmdr. Sarah Keller',
    userEmail: 'commander.keller@metropolitan.gov',
    role: 'INCIDENT_COMMANDER',
    action: 'INCIDENT_DISPATCH_ASSIGNED',
    resource: 'INC-2026-081',
    description: 'Assigned Field Squad Delta to bypass Gate A turnstiles and relieve compression.',
    ipAddress: '192.168.10.45',
    status: 'SUCCESS'
  },
  {
    id: 'aud-002',
    timestamp: '2026-09-26 14:28:10 IST',
    user: 'SYSTEM (AI Edge Ingestion)',
    userEmail: 'system@crowdiq.security',
    role: 'SYSTEM',
    action: 'ALERT_TRIGGERED',
    resource: 'ALT-9041',
    description: 'YOLOv8 vision pipeline flagged critical inflow density spike (>180 pers/min).',
    ipAddress: '10.0.4.12',
    status: 'WARNING'
  },
  {
    id: 'aud-003',
    timestamp: '2026-09-26 14:05:22 IST',
    user: 'Chief Marcus Vance',
    userEmail: 'admin@crowdiq.security',
    role: 'ADMIN',
    action: 'ROLE_PERMISSION_UPDATED',
    resource: 'ROLES:INCIDENT_COMMANDER',
    description: 'Extended emergency evacuation broadcast override permission.',
    ipAddress: '192.168.10.1',
    status: 'SUCCESS'
  },
  {
    id: 'aud-004',
    timestamp: '2026-09-26 13:45:10 IST',
    user: 'Director David Chen',
    userEmail: 'director.chen@metropolitanarena.com',
    role: 'OPERATIONS_DIRECTOR',
    action: 'REPORT_GENERATED',
    resource: 'REP-CROWD-DENSITY-001',
    description: 'Exported hourly crowd distribution CSV report for Metropolitan Sports Authority.',
    ipAddress: '192.168.10.88',
    status: 'SUCCESS'
  },
  {
    id: 'aud-005',
    timestamp: '2026-09-26 12:50:00 IST',
    user: 'Officer Kevin Reyes',
    userEmail: 'officer.reyes@fieldsec.com',
    role: 'SECURITY_OFFICER',
    action: 'INCIDENT_LOGGED',
    resource: 'INC-2026-080',
    description: 'Logged localized barrier vibration at stage front left.',
    ipAddress: '172.16.2.14',
    status: 'SUCCESS'
  }
];

// Seed System Health Services
export const INITIAL_SYSTEM_HEALTH: SystemHealthService[] = [
  {
    id: 'sh-api',
    serviceName: 'Core REST API Gateway (FastAPI)',
    status: 'OPERATIONAL',
    uptimePercentage: 99.99,
    latencyMs: 14,
    lastHeartbeat: '1s ago',
    details: { load: '18%', requestsPerSec: 1420 }
  },
  {
    id: 'sh-db',
    serviceName: 'PostgreSQL Relational DB (Supabase)',
    status: 'OPERATIONAL',
    uptimePercentage: 99.98,
    latencyMs: 18,
    lastHeartbeat: '2s ago',
    details: { activeConnections: 34, poolUtilization: '28%' }
  },
  {
    id: 'sh-auth',
    serviceName: 'Supabase Authentication & RBAC Engine',
    status: 'OPERATIONAL',
    uptimePercentage: 100.0,
    latencyMs: 12,
    lastHeartbeat: '1s ago',
    details: { jwtValidation: 'nominal', activeSessions: 84 }
  },
  {
    id: 'sh-realtime',
    serviceName: 'Realtime WebSocket Telemetry Hub',
    status: 'OPERATIONAL',
    uptimePercentage: 99.95,
    latencyMs: 8,
    lastHeartbeat: '1s ago',
    details: { connectedSubscribers: 128, throughputKbps: 450 }
  },
  {
    id: 'sh-vision',
    serviceName: 'AI Vision Engine (YOLOv8 + DeepSORT)',
    status: 'OPERATIONAL',
    uptimePercentage: 99.92,
    latencyMs: 34,
    lastHeartbeat: '3s ago',
    details: { inferenceFps: 30.2, frameDrops: '0.01%' }
  },
  {
    id: 'sh-cctv',
    serviceName: 'CCTV Edge Network (120 Camera Nodes)',
    status: 'OPERATIONAL',
    uptimePercentage: 99.89,
    latencyMs: 22,
    lastHeartbeat: '3s ago',
    details: { totalCameras: 120, online: 117, maintenance: 3 }
  },
  {
    id: 'sh-storage',
    serviceName: 'Encrypted Media & Video Object Storage',
    status: 'OPERATIONAL',
    uptimePercentage: 100.0,
    latencyMs: 29,
    lastHeartbeat: '5s ago',
    details: { capacityUsedPct: 38, replication: 'multi-region' }
  }
];

// Seed Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'SECURITY',
    title: 'Critical Inflow Rate Spike (Gate A)',
    message: 'Turnstiles 3 & 4 reporting density surge at 184 persons/min. Squad Delta dispatched.',
    timestamp: '2 min ago',
    isRead: false,
    actionLink: 'alerts'
  },
  {
    id: 'notif-2',
    category: 'INCIDENT',
    title: 'Incident INC-2026-081 Status Update',
    message: 'Field response is currently in progress. Gates 1 & 2 opened for overflow bypass.',
    timestamp: '4 min ago',
    isRead: false,
    actionLink: 'incidents'
  },
  {
    id: 'notif-3',
    category: 'EVENT',
    title: 'Public Safety Notice Broadcasted',
    message: 'Advisory updated: Attendees advised to prefer North Gate 1 and avoid East Turnstiles.',
    timestamp: '15 min ago',
    isRead: true,
    actionLink: 'events'
  },
  {
    id: 'notif-4',
    category: 'SYSTEM',
    title: 'Camera Maintenance Alert',
    message: 'CAM-07 (Perimeter Gate 3) placed into scheduled diagnostic maintenance.',
    timestamp: '35 min ago',
    isRead: true,
    actionLink: 'cameras'
  },
  {
    id: 'notif-5',
    category: 'REGISTRATION',
    title: 'Digital Entrance Pass Confirmed',
    message: 'Your registration for Metropolitan Arena Grand Prix is confirmed. Digital QR pass is active.',
    timestamp: '1 hour ago',
    isRead: true,
    targetRole: 'EVENT_ATTENDEE',
    actionLink: 'dashboard'
  }
];
