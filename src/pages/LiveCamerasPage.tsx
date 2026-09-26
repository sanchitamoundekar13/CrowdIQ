import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Video, 
  Activity, 
  Radio, 
  Eye, 
  Layers, 
  Maximize2, 
  ShieldCheck, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  ArrowRight,
  Wifi,
  WifiOff
} from 'lucide-react';

export const LiveCamerasPage: React.FC = () => {
  const { cameraFeeds, zones, stage, totalPeople } = useSimulation();
  const [selectedCamId, setSelectedCamId] = useState<string>('cam-02');

  // Camera list as requested in Section 11:
  // CAM-01 Main Gate ONLINE, CAM-02 Gate 2 ONLINE, CAM-03 North Exit OFFLINE, CAM-04 Central Area ONLINE
  const camerasData = [
    {
      id: 'cam-01',
      code: 'CAM-01',
      name: 'Main Gate',
      status: 'ONLINE',
      peopleDetected: 42,
      density: '3.8/m²',
      riskLevel: 'LOW',
      fps: 30,
      direction: 'North → Concourse',
      resolution: '1080p 60Hz'
    },
    {
      id: 'cam-02',
      code: 'CAM-02',
      name: 'Gate 2',
      status: 'ONLINE',
      peopleDetected: 47,
      density: '5.4/m²',
      riskLevel: 'MODERATE',
      fps: 30,
      direction: 'East → West',
      resolution: '4K UltraHD'
    },
    {
      id: 'cam-03',
      code: 'CAM-03',
      name: 'North Exit',
      status: 'OFFLINE',
      peopleDetected: 0,
      density: '0.0/m²',
      riskLevel: 'LOW',
      fps: 0,
      direction: 'Standby / Signal Loss',
      resolution: 'N/A'
    },
    {
      id: 'cam-04',
      code: 'CAM-04',
      name: 'Central Area',
      status: 'ONLINE',
      peopleDetected: 84,
      density: '7.1/m²',
      riskLevel: 'HIGH',
      fps: 30,
      direction: 'South → Plaza',
      resolution: '4K UltraHD'
    }
  ];

  const activeCam = camerasData.find(c => c.id === selectedCamId) || camerasData[1];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-[#2563EB]" />
            <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
              Live Monitoring & Edge Vision Matrix
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            CCTV Feeds with Real-Time YOLOv8 Person Detection & DeepSORT Kinematic Tracking
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] font-mono flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-[#16A34A] animate-pulse" />
            3 of 4 Streams Active
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] font-semibold font-mono">
            DEMO SIMULATION
          </span>
        </div>
      </div>

      {/* SECTION 8: PRIMARY FEATURED CCTV STREAM WITH YOLO + DEEPSORT DETECTION OVERLAYS */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-sm overflow-hidden">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-[#2563EB] text-white font-mono font-bold text-xs">
              {activeCam.code}
            </span>
            <span className="font-bold text-[#0F172A] text-sm">{activeCam.name}</span>
            <span className="text-[#94A3B8]">|</span>
            <span className="font-mono text-[#64748B]">{activeCam.resolution}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>LIVE RTSP FEED</span>
            </div>
            <span className="text-[11px] font-mono text-[#64748B] bg-white px-2.5 py-1 rounded border border-[#E2E8F0]">
              Inference Latency: 14ms (YOLOv8 + DeepSORT)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Video Viewport with Simulated Bounding Boxes & Trajectory Vectors */}
          <div className="lg:col-span-8 bg-[#0F172A] relative min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden select-none">
            <img 
              src="./assets/crowd_detection_cctv.jpg" 
              alt="CCTV Crowd Detection Feed" 
              className="w-full h-full object-cover opacity-85"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80';
              }}
            />

            {/* SVG Bounding Boxes, IDs, and Movement Indicators (Person 01, Person 02, Person 03) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 450">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                </marker>
              </defs>

              {/* PERSON 01 */}
              <g>
                <rect x="210" y="140" width="58" height="135" rx="3" stroke="#2563EB" strokeWidth="2.5" fill="rgba(37, 99, 235, 0.15)" />
                {/* Detection Label */}
                <rect x="210" y="118" width="85" height="20" rx="3" fill="#2563EB" />
                <text x="215" y="132" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Person 01</text>
                {/* DeepSORT Tracking Vector */}
                <line x1="239" y1="205" x2="285" y2="205" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#arrow)" />
                <circle cx="239" cy="205" r="3.5" fill="#10B981" />
                <text x="212" y="290" fill="#93C5FD" fontSize="10" fontFamily="monospace">ID: #8421</text>
              </g>

              {/* PERSON 02 */}
              <g>
                <rect x="330" y="160" width="54" height="128" rx="3" stroke="#2563EB" strokeWidth="2.5" fill="rgba(37, 99, 235, 0.15)" />
                <rect x="330" y="138" width="85" height="20" rx="3" fill="#2563EB" />
                <text x="335" y="152" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Person 02</text>
                <line x1="357" y1="225" x2="400" y2="228" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#arrow)" />
                <circle cx="357" cy="225" r="3.5" fill="#10B981" />
                <text x="332" y="303" fill="#93C5FD" fontSize="10" fontFamily="monospace">ID: #8422</text>
              </g>

              {/* PERSON 03 */}
              <g>
                <rect x="440" y="130" width="56" height="142" rx="3" stroke="#2563EB" strokeWidth="2.5" fill="rgba(37, 99, 235, 0.15)" />
                <rect x="440" y="108" width="85" height="20" rx="3" fill="#2563EB" />
                <text x="445" y="122" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">Person 03</text>
                <line x1="468" y1="200" x2="515" y2="198" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#arrow)" />
                <circle cx="468" cy="200" r="3.5" fill="#10B981" />
                <text x="442" y="287" fill="#93C5FD" fontSize="10" fontFamily="monospace">ID: #8423</text>
              </g>

              {/* PERSON 04 Background */}
              <g>
                <rect x="560" y="175" width="46" height="110" rx="2" stroke="#0F766E" strokeWidth="2" fill="rgba(15, 118, 110, 0.15)" />
                <rect x="560" y="157" width="75" height="17" rx="2" fill="#0F766E" />
                <text x="564" y="169" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">Person 04</text>
                <circle cx="583" cy="230" r="3" fill="#10B981" />
              </g>
            </svg>

            {/* Top HUD Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded text-white font-mono text-[10px] flex items-center gap-1.5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span>REC • 30 FPS</span>
              </div>
              <div className="bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded text-[#93C5FD] font-mono text-[10px] border border-white/10">
                <span>YOLOv8 + DeepSORT</span>
              </div>
            </div>

            {/* Bottom HUD: Detection count */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md border border-[#CBD5E1] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                  <span className="font-bold text-[#0F172A] font-mono">TRACKING ACTIVE:</span>
                  <span className="text-[#2563EB] font-mono font-bold">{activeCam.peopleDetected} Persons In Frame</span>
                </div>
              </div>
              <div className="font-mono text-[11px] text-[#64748B]">
                Kinematic Flow Vector: <strong className="text-[#0F172A]">East → West</strong>
              </div>
            </div>
          </div>

          {/* Beside the Camera Feed: Exactly specified Section 8 Metrics */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-white border-t lg:border-t-0 lg:border-l border-[#CBD5E1] flex flex-col justify-between space-y-5">
            <div>
              <div className="pb-3 border-b border-[#F1F5F9]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] font-mono block">
                  Vision Telemetry Panel
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
                  {activeCam.name} Live Metrics
                </h3>
              </div>

              {/* Exact Section 8 Metrics */}
              <div className="mt-4 space-y-3.5">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] uppercase font-bold text-[#64748B] block">People Detected</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold font-mono text-[#0F172A]">
                      {activeCam.peopleDetected}
                    </span>
                    <span className="text-xs text-[#16A34A] font-medium font-mono">Live Bounding Boxes</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] uppercase font-bold text-[#64748B] block">Average Density</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold font-mono text-[#0F172A]">
                      {activeCam.density}
                    </span>
                    <span className="text-xs text-[#64748B] font-mono">persons/m²</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] uppercase font-bold text-[#64748B] block">Movement Direction</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base font-bold font-mono text-[#0F766E] flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#0F766E]" />
                      {activeCam.direction}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] uppercase font-bold text-[#64748B] block">Current Risk</span>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-extrabold font-mono border ${
                      activeCam.riskLevel === 'HIGH' 
                        ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]'
                        : activeCam.riskLevel === 'MODERATE'
                        ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                        : 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]'
                    }`}>
                      {activeCam.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline explanation badge */}
            <div className="p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1D4ED8]">
              <span className="font-bold block">YOLOv8 + DeepSORT Pipeline:</span>
              <p className="mt-0.5 text-[11px] text-[#2563EB] leading-relaxed">
                YOLO identifies human silhouettes in bounding boxes; DeepSORT calculates spatial Kalman filters across consecutive video frames to measure density and directional velocity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 11: CAMERAS / VENUE MONITORING CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            Surveillance Node Directory (4 CCTV Feeds)
          </h2>
          <span className="text-xs text-[#64748B]">Click any camera to preview stream</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {camerasData.map((cam) => {
            const isSelected = selectedCamId === cam.id;
            const isOnline = cam.status === 'ONLINE';

            return (
              <div
                key={cam.id}
                onClick={() => isOnline && setSelectedCamId(cam.id)}
                className={`p-4 rounded-xl border bg-white transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-sm'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                } ${!isOnline ? 'opacity-70 cursor-not-allowed bg-[#F8FAFC]' : ''}`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="font-bold font-mono text-[#2563EB] text-xs">{cam.code}</span>
                  <div className="flex items-center gap-1.5">
                    {isOnline ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[10px] font-bold font-mono text-[#16A34A] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                        ONLINE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] border border-[#FCA5A5] text-[10px] font-bold font-mono text-[#DC2626] flex items-center gap-1">
                        <WifiOff className="w-3 h-3 text-[#DC2626]" />
                        OFFLINE
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-[#0F172A] text-sm">{cam.name}</h4>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block uppercase">Count</span>
                      <span className="font-mono font-bold text-[#0F172A]">{cam.peopleDetected}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64748B] block uppercase">Density</span>
                      <span className="font-mono font-bold text-[#0F172A]">{cam.density}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#64748B]">Risk Level</span>
                  <span className={`font-bold ${
                    cam.riskLevel === 'HIGH' ? 'text-[#DC2626]' : cam.riskLevel === 'MODERATE' ? 'text-[#D97706]' : 'text-[#16A34A]'
                  }`}>
                    {cam.riskLevel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
