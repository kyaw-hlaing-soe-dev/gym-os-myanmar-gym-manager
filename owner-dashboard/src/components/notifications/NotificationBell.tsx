'use client';

import { useEffect, useRef, useState } from 'react';
import type { GymNotification, NotificationType } from '@/lib/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<NotificationType, string> = {
  expiring: '⚠️',
  overdue: '💸',
  churn: '📉',
};

const TYPE_COLOR: Record<NotificationType, string> = {
  expiring: '#f59e0b',
  overdue: '#ef4444',
  churn: '#8b5cf6',
};

const TYPE_LABEL: Record<NotificationType, string> = {
  expiring: 'Expiring',
  overdue: 'Overdue',
  churn: 'Churn Risk',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  notifications: GymNotification[];
  unreadCount: number;
  onMarkAllRead: () => void;
}

export default function NotificationBell({
  notifications,
  unreadCount,
  onMarkAllRead,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        id="notif-bell-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications — ${unreadCount} unread`}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-600 shadow-sm transition hover:bg-slate-50"
      >
        🔔
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
            style={{ background: '#ef4444' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          style={{ animation: 'fadeSlideDown 0.15s ease' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="font-semibold text-slate-900">Notifications</p>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{
                background: unreadCount > 0 ? '#ef444420' : '#10b98120',
                color: unreadCount > 0 ? '#ef4444' : '#10b981',
              }}
            >
              {unreadCount > 0 ? `${unreadCount} unread` : 'all read'}
            </span>
          </div>

          {/* Alert list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-2xl">🎉</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">All clear!</p>
                <p className="mt-1 text-xs text-slate-400">No alerts at the moment.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50 ${
                    notif.read ? 'opacity-55' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                      style={{ background: TYPE_COLOR[notif.type] + '20' }}
                    >
                      {TYPE_ICON[notif.type]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: TYPE_COLOR[notif.type] }}>
                        {TYPE_LABEL[notif.type]}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-700">{notif.message}</p>
                      <p className="mt-1 text-xs text-slate-400">{timeAgo(notif.timestamp)}</p>
                    </div>
                    {!notif.read && (
                      <div
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: '#0f9b8e' }}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {unreadCount > 0 && (
            <div className="border-t border-slate-100 px-4 py-3">
              <button
                onClick={() => {
                  onMarkAllRead();
                  setOpen(false);
                }}
                className="w-full rounded-xl py-2 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: '#0f9b8e' }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
