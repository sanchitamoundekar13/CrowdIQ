import React from 'react';
import { X, CheckCheck, Bell, ShieldAlert, Calendar, AlertOctagon, Server, QrCode } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { NotificationCategory } from '../../types/platform';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    userRole 
  } = usePlatform();

  if (!isOpen) return null;

  // Filter notifications relevant for user role
  const roleFiltered = notifications.filter(n => !n.targetRole || n.targetRole === userRole);

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'SECURITY':
        return <ShieldAlert className="w-4 h-4 text-[#DC2626]" />;
      case 'INCIDENT':
        return <AlertOctagon className="w-4 h-4 text-[#EA580C]" />;
      case 'EVENT':
        return <Calendar className="w-4 h-4 text-[#2563EB]" />;
      case 'REGISTRATION':
        return <QrCode className="w-4 h-4 text-[#16A34A]" />;
      case 'SYSTEM':
      default:
        return <Server className="w-4 h-4 text-[#64748B]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/20 backdrop-blur-2xs animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col text-[#0F172A]">
          
          {/* Header */}
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#2563EB]" />
              <h2 className="font-bold text-sm text-[#0F172A]">
                Notification Center
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold">
                {roleFiltered.filter(n => !n.isRead).length} new
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
              <button 
                onClick={onClose}
                className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
            {roleFiltered.length === 0 ? (
              <div className="p-8 text-center text-[#64748B] space-y-2">
                <Bell className="w-8 h-8 text-[#CBD5E1] mx-auto" />
                <p className="text-xs">No notifications currently</p>
              </div>
            ) : (
              roleFiltered.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.actionLink) {
                      onNavigate(notif.actionLink);
                      onClose();
                    }
                  }}
                  className={`p-4 transition-colors cursor-pointer flex items-start gap-3 hover:bg-[#F8FAFC] ${
                    !notif.isRead ? 'bg-[#EFF6FF]/40' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#0F172A] truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#64748B] px-1.5 py-0.2 rounded bg-[#F1F5F9]">
                        {notif.category}
                      </span>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-center">
            <button
              onClick={() => { onNavigate('notifications'); onClose(); }}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              View All Platform Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
