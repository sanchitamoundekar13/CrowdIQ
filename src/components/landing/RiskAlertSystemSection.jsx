import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  Sliders, 
  Shield 
} from 'lucide-react';

export function RiskAlertSystemSection() {
  const riskLevels = [
    {
      level: 'LOW',
      badgeClass: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
      dotColor: '#16A34A',
      title: 'Normal Crowd Movement',
      densityRange: '< 3.0 persons/m²',
      description: 'Laminar pedestrian flow with unimpeded circulation through access gates and concourses.'
    },
    {
      level: 'MEDIUM',
      badgeClass: 'bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]',
      dotColor: '#EAB308',
      title: 'Increasing Crowd Density',
      densityRange: '3.0 – 5.5 persons/m²',
      description: 'Localized queue formation and slight deceleration of ingress flow. Security monitors on standby.'
    },
    {
      level: 'HIGH',
      badgeClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
      dotColor: '#F59E0B',
      title: 'Potential Congestion',
      densityRange: '5.5 – 7.5 persons/m²',
      description: 'Inflow rate exceeds bottleneck outflow capacity. Early warning flags potential crush hazard within 4 minutes.'
    },
    {
      level: 'CRITICAL',
      badgeClass: 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
      dotColor: '#DC2626',
      title: 'Dangerous Crowd Concentration',
      densityRange: '> 7.5 persons/m²',
      description: 'Severe congestion with restricted physical mobility. Immediate turnstile throttling and squad dispatch required.'
    }
  ];

  const sampleIncidents = [
    {
      id: 'ALERT #1042',
      severity: 'CRITICAL',
      title: 'HIGH DENSITY DETECTED',
      location: 'Gate 3',
      time: '13:42:18',
      density: '7.8 persons/m²',
      status: 'Investigating',
      action: 'Open alternate exit & dispatch Squad 04'
    },
    {
      id: 'ALERT #1041',
      severity: 'HIGH',
      title: 'INFLOW RATE SURGE',
      location: 'Concourse B East',
      time: '13:38:05',
      density: '6.4 persons/m²',
      status: 'Acknowledged',
      action: 'Pacing turnstiles at 80/min'
    },
    {
      id: 'ALERT #1040',
      severity: 'MEDIUM',
      title: 'SLOW EGRESS FLOW',
      location: 'West Plaza Corridor',
      time: '13:31:40',
      density: '4.8 persons/m²',
      status: 'Resolved',
      action: 'Stanchions adjusted for wider corridor'
    }
  ];

  return (
    <section className="bg-[#F7F9FC] py-16 lg:py-20 border-b border-[#E2E8F0]" id="risk-alerts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Risk & Alert Classification System
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            Transparent 4-tier risk threshold taxonomy engineered to eliminate alert fatigue and prioritize high-consequence interventions.
          </p>
        </div>

        {/* 4 Risk Level Hierarchy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {riskLevels.map((item) => (
            <div 
              key={item.level}
              className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold font-mono border ${item.badgeClass}`}>
                  {item.level}
                </span>
                <span className="text-[11px] font-mono text-[#64748B]">{item.densityRange}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center gap-1.5 text-[11px] text-[#64748B]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.dotColor }}></span>
                <span>Automated classification</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security Operator Incident Table with ALERT #1042 */}
        <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Real-Time Security Incident Dispatch Log</h3>
              <p className="text-xs text-[#64748B]">Active surveillance triggers logged from edge vision streams</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-mono uppercase text-[11px]">
                  <th className="py-3 px-4 font-bold">Alert ID</th>
                  <th className="py-3 px-4 font-bold">Severity</th>
                  <th className="py-3 px-4 font-bold">Classification</th>
                  <th className="py-3 px-4 font-bold">Location</th>
                  <th className="py-3 px-4 font-bold">Time</th>
                  <th className="py-3 px-4 font-bold">Density</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Mitigation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {sampleIncidents.map((inc) => {
                  const isCrit = inc.severity === 'CRITICAL';
                  const isHigh = inc.severity === 'HIGH';
                  return (
                    <tr 
                      key={inc.id} 
                      className={`hover:bg-[#F8FAFC] transition-colors ${isCrit ? 'bg-[#FEF2F2]/40' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A]">{inc.id}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${
                          isCrit 
                            ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' 
                            : isHigh 
                            ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                            : 'bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]'
                        }`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#0F172A]">{inc.title}</td>
                      <td className="py-3.5 px-4 text-[#475569]">{inc.location}</td>
                      <td className="py-3.5 px-4 font-mono text-[#64748B]">{inc.time}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A]">{inc.density}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          inc.status === 'Investigating' 
                            ? 'bg-[#FEF2F2] text-[#DC2626]' 
                            : inc.status === 'Acknowledged'
                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                            : 'bg-[#F0FDF4] text-[#16A34A]'
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#475569] font-medium">{inc.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
