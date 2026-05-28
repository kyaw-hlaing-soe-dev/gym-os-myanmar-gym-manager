"use client";

import {
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

interface Props {
  newMembers: Member[];
  payments: PaymentRecord[];
}

const BAR_COLORS = ["#0f9b8e", "#2563eb"];

export default function MembersReport({ newMembers, payments }: Props) {
  const newCount = payments.filter((payment) => payment.type === "New").length;
  const renewCount = payments.filter((payment) => payment.type === "Renewal").length;
  const chartData = [
    { label: "New Members", count: newCount },
    { label: "Renewals", count: renewCount },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Member Activity</h3>
      <p className="mb-5 text-xs text-slate-500">အဖွဲ့ဝင်လှုပ်ရှားမှု</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            New Members vs Renewals
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={entry.label} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-teal-50 p-3 text-center">
              <p className="text-2xl font-bold text-teal-700">{newCount}</p>
              <p className="text-xs text-slate-500">New Members</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{renewCount}</p>
              <p className="text-xs text-slate-500">Renewals</p>
            </div>
          </div>
        </div>

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
              {newMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{member.name}</p>
                    <p className="text-xs text-slate-500">
                      {member.plan} · Joined {member.joinDate}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">
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
