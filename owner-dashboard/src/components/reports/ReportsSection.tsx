'use client';

import { useMemo, useState } from 'react';
import type { Member, PaymentRecord } from '@/lib/types';
import RevenueReport from './RevenueReport';
import MembersReport from './MembersReport';
import ChurnReport from './ChurnReport';
import { exportReportCsv } from './exportCsv';

// ─── Date range helpers ────────────────────────────────────────────────────────

type RangeId = 'this-week' | 'this-month' | 'last-month' | 'custom';

function computeRange(id: RangeId, from: string, to: string): [Date, Date] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (id === 'this-week') {
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    return [monday, today];
  }
  if (id === 'this-month') {
    return [new Date(today.getFullYear(), today.getMonth(), 1), today];
  }
  if (id === 'last-month') {
    const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const last = new Date(today.getFullYear(), today.getMonth(), 0);
    return [first, last];
  }
  // custom
  const f = from ? new Date(from) : new Date(today.getFullYear(), today.getMonth(), 1);
  const t = to ? new Date(to) : today;
  return [f, t];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  members: Member[];
  paymentRecords: PaymentRecord[];
}

const RANGE_OPTIONS: { id: RangeId; label: string }[] = [
  { id: 'this-week', label: 'This Week' },
  { id: 'this-month', label: 'This Month' },
  { id: 'last-month', label: 'Last Month' },
  { id: 'custom', label: 'Custom' },
];

export default function ReportsSection({ members, paymentRecords }: Props) {
  const [range, setRange] = useState<RangeId>('this-month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const [fromDate, toDate] = useMemo(
    () => computeRange(range, customFrom, customTo),
    [range, customFrom, customTo],
  );

  // Payments in period
  const filteredPayments = useMemo(
    () =>
      paymentRecords.filter((p) => {
        const d = new Date(p.date);
        return d >= fromDate && d <= toDate;
      }),
    [paymentRecords, fromDate, toDate],
  );

  // New members who joined in period
  const newMembers = useMemo(
    () =>
      members.filter((m) => {
        const d = new Date(m.joinDate);
        return d >= fromDate && d <= toDate;
      }),
    [members, fromDate, toDate],
  );

  const totalRevenue = filteredPayments.reduce((s, p) => s + p.amount, 0);
  const newCount = filteredPayments.filter((p) => p.type === 'New').length;
  const renewCount = filteredPayments.filter((p) => p.type === 'Renewal').length;

  function handleExport() {
    exportReportCsv(filteredPayments, newMembers, fromDate, toDate);
  }

  return (
    <div className="space-y-5">
        {/* ── Header card ───────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-950">Reports & Analytics</h2>
              <p className="text-xs text-slate-500">
                အစီရင်ခံစာများနှင့် ခွဲခြမ်းစိတ်ဖြာမှု
              </p>
            </div>
            <button
              id="reports-export-btn"
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ background: '#0f9b8e' }}
            >
              ⬇ Export CSV
            </button>
          </div>

          {/* Date range picker */}
          <div className="mt-4 flex flex-wrap gap-2">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                id={`range-${opt.id}`}
                onClick={() => setRange(opt.id)}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition"
                style={{
                  background: range === opt.id ? '#0f9b8e' : '#f1f5f9',
                  color: range === opt.id ? '#ffffff' : '#64748b',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {range === 'custom' && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                id="report-from"
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0f9b8e]"
              />
              <span className="text-sm text-slate-400">to</span>
              <input
                id="report-to"
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0f9b8e]"
              />
            </div>
          )}

          {/* 🏆 Best performing month banner */}
          <div
            className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              background: '#0f9b8e12',
              border: '1px solid #0f9b8e30',
            }}
          >
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-sm font-bold" style={{ color: '#0f9b8e' }}>
                Best performing month: March — 21,200,000 MMK
              </p>
              <p className="text-xs text-slate-500">
                အကောင်းဆုံး လ · မတ်လ · ၂၁.၂ သန်း ကျပ်
              </p>
            </div>
          </div>
        </section>

        {/* ── Summary KPIs ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            {
              label: 'Total Collected',
              labelMM: 'စုစုပေါင်းကောက်ခံ',
              value: `${(totalRevenue / 1_000_000).toFixed(2)}M MMK`,
              color: '#0f9b8e',
            },
            {
              label: 'Transactions',
              labelMM: 'ငွေပေးငွေယူ',
              value: filteredPayments.length,
              color: '#3b82f6',
            },
            {
              label: 'New Members',
              labelMM: 'အသစ်ဝင်ရောက်',
              value: newCount,
              color: '#10b981',
            },
            {
              label: 'Renewals',
              labelMM: 'သက်တမ်းတိုး',
              value: renewCount,
              color: '#8b5cf6',
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {card.label}
              </p>
              <p className="text-[9px] text-slate-400">{card.labelMM}</p>
              <p
                className="mt-2 text-2xl font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Sub-reports ───────────────────────────────────────────────── */}
        <RevenueReport payments={filteredPayments} />
        <MembersReport newMembers={newMembers} payments={filteredPayments} />
        <ChurnReport members={members} fromDate={fromDate} toDate={toDate} />
    </div>
  );
}
