import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: LucideIcon;
  statusColor?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate';
  pulse?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  trend,
  trendValue,
  icon: Icon,
  statusColor = 'cyan',
  pulse = false,
}) => {
  const iconBgMap = {
    cyan: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]',
    emerald: 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]',
    amber: 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
    rose: 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]',
    slate: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 bg-white border-[#E2E8F0] shadow-sm transition-all duration-200 hover:border-[#CBD5E1] ${
        pulse ? 'ring-1 ring-[#DC2626]/40 animate-pulse' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          {label}
        </span>
        <div className={`rounded-lg p-2 ${iconBgMap[statusColor]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold font-mono tracking-tight text-[#0F172A]">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-[#64748B] font-mono">
            {subValue}
          </span>
        )}
      </div>

      {trendValue && (
        <div className="mt-2 flex items-center gap-1.5 text-xs font-mono">
          {trend === 'up' && (
            <span className="text-[#DC2626] font-semibold flex items-center">↑ {trendValue}</span>
          )}
          {trend === 'down' && (
            <span className="text-[#16A34A] font-semibold flex items-center">↓ {trendValue}</span>
          )}
          {trend === 'neutral' && (
            <span className="text-[#64748B] flex items-center">→ {trendValue}</span>
          )}
          <span className="text-[#94A3B8] text-[11px]">vs baseline</span>
        </div>
      )}
    </div>
  );
};
