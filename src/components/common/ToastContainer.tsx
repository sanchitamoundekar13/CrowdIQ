import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSimulation();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          info: <Info className="h-4 w-4 text-[#2563EB] shrink-0" />,
          warning: <AlertTriangle className="h-4 w-4 text-[#D97706] shrink-0" />,
          error: <XCircle className="h-4 w-4 text-[#DC2626] shrink-0" />,
          success: <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" />,
        };

        const borderColors = {
          info: 'border-[#BFDBFE] bg-white text-[#0F172A]',
          warning: 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]',
          error: 'border-[#FCA5A5] bg-[#FEF2F2] text-[#991B1B]',
          success: 'border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-300 ${
              borderColors[toast.type]
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">{icons[toast.type]}</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider font-mono">
                  {toast.title}
                </p>
                <p className="text-xs mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
