"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const peakHoursData = [
  { hour: "6 AM", visitors: 18 },
  { hour: "7 AM", visitors: 42 },
  { hour: "8 AM", visitors: 36 },
  { hour: "9 AM", visitors: 22 },
  { hour: "10 AM", visitors: 16 },
  { hour: "11 AM", visitors: 20 },
  { hour: "12 PM", visitors: 28 },
  { hour: "1 PM", visitors: 25 },
  { hour: "2 PM", visitors: 21 },
  { hour: "3 PM", visitors: 24 },
  { hour: "4 PM", visitors: 34 },
  { hour: "5 PM", visitors: 58 },
  { hour: "6 PM", visitors: 74 },
  { hour: "7 PM", visitors: 82 },
  { hour: "8 PM", visitors: 69 },
  { hour: "9 PM", visitors: 45 },
  { hour: "10 PM", visitors: 24 },
];

export default function PeakGymHoursChart() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-950">Peak Gym Hours</h2>
          <p className="text-xs text-slate-500">Mock visitor counts from 6 AM to 10 PM</p>
        </div>
        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
          7 PM peak
        </span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={peakHoursData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              interval={1}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: "rgba(15,23,42,0.04)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
              }}
              labelStyle={{ color: "#0f172a", fontWeight: 700 }}
            />
            <Bar dataKey="visitors" radius={[8, 8, 0, 0]} fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
