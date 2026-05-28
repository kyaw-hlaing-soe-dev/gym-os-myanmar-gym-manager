'use client';

import { useMemo, useState } from 'react';
import type { Member, CheckIn } from '@/lib/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  members: Member[];
  checkIns: CheckIn[];
  onCheckIn: (checkIn: CheckIn) => void;
}

export default function QuickCheckIn({ members, checkIns, onCheckIn }: Props) {
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const today = todayISO();

  // Today's check-ins
  const todayCheckIns = checkIns.filter((c) => c.timestamp.startsWith(today));
  const checkedInIds = new Set(todayCheckIns.map((c) => c.memberId));

  // Filtered member list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.nameMM.includes(search.trim()),
    );
  }, [members, search]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  }

  function doCheckIn(member: Member, isOverride = false) {
    const now = new Date().toISOString();
    const checkIn: CheckIn = {
      id: `ci-${member.id}-${now.replace(/\D/g, '')}`,
      memberId: member.id,
      memberName: member.name,
      memberNameMM: member.nameMM,
      timestamp: now,
      isOverride,
    };
    onCheckIn(checkIn);
    showToast(`✓ ${member.name} checked in at ${formatTime(now)}`);
  }

  function handleCheckIn(member: Member) {
    if (checkedInIds.has(member.id)) {
      const ok = window.confirm(
        `${member.name} already checked in today. Check in again?`,
      );
      if (ok) doCheckIn(member, true);
      return;
    }
    doCheckIn(member);
  }

  const statusColor = (m: Member) => {
    if (m.status === 'Expired') return '#ef4444';
    if (m.paymentStatus === 'Overdue' || m.paymentStatus === 'Unpaid') return '#f59e0b';
    return '#10b981';
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-950">Quick Check-In</h2>
          <p className="text-xs text-slate-500">လျင်မြန်သောတက်ရောက်မှတ်တမ်း</p>
        </div>
        <span
          className="rounded-xl px-3 py-1.5 text-sm font-bold text-white"
          style={{ background: '#0f9b8e' }}
        >
          {todayCheckIns.length} today
        </span>
      </div>

      <div className="p-5">
        {/* ── Search ───────────────────────────────────────────────────── */}
        <div className="relative mb-4">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            id="checkin-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member name or Myanmar name…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#0f9b8e] focus:bg-white focus:ring-2 focus:ring-[#0f9b8e30]"
          />
        </div>

        {/* ── Member rows ──────────────────────────────────────────────── */}
        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">
              No members found
            </p>
          )}

          {filtered.map((member) => {
            const alreadyIn = checkedInIds.has(member.id);
            return (
              <div
                key={member.id}
                className={`flex items-center gap-3 rounded-xl p-3 transition ${
                  alreadyIn ? 'bg-green-50' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                {/* Avatar */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: '#0f9b8e' }}
                >
                  {member.initials}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {member.name}
                    </p>
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: statusColor(member) }}
                    />
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {member.nameMM} · {member.plan} · Exp {member.expiryDate}
                  </p>
                </div>

                {/* Action */}
                {alreadyIn ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-semibold text-green-700">
                      ✓ Checked in
                    </span>
                    <button
                      onClick={() => handleCheckIn(member)}
                      className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                      Again?
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckIn(member)}
                    disabled={member.status === 'Expired'}
                    className="shrink-0 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ background: '#0f9b8e' }}
                    title={
                      member.status === 'Expired'
                        ? 'Membership expired'
                        : undefined
                    }
                  >
                    Check In
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Today's log ──────────────────────────────────────────────── */}
        {todayCheckIns.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              Today&apos;s log
            </p>
            <div className="max-h-44 space-y-1.5 overflow-y-auto">
              {[...todayCheckIns].reverse().map((ci) => (
                <div
                  key={ci.id}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs"
                >
                  <span className="font-semibold" style={{ color: '#0f9b8e' }}>
                    ✓
                  </span>
                  <span className="font-medium text-slate-700">
                    {ci.memberName}
                  </span>
                  {ci.isOverride && (
                    <span className="rounded-full bg-amber-100 px-1.5 text-[10px] text-amber-700">
                      override
                    </span>
                  )}
                  <span className="ml-auto text-slate-400">
                    {formatTime(ci.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-[70] rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-2xl"
          style={{
            background: '#0f9b8e',
            animation: 'fadeSlideUp 0.25s ease',
          }}
        >
          {toast}
        </div>
      )}
    </section>
  );
}
