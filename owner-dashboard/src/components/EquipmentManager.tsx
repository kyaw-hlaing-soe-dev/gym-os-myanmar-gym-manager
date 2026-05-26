"use client";

import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Clock,
  Dumbbell,
} from "lucide-react";
import { useState } from "react";
import { equipmentList } from "@/lib/mockData";

function formatMMK(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M MMK`;
  return `${(v / 1_000).toFixed(0)}K MMK`;
}

const statusConfig = {
  good: {
    label: "Good",
    icon: CheckCircle2,
    color: "#0d9488",
    bg: "#f0fdfa",
    border: "#ccfbf1",
  },
  "needs-service": {
    label: "Needs Service",
    icon: AlertTriangle,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  "out-of-order": {
    label: "Out of Order",
    icon: XCircle,
    color: "#e11d48",
    bg: "#fff1f2",
    border: "#fecdd3",
  },
};

const categoryColors: Record<string, string> = {
  cardio: "#0d9488",
  strength: "#3a547d",
  functional: "#7c3aed",
  accessories: "#64748b",
};

export default function EquipmentManager() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null
  );

  const filtered =
    filter === "all"
      ? equipmentList
      : equipmentList.filter((eq) => eq.status === filter);

  const counts = {
    all: equipmentList.length,
    good: equipmentList.filter((e) => e.status === "good").length,
    "needs-service": equipmentList.filter((e) => e.status === "needs-service")
      .length,
    "out-of-order": equipmentList.filter((e) => e.status === "out-of-order")
      .length,
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Wrench size={24} className="text-slate-600" />
          Equipment Manager
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Track equipment lifecycle, maintenance, and AI repair/replace
          recommendations · ကိရိယာ စီမံခန့်ခွဲမှု
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(
          [
            { key: "all", label: "All", color: "#475569" },
            { key: "good", label: "Good", color: "#0d9488" },
            { key: "needs-service", label: "Needs Service", color: "#d97706" },
            { key: "out-of-order", label: "Out of Order", color: "#e11d48" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            id={`eq-filter-${tab.key}`}
            onClick={() => setFilter(tab.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: filter === tab.key ? tab.color : "#f1f5f9",
              color: filter === tab.key ? "white" : "#64748b",
              boxShadow:
                filter === tab.key
                  ? `0 4px 12px ${tab.color}33`
                  : "none",
            }}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((eq) => {
          const status = statusConfig[eq.status];
          const StatusIcon = status.icon;
          const usagePercent =
            eq.maxHours > 0
              ? Math.round((eq.usageHours / eq.maxHours) * 100)
              : 0;
          const isSelected = selectedEquipment === eq.id;

          return (
            <div
              key={eq.id}
              id={`equipment-${eq.id}`}
              className="card p-5 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{
                border: isSelected
                  ? `2px solid ${status.color}`
                  : "1px solid #e2e8f0",
              }}
              onClick={() =>
                setSelectedEquipment(isSelected ? null : eq.id)
              }
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {eq.name}
                  </h3>
                  <p className="text-slate-400 text-xs">{eq.nameMM}</p>
                </div>
                <span
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: status.bg,
                    color: status.color,
                    border: `1px solid ${status.border}`,
                  }}
                >
                  <StatusIcon size={11} />
                  {status.label}
                </span>
              </div>

              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                  style={{
                    background: categoryColors[eq.category] || "#64748b",
                  }}
                >
                  {eq.category}
                </span>
                <span className="text-slate-400 text-xs">
                  Since {eq.purchaseDate}
                </span>
              </div>

              {/* Usage Bar */}
              {eq.maxHours > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">
                      <Clock size={10} className="inline mr-1" />
                      {eq.usageHours.toLocaleString()} /{" "}
                      {eq.maxHours.toLocaleString()}h
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          usagePercent > 80
                            ? "#e11d48"
                            : usagePercent > 60
                              ? "#d97706"
                              : "#0d9488",
                      }}
                    >
                      {usagePercent}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${usagePercent}%`,
                        background:
                          usagePercent > 80
                            ? "linear-gradient(90deg, #e11d48, #f43f5e)"
                            : usagePercent > 60
                              ? "linear-gradient(90deg, #d97706, #fbbf24)"
                              : "linear-gradient(90deg, #0d9488, #14b8a6)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Maintenance Info */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Last: {eq.lastMaintenance}</span>
                <span
                  className="font-medium"
                  style={{
                    color:
                      eq.nextMaintenance === "OVERDUE"
                        ? "#e11d48"
                        : eq.nextMaintenance === "N/A"
                          ? "#64748b"
                          : "#0d9488",
                  }}
                >
                  Next: {eq.nextMaintenance}
                </span>
              </div>

              {/* AI Note (expanded) */}
              {isSelected && (
                <div
                  className="mt-3 p-3 rounded-lg text-xs leading-relaxed animate-fade-in-up"
                  style={{
                    background: "#f0fdfa",
                    border: "1px solid #ccfbf1",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={12} className="text-teal-500" />
                    <span className="font-semibold text-teal-700">
                      AI Analysis
                    </span>
                  </div>
                  <p className="text-slate-600">{eq.aiNote}</p>
                  <p className="text-slate-400 mt-1.5">
                    Value: {formatMMK(eq.costMMK)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Bar */}
      <div
        className="card px-5 py-4 rounded-xl flex items-center gap-4 flex-wrap"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e2d4a)",
        }}
      >
        <Dumbbell size={18} className="text-teal-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium">
            {counts.good} machines operational · {counts["needs-service"]}{" "}
            need service · {counts["out-of-order"]} out of order
          </p>
          <p className="text-slate-400 text-xs">
            Total equipment value:{" "}
            {formatMMK(
              equipmentList.reduce((s, e) => s + e.costMMK, 0)
            )}
          </p>
        </div>
        <span className="badge badge-teal flex-shrink-0">
          {Math.round((counts.good / counts.all) * 100)}% Operational
        </span>
      </div>
    </div>
  );
}
