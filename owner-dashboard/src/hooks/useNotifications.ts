'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import type { Member, GymNotification } from '@/lib/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysDiff(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function buildNotifications(
  members: Member[],
  readIds: Set<string>,
): GymNotification[] {
  const result: GymNotification[] = [];
  const now = new Date().toISOString();

  for (const member of members) {
    // ── Expiring in ≤ 3 days ─────────────────────────────────────────────
    const expiryDiff = daysDiff(member.expiryDate);
    if (expiryDiff >= 0 && expiryDiff <= 3) {
      const id = `exp-${member.id}`;
      const daysText =
        expiryDiff === 0
          ? 'today'
          : `in ${expiryDiff} day${expiryDiff > 1 ? 's' : ''}`;
      result.push({
        id,
        type: 'expiring',
        message: `${member.name}'s ${member.plan} membership expires ${daysText}`,
        memberName: member.name,
        memberId: member.id,
        timestamp: now,
        read: readIds.has(id),
      });
    }

    // ── Overdue payment > 7 days ──────────────────────────────────────────
    if (
      member.paymentDueDate &&
      (member.paymentStatus === 'Overdue' || member.paymentStatus === 'Unpaid')
    ) {
      const overdueDiff = daysDiff(member.paymentDueDate);
      if (overdueDiff < -7) {
        const id = `ov-${member.id}`;
        result.push({
          id,
          type: 'overdue',
          message: `${member.name} — payment ${Math.abs(overdueDiff)} days overdue (${member.plan})`,
          memberName: member.name,
          memberId: member.id,
          timestamp: now,
          read: readIds.has(id),
        });
      }
    }

    // ── Churn risk: no visit in 14+ days ─────────────────────────────────
    if (member.lastVisitDate) {
      const visitDiff = daysDiff(member.lastVisitDate);
      if (visitDiff <= -14) {
        const id = `churn-${member.id}`;
        result.push({
          id,
          type: 'churn',
          message: `${member.name} hasn't visited in ${Math.abs(visitDiff)} days — churn risk`,
          memberName: member.name,
          memberId: member.id,
          timestamp: now,
          read: readIds.has(id),
        });
      }
    }
  }

  return result;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotifications(members: Member[]) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gymNotifRead');
      if (stored) {
        window.setTimeout(() => {
          setReadIds(new Set(JSON.parse(stored) as string[]));
        }, 0);
      }
    } catch {
      // ignore
    }
  }, []);

  const notifications = useMemo(
    () => buildNotifications(members, readIds),
    [members, readIds],
  );

  const markAllRead = useCallback(() => {
    const newIds = new Set([...readIds, ...notifications.map((n) => n.id)]);
    setReadIds(newIds);
    try {
      localStorage.setItem('gymNotifRead', JSON.stringify([...newIds]));
    } catch {
      // ignore
    }
  }, [notifications, readIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead };
}
