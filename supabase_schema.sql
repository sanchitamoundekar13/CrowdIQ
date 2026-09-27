-- ====================================================================
-- CrowdIQ Supabase PostgreSQL Real-Time Schema Migration Script
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Zones Telemetry Table
CREATE TABLE IF NOT EXISTS public.zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  current_people INTEGER DEFAULT 0,
  max_capacity INTEGER NOT NULL,
  density INTEGER DEFAULT 0,
  risk_level TEXT DEFAULT 'LOW',
  inflow INTEGER DEFAULT 0,
  outflow INTEGER DEFAULT 0,
  flow_direction TEXT DEFAULT 'Stationary',
  status TEXT DEFAULT 'OPEN',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Turnstile E-Tickets & Ingress Admissions Table
CREATE TABLE IF NOT EXISTS public.turnstile_tickets (
  id TEXT PRIMARY KEY,
  attendee TEXT NOT NULL,
  tier TEXT DEFAULT 'General Admission',
  zone TEXT NOT NULL,
  gate TEXT NOT NULL,
  valid BOOLEAN DEFAULT true,
  used BOOLEAN DEFAULT false,
  scanned_at TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Neural Vision Cameras & Optical Telemetry Table
CREATE TABLE IF NOT EXISTS public.camera_telemetry (
  id TEXT PRIMARY KEY,
  cam_number TEXT NOT NULL,
  location_name TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  status TEXT DEFAULT 'ONLINE',
  detections INTEGER DEFAULT 0,
  density INTEGER DEFAULT 0,
  fps INTEGER DEFAULT 30,
  risk_level TEXT DEFAULT 'LOW',
  flow_direction TEXT DEFAULT 'Normal',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Safety & Incident Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  camera_id TEXT,
  severity TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'ACTIVE',
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Operational Audit Trail Ledger Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  operator TEXT NOT NULL,
  severity TEXT DEFAULT 'INFO',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable Row Level Security (RLS) & Allow Read/Write
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turnstile_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camera_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for zones" ON public.zones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for turnstiles" ON public.turnstile_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for cameras" ON public.camera_telemetry FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for audit" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- 8. Enable Realtime Publications on All CrowdIQ Tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.zones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.turnstile_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.camera_telemetry;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
