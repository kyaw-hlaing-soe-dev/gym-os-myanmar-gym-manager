"use client";

import { type FormEvent, useEffect, useMemo, useState, useSyncExternalStore } from "react";
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

type Section =
  | "dashboard"
  | "accounts"
  | "churn"
  | "revenue"
  | "payments"
  | "trainers"
  | "members"
  | "occupancy";

type ChurnMember = {
  id: string;
  name: string;
  nameMM: string;
  initials: string;
  plan: string;
  churnScore: number;
  lastVisit: string;
  paymentStatus: "Paid" | "Overdue" | "Unpaid";
  phone: string;
};

type AccountRole = "member" | "trainer";

type GymAccount = {
  id: string;
  role: AccountRole;
  name: string;
  username: string;
  password: string;
  phone: string;
  planOrSpecialty: string;
  status: "Active" | "Pending";
  createdAt: string;
};

const gymMeta = {
  name: "FitZone Yangon",
  nameMM: "ဖစ်ဇုန် ရန်ကုန်",
  branch: "Kamayut Branch",
  owner: "Ko Aung",
};

const navItems: Array<{ id: Section; label: string; icon: string; badge?: number }> = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "accounts", label: "Accounts", icon: "⊕" },
  { id: "churn", label: "Churn Risk", icon: "⚡", badge: 8 },
  { id: "revenue", label: "Revenue", icon: "▥" },
  { id: "payments", label: "Payments", icon: "₭" },
  { id: "trainers", label: "Trainers", icon: "◇" },
  { id: "members", label: "Members", icon: "👥" },
  { id: "occupancy", label: "Occupancy", icon: "▣" },
];

const comingSoonItems = ["Equipment", "Social Media", "Utilities", "System"];

const statsCards = [
  {
    label: "Total Members",
    labelMM: "စုစုပေါင်းအဖွဲ့ဝင်များ",
    value: "184",
    change: "+8%",
    emoji: "👥",
    tone: "bg-blue-50 text-blue-700",
  },
  {
    label: "Churn Risk",
    labelMM: "ထွက်ခွာနိုင်ခြေ",
    value: "8",
    change: "-2%",
    emoji: "⚠️",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    label: "New This Month",
    labelMM: "ယခုလအသစ်များ",
    value: "14",
    change: "+12%",
    emoji: "🆕",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    label: "Retention Rate",
    labelMM: "ထိန်းသိမ်းမှုနှုန်း",
    value: "88%",
    change: "+4%",
    emoji: "💪",
    tone: "bg-emerald-50 text-emerald-700",
  },
];

const revenueData = [
  { month: "Dec", revenue: 14_200_000, label: "14.2M" },
  { month: "Jan", revenue: 15_100_000, label: "15.1M" },
  { month: "Feb", revenue: 13_800_000, label: "13.8M" },
  { month: "Mar", revenue: 16_200_000, label: "16.2M" },
  { month: "Apr", revenue: 17_100_000, label: "17.1M" },
  { month: "May", revenue: 18_400_000, label: "18.4M" },
];

const churnMembers: ChurnMember[] = [
  {
    id: "m1",
    name: "Zaw Myint",
    nameMM: "ဇော်မြင့်",
    initials: "ZM",
    plan: "Premium",
    churnScore: 87,
    lastVisit: "23 days ago",
    paymentStatus: "Overdue",
    phone: "+95 9 7654 3210",
  },
  {
    id: "m2",
    name: "Thin Thin Aye",
    nameMM: "သင်းသင်းအေး",
    initials: "TA",
    plan: "Basic",
    churnScore: 82,
    lastVisit: "18 days ago",
    paymentStatus: "Unpaid",
    phone: "+95 9 8765 4321",
  },
  {
    id: "m3",
    name: "Kyaw Zin Htun",
    nameMM: "ကျော်ဇင်ထွန်း",
    initials: "KH",
    plan: "Premium",
    churnScore: 78,
    lastVisit: "15 days ago",
    paymentStatus: "Paid",
    phone: "+95 9 9876 5432",
  },
  {
    id: "m4",
    name: "Su Su Lwin",
    nameMM: "စုစုလွင်",
    initials: "SL",
    plan: "Basic",
    churnScore: 74,
    lastVisit: "21 days ago",
    paymentStatus: "Overdue",
    phone: "+95 9 6543 2109",
  },
  {
    id: "m5",
    name: "Aung Ko Ko",
    nameMM: "အောင်ကိုကို",
    initials: "AK",
    plan: "Premium Plus",
    churnScore: 71,
    lastVisit: "12 days ago",
    paymentStatus: "Paid",
    phone: "+95 9 5432 1098",
  },
  {
    id: "m6",
    name: "Ei Ei Mon",
    nameMM: "အေးအေးမွန်",
    initials: "EM",
    plan: "Basic",
    churnScore: 70,
    lastVisit: "19 days ago",
    paymentStatus: "Unpaid",
    phone: "+95 9 4321 0987",
  },
  {
    id: "m7",
    name: "Hla Myat",
    nameMM: "လှမြတ်",
    initials: "HM",
    plan: "Premium",
    churnScore: 66,
    lastVisit: "10 days ago",
    paymentStatus: "Paid",
    phone: "+95 9 3210 9876",
  },
  {
    id: "m8",
    name: "Ni Ni Aung",
    nameMM: "နီနီအောင်",
    initials: "NA",
    plan: "Basic",
    churnScore: 59,
    lastVisit: "9 days ago",
    paymentStatus: "Paid",
    phone: "+95 9 2109 8765",
  },
];

const recentActivities = [
  "Zaw Myint checked in · 5 min ago",
  "Ma Thida logged session with Ko Aung Min · 12 min ago",
  "New member Ni Ni Aung joined · 1 hour ago",
  "Payment received from Kyaw Zin Htun · 2 hours ago",
];

const trainers = [
  { name: "Ma Thida", clients: 24, sessions: 48, retention: 94 },
  { name: "Ko Naing", clients: 18, sessions: 36, retention: 88 },
  { name: "Daw Yin Yin", clients: 15, sessions: 30, retention: 80 },
  { name: "Ko Pyae Phyo", clients: 21, sessions: 42, retention: 91 },
];

const payments = [
  { channel: "KBZPay", amount: "7.2M MMK", percent: 39 },
  { channel: "Cash", amount: "4.6M MMK", percent: 25 },
  { channel: "WavePay", amount: "3.3M MMK", percent: 18 },
  { channel: "Bank Transfer", amount: "2.4M MMK", percent: 13 },
];

const initialGymAccounts: GymAccount[] = [
  {
    id: "acc-1",
    role: "member",
    name: "Ni Ni Aung",
    username: "nini.aung",
    password: "FitZone8842",
    phone: "+95 9 2109 8765",
    planOrSpecialty: "Basic",
    status: "Active",
    createdAt: "Today, 8:30 AM",
  },
  {
    id: "acc-2",
    role: "trainer",
    name: "Ko Naing",
    username: "ko.naing",
    password: "Trainer7391",
    phone: "+95 9 7788 9911",
    planOrSpecialty: "Strength Training",
    status: "Active",
    createdAt: "Yesterday, 5:10 PM",
  },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, hour) => hour);

const retentionMessages = [
  (member: ChurnMember) =>
    `မင်္ဂလာပါ ${member.name} ရေ၊ သင့်ကို လွမ်းနေပါတယ်။ ဒီဗုဒ္ဓဟူးနေ့မှာ ပြန်လာပါ၊ အထူးလေ့ကျင့်ခန်းပရိုဂရမ် တစ်ပတ်အခမဲ့ရမှာပါ။`,
  (member: ChurnMember) =>
    `မင်္ဂလာပါ ${member.name} ရေ၊ FitZone Yangon မှာ သင့်နေရာလေး စောင့်နေပါတယ်။ ဒီအပတ် ပြန်လာရင် personal trainer check-in session တစ်ကြိမ် အခမဲ့ပေးပါမယ်။`,
  (member: ChurnMember) =>
    `${member.name} ရေ၊ မတွေ့တာကြာပြီနော်။ Kamayut Branch ကို ဒီသောကြာနေ့ ပြန်လာပါ၊ Premium workout plan အသစ်ကို တစ်ပတ်အခမဲ့ စမ်းသုံးနိုင်ပါတယ်။`,
  (member: ChurnMember) =>
    `မင်္ဂလာပါ ${member.name} ရေ၊ သင့် fitness goal ကို ဆက်သွားနိုင်ဖို့ FitZone Yangon က ကူညီချင်ပါတယ်။ ဒီနေ့ပြန်လာရင် group class တစ်ခု အခမဲ့ဝင်နိုင်ပါတယ်။`,
];

function formatMMK(value: number) {
  return `${(value / 1_000_000).toFixed(1)}M`;
}

function useMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
}

function formatHour(hour: number) {
  if (hour === 0) return "12a";
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return "12p";
  return `${hour - 12}p`;
}

function createInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function createUsername(name: string, role: AccountRole, accounts: GymAccount[]) {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "") || role;

  let username = base;
  let suffix = 2;
  const existing = new Set(accounts.map((account) => account.username.toLowerCase()));

  while (existing.has(username.toLowerCase())) {
    username = `${base}${suffix}`;
    suffix += 1;
  }

  return username;
}

function createPassword(role: AccountRole) {
  const prefix = role === "trainer" ? "Trainer" : "Member";
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${digits}`;
}

function getOccupancy(dayIndex: number, hour: number) {
  const weekday = dayIndex < 5;
  const morningPeak = weekday && hour >= 6 && hour <= 8;
  const eveningPeak = weekday && hour >= 18 && hour <= 20;
  const weekendMidday = !weekday && hour >= 9 && hour <= 14;
  const closedHours = hour <= 4 || hour >= 23;

  if (closedHours) return 4 + ((dayIndex + hour) % 3);
  if (morningPeak) return 70 + dayIndex * 4 + (hour === 7 ? 14 : 6);
  if (eveningPeak) return 78 + dayIndex * 4 + (hour === 19 ? 16 : 8);
  if (weekendMidday) return 48 + ((hour + dayIndex) % 5) * 6;
  if (hour >= 16 && hour <= 21) return 38 + ((hour + dayIndex) % 5) * 5;
  if (hour >= 10 && hour <= 14) return 24 + ((hour + dayIndex) % 4) * 4;
  return 12 + ((hour + dayIndex) % 5) * 3;
}

function heatClass(count: number) {
  if (count >= 86) return "bg-blue-700";
  if (count >= 70) return "bg-blue-500";
  if (count >= 52) return "bg-blue-300";
  if (count >= 34) return "bg-sky-200";
  if (count >= 18) return "bg-sky-100";
  return "bg-slate-50";
}

function borderClass(score: number) {
  if (score >= 80) return "border-l-red-500";
  if (score >= 70) return "border-l-orange-500";
  return "border-l-yellow-400";
}

function scoreTextClass(score: number) {
  if (score >= 80) return "text-red-600";
  if (score >= 70) return "text-orange-600";
  return "text-yellow-600";
}

function paymentBadgeClass(status: ChurnMember["paymentStatus"]) {
  if (status === "Paid") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Overdue") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-red-50 text-red-700 ring-red-200";
}

function Sidebar({
  activeSection,
  mobileOpen,
  onNavigate,
  onMobileClose,
}: {
  activeSection: Section;
  mobileOpen: boolean;
  onNavigate: (section: Section) => void;
  onMobileClose: () => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onMobileClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white shadow-2xl transition-transform duration-300 md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold shadow-lg shadow-blue-900/40">
              G
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">GymOS Myanmar</p>
              <p className="truncate text-xs text-slate-400">{gymMeta.branch}</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-white/5 px-3 py-2">
            <p className="truncate text-xs text-slate-300">{gymMeta.name}</p>
            <p className="mt-1 text-xs font-medium text-emerald-300">● Pro Plan Active</p>
          </div>
        </div>

        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-xs font-bold">
              KA
            </div>
            <div>
              <p className="text-sm font-semibold">{gymMeta.owner}</p>
              <p className="text-xs text-slate-400">Gym Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onMobileClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-500/15 text-blue-200 ring-1 ring-blue-400/30"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center text-base">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-bold text-red-200">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-3 flex items-center gap-2 px-2">
            {comingSoonItems.map((item) => (
              <div key={item} className="group relative">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs text-slate-500"
                  aria-label={`${item} coming soon`}
                >
                  •
                </button>
                <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
                  {item}: coming soon
                </div>
              </div>
            ))}
          </div>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-white/10 hover:text-red-300">
            <span>↩</span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-6">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-xl text-slate-700 md:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        ☰
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold text-slate-950">Manager Dashboard</h1>
        <p className="truncate text-xs text-slate-500">
          {gymMeta.name} · {gymMeta.branch} · {date}
        </p>
      </div>
      <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 sm:block">
        Last updated: <span className="font-semibold text-emerald-600">just now</span> · {time}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          KA
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-xs font-semibold text-slate-800">{gymMeta.owner}</p>
          <p className="text-[10px] text-slate-400">Manager</p>
        </div>
      </div>
    </header>
  );
}

function StatsCards() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">
        {statsCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {card.label}
                </p>
                <p className="truncate text-[10px] text-slate-400">{card.labelMM}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${card.tone}`}>
                {card.emoji}
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-950 xl:text-3xl">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-semibold text-emerald-600">{card.change}</span> vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950 shadow-sm">
        <p className="text-sm font-semibold">
          💡 Retain 5 at-risk members this month = 1,200,000 MMK saved — 10x your GymOS subscription cost
        </p>
      </div>
    </div>
  );
}

function RevenueChart() {
  const mounted = useMounted();
  const total = revenueData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-950">Revenue Performance</h2>
          <p className="text-xs text-slate-500">Monthly revenue · last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-950">18.4M MMK</p>
          <p className="text-xs font-semibold text-emerald-600">+7.6% MoM</p>
        </div>
      </div>

      <div className="h-64">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 8, right: 6, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatMMK(Number(value))}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
                formatter={(value) => [`${formatMMK(Number(value))} MMK`, "Revenue"]}
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
                }}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {revenueData.map((entry) => (
                  <Cell key={entry.month} fill={entry.month === "May" ? "#2563eb" : "#60a5fa"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-xl bg-slate-50" />
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-xs">
        <div>
          <p className="text-slate-400">6-Month Total</p>
          <p className="mt-1 font-bold text-slate-800">{formatMMK(total)} MMK</p>
        </div>
        <div>
          <p className="text-slate-400">Avg Monthly</p>
          <p className="mt-1 font-bold text-slate-800">{formatMMK(total / revenueData.length)} MMK</p>
        </div>
        <div>
          <p className="text-slate-400">Current Month</p>
          <p className="mt-1 font-bold text-blue-700">May highlighted</p>
        </div>
      </div>
    </section>
  );
}

function OccupancyHeatmap() {
  const heatmap = useMemo(
    () =>
      days.map((day, dayIndex) => ({
        day,
        values: hours.map((hour) => ({ hour, count: getOccupancy(dayIndex, hour) })),
      })),
    []
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">Occupancy Heatmap</h2>
          <p className="text-xs text-slate-500">7 days x 24 hours · peak weekdays 6-8am and 6-8pm</p>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Live pattern</div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[48px_repeat(24,minmax(22px,1fr))] gap-1">
            <div />
            {hours.map((hour) => (
              <div key={hour} className="text-center text-[10px] font-medium text-slate-400">
                {hour % 3 === 0 ? formatHour(hour) : ""}
              </div>
            ))}
          </div>

          <div className="mt-2 space-y-1">
            {heatmap.map((row) => (
              <div key={row.day} className="grid grid-cols-[48px_repeat(24,minmax(22px,1fr))] gap-1">
                <div className="flex items-center text-xs font-semibold text-slate-500">{row.day}</div>
                {row.values.map((cell) => (
                  <div
                    key={`${row.day}-${cell.hour}`}
                    title={`${row.day} ${formatHour(cell.hour)} · ${cell.count} check-ins`}
                    className={`h-6 rounded-md ring-1 ring-white transition hover:scale-125 hover:ring-blue-300 ${heatClass(
                      cell.count
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <span>Quiet</span>
        <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-slate-50 via-sky-200 to-blue-700" />
        <span>Peak</span>
      </div>
    </section>
  );
}

function ActivityFeed() {
  const mounted = useMounted();
  const checkins = [
    { day: "Mon", count: 48 },
    { day: "Tue", count: 62 },
    { day: "Wed", count: 55 },
    { day: "Thu", count: 71 },
    { day: "Fri", count: 65 },
    { day: "Sat", count: 58 },
    { day: "Sun", count: 42 },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Daily Check-ins</h2>
            <p className="text-xs text-slate-500">Last 7 days activity</p>
          </div>
          <p className="text-2xl font-bold text-slate-950">42</p>
        </div>
        <div className="h-44">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={checkins} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-xl bg-slate-50" />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Recent Activity</h2>
            <p className="text-xs text-slate-500">Real-time gym events</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={activity} className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-3">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
              <p className="text-sm text-slate-700">{activity}</p>
              {index === 0 ? <span className="ml-auto text-xs font-semibold text-emerald-600">new</span> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RetentionModal({
  member,
  onCancel,
  onSend,
}: {
  member: ChurnMember;
  onCancel: () => void;
  onSend: (member: ChurnMember) => void;
}) {
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setGenerating(false), 1500);
    return () => window.clearTimeout(timer);
  }, [member.id]);

  const message = retentionMessages[
    churnMembers.findIndex((item) => item.id === member.id) % retentionMessages.length
  ](member);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">AI Retention Offer</p>
            <p className="text-xs text-slate-500">Personalized Viber message</p>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={onCancel}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Member</p>
            <p className="mt-1 font-semibold text-slate-800">{member.name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Risk score</p>
            <p className={`mt-1 font-bold ${scoreTextClass(member.churnScore)}`}>{member.churnScore}/100</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Last visit</p>
            <p className="mt-1 font-semibold text-slate-800">{member.lastVisit}</p>
          </div>
        </div>

        <div className="mb-4 min-h-36 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          {generating ? (
            <div className="flex h-28 items-center justify-center gap-3 text-sm font-semibold text-blue-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              🤖 Generating message...
            </div>
          ) : (
            <div className="animate-fade-in">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">Generated Burmese message</p>
              <p className="text-sm leading-7 text-slate-800">{message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            onClick={() => onSend(member)}
            disabled={generating}
          >
            Send via Viber
          </button>
        </div>
      </div>
    </div>
  );
}

function ChurnRiskPanel() {
  const [selectedMember, setSelectedMember] = useState<ChurnMember | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");

  function handleSend(member: ChurnMember) {
    setSent((previous) => new Set(previous).add(member.id));
    setSelectedMember(null);
    setToast(`Offer sent via Viber to ${member.name}`);
  }

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-950">Churn Risk Members</h2>
            <p className="text-xs text-slate-500">AI-predicted · updated live</p>
          </div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">8 HIGH</span>
        </div>

        <div className="space-y-3">
          {churnMembers.map((member) => {
            const wasSent = sent.has(member.id);
            return (
              <div
                key={member.id}
                className={`rounded-2xl border border-l-4 border-slate-200 bg-white p-3 shadow-sm transition hover:bg-slate-50 ${borderClass(
                  member.churnScore
                )}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {member.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.nameMM}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${paymentBadgeClass(
                            member.paymentStatus
                          )}`}
                        >
                          {member.paymentStatus}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Last visit: {member.lastVisit} · {member.plan} · {member.phone}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              member.churnScore >= 80
                                ? "bg-red-500"
                                : member.churnScore >= 70
                                ? "bg-orange-500"
                                : "bg-yellow-400"
                            }`}
                            style={{ width: `${member.churnScore}%` }}
                          />
                        </div>
                        <span className={`w-9 text-right text-xs font-bold ${scoreTextClass(member.churnScore)}`}>
                          {member.churnScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  {wasSent ? (
                    <div className="shrink-0 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                      Sent
                    </div>
                  ) : (
                    <button
                      className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700"
                      onClick={() => setSelectedMember(member)}
                    >
                      Send Offer AI
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selectedMember ? (
        <RetentionModal member={selectedMember} onCancel={() => setSelectedMember(null)} onSend={handleSend} />
      ) : null}

      {toast ? (
        <div className="fixed bottom-5 right-5 z-[70] rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      ) : null}
    </>
  );
}

function OverviewCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Gym Manager Workspace</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">{gymMeta.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {gymMeta.nameMM} · {gymMeta.branch} · Manager: {gymMeta.owner}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xl font-bold text-slate-950">18.4M</p>
            <p className="text-xs text-slate-500">MMK revenue</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xl font-bold text-slate-950">68%</p>
            <p className="text-xs text-slate-500">attendance</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xl font-bold text-slate-950">95.8%</p>
            <p className="text-xs text-slate-500">collection</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AccountCreationPanel({
  accounts,
  onCreateAccount,
  defaultRole = "member",
}: {
  accounts: GymAccount[];
  onCreateAccount: (account: GymAccount) => void;
  defaultRole?: AccountRole;
}) {
  const [role, setRole] = useState<AccountRole>(defaultRole);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [planOrSpecialty, setPlanOrSpecialty] = useState(defaultRole === "trainer" ? "Strength Training" : "Basic");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(createPassword(defaultRole));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [createdName, setCreatedName] = useState("");

  const memberAccounts = accounts.filter((account) => account.role === "member");
  const trainerAccounts = accounts.filter((account) => account.role === "trainer");
  const roleLabel = role === "trainer" ? "Trainer" : "Member";
  const accountOptions =
    role === "trainer"
      ? ["Strength Training", "HIIT", "Yoga", "Zumba", "Boxing"]
      : ["Basic", "Premium", "Premium Plus", "Student"];

  function handleRoleChange(nextRole: AccountRole) {
    setRole(nextRole);
    setPlanOrSpecialty(nextRole === "trainer" ? "Strength Training" : "Basic");
    setPassword(createPassword(nextRole));
    setError("");
  }

  function handleNameChange(nextName: string) {
    setName(nextName);
    if (!username || username === createUsername(name, role, accounts)) {
      setUsername(createUsername(nextName, role, accounts));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError("Enter the account holder name.");
      return;
    }

    if (cleanUsername.length < 4) {
      setError("Username must be at least 4 characters.");
      return;
    }

    if (accounts.some((account) => account.username.toLowerCase() === cleanUsername.toLowerCase())) {
      setError("This username is already used. Choose another username.");
      return;
    }

    if (cleanPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const newAccount: GymAccount = {
      id: `acc-${Date.now()}`,
      role,
      name: cleanName,
      username: cleanUsername,
      password: cleanPassword,
      phone: cleanPhone || "No phone added",
      planOrSpecialty,
      status: "Active",
      createdAt: "Just now",
    };

    onCreateAccount(newAccount);
    setCreatedName(cleanName);
    setName("");
    setPhone("");
    setUsername("");
    setPassword(createPassword(role));
    setError("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-semibold text-slate-950">Account Creation</h2>
          <p className="text-xs text-slate-500">Create login credentials for gym members and trainers</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="font-bold text-slate-950">{accounts.length}</p>
            <p className="text-slate-500">Accounts</p>
          </div>
          <div className="rounded-xl bg-blue-50 px-3 py-2">
            <p className="font-bold text-blue-700">{memberAccounts.length}</p>
            <p className="text-blue-700">Members</p>
          </div>
          <div className="rounded-xl bg-emerald-50 px-3 py-2">
            <p className="font-bold text-emerald-700">{trainerAccounts.length}</p>
            <p className="text-emerald-700">Trainers</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <form className="space-y-4 rounded-2xl bg-slate-50 p-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-white p-1 text-sm font-semibold shadow-sm ring-1 ring-slate-200">
            {(["member", "trainer"] as AccountRole[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleRoleChange(option)}
                className={`rounded-lg px-3 py-2 transition ${
                  role === option ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {option === "trainer" ? "Trainer" : "Member"}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600" htmlFor="account-name">
              {roleLabel} name
            </label>
            <input
              id="account-name"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder={role === "trainer" ? "Ko Trainer Name" : "Member full name"}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="account-phone">
                Phone
              </label>
              <input
                id="account-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="+95 9..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="account-plan">
                {role === "trainer" ? "Specialty" : "Plan"}
              </label>
              <select
                id="account-plan"
                value={planOrSpecialty}
                onChange={(event) => setPlanOrSpecialty(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              >
                {accountOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="account-username">
                Username
              </label>
              <input
                id="account-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="username"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="account-password">
                Password
              </label>
              <div className="mt-1 flex rounded-xl border border-slate-200 bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                <input
                  id="account-password"
                  value={password}
                  type={showPassword ? "text" : "password"}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 rounded-l-xl bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none"
                  placeholder="temporary password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="px-3 text-xs font-semibold text-blue-700 hover:text-blue-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</p> : null}
          {createdName ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              Account created for {createdName}.
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setPassword(createPassword(role))}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
            >
              Generate Password
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700 sm:flex-1"
            >
              Create {roleLabel} Account
            </button>
          </div>
        </form>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">Recent Accounts</h3>
              <p className="text-xs text-slate-500">Username and temporary password handoff list</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {accounts.filter((account) => account.status === "Active").length} active
            </span>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        account.role === "trainer" ? "bg-emerald-600" : "bg-blue-600"
                      }`}
                    >
                      {createInitials(account.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-800">{account.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
                            account.role === "trainer"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              : "bg-blue-50 text-blue-700 ring-blue-200"
                          }`}
                        >
                          {account.role === "trainer" ? "Trainer" : "Member"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {account.planOrSpecialty} · {account.phone} · {account.createdAt}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {account.status}
                  </span>
                </div>

                <div className="mt-3 grid gap-2 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-400">Username</p>
                    <p className="mt-1 truncate font-bold text-slate-800">{account.username}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-400">Temporary password</p>
                    <p className="mt-1 truncate font-bold text-slate-800">{account.password}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrainersPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-950">Trainer Management</h2>
      <p className="text-xs text-slate-500">Performance metrics, session logs, and client retention</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {trainers.map((trainer) => (
          <div key={trainer.name} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-800">{trainer.name}</p>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                {trainer.retention}% retention
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {trainer.clients} clients · {trainer.sessions} sessions this month
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PaymentsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-950">Payment Reconciliation</h2>
      <p className="text-xs text-slate-500">Expected 19.2M MMK · collected 18.4M MMK</p>
      <div className="mt-5 space-y-3">
        {payments.map((payment) => (
          <div key={payment.channel}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">{payment.channel}</span>
              <span className="text-slate-500">{payment.amount}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${payment.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardContent({
  section,
  accounts,
  onCreateAccount,
}: {
  section: Section;
  accounts: GymAccount[];
  onCreateAccount: (account: GymAccount) => void;
}) {
  if (section === "accounts") {
    return <AccountCreationPanel key="accounts" accounts={accounts} onCreateAccount={onCreateAccount} />;
  }

  if (section === "churn") {
    return (
      <>
        <StatsCards />
        <ChurnRiskPanel />
      </>
    );
  }

  if (section === "revenue") {
    return (
      <>
        <StatsCards />
        <RevenueChart />
        <ActivityFeed />
      </>
    );
  }

  if (section === "payments") return <PaymentsPanel />;
  if (section === "trainers") {
    return (
      <>
        <AccountCreationPanel
          key="trainer-accounts"
          accounts={accounts}
          onCreateAccount={onCreateAccount}
          defaultRole="trainer"
        />
        <TrainersPanel />
      </>
    );
  }
  if (section === "members") {
    return (
      <>
        <StatsCards />
        <AccountCreationPanel
          key="member-accounts"
          accounts={accounts}
          onCreateAccount={onCreateAccount}
          defaultRole="member"
        />
        <ChurnRiskPanel />
      </>
    );
  }
  if (section === "occupancy") {
    return (
      <>
        <OccupancyHeatmap />
        <ActivityFeed />
      </>
    );
  }

  return (
    <>
      <OverviewCard />
      <StatsCards />
      <AccountCreationPanel key="dashboard-accounts" accounts={accounts} onCreateAccount={onCreateAccount} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <ChurnRiskPanel />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TrainersPanel />
        <OccupancyHeatmap />
      </div>
      <ActivityFeed />
    </>
  );
}

export default function ManagerDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accounts, setAccounts] = useState<GymAccount[]>(initialGymAccounts);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        activeSection={activeSection}
        mobileOpen={mobileOpen}
        onNavigate={setActiveSection}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6">
          <DashboardContent
            section={activeSection}
            accounts={accounts}
            onCreateAccount={(account) => setAccounts((currentAccounts) => [account, ...currentAccounts])}
          />
        </main>
        <footer className="flex flex-col gap-1 border-t border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p>GymOS Myanmar · AI-Powered Platform · Claude API</p>
          <p>
            Last sync: just now · <span className="font-semibold text-emerald-600">● Live</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
