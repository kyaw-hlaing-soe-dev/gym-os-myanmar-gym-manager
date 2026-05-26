"use client";

import {
  Share2,
  MessageCircle,
  Send,
  Eye,
  Calendar,
  Sparkles,
  FileText,
  Users,
  BarChart3,
  Clock,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { useState } from "react";
import { socialMediaPosts, viberMessageLog, socialStats } from "@/lib/mockData";

const FacebookIcon = ({
  size = 24,
  color = "currentColor",
  style,
  ...props
}: LucideProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={{ ...(style ?? {}), color }}
    {...props}
  >
    <path d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V12H8v3h2v7h3v-7h2.62L16 12h-3V9.75c0-.41.34-.75.75-.75Z" />
  </svg>
);

const platformConfig = {
  facebook: {
    icon: FacebookIcon,
    color: "#1877f2",
    bg: "#e7f0ff",
    label: "Facebook",
  },
  viber: {
    icon: MessageCircle,
    color: "#7360f2",
    bg: "#eeecfe",
    label: "Viber",
  },
};

const typeLabels: Record<string, { label: string; color: string }> = {
  promo: { label: "Promo", color: "#e11d48" },
  motivation: { label: "Motivation", color: "#0d9488" },
  schedule: { label: "Schedule", color: "#3a547d" },
  transformation: { label: "Story", color: "#d97706" },
};

const statusStyles: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  draft: { label: "Draft", bg: "#f1f5f9", color: "#64748b" },
  scheduled: { label: "Scheduled", bg: "#f0fdfa", color: "#0d9488" },
  sent: { label: "Sent", bg: "#dae2fd", color: "#3a547d" },
};

const messageTypeLabels: Record<
  string,
  { label: string; icon: typeof Send; color: string }
> = {
  payment_reminder: { label: "Payment Reminder", icon: Send, color: "#e11d48" },
  birthday: { label: "Birthday Wish", icon: Sparkles, color: "#d97706" },
  class_schedule: { label: "Class Schedule", icon: Calendar, color: "#0d9488" },
  reengagement: { label: "Re-engagement", icon: Users, color: "#7c3aed" },
};

export default function SocialMediaHub() {
  const [activeTab, setActiveTab] = useState<"content" | "viber">("content");
  const [showBurmese, setShowBurmese] = useState(false);

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Share2 size={24} className="text-blue-600" />
            Social Media Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            AI content generation & automated Viber messaging · လူမှုမီဒီယာ
            စီမံခန့်ခွဲမှု
          </p>
        </div>
        <button
          id="language-toggle"
          onClick={() => setShowBurmese(!showBurmese)}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: showBurmese
              ? "linear-gradient(135deg, #0d9488, #0f766e)"
              : "#f1f5f9",
            color: showBurmese ? "white" : "#64748b",
            boxShadow: showBurmese ? "0 4px 12px rgba(13,148,136,0.3)" : "none",
          }}
        >
          {showBurmese ? "🇲🇲 မြန်မာ" : "🇬🇧 English"}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Send,
            label: "Messages Sent",
            value: socialStats.totalMessagesSentThisMonth.toString(),
            sub: "this month",
            color: "#3a547d",
            bg: "#dae2fd",
          },
          {
            icon: Eye,
            label: "Avg Open Rate",
            value: `${socialStats.avgOpenRate}%`,
            sub: "across all channels",
            color: "#0d9488",
            bg: "#f0fdfa",
          },
          {
            icon: Sparkles,
            label: "AI Suggestions",
            value: socialStats.contentSuggestionsGenerated.toString(),
            sub: "content pieces generated",
            color: "#7c3aed",
            bg: "#ede9fe",
          },
          {
            icon: Users,
            label: "Viber Group",
            value: socialStats.viberGroupMembers.toString(),
            sub: `FB: ${socialStats.facebookFollowers.toLocaleString()} followers`,
            color: "#d97706",
            bg: "#fffbeb",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card p-4 rounded-xl"
              style={{ background: stat.bg }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: stat.color }} />
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
              <p
                className="text-xs mt-1"
                style={{ color: stat.color, opacity: 0.7 }}
              >
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        {(
          [
            { key: "content", label: "AI Content", icon: FileText },
            { key: "viber", label: "Viber Messages", icon: MessageCircle },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              id={`social-tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background:
                  activeTab === tab.key
                    ? "linear-gradient(135deg, #0f172a, #1e2d4a)"
                    : "#f1f5f9",
                color: activeTab === tab.key ? "white" : "#64748b",
                boxShadow:
                  activeTab === tab.key
                    ? "0 4px 16px rgba(15,23,42,0.2)"
                    : "none",
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {socialMediaPosts.map((post) => {
            const platform = platformConfig[post.platform];
            const PlatformIcon = platform.icon;
            const typeConfig = typeLabels[post.type];
            const statusStyle = statusStyles[post.status];

            return (
              <div
                key={post.id}
                id={`post-${post.id}`}
                className="card p-5 rounded-xl transition-all hover:shadow-md"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: platform.bg }}
                    >
                      <PlatformIcon
                        size={16}
                        style={{ color: platform.color }}
                      />
                    </div>
                    <div>
                      <span
                        className="text-xs font-bold"
                        style={{ color: platform.color }}
                      >
                        {platform.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: typeConfig.color }}
                        >
                          {typeConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                    }}
                  >
                    {statusStyle.label}
                  </span>
                </div>

                {/* Content */}
                <div
                  className="p-3 rounded-lg text-sm leading-relaxed whitespace-pre-line mb-3"
                  style={{ background: "#f8fafc" }}
                >
                  {showBurmese ? post.contentMM : post.contentEN}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock size={11} />
                    <span>{post.scheduledDate}</span>
                  </div>
                  {post.status === "draft" && (
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: platform.bg,
                        color: platform.color,
                      }}
                    >
                      <Send size={11} />
                      Schedule
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Viber Messages Tab */}
      {activeTab === "viber" && (
        <div className="space-y-4">
          {viberMessageLog.map((msg) => {
            const typeConfig = messageTypeLabels[msg.type];
            const TypeIcon = typeConfig.icon;

            return (
              <div
                key={msg.id}
                id={`viber-msg-${msg.id}`}
                className="card p-5 rounded-xl transition-all hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${typeConfig.color}15`,
                    }}
                  >
                    <TypeIcon size={18} style={{ color: typeConfig.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: typeConfig.color }}
                      >
                        {typeConfig.label}
                      </span>
                      <span className="text-slate-400 text-xs">
                        · {msg.sentDate}
                      </span>
                    </div>
                    <div
                      className="p-3 rounded-lg text-xs leading-relaxed whitespace-pre-line mb-2"
                      style={{ background: "#f8fafc" }}
                    >
                      {showBurmese ? msg.templateMM : msg.templateEN}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {msg.recipientCount} recipients
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {msg.openRate}% open rate
                      </span>
                    </div>
                  </div>

                  {/* Open Rate Badge */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                    style={{
                      background:
                        msg.openRate >= 80
                          ? "#f0fdfa"
                          : msg.openRate >= 60
                            ? "#fffbeb"
                            : "#fff1f2",
                    }}
                  >
                    <span
                      className="font-bold text-sm"
                      style={{
                        color:
                          msg.openRate >= 80
                            ? "#0d9488"
                            : msg.openRate >= 60
                              ? "#d97706"
                              : "#e11d48",
                      }}
                    >
                      {msg.openRate}%
                    </span>
                    <span className="text-[8px] text-slate-400 uppercase font-semibold">
                      Open
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Auto-replies Summary */}
          <div
            className="card px-5 py-4 rounded-xl flex items-center gap-4"
            style={{
              background: "linear-gradient(135deg, #0f172a, #1e2d4a)",
            }}
          >
            <BarChart3 size={18} className="text-teal-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">
                {socialStats.autoRepliesHandled} auto-replies handled this month
              </p>
              <p className="text-slate-400 text-xs">
                Automated responses to routine member inquiries via Viber
              </p>
            </div>
            <span className="badge badge-teal flex-shrink-0">
              {Math.round(
                (socialStats.autoRepliesHandled /
                  socialStats.totalMessagesSentThisMonth) *
                  100,
              )}
              % Automated
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
