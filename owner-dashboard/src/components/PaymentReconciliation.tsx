"use client";

import {
  Wallet,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Users,
  ArrowRight,
  Phone,
  CreditCard,
} from "lucide-react";
import {
  paymentChannels,
  overduePayments,
  paymentSummary,
} from "@/lib/mockData";

function formatMMK(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toLocaleString();
}

export default function PaymentReconciliation() {
  const maxAmount = Math.max(...paymentChannels.map((c) => c.amount));

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Wallet size={24} className="text-violet-600" />
          Payment Reconciliation
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Multi-channel payment tracking & overdue management ·
          ငွေပေးချေမှု စီမံခန့်ခွဲမှု
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: TrendingUp,
            label: "Expected Revenue",
            value: `${formatMMK(paymentSummary.expectedRevenue)} MMK`,
            color: "#3a547d",
            bg: "#dae2fd",
          },
          {
            icon: CheckCircle2,
            label: "Collected",
            value: `${formatMMK(paymentSummary.actualCollected)} MMK`,
            sub: `${paymentSummary.collectionRate}% rate`,
            color: "#0d9488",
            bg: "#f0fdfa",
          },
          {
            icon: AlertCircle,
            label: "Overdue Total",
            value: `${formatMMK(paymentSummary.overdueTotal)} MMK`,
            sub: `${overduePayments.length} members`,
            color: "#e11d48",
            bg: "#fff1f2",
          },
          {
            icon: Users,
            label: "Leaky Memberships",
            value: paymentSummary.leakyMemberships.toString(),
            sub: "training past expiry",
            color: "#d97706",
            bg: "#fffbeb",
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
              {"sub" in kpi && kpi.sub && (
                <p
                  className="text-xs mt-1"
                  style={{ color: kpi.color, opacity: 0.7 }}
                >
                  {kpi.sub}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Payment Channels */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <CreditCard size={14} className="text-slate-400" />
            Payment Channel Breakdown
          </h3>
          <div className="space-y-3">
            {paymentChannels.map((ch) => (
              <div key={ch.channel}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: ch.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {ch.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {ch.transactions} txns
                    </span>
                    <span className="text-sm font-semibold text-slate-800 font-mono-data">
                      {formatMMK(ch.amount)} MMK
                    </span>
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: ch.color }}
                    >
                      {ch.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(ch.amount / maxAmount) * 100}%`,
                      background: ch.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Trainer Commission */}
          <div
            className="mt-5 p-3 rounded-xl flex items-center justify-between"
            style={{ background: "#f0fdfa", border: "1px solid #ccfbf1" }}
          >
            <span className="text-sm text-teal-700 font-medium">
              Trainer Commissions (auto-calculated)
            </span>
            <span className="font-mono-data font-bold text-teal-700">
              {formatMMK(paymentSummary.trainerCommissions)} MMK
            </span>
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <AlertCircle size={14} className="text-rose-500" />
            Overdue Payments
          </h3>
          <div className="space-y-3">
            {overduePayments.map((op) => (
              <div
                key={op.id}
                id={`overdue-${op.id}`}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm"
                style={{
                  background:
                    op.daysOverdue > 10 ? "#fff1f2" : "#fefce8",
                  border: `1px solid ${op.daysOverdue > 10 ? "#fecdd3" : "#fef08a"}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{
                    background:
                      op.daysOverdue > 10
                        ? "linear-gradient(135deg, #e11d48, #f43f5e)"
                        : "linear-gradient(135deg, #d97706, #fbbf24)",
                  }}
                >
                  {op.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {op.memberName}
                    </p>
                    <span className="text-slate-400 text-xs">
                      {op.memberNameMM}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="badge badge-amber text-[10px]">
                      {op.plan}
                    </span>
                    <span className="text-xs text-slate-500">
                      via {op.lastPaymentMethod}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono-data font-bold text-sm text-slate-800">
                    {formatMMK(op.amountDue)} MMK
                  </p>
                  <p
                    className="text-xs font-semibold"
                    style={{
                      color:
                        op.daysOverdue > 10 ? "#e11d48" : "#d97706",
                    }}
                  >
                    {op.daysOverdue} days overdue
                  </p>
                </div>
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all flex-shrink-0"
                  title={`Call ${op.phone}`}
                >
                  <Phone size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Leaky Memberships Alert */}
          <div
            className="mt-4 p-3 rounded-xl flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
              border: "1px solid #fde68a",
            }}
          >
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-amber-800 text-xs font-semibold">
                {paymentSummary.leakyMemberships} Leaky Memberships Detected
              </p>
              <p className="text-amber-700 text-xs">
                Members training past their expiry date — action required
              </p>
            </div>
            <ArrowRight size={14} className="text-amber-600 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
