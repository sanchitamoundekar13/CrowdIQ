import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, CheckCircle, ShieldAlert, Zap, ArrowDownCircle, CheckCircle2 } from 'lucide-react';

export const AlertTimeline: React.FC = () => {
  const { alerts, acknowledgeAlert } = useSimulation();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          badge: 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          icon: <AlertTriangle className="h-3.5 w-3.5 text-[#DC2626]" />,
          dot: 'bg-[#DC2626]',
        };
      case 'HIGH':
        return {
          badge: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
          icon: <AlertTriangle className="h-3.5 w-3.5 text-[#D97706]" />,
          dot: 'bg-[#F59E0B]',
        };
      case 'WARNING':
        return {
          badge: 'bg-[#FEFCE8] text-[#CA8A04] border-[#FEF08A]',
          icon: <AlertTriangle className="h-3.5 w-3.5 text-[#CA8A04]" />,
          dot: 'bg-[#EAB308]',
        };
      case 'ACTION':
        return {
          badge: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          icon: <Zap className="h-3.5 w-3.5 text-[#2563EB]" />,
          dot: 'bg-[#2563EB]',
        };
      case 'RECOVERY':
        return {
          badge: 'bg-[#F0FDFA] text-[#0F766E] border-[#CCFBF1]',
          icon: <ArrowDownCircle className="h-3.5 w-3.5 text-[#0F766E]" />,
          dot: 'bg-[#0F766E]',
        };
      case 'RESOLVED':
        return {
          badge: 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
          icon: <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />,
          dot: 'bg-[#16A34A]',
        };
      default:
        return {
          badge: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
          icon: <CheckCircle className="h-3.5 w-3.5 text-[#475569]" />,
          dot: 'bg-[#64748B]',
        };
    }
  };

  return (
    <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 shadow-sm flex flex-col h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#2563EB]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A]">
            Real-Time Incident Stream & Telemetry Log
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#64748B]">
          {alerts.length} events logged
        </span>
      </div>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-3">
        {alerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);
          return (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border text-xs font-mono transition-all duration-150 ${
                alert.status === 'ACTIVE'
                  ? 'bg-white border-[#CBD5E1] shadow-xs hover:border-[#94A3B8]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  <span className="font-bold text-[#0F172A]">{alert.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold uppercase ${style.badge}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] text-[#64748B]">{alert.timeFormatted}</span>
                </div>
              </div>

              <p className="mt-1.5 text-xs text-[#475569] leading-relaxed">
                {alert.description}
              </p>

              <div className="mt-2 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                <span className="text-[#0F766E] truncate max-w-[280px]">
                  <strong>Action:</strong> {alert.actionTaken}
                </span>

                {alert.status === 'ACTIVE' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-2 py-0.5 rounded border border-[#CBD5E1] bg-white text-[10px] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status === 'ACKNOWLEDGED' && (
                  <span className="text-[10px] text-[#2563EB] font-semibold">Acknowledged</span>
                )}
                {alert.status === 'RESOLVED' && (
                  <span className="text-[10px] text-[#16A34A] font-semibold">Resolved</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
