'use client';

import { useEffect, useRef } from 'react';
import type { Member, PaymentRecord } from '@/lib/types';

interface Props {
  newMembers: Member[];
  payments: PaymentRecord[];
  chartJsLoaded: boolean;
}

export default function MembersReport({ newMembers, payments, chartJsLoaded }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartInstance = useRef<any>(null);

  const newCount = payments.filter((p) => p.type === 'New').length;
  const renewCount = payments.filter((p) => p.type === 'Renewal').length;

  useEffect(() => {
    if (!chartJsLoaded || !window.Chart || !chartRef.current) return;

    chartInstance.current?.destroy();
    chartInstance.current = new window.Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['New Members', 'Renewals'],
        datasets: [
          {
            label: 'Count',
            data: [newCount, renewCount],
            backgroundColor: ['#0f9b8e', '#3b82f6'],
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            grid: { color: '#f1f5f9' },
            ticks: { stepSize: 1, color: '#64748b', font: { size: 11 } },
          },
          x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
        },
      },
    });

    return () => { chartInstance.current?.destroy(); };
  }, [chartJsLoaded, newCount, renewCount]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Member Activity</h3>
      <p className="mb-5 text-xs text-slate-500">အဖွဲ့ဝင်လှုပ်ရှားမှု</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            New Members vs Renewals
          </p>
          <div className="h-48">
            {chartJsLoaded ? (
              <canvas ref={chartRef} />
            ) : (
              <div className="h-full animate-pulse rounded-xl bg-slate-100" />
            )}
          </div>

          {/* Stat pills */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: '#0f9b8e15' }}
            >
              <p className="text-2xl font-bold" style={{ color: '#0f9b8e' }}>
                {newCount}
              </p>
              <p className="text-xs text-slate-500">New Members</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{renewCount}</p>
              <p className="text-xs text-slate-500">Renewals</p>
            </div>
          </div>
        </div>

        {/* New members list */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            New Members in Period
          </p>
          {newMembers.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">No new members in this period</p>
            </div>
          ) : (
            <div className="max-h-56 space-y-2 overflow-y-auto">
              {newMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: '#0f9b8e' }}
                  >
                    {m.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {m.plan} · Joined {m.joinDate}
                    </p>
                  </div>
                  <span
                    className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: '#0f9b8e20', color: '#0f9b8e' }}
                  >
                    New
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
