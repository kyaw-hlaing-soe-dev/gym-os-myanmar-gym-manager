"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PaymentRecord } from "@/lib/types";

interface Props {
  payments: PaymentRecord[];
}

const PLAN_COLORS = ["#0f9b8e", "#2563eb", "#7c3aed", "#f59e0b", "#ef4444"];
const METHOD_COLORS = ["#0f9b8e", "#2563eb", "#ef4444", "#7c3aed", "#f59e0b"];

function formatMMK(value: number) {
  return `${value.toLocaleString()} MMK`;
}

export default function RevenueReport({ payments }: Props) {
  const byPlan = payments.reduce<Record<string, number>>((totals, payment) => {
    totals[payment.plan] = (totals[payment.plan] ?? 0) + payment.amount;
    return totals;
  }, {});

  const byMethod = payments.reduce<Record<string, number>>((totals, payment) => {
    totals[payment.method] = (totals[payment.method] ?? 0) + payment.amount;
    return totals;
  }, {});

  const planData = Object.entries(byPlan).map(([plan, amount]) => ({ plan, amount }));
  const methodData = Object.entries(byMethod).map(([method, amount]) => ({ method, amount }));

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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="plan" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(value) => `${Number(value) / 1_000}K`} />
                <Tooltip formatter={(value) => [formatMMK(Number(value)), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {planData.map((entry, index) => (
                    <Cell key={entry.plan} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            By Payment Method
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodData}
                  dataKey="amount"
                  nameKey="method"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                >
                  {methodData.map((entry, index) => (
                    <Cell key={entry.method} fill={METHOD_COLORS[index % METHOD_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [formatMMK(Number(value)), name]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {methodData.map((item, index) => (
              <span key={item.method} className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ background: METHOD_COLORS[index % METHOD_COLORS.length] }} />
                {item.method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-400">Plan Totals</p>
          {Object.entries(byPlan)
            .sort(([, a], [, b]) => b - a)
            .map(([plan, amount]) => (
              <div key={plan} className="flex justify-between py-1 text-sm">
                <span className="text-slate-700">{plan}</span>
                <span className="font-semibold text-slate-900">{formatMMK(amount)}</span>
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
                <span className="font-semibold text-slate-900">{formatMMK(amount)}</span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
