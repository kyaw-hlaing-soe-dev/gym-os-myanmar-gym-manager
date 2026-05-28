"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Member, PaymentRecord } from "@/lib/types";

type Props = {
  members: Member[];
  paymentRecords: PaymentRecord[];
};

const PLAN_COLORS = ["#0f9b8e", "#2563eb", "#7c3aed", "#f59e0b"];

function monthKey(date: string) {
  return date.slice(0, 7);
}

function monthLabel(key: string) {
  return new Date(`${key}-01T00:00:00`).toLocaleDateString("en-US", { month: "short" });
}

function formatMMK(value: number) {
  return `${(value / 1_000_000).toFixed(1)}M MMK`;
}

export default function RevenueOverview({ members, paymentRecords }: Props) {
  const monthTotals = paymentRecords.reduce<Record<string, number>>((totals, payment) => {
    const key = monthKey(payment.date);
    totals[key] = (totals[key] ?? 0) + payment.amount;
    return totals;
  }, {});

  const trendData = Object.entries(monthTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, revenue]) => ({
      month: monthLabel(key),
      revenue,
      display: formatMMK(revenue),
    }));

  const currentRevenue = trendData.at(-1)?.revenue ?? 0;
  const previousRevenue = trendData.at(-2)?.revenue ?? 0;
  const momGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  const expectedRevenue = members.reduce((sum, member) => {
    const price = member.plan === "Premium Plus" ? 200_000 : member.plan === "Premium" ? 150_000 : member.plan === "Student" ? 60_000 : 80_000;
    return sum + price;
  }, 0);
  const collectionRate = expectedRevenue > 0 ? Math.min(100, (currentRevenue / expectedRevenue) * 100) : 0;

  const byPlan = Object.entries(
    paymentRecords.reduce<Record<string, number>>((totals, payment) => {
      totals[payment.plan] = (totals[payment.plan] ?? 0) + payment.amount;
      return totals;
    }, {}),
  ).map(([plan, amount]) => ({ plan, amount }));

  const outstandingMembers = members.filter(
    (member) => member.paymentStatus === "Overdue" || member.paymentStatus === "Unpaid",
  );
  const forecast = currentRevenue + Math.max(0, currentRevenue - previousRevenue);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Revenue Overview</h2>
            <p className="text-xs text-slate-500">Monthly collection, forecast, and outstanding payments · ဝင်ငွေခြုံငုံကြည့်ရန်</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
            <div className="rounded-xl bg-teal-50 px-3 py-2">
              <p className="text-lg font-bold text-teal-700">{formatMMK(currentRevenue)}</p>
              <p className="text-teal-700">Collected</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-lg font-bold text-slate-950">{collectionRate.toFixed(0)}%</p>
              <p className="text-slate-500">Collection</p>
            </div>
            <div className="rounded-xl bg-blue-50 px-3 py-2">
              <p className="text-lg font-bold text-blue-700">{momGrowth >= 0 ? "+" : ""}{momGrowth.toFixed(1)}%</p>
              <p className="text-blue-700">MoM</p>
            </div>
            <div className="rounded-xl bg-amber-50 px-3 py-2">
              <p className="text-lg font-bold text-amber-700">{outstandingMembers.length}</p>
              <p className="text-amber-700">Outstanding</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Monthly Revenue Trend</h3>
          <p className="mb-4 text-xs text-slate-500">လစဉ်ဝင်ငွေတိုးတက်မှု</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f9b8e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0f9b8e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(value) => `${Number(value) / 1_000_000}M`} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} MMK`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="revenue" stroke="#0f9b8e" strokeWidth={3} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Collection Rate</h3>
          <p className="text-xs text-slate-500">ကောက်ခံပြီးနှုန်း</p>
          <div className="mt-5 flex items-center gap-4">
            <div className="relative h-28 w-28 shrink-0 rounded-full bg-slate-100">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: `conic-gradient(#0f9b8e ${collectionRate * 3.6}deg, #e2e8f0 0deg)` }}
              />
              <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white">
                <span className="text-xl font-bold text-slate-950">{collectionRate.toFixed(0)}%</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{formatMMK(currentRevenue)} collected</p>
              <p className="mt-1 text-xs text-slate-500">Expected this cycle: {formatMMK(expectedRevenue)}</p>
              <p className="mt-3 rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                Forecast next month: {formatMMK(forecast)}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Revenue by Plan</h3>
          <p className="mb-4 text-xs text-slate-500">အစီအစဉ်အလိုက်ဝင်ငွေ</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPlan} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="plan" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(value) => `${Number(value) / 1_000_000}M`} />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} MMK`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {byPlan.map((entry, index) => (
                    <Cell key={entry.plan} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Outstanding Payments</h3>
          <p className="mb-4 text-xs text-slate-500">မကောက်ခံရသေးသောငွေများ</p>
          <div className="max-h-56 space-y-2 overflow-y-auto">
            {outstandingMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.plan} · Due {member.paymentDueDate ?? "now"}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                  {member.paymentStatus}
                </span>
              </div>
            ))}
            {outstandingMembers.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
                No outstanding payments.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
