-- ============================================================================
-- CrowdIQ - Intelligent Crowd Safety & Event Intelligence Platform
-- PostgreSQL Relational Database Schema with Row Level Security (RLS)
-- Compatible with Supabase PostgreSQL 15+
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES & PERMISSIONS
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(100) PRIMARY KEY,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(50) REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    role VARCHAR(50) REFERENCES roles(id) DEFAULT 'EVENT_ATTENDEE',
    organization VARCHAR(255),
    designation VARCHAR(255),
    employee_or_officer_id VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    preferred_language VARCHAR(50) DEFAULT 'en',
    accessibility_preference TEXT,
    certifications TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    expected_capacity INTEGER NOT NULL,
    max_capacity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'Upcoming', -- Upcoming, Live, Paused, Completed, Cancelled
    organizer VARCHAR(255) NOT NULL,
    public_status VARCHAR(50) DEFAULT 'NORMAL', -- NORMAL, HIGH CROWD, RESTRICTED
    public_safety_announcement TEXT,
    recommended_gates TEXT[],
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVENT STAFF ASSIGNMENTS
CREATE TABLE IF NOT EXISTS event_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_role VARCHAR(50) NOT NULL,
    assigned_zone_id UUID,
    shift_start TIMESTAMPTZ,
    shift_end TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ZONES
CREATE TABLE IF NOT EXISTS zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(50),
    category VARCHAR(50) DEFAULT 'SECTOR', -- GATE, STAGE, FACILITY, EXIT, SECURITY, SECTOR
    location VARCHAR(255),
    capacity INTEGER NOT NULL,
    current_crowd INTEGER DEFAULT 0,
    density_percentage NUMERIC(5,2) DEFAULT 0,
    flow_direction VARCHAR(50) DEFAULT 'STABLE',
    inflow_rate INTEGER DEFAULT 0,
    outflow_rate INTEGER DEFAULT 0,
    risk_level VARCHAR(50) DEFAULT 'LOW', -- LOW, MODERATE, HIGH, CRITICAL
    risk_score INTEGER DEFAULT 0,
    risk_reason TEXT,
    coordinates JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CAMERAS
CREATE TABLE IF NOT EXISTS cameras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    camera_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    stream_url TEXT,
    status VARCHAR(50) DEFAULT 'ONLINE', -- ONLINE, OFFLINE, DEGRADED, MAINTENANCE
    fps INTEGER DEFAULT 30,
    resolution VARCHAR(50) DEFAULT '1080p',
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    current_people_count INTEGER DEFAULT 0,
    optical_flow_vector JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CROWD MEASUREMENTS (TIME-SERIES TELEMETRY FROM YOLO / CV)
CREATE TABLE IF NOT EXISTS crowd_measurements (
    id BIGSERIAL PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    camera_id UUID REFERENCES cameras(id) ON DELETE SET NULL,
    person_count INTEGER NOT NULL,
    density_percentage NUMERIC(5,2) NOT NULL,
    velocity NUMERIC(5,2),
    direction VARCHAR(50),
    congestion_score NUMERIC(5,2),
    flow_instability NUMERIC(5,2),
    risk_score INTEGER NOT NULL,
    measured_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crowd_measurements_zone_time 
ON crowd_measurements (zone_id, measured_at DESC);

-- 8. ALERTS
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    camera_id UUID REFERENCES cameras(id) ON DELETE SET NULL,
    severity VARCHAR(50) NOT NULL, -- LOW, MODERATE, HIGH, CRITICAL
    type VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, ACKNOWLEDGED, RESOLVED
    acknowledged_by UUID REFERENCES profiles(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INCIDENTS
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_number VARCHAR(50) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id) ON DELETE SET NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL, -- LOW, MODERATE, HIGH, CRITICAL
    description TEXT NOT NULL,
    detected_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reported_by VARCHAR(255) NOT NULL,
    reported_by_id UUID REFERENCES profiles(id),
    assigned_commander VARCHAR(255),
    assigned_commander_id UUID REFERENCES profiles(id),
    assigned_officers TEXT[],
    status VARCHAR(50) DEFAULT 'DETECTED', 
    -- DETECTED -> ACKNOWLEDGED -> INVESTIGATING -> RESPONSE ASSIGNED -> RESPONSE IN PROGRESS -> RESOLVED -> CLOSED
    resolution TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INCIDENT ACTIONS & TIMELINE
CREATE TABLE IF NOT EXISTS incident_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    performed_by UUID REFERENCES profiles(id),
    performed_by_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EVENT REGISTRATIONS (ATTENDEE REGISTRATIONS & DIGITAL PASSES)
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_code VARCHAR(50) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    attendee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    attendee_name VARCHAR(255) NOT NULL,
    attendee_email VARCHAR(255) NOT NULL,
    attendee_phone VARCHAR(50) NOT NULL,
    attendance_date DATE NOT NULL,
    expected_arrival_time VARCHAR(50) NOT NULL,
    accompanying_people INTEGER DEFAULT 0,
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(50) NOT NULL,
    emergency_contact_relationship VARCHAR(100) NOT NULL,
    accessibility_assistance BOOLEAN DEFAULT FALSE,
    consent_agreed BOOLEAN DEFAULT TRUE,
    assigned_gate VARCHAR(50) DEFAULT 'Gate 1',
    qr_code_data TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'CONFIRMED', -- CONFIRMED, CHECKED_IN, CANCELLED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(50),
    device_info TEXT,
    status VARCHAR(50) DEFAULT 'SUCCESS',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp 
ON audit_logs (timestamp DESC);

-- 13. SYSTEM HEALTH
CREATE TABLE IF NOT EXISTS system_health (
    id VARCHAR(50) PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL, -- OPERATIONAL, DEGRADED, OFFLINE
    uptime_percentage NUMERIC(5,2) DEFAULT 99.98,
    latency_ms INTEGER DEFAULT 18,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    details JSONB
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_role VARCHAR(50), -- NULL means targeted to user, or filter by role
    category VARCHAR(50) NOT NULL, -- SECURITY, EVENT, INCIDENT, SYSTEM, REGISTRATION
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile; Admins can view all
CREATE POLICY "Users view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    ));

CREATE POLICY "Users update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    ));

-- Events: Everyone can view public event info; Staff/Admins can manage
CREATE POLICY "Public read events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Admins and Directors manage events" ON events
    FOR ALL USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OPERATIONS_DIRECTOR')
    ));

-- Registrations: Attendees view only their own; Admins & Directors view all
CREATE POLICY "Attendees view own registrations" ON event_registrations
    FOR SELECT USING (attendee_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'OPERATIONS_DIRECTOR')
    ));

CREATE POLICY "Attendees insert registrations" ON event_registrations
    FOR INSERT WITH CHECK (attendee_id = auth.uid());

CREATE POLICY "Attendees cancel own registration" ON event_registrations
    FOR UPDATE USING (attendee_id = auth.uid());

-- Cameras, Zones, Alerts, Incidents: NO ACCESS for EVENT_ATTENDEE
CREATE POLICY "Staff read zones" ON zones
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'INCIDENT_COMMANDER', 'SECURITY_OFFICER', 'OPERATIONS_DIRECTOR')
    ));

CREATE POLICY "Staff read cameras" ON cameras
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'INCIDENT_COMMANDER', 'SECURITY_OFFICER', 'OPERATIONS_DIRECTOR')
    ));

CREATE POLICY "Staff read alerts" ON alerts
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'INCIDENT_COMMANDER', 'SECURITY_OFFICER', 'OPERATIONS_DIRECTOR')
    ));

CREATE POLICY "Staff read incidents" ON incidents
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'INCIDENT_COMMANDER', 'SECURITY_OFFICER', 'OPERATIONS_DIRECTOR')
    ));

-- Audit Logs & System Health: ADMIN only
CREATE POLICY "Admin only audit logs" ON audit_logs
    FOR ALL USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    ));

CREATE POLICY "Admin only system health" ON system_health
    FOR ALL USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'
    ));
