"use client";

import { useState } from "react";
import {
  AlertTriangle,
  MessageSquare,
  Phone,
  CreditCard,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";
import { churnMembers, type ChurnMember } from "@/lib/mockData";

function ChurnScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "#e11d48" : score >= 50 ? "#f59e0b" : "#0d9488";
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ background: "#f1f5f9", height: 6 }}
      >
        <div
          className="h-full rounded-full churn-bar-fill"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span
        className="font-mono-data text-xs font-bold w-8 text-right"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

function PaymentBadge({ status }: { status: ChurnMember["paymentStatus"] }) {
  const cfg = {
    paid: { label: "Paid", cls: "badge-paid" },
    overdue: { label: "Overdue", cls: "badge-overdue" },
    unpaid: { label: "Unpaid", cls: "badge-unpaid" },
  }[status];
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

// AI Retention Message Modal
function RetentionModal({
  member,
  onClose,
}: {
  member: ChurnMember;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"loading" | "done">("loading");

  const message = `မင်္ဂလာပါ ${member.nameMM}! FitZone Yangon မှ ကြည့်ရှုခြင်းဖြစ်ပါသည်။ မကြာသေးမီကာလ အတွင်း ကျွန်ုပ်တို့ gym မှ မတွေ့ရသဖြင့် မေးမြန်းလိုပါသည်။ ယခု special offer တစ်ခု ပေးရန် အဆင်သင့် ဖြစ်ပါသည် — နောက် 2 လ Premium Plan ကို 30% လျှော့ဈေးဖြင့် ရနိုင်ပါသည်။ ကျွန်ုပ်တို့နှင့် ပြန်လည်ပူးပေါင်းပါ! 💪`;

  useState(() => {
    const timer = setTimeout(() => setStep("done"), 2200);
    return () => clearTimeout(timer);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="card w-full max-w-lg p-6 animate-fade-in-up"
        style={{ boxShadow: "0 24px 64px rgba(15,23,42,0.2)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                AI Retention Offer
              </p>
              <p className="text-slate-400 text-xs">Powered by Claude API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Target Member */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-4"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #e11d48, #be123c)" }}
          >
            {member.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm">
              {member.name}
            </p>
            <p className="text-slate-400 text-xs">{member.nameMM}</p>
          </div>
          <div className="text-right">
            <p className="text-rose-600 font-bold text-sm">
              {member.churnScore}/100
            </p>
            <p className="text-slate-400 text-xs">churn score</p>
          </div>
        </div>

        {/* Message area */}
        <div
          className="rounded-xl p-4 mb-4 min-h-[100px] flex items-start"
          style={{
            background: "linear-gradient(135deg, #f0fdfa, #f8fafc)",
            border: "1px solid #ccfbf1",
          }}
        >
          {step === "loading" ? (
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
                <span className="text-teal-600 text-xs font-medium">
                  Claude is generating Burmese retention message...
                </span>
              </div>
              {[90, 75, 60].map((w, i) => (
                <div
                  key={i}
                  className="skeleton h-3 rounded"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 size={14} className="text-teal-600" />
                <span className="text-teal-600 text-xs font-semibold">
                  Generated in 2.1s
                </span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{message}</p>
            </div>
          )}
        </div>

        {/* Channel + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="badge badge-teal">📱 Viber</span>
            <span className="text-slate-400 text-xs">{member.phone}</span>
          </div>
          {step === "done" && (
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-all">
                Edit
              </button>
              <button className="btn-ai text-xs py-1.5 px-3">
                <MessageSquare size={13} />
                Send via Viber
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChurnRiskPanel() {
  const [selectedMember, setSelectedMember] = useState<ChurnMember | null>(null);
  const [sentOffers, setSentOffers] = useState<Set<string>>(new Set());

  const highRisk = churnMembers.filter((m) => m.churnScore >= 70);

  return (
    <>
      <div className="card p-6 animate-fade-in-up delay-400">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#ffe4e6" }}
            >
              <AlertTriangle size={16} style={{ color: "#e11d48" }} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 text-base">
                Churn Risk Members
              </h2>
              <p className="text-slate-400 text-xs">
                AI-predicted · Updated nightly
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="badge"
              style={{
                background: "#ffe4e6",
                color: "#e11d48",
              }}
            >
              {highRisk.length} HIGH
            </span>
          </div>
        </div>

        {/* Score Legend */}
        <div className="flex items-center gap-4 mb-4 px-1">
          {[
            { color: "#e11d48", label: "HIGH (70+)" },
            { color: "#f59e0b", label: "MED (50-69)" },
            { color: "#0d9488", label: "LOW (<50)" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: l.color }}
              />
              <span className="text-slate-400 text-[10px] font-medium">
                {l.label}
              </span>
            </div>
          ))}
        </div>

        {/* Member Rows */}
        <div className="space-y-2">
          {churnMembers.map((member) => {
            const offered = sentOffers.has(member.id);
            return (
              <div
                key={member.id}
                id={`churn-member-${member.id}`}
                className="group flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-50"
                style={{ cursor: "default" }}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{
                    background:
                      member.churnScore >= 70
                        ? "linear-gradient(135deg, #e11d48, #be123c)"
                        : member.churnScore >= 50
                        ? "linear-gradient(135deg, #f59e0b, #d97706)"
                        : "linear-gradient(135deg, #0d9488, #0f766e)",
                  }}
                >
                  {member.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 text-sm">
                      {member.name}
                    </span>
                    <span className="text-slate-400 text-xs hidden sm:inline">
                      {member.nameMM}
                    </span>
                    <PaymentBadge status={member.paymentStatus} />
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Clock size={10} />
                      <span>{member.lastCheckin}</span>
                    </div>
                    <span
                      className="text-xs text-slate-400"
                      style={{ fontSize: "10px" }}
                    >
                      {member.plan}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ChurnScoreBar score={member.churnScore} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    title="Call"
                  >
                    <Phone size={13} />
                  </button>
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    title="View payment"
                  >
                    <CreditCard size={13} />
                  </button>
                </div>

                {/* Send Offer Button */}
                {offered ? (
                  <div className="flex items-center gap-1 text-teal-600 flex-shrink-0">
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-medium hidden sm:inline">Sent</span>
                  </div>
                ) : (
                  <button
                    id={`send-offer-${member.id}`}
                    onClick={() => {
                      setSelectedMember(member);
                    }}
                    className="btn-ai flex-shrink-0 text-xs py-1.5 px-2.5 whitespace-nowrap"
                  >
                    <Sparkles size={11} />
                    <span className="hidden sm:inline">Send Offer</span>
                    <span className="sm:hidden">AI</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="mt-4 pt-4 flex items-center justify-between"
          style={{ borderTop: "1px solid #f1f5f9" }}
        >
          <p className="text-slate-400 text-xs">
            ROI: Retain 5 members → +1.2M MMK/mo saved
          </p>
          <button className="text-teal-600 text-xs font-semibold hover:underline">
            View all →
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedMember && (
        <RetentionModal
          member={selectedMember}
          onClose={() => {
            setSentOffers((s) => new Set([...s, selectedMember.id]));
            setSelectedMember(null);
          }}
        />
      )}
    </>
  );
}
