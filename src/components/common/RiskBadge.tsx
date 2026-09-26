import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showDot?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  className = '', 
  showDot = true,
  size = 'md' 
}) => {
  const getStyles = () => {
    switch (level) {
      case 'SAFE':
        return {
          bg: 'bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A]',
          dot: 'bg-[#16A34A]',
          label: 'SAFE',
        };
      case 'WATCH':
        return {
          bg: 'bg-[#FEFCE8] border-[#FEF08A] text-[#CA8A04]',
          dot: 'bg-[#EAB308]',
          label: 'WATCH',
        };
      case 'HIGH':
        return {
          bg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]',
          dot: 'bg-[#F59E0B]',
          label: 'HIGH RISK',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626]',
          dot: 'bg-[#DC2626]',
          label: 'CRITICAL',
        };
      default:
        return {
          bg: 'bg-[#F1F5F9] border-[#CBD5E1] text-[#475569]',
          dot: 'bg-[#64748B]',
          label: 'NORMAL',
        };
    }
  };

  const config = getStyles();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-mono font-medium',
    md: 'px-2.5 py-1 text-xs font-mono font-semibold tracking-wider',
    lg: 'px-3.5 py-1.5 text-sm font-mono font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${config.bg} ${sizeClasses[size]} ${className}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot} ${level === 'CRITICAL' ? 'animate-ping' : ''}`} />
      )}
      {config.label}
    </span>
  );
};
