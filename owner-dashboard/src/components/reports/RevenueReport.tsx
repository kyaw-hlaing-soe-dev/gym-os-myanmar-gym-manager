'use client';

import { useEffect, useRef } from 'react';
import type { PaymentRecord } from '@/lib/types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Chart: any;
  }
}

interface Props {
  payments: PaymentRecord[];
  chartJsLoaded: boolean;
}

const PLAN_COLORS = ['#0f9b8e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
const METHOD_COLORS = ['#0f9b8e', '#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b'];

function Skeleton() {
  return <div className="h-full animate-pulse rounded-xl bg-slate-100" />;
}

export default function RevenueReport({ payments, chartJsLoaded }: Props) {
  const planRef = useRef<HTMLCanvasElement>(null);
  const methodRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const planChart = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methodChart = useRef<any>(null);

  // Group by plan
  const byPlan: Record<string, number> = {};
  payments.forEach((p) => { byPlan[p.plan] = (byPlan[p.plan] ?? 0) + p.amount; });

  // Group by method
  const byMethod: Record<string, number> = {};
  payments.forEach((p) => { byMethod[p.method] = (byMethod[p.method] ?? 0) + p.amount; });

  useEffect(() => {
    if (!chartJsLoaded || !window.Chart) return;

    // Plan bar chart
    if (planRef.current) {
      planChart.current?.destroy();
      const labels = Object.keys(byPlan);
      const data = labels.map((k) => byPlan[k]);
      planChart.current = new window.Chart(planRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Revenue (MMK)',
              data,
              backgroundColor: labels.map((_, i) => PLAN_COLORS[i % PLAN_COLORS.length]),
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
              ticks: { callback: (v: number) => `${(v / 1000).toFixed(0)}K`, color: '#64748b', font: { size: 11 } },
            },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
          },
        },
      });
    }

    // Payment method doughnut
    if (methodRef.current) {
      methodChart.current?.destroy();
      const labels = Object.keys(byMethod);
      const data = labels.map((k) => byMethod[k]);
      methodChart.current = new window.Chart(methodRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: labels.map((_, i) => METHOD_COLORS[i % METHOD_COLORS.length]),
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#64748b', padding: 12 } },
            tooltip: {
              callbacks: {
                label: (ctx: { label: string; raw: number }) =>
                  ` ${ctx.label}: ${ctx.raw.toLocaleString()} MMK`,
              },
            },
          },
        },
      });
    }

    return () => {
      planChart.current?.destroy();
      methodChart.current?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartJsLoaded, JSON.stringify(byPlan), JSON.stringify(byMethod)]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Revenue Breakdown</h3>
      <p className="mb-5 text-xs text-slate-500">ဝင်ငွေခွဲခြမ်းစိတ်ဖြာမှု</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            By Plan Type
          </p>
          <div className="h-52">
            {chartJsLoaded ? <canvas ref={planRef} /> : <Skeleton />}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            By Payment Method
          </p>
          <div className="h-52">
            {chartJsLoaded ? <canvas ref={methodRef} /> : <Skeleton />}
          </div>
        </div>
      </div>

      {/* Tabular summary */}
      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-400">Plan Totals</p>
          {Object.entries(byPlan)
            .sort(([, a], [, b]) => b - a)
            .map(([plan, amount]) => (
              <div key={plan} className="flex justify-between py-1 text-sm">
                <span className="text-slate-700">{plan}</span>
                <span className="font-semibold text-slate-900">
                  {amount.toLocaleString()} MMK
                </span>
              </div>
            ))}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-400">Method Totals</p>
          {Object.entries(byMethod)
            .sort(([, a], [, b]) => b - a)
            .map(([method, amount]) => (
              <div key={method} className="flex justify-between py-1 text-sm">
                <span className="text-slate-700">{method}</span>
                <span className="font-semibold text-slate-900">
                  {amount.toLocaleString()} MMK
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
