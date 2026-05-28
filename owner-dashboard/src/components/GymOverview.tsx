"use client";

import { gymMeta } from "@/lib/mockData";
import {
  Crown,
  Zap,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

function formatMMK(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M MMK`;
  return `${v.toLocaleString()} MMK`;
}

export default function GymOverview() {
  const retentionRate = Math.round(
    (gymMeta.activeMembers / gymMeta.totalMembers) * 100
  );
  const churnRate = 100 - retentionRate;

  return (
    <div className="card p-6 animate-fade-in-up delay-200">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #0f172a 100%)",
            boxShadow: "0 8px 24px rgba(13,148,136,0.3)",
          }}
        >
          💪
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-slate-900 text-xl truncate">
              {gymMeta.name}
            </h2>
            <span className="badge badge-teal">{gymMeta.subscriptionPlan}</span>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">{gymMeta.nameMM}</p>
          <p className="text-slate-400 text-xs">{gymMeta.branch}</p>
        </div>
        {/* MRR Highlight */}
        <div
          className="text-right hidden sm:block flex-shrink-0 p-3 rounded-xl"
          style={{ background: "#f0fdfa" }}
        >
          <p className="text-teal-600 text-xs font-semibold uppercase tracking-wider">
            MRR
          </p>
          <p className="font-mono-data font-bold text-teal-700 text-lg">
            {formatMMK(gymMeta.monthlyRevenue)}
          </p>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <TrendingUp size={11} className="text-teal-500" />
            <span className="text-teal-500 text-xs font-medium">
              +{gymMeta.revenueChange}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            icon: Users,
            label: "Total Members",
            value: gymMeta.totalMembers,
            sub: `${gymMeta.activeMembers} active`,
            color: "#0d9488",
            bg: "#f0fdfa",
          },
          {
            icon: Zap,
            label: "Churn Risk",
            value: gymMeta.churnRiskCount,
            sub: `${churnRate}% rate`,
            color: "#e11d48",
            bg: "#fff1f2",
          },
          {
            icon: Calendar,
            label: "New This Month",
            value: gymMeta.newMembersThisMonth,
            sub: "joined recently",
            color: "#3a547d",
            bg: "#dae2fd",
          },
          {
            icon: Crown,
            label: "Retention Rate",
            value: `${retentionRate}%`,
            sub: "of total members",
            color: "#d97706",
            bg: "#fef3c7",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-3 rounded-xl"
              style={{ background: stat.bg }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} style={{ color: stat.color }} />
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: stat.color, opacity: 0.8 }}
                >
                  {stat.label}
                </span>
              </div>
              <p
                className="font-mono-data font-bold text-xl"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: stat.color, opacity: 0.7 }}>
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* ROI Banner */}
      <div
        className="mt-4 px-4 py-3 rounded-xl flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e2d4a)",
        }}
      >
        <DollarSign size={18} className="text-teal-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium">
            Retain 5 at-risk members this month
          </p>
          <p className="text-slate-400 text-xs">
            = 1,200,000 MMK saved · 10x ROI on subscription
          </p>
        </div>
        <span className="badge badge-teal flex-shrink-0">10x ROI</span>
      </div>
    </div>
  );
}
