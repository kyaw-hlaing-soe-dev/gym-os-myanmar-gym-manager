"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { revenueData } from "@/lib/mockData";
import { TrendingUp } from "lucide-react";

function formatMMK(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass rounded-xl px-4 py-3 shadow-xl"
      style={{ border: "1px solid rgba(13,148,136,0.2)" }}
    >
      <p className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-slate-600 text-xs capitalize">{p.name}</span>
          <span className="text-slate-900 text-xs font-bold ml-auto pl-4">
            {formatMMK(p.value)} MMK
          </span>
        </div>
      ))}
      <p className="text-slate-400 text-[10px] mt-2 pt-2 border-t border-slate-200">
        {payload[0]
          ? `${((payload[0].value / 17_000_000) * 100 - 100).toFixed(1)}% vs target`
          : ""}
      </p>
    </div>
  );
};

export default function RevenueChart() {
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const lastMonth = revenueData[revenueData.length - 1];
  const prevMonth = revenueData[revenueData.length - 2];
  const growth = (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1);

  return (
    <div className="card p-6 animate-fade-in-up delay-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-slate-900 font-semibold text-base">
            Revenue Performance
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Monthly revenue vs target — last 6 months
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono-data text-2xl font-bold text-slate-900">
            {formatMMK(lastMonth.revenue)} MMK
          </p>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <TrendingUp size={12} className="text-teal-600" />
            <span className="text-teal-600 text-xs font-semibold">
              +{growth}% MoM
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 rounded bg-teal-500" />
          <span className="text-slate-500 text-xs">Actual Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-0.5 rounded"
            style={{ background: "#94a3b8", borderStyle: "dashed" }}
          />
          <span className="text-slate-500 text-xs">Target</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueData}
            margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatMMK}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#cbd5e1"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#targetGradient)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#0d9488"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={{ r: 4, fill: "#0d9488", stroke: "white", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#0d9488", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div
        className="grid grid-cols-3 gap-4 mt-5 pt-4"
        style={{ borderTop: "1px solid #f1f5f9" }}
      >
        <div>
          <p className="text-slate-400 text-xs">6-Month Total</p>
          <p className="font-mono-data font-bold text-slate-800 text-sm mt-0.5">
            {formatMMK(totalRevenue)} MMK
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Avg Monthly</p>
          <p className="font-mono-data font-bold text-slate-800 text-sm mt-0.5">
            {formatMMK(Math.round(totalRevenue / revenueData.length))} MMK
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs">Members</p>
          <p className="font-mono-data font-bold text-slate-800 text-sm mt-0.5">
            {lastMonth.members} active
          </p>
        </div>
      </div>
    </div>
  );
}
