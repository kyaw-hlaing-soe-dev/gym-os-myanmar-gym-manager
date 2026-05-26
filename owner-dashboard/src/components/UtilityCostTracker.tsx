"use client";

import {
  Lightbulb,
  Fuel,
  Zap,
  TrendingDown,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";
import { utilityCosts, utilityInsights } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function formatMMK(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toLocaleString();
}

export default function UtilityCostTracker() {
  const [generatorMode, setGeneratorMode] = useState(false);

  const totalCost = utilityCosts.reduce(
    (sum, m) => sum + m.gridCost + m.generatorCost,
    0,
  );
  const totalOutage = utilityCosts.reduce((sum, m) => sum + m.outageHours, 0);
  const totalDiesel = utilityCosts.reduce((sum, m) => sum + m.dieselLiters, 0);
  const budgetUsed = Math.round(
    (utilityInsights.spentThisMonth / utilityInsights.budgetThisMonth) * 100,
  );

  const chartData = utilityCosts.map((m) => ({
    month: m.month,
    "Grid (MMK)": m.gridCost,
    "Generator (MMK)": m.generatorCost,
    "Outage Hrs": m.outageHours,
  }));

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb size={24} className="text-amber-500" />
            Utility Cost Tracker
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor electricity and generator costs · လျှပ်စစ်နှင့် ဂျင်နရေတာ
            ကုန်ကျစရိတ်
          </p>
        </div>
        {/* Generator Mode Toggle */}
        <button
          id="generator-mode-toggle"
          onClick={() => setGeneratorMode(!generatorMode)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200"
          style={{
            background: generatorMode
              ? "linear-gradient(135deg, #f59e0b, #d97706)"
              : "#f1f5f9",
            color: generatorMode ? "white" : "#64748b",
            boxShadow: generatorMode
              ? "0 4px 16px rgba(245,158,11,0.3)"
              : "none",
          }}
        >
          {generatorMode ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          <span className="text-sm font-semibold">Generator Mode</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Zap,
            label: "Total Utility Cost",
            value: `${formatMMK(totalCost)} MMK`,
            sub: "5 months",
            color: "#e11d48",
            bg: "#fff1f2",
          },
          {
            icon: Fuel,
            label: "Diesel Used",
            value: `${totalDiesel}L`,
            sub: `${utilityInsights.generatorPercentage}% of total cost`,
            color: "#d97706",
            bg: "#fef3c7",
          },
          {
            icon: Clock,
            label: "Outage Hours",
            value: `${totalOutage}h`,
            sub: `Peak: ${utilityInsights.peakOutageDay} ${utilityInsights.peakOutageTime}`,
            color: "#7c3aed",
            bg: "#ede9fe",
          },
          {
            icon: TrendingDown,
            label: "May Budget",
            value: `${budgetUsed}%`,
            sub: `${formatMMK(utilityInsights.spentThisMonth)} / ${formatMMK(utilityInsights.budgetThisMonth)} MMK`,
            color: budgetUsed > 90 ? "#e11d48" : "#0d9488",
            bg: budgetUsed > 90 ? "#fff1f2" : "#f0fdfa",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="card p-4 rounded-xl"
              style={{ background: kpi.bg }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: kpi.color }} />
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: kpi.color, opacity: 0.8 }}
                >
                  {kpi.label}
                </span>
              </div>
              <p
                className="font-mono-data font-bold text-xl"
                style={{ color: kpi.color }}
              >
                {kpi.value}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: kpi.color, opacity: 0.7 }}
              >
                {kpi.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart + AI Insight */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <div className="xl:col-span-2 card p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Monthly Cost Breakdown — Grid vs Generator
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value) => {
                    if (value == null) return "";
                    const numeric =
                      typeof value === "number" ? value : Number(String(value));
                    return Number.isFinite(numeric)
                      ? `${numeric.toLocaleString()} MMK`
                      : `${String(value)}`;
                  }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="Grid (MMK)"
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Generator (MMK)"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="xl:col-span-1 card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-teal-500" />
            <h3 className="text-sm font-semibold text-slate-700">
              AI Recommendation
            </h3>
          </div>
          <div
            className="flex-1 p-4 rounded-xl text-sm leading-relaxed"
            style={{ background: "#f0fdfa", border: "1px solid #ccfbf1" }}
          >
            <p className="text-slate-700 mb-3">
              {utilityInsights.aiRecommendation}
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              {utilityInsights.aiRecommendationMM}
            </p>
          </div>

          {/* Budget Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">
                May Budget Usage
              </span>
              <span className="font-semibold text-slate-700">
                {budgetUsed}%
              </span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${budgetUsed}%`,
                  background:
                    budgetUsed > 90
                      ? "linear-gradient(90deg, #e11d48, #f43f5e)"
                      : budgetUsed > 70
                        ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                        : "linear-gradient(90deg, #0d9488, #14b8a6)",
                }}
              />
            </div>
          </div>

          {/* Generator Mode Panel */}
          {generatorMode && (
            <div
              className="mt-4 p-4 rounded-xl animate-fade-in-up"
              style={{
                background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
                border: "1px solid #fde68a",
              }}
            >
              <p className="text-amber-800 text-xs font-semibold mb-1">
                ⚡ Generator Mode Active
              </p>
              <p className="text-amber-700 text-xs leading-relaxed">
                Rescheduling recommendations active. Shift 5PM–7PM classes to
                reduce diesel consumption during peak outage windows.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
