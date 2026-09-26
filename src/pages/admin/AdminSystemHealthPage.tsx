import React from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Lock, 
  Radio, 
  Cpu, 
  Video, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const AdminSystemHealthPage: React.FC = () => {
  const { systemHealth, cameras } = usePlatform();

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'sh-api':
        return <Server className="w-5 h-5 text-[#2563EB]" />;
      case 'sh-db':
        return <Database className="w-5 h-5 text-[#2563EB]" />;
      case 'sh-auth':
        return <Lock className="w-5 h-5 text-[#2563EB]" />;
      case 'sh-realtime':
        return <Radio className="w-5 h-5 text-[#16A34A]" />;
      case 'sh-vision':
        return <Cpu className="w-5 h-5 text-[#7C3AED]" />;
      case 'sh-cctv':
        return <Video className="w-5 h-5 text-[#2563EB]" />;
      case 'sh-storage':
      default:
        return <HardDrive className="w-5 h-5 text-[#64748B]" />;
    }
  };

  return (
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
              Telemetry Diagnostic Hub
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              7 Subsystems Live
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            System Health &amp; Subsystem Heartbeats
          </h1>
          <p className="text-xs text-[#64748B]">
            Continuous probe telemetry across API Gateways, PostgreSQL Database, YOLOv8 Vision Engines, and CCTV hardware.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-bold text-[#16A34A] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
            <span>ALL CORE SERVICES OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Aggregate Health Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Global SLA Uptime</span>
          <div className="text-2xl font-extrabold text-[#16A34A] mt-1 font-mono">
            99.98%
          </div>
          <span className="text-[10px] text-[#64748B]">Past 30 operational days</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">Median API Latency</span>
          <div className="text-2xl font-extrabold text-[#2563EB] mt-1 font-mono">
            14 ms
          </div>
          <span className="text-[10px] text-[#16A34A] font-semibold">FastAPI Gateway Nominal</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">CCTV Camera Links</span>
          <div className="text-2xl font-extrabold text-[#0F172A] mt-1 font-mono">
            117 / 120
          </div>
          <span className="text-[10px] text-[#64748B]">3 Scheduled Maintenance</span>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">YOLO Edge FPS</span>
          <div className="text-2xl font-extrabold text-[#7C3AED] mt-1 font-mono">
            30.2 FPS
          </div>
          <span className="text-[10px] text-[#7C3AED] font-semibold">Hardware Tensor Acceleration</span>
        </div>
      </div>

      {/* Detailed Subsystems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {systemHealth.map((svc) => (
          <div 
            key={svc.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  {getServiceIcon(svc.id)}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                  {svc.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {svc.serviceName}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1 font-mono">
                  <span>Latency: <strong>{svc.latencyMs} ms</strong></span>
                  <span>•</span>
                  <span>Uptime: <strong>{svc.uptimePercentage}%</strong></span>
                </div>
              </div>

              {svc.details && (
                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-mono text-[#475569] space-y-1">
                  {Object.entries(svc.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-[#64748B] capitalize">{k}:</span>
                      <strong>{String(v)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[10px] text-[#94A3B8] font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Heartbeat: {svc.lastHeartbeat}
              </span>
              <span className="text-[#16A34A] font-bold">● Nominal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
