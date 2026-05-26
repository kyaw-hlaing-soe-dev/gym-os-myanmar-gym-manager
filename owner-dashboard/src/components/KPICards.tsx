"use client";

import { TrendingUp, TrendingDown, Users, Activity, AlertTriangle, DollarSign } from "lucide-react";
import { kpiCards } from "@/lib/mockData";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  DollarSign,
};

const colorConfig: Record<string, { bg: string; icon: string; accent: string; glow: string }> = {
  teal: {
    bg: "from-teal-500 to-teal-700",
    icon: "#0d9488",
    accent: "#ccfbf1",
    glow: "rgba(13,148,136,0.15)",
  },
  navy: {
    bg: "from-slate-700 to-slate-900",
    icon: "#334155",
    accent: "#dae2fd",
    glow: "rgba(51,65,85,0.12)",
  },
  amber: {
    bg: "from-amber-500 to-amber-700",
    icon: "#d97706",
    accent: "#fef3c7",
    glow: "rgba(217,119,6,0.15)",
  },
  slate: {
    bg: "from-slate-500 to-slate-700",
    icon: "#64748b",
    accent: "#f1f5f9",
    glow: "rgba(100,116,139,0.12)",
  },
};

function formatChange(change: number) {
  const abs = Math.abs(change);
  const sign = change >= 0 ? "+" : "-";
  return `${sign}${abs}%`;
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {kpiCards.map((card, i) => {
        const Icon = iconMap[card.icon] || TrendingUp;
        const cfg = colorConfig[card.color] || colorConfig.slate;
        const isUp = card.change >= 0;
        const isChurn = card.id === "churn";
        // For churn, more = bad, so invert trend coloring
        const trendPositive = isChurn ? !isUp : isUp;

        return (
          <div
            key={card.id}
            id={`kpi-${card.id}`}
            className={`card card-interactive p-6 animate-fade-in-up delay-${100 + i * 100}`}
            style={{
              boxShadow: `0 4px 24px ${cfg.glow}`,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                  style={{ color: "#94a3b8" }}
                >
                  {card.label}
                </p>
                <p className="text-[10px]" style={{ color: "#cbd5e1" }}>
                  {card.labelMM}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: cfg.accent }}
              >
                <Icon size={20} style={{ color: cfg.icon }} />
              </div>
            </div>

            {/* Value */}
            <p
              className="font-mono-data font-bold text-3xl text-slate-900 animate-count-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              {card.value}
            </p>

            {/* Trend */}
            <div className="flex items-center gap-1.5 mt-2">
              {trendPositive ? (
                <TrendingUp size={14} className="trend-up" />
              ) : (
                <TrendingDown size={14} className="trend-down" />
              )}
              <span
                className={`text-sm font-semibold ${trendPositive ? "trend-up" : "trend-down"}`}
              >
                {formatChange(card.change)}
              </span>
              <span className="text-slate-400 text-xs">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
