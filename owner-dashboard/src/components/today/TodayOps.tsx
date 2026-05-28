"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  History,
  Phone,
  QrCode,
  ReceiptText,
  RefreshCw,
  Search,
  ShoppingCart,
  UserCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { CheckIn, Member, PaymentRecord } from "@/lib/types";
import { PLAN_PRICES } from "@/lib/data";
import POSCart from "@/components/pos/POSCart";
import QrCheckInScanner from "@/components/checkin/QrCheckInScanner";

type ConfirmIntent = "duplicate" | "expired";

type ConfirmState = {
  intent: ConfirmIntent;
  member: Member;
} | null;

type Props = {
  members: Member[];
  checkIns: CheckIn[];
  paymentRecords: PaymentRecord[];
  onCheckIn: (checkIn: CheckIn) => void;
};

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function daysFromToday(date: string) {
  const today = new Date(todayISO());
  const target = new Date(date);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function formatDate(date: string | null) {
  if (!date) return "No visit yet";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMMK(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M MMK`;
  return `${value.toLocaleString("en-US")} MMK`;
}

function paymentTone(status: Member["paymentStatus"]) {
  if (status === "Paid") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Overdue") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-red-50 text-red-700 ring-red-200";
}

function memberStatusTone(status: Member["status"]) {
  if (status === "Active") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Expired") return "bg-red-50 text-red-700 ring-red-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function buildCheckIn(member: Member, isOverride = false): CheckIn {
  const timestamp = new Date().toISOString();
  return {
    id: `ci-${member.id}-${timestamp.replace(/\D/g, "")}`,
    memberId: member.id,
    memberName: member.name,
    memberNameMM: member.nameMM,
    timestamp,
    isOverride,
  };
}

function matchesMember(member: Member, value: string) {
  const query = value.trim().toLowerCase();
  if (!query) return true;

  return (
    member.id.toLowerCase().includes(query) ||
    member.name.toLowerCase().includes(query) ||
    member.nameMM.includes(value.trim()) ||
    member.phone.toLowerCase().includes(query) ||
    member.initials.toLowerCase() === query
  );
}

export default function TodayOps({ members, checkIns, paymentRecords, onCheckIn }: Props) {
  const [query, setQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id ?? "");
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [toast, setToast] = useState("");
  const [showPos, setShowPos] = useState(false);
  const [scannerNote, setScannerNote] = useState("Ready for member QR scan.");

  const today = todayISO();
  const todayCheckIns = useMemo(
    () => checkIns.filter((checkIn) => checkIn.timestamp.startsWith(today)),
    [checkIns, today],
  );
  const checkedInIds = useMemo(
    () => new Set(todayCheckIns.map((checkIn) => checkIn.memberId)),
    [todayCheckIns],
  );
  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? members[0] ?? null;

  const filteredMembers = useMemo(
    () => members.filter((member) => matchesMember(member, query)).slice(0, 8),
    [members, query],
  );

  const expiringMembers = useMemo(
    () =>
      members
        .map((member) => ({ member, days: daysFromToday(member.expiryDate) }))
        .filter(({ days }) => days >= 0 && days <= 7)
        .sort((a, b) => a.days - b.days)
        .slice(0, 6),
    [members],
  );

  const overdueMembers = useMemo(
    () =>
      members
        .filter((member) => member.paymentStatus === "Overdue" || member.paymentStatus === "Unpaid")
        .sort((a, b) => daysFromToday(a.paymentDueDate ?? a.expiryDate) - daysFromToday(b.paymentDueDate ?? b.expiryDate))
        .slice(0, 6),
    [members],
  );

  const todaysRevenue = useMemo(
    () =>
      paymentRecords
        .filter((payment) => payment.date === today)
        .reduce((sum, payment) => sum + payment.amount, 0),
    [paymentRecords, today],
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function completeCheckIn(member: Member, isOverride = false) {
    const checkIn = buildCheckIn(member, isOverride);
    onCheckIn(checkIn);
    setSelectedMemberId(member.id);
    setScannerNote(`${member.name} checked in at ${formatTime(checkIn.timestamp)}.`);
    showToast(`${member.name} checked in`);
  }

  function requestCheckIn(member: Member) {
    if (checkedInIds.has(member.id)) {
      setConfirmState({ intent: "duplicate", member });
      return;
    }

    if (member.status === "Expired") {
      setConfirmState({ intent: "expired", member });
      return;
    }

    completeCheckIn(member);
  }

  function handleQrScan(decodedText: string) {
    const matchedMember = members.find((member) => matchesMember(member, decodedText));
    if (!matchedMember) {
      setQuery(decodedText);
      setScannerNote(`No member matched "${decodedText}". Use manual search.`);
      return;
    }

    setQuery("");
    setSelectedMemberId(matchedMember.id);
    requestCheckIn(matchedMember);
  }

  function handleScannerUnavailable(message: string) {
    setScannerNote(message);
  }

  function confirmOverride() {
    if (!confirmState) return;
    completeCheckIn(confirmState.member, true);
    setConfirmState(null);
  }

  function mockAction(label: string, member: Member | null) {
    if (!member) return;
    showToast(`${label} ready for ${member.name}`);
  }

  const actionDisabled = !selectedMember;
  const selectedAlreadyIn = selectedMember ? checkedInIds.has(selectedMember.id) : false;
  const selectedPlanPrice = selectedMember ? PLAN_PRICES[selectedMember.plan] ?? 0 : 0;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-blue-700">Today Ops</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">Front Desk Check-In</h1>
            <p className="mt-1 text-sm text-slate-500">
              QR first, manual search ready · ရှေ့ကောင်တာနေ့စဉ်လုပ်ငန်း
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs sm:min-w-[360px]">
            <div className="rounded-xl bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
              <p className="text-lg font-bold text-emerald-700">{todayCheckIns.length}</p>
              <p className="text-emerald-700">Check-ins</p>
            </div>
            <div className="rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
              <p className="text-lg font-bold text-amber-700">{overdueMembers.length}</p>
              <p className="text-amber-700">Due pay</p>
            </div>
            <div className="rounded-xl bg-blue-50 px-3 py-2 ring-1 ring-blue-100">
              <p className="text-lg font-bold text-blue-700">{formatMMK(todaysRevenue)}</p>
              <p className="text-blue-700">Today cash</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1fr)]">
            <QrCheckInScanner
              mode="embedded"
              containerId="today-ops-qr-reader"
              onScan={handleQrScan}
              onUnavailable={handleScannerUnavailable}
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-950">Manual Search</h2>
                  <p className="text-xs text-slate-500">Name, Myanmar name, phone, or ID</p>
                </div>
                <Search size={18} className="text-slate-400" />
              </div>
              <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                <Search size={15} className="text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search member..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </label>
              <div className="mt-3 max-h-[286px] space-y-2 overflow-y-auto pr-1">
                {filteredMembers.map((member) => {
                  const active = selectedMember?.id === member.id;
                  const alreadyIn = checkedInIds.has(member.id);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {member.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">{member.name}</p>
                          {alreadyIn ? <CheckCircle2 size={14} className="text-emerald-600" /> : null}
                        </div>
                        <p className="truncate text-xs text-slate-500">
                          {member.nameMM} · {member.phone}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${paymentTone(member.paymentStatus)}`}>
                        {member.paymentStatus}
                      </span>
                    </button>
                  );
                })}
                {filteredMembers.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                    No matching member · မတွေ့ပါ
                  </p>
                ) : null}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Member Action Panel</h2>
                <p className="text-xs text-slate-500">Scan result, membership status, and next action</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                <QrCode size={13} />
                {scannerNote}
              </div>
            </div>

            {selectedMember ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                        {selectedMember.initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-slate-950">{selectedMember.name}</h3>
                        <p className="truncate text-sm text-slate-500">{selectedMember.nameMM}</p>
                        <p className="mt-1 text-xs text-slate-500">{selectedMember.phone}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${memberStatusTone(selectedMember.status)}`}>
                        {selectedMember.status}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${paymentTone(selectedMember.paymentStatus)}`}>
                        {selectedMember.paymentStatus}
                      </span>
                      {selectedAlreadyIn ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                          Checked in
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-400">Plan</p>
                      <p className="mt-1 font-semibold text-slate-900">{selectedMember.plan}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-400">Expiry</p>
                      <p className="mt-1 font-semibold text-slate-900">{formatDate(selectedMember.expiryDate)}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-400">Last visit</p>
                      <p className="mt-1 font-semibold text-slate-900">{formatDate(selectedMember.lastVisitDate)}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-400">Renewal</p>
                      <p className="mt-1 font-semibold text-slate-900">{formatMMK(selectedPlanPrice)}</p>
                    </div>
                  </div>

                  {selectedMember.paymentStatus !== "Paid" || selectedMember.status === "Expired" ? (
                    <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
                      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                      <div>
                        <p className="font-semibold">Payment or membership action required</p>
                        <p className="text-xs text-amber-700">
                          Collect renewal before training when possible · ငွေကောက်ခံရန်လိုအပ်နိုင်သည်
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => requestCheckIn(selectedMember)}
                    disabled={actionDisabled}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
                  >
                    <UserCheck size={16} />
                    Check In
                  </button>
                  <button
                    type="button"
                    onClick={() => mockAction("Renew membership", selectedMember)}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                  >
                    <RefreshCw size={16} />
                    Renew Membership
                  </button>
                  <button
                    type="button"
                    onClick={() => mockAction("Record payment", selectedMember)}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <CreditCard size={16} />
                    Record Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPos((current) => !current)}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ShoppingCart size={16} />
                    Sell Item
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${selectedMember.phone}`}
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Phone size={15} />
                      Call
                    </a>
                    <a
                      href={`viber://chat?number=${encodeURIComponent(selectedMember.phone)}`}
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <ExternalLink size={15} />
                      Viber
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 px-4 py-12 text-center text-sm text-slate-400">
                Select a member to continue.
              </div>
            )}
          </section>

          {showPos ? <POSCart /> : null}
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Action Queue</h2>
                <p className="text-xs text-slate-500">Today&apos;s front desk priorities</p>
              </div>
              <ReceiptText size={18} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-amber-600">Expiring soon</p>
                <div className="space-y-2">
                  {expiringMembers.map(({ member, days }) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMemberId(member.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-left ring-1 ring-amber-100"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-900">{member.name}</span>
                        <span className="text-xs text-slate-500">{member.plan}</span>
                      </span>
                      <span className="shrink-0 text-xs font-bold text-amber-700">
                        {days === 0 ? "Today" : `${days}d`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase text-red-600">Overdue payments</p>
                <div className="space-y-2">
                  {overdueMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMemberId(member.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl bg-red-50 px-3 py-2 text-left ring-1 ring-red-100"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-900">{member.name}</span>
                        <span className="text-xs text-slate-500">{member.phone}</span>
                      </span>
                      <span className="shrink-0 text-xs font-bold text-red-700">
                        {formatMMK(PLAN_PRICES[member.plan] ?? 0)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-950">Recent Check-ins</h2>
                <p className="text-xs text-slate-500">နောက်ဆုံးဝင်ရောက်မှုများ</p>
              </div>
              <History size={18} className="text-slate-400" />
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {[...todayCheckIns].reverse().slice(0, 8).map((checkIn) => (
                <div key={checkIn.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{checkIn.memberName}</p>
                    <p className="truncate text-xs text-slate-500">
                      {checkIn.memberNameMM}
                      {checkIn.isOverride ? " · override" : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-400">{formatTime(checkIn.timestamp)}</span>
                </div>
              ))}
              {todayCheckIns.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                  No check-ins yet.
                </p>
              ) : null}
            </div>
          </section>
        </aside>
      </div>

      {confirmState ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">
                  {confirmState.intent === "duplicate" ? "Check in again?" : "Expired membership"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {confirmState.intent === "duplicate"
                    ? `${confirmState.member.name} already checked in today. Confirm an override check-in.`
                    : `${confirmState.member.name} is expired. Only continue if staff approved an override.`}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmState(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmOverride}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-5 right-5 z-[90] rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
