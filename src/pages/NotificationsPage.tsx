import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  ShieldAlert, 
  AlertOctagon, 
  Calendar, 
  QrCode, 
  Server, 
  Filter 
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { NotificationCategory } from '../types/platform';

interface NotificationsPageProps {
  onNavigate: (route: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    userRole 
  } = usePlatform();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter by user role and category
  const roleFiltered = notifications.filter(n => !n.targetRole || n.targetRole === userRole);
  const filteredNotifications = roleFiltered.filter(n => categoryFilter === 'ALL' || n.category === categoryFilter);

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
    <div className="space-y-6 text-[#0F172A]">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
              Notification Dispatch
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              {roleFiltered.filter(n => !n.isRead).length} Unread
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Platform Notifications &amp; System Broadcasts
          </h1>
          <p className="text-xs text-[#64748B]">
            Real-time critical telemetry advisories, squad incident dispatches, and public safety announcements.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="font-semibold text-[#475569]">Filter Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-white font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="SECURITY">Security</option>
            <option value="INCIDENT">Incident</option>
            <option value="EVENT">Event</option>
            <option value="REGISTRATION">Registration</option>
            <option value="SYSTEM">System</option>
          </select>
        </div>

        <span className="text-[11px] font-mono text-[#64748B]">
          Showing {filteredNotifications.length} items
        </span>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden divide-y divide-[#F1F5F9]">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] space-y-2">
            <Bell className="w-10 h-10 text-[#CBD5E1] mx-auto" />
            <p className="text-xs font-semibold">No notifications in this category</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.actionLink) onNavigate(notif.actionLink);
              }}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-[#F8FAFC] ${
                !notif.isRead ? 'bg-[#EFF6FF]/40 border-l-4 border-l-[#2563EB]' : ''
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#0F172A] truncate">
                    {notif.title}
                  </h3>
                  <span className="text-[11px] font-mono text-[#94A3B8] whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-[#475569] mt-1 leading-relaxed">
                  {notif.message}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F1F5F9] text-[#64748B]">
                    {notif.category}
                  </span>
                  {!notif.isRead && (
                    <span className="text-[10px] font-bold text-[#2563EB]">● Unread</span>
                  )}
                  {notif.actionLink && (
                    <span className="text-[10px] font-semibold text-[#2563EB] hover:underline ml-2">
                      View details →
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
