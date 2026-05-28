'use client';

import type { Member } from '@/lib/types';

interface Props {
  members: Member[];
  fromDate: Date;
  toDate: Date;
}

export default function ChurnReport({ members, fromDate, toDate }: Props) {
  // Churned = expired within the period AND status is Expired (did not renew)
  const churned = members.filter((m) => {
    const exp = new Date(m.expiryDate);
    return exp >= fromDate && exp <= toDate && m.status === 'Expired';
  });

  // At-risk = Active but high churn indicators in period
  const atRisk = members.filter((m) => {
    if (m.status !== 'Active') return false;
    if (!m.lastVisitDate) return false;
    const last = new Date(m.lastVisitDate);
    const daysDiff = Math.round(
      (new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysDiff >= 14;
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">Churn Analysis</h3>
          <p className="text-xs text-slate-500">ထွက်ခွာနိုင်ခြေ ခွဲခြမ်းစိတ်ဖြာမှု</p>
        </div>
        <div className="flex gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              background: churned.length > 0 ? '#ef444420' : '#10b98120',
              color: churned.length > 0 ? '#ef4444' : '#10b981',
            }}
          >
            {churned.length} churned
          </span>
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: '#f59e0b20', color: '#f59e0b' }}
          >
            {atRisk.length} at risk
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Churned */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Expired & Did Not Renew
          </p>
          {churned.length === 0 ? (
            <div className="rounded-xl bg-green-50 p-4 text-center">
              <p className="text-lg">🎉</p>
              <p className="mt-1 text-sm font-semibold text-green-700">
                No churn in this period!
              </p>
              <p className="mt-0.5 text-xs text-green-600">
                All expired members renewed.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {churned.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-200 text-xs font-bold text-red-700">
                    {m.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {m.nameMM} · {m.plan} · Expired {m.expiryDate}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                    Churned
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* At risk */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Active but At-Risk (14+ days absent)
          </p>
          {atRisk.length === 0 ? (
            <div className="rounded-xl bg-green-50 p-4 text-center">
              <p className="text-sm font-semibold text-green-700">
                All active members are engaged!
              </p>
            </div>
          ) : (
            <div className="max-h-56 space-y-2 overflow-y-auto">
              {atRisk.map((m) => {
                const daysSince = Math.round(
                  (new Date().getTime() - new Date(m.lastVisitDate!).getTime()) /
                    (1000 * 60 * 60 * 24),
                );
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700">
                      {m.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {m.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {m.plan} · Last visit {daysSince} days ago
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      {daysSince}d
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
