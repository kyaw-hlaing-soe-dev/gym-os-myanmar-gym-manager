"use client";

import { type FormEvent, useMemo, useState } from "react";
import { CalendarClock, Phone, Plus, Search, UserCog, Users } from "lucide-react";
import type { Member, MemberStatus, PaymentStatus, PlanType } from "@/lib/types";

type Props = {
  members: Member[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
};

type FilterStatus = "All" | MemberStatus | "Overdue";

const PLAN_OPTIONS: PlanType[] = ["Basic", "Premium", "Premium Plus", "Student"];
const STATUS_OPTIONS: MemberStatus[] = ["Active", "Expired", "Suspended"];
const PAYMENT_OPTIONS: PaymentStatus[] = ["Paid", "Overdue", "Unpaid"];

function createInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function formatDate(date: string | null) {
  if (!date) return "No visit";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function statusTone(status: MemberStatus) {
  if (status === "Active") return "bg-teal-50 text-teal-700 ring-teal-200";
  if (status === "Expired") return "bg-rose-50 text-rose-700 ring-rose-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function paymentTone(status: PaymentStatus) {
  if (status === "Paid") return "bg-teal-50 text-teal-700 ring-teal-200";
  if (status === "Overdue") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-rose-50 text-rose-700 ring-rose-200";
}

export default function MemberManagement({ members, onAddMember, onUpdateMember }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("All");
  const [form, setForm] = useState({
    name: "",
    nameMM: "",
    phone: "",
    plan: "Basic" as PlanType,
    expiryDate: addDays(30),
    trainerId: "",
  });

  const activeCount = members.filter((member) => member.status === "Active").length;
  const overdueCount = members.filter(
    (member) => member.paymentStatus === "Overdue" || member.paymentStatus === "Unpaid",
  ).length;
  const assignedCount = members.filter((member) => member.trainerId).length;

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return members.filter((member) => {
      const statusMatches =
        status === "All" ||
        member.status === status ||
        (status === "Overdue" && (member.paymentStatus === "Overdue" || member.paymentStatus === "Unpaid"));
      const queryMatches =
        !normalized ||
        member.id.toLowerCase().includes(normalized) ||
        member.name.toLowerCase().includes(normalized) ||
        member.nameMM.includes(query.trim()) ||
        member.phone.toLowerCase().includes(normalized) ||
        member.plan.toLowerCase().includes(normalized);
      return statusMatches && queryMatches;
    });
  }, [members, query, status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = form.name.trim();
    if (!cleanName) return;

    onAddMember({
      id: `mem-${Date.now()}`,
      name: cleanName,
      nameMM: form.nameMM.trim() || cleanName,
      initials: createInitials(cleanName),
      plan: form.plan,
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
      expiryDate: form.expiryDate,
      lastVisitDate: null,
      phone: form.phone.trim() || "No phone added",
      paymentStatus: "Paid",
      paymentDueDate: null,
      trainerId: form.trainerId || null,
    });

    setForm({
      name: "",
      nameMM: "",
      phone: "",
      plan: "Basic",
      expiryDate: addDays(30),
      trainerId: "",
    });
  }

  function updateMember<K extends keyof Member>(member: Member, key: K, value: Member[K]) {
    onUpdateMember({ ...member, [key]: value });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-950">Member Management</h2>
            <p className="text-xs text-slate-500">Create, update, and monitor gym members · အဖွဲ့ဝင်စီမံခန့်ခွဲမှု</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl bg-slate-50 px-3 py-2">
              <p className="text-lg font-bold text-slate-950">{members.length}</p>
              <p className="text-slate-500">Total</p>
            </div>
            <div className="rounded-xl bg-teal-50 px-3 py-2">
              <p className="text-lg font-bold text-teal-700">{activeCount}</p>
              <p className="text-teal-700">Active</p>
            </div>
            <div className="rounded-xl bg-amber-50 px-3 py-2">
              <p className="text-lg font-bold text-amber-700">{overdueCount}</p>
              <p className="text-amber-700">Due</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Plus size={18} className="text-teal-700" />
            <div>
              <h3 className="font-semibold text-slate-900">Add Member</h3>
              <p className="text-xs text-slate-500">New membership registration</p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="member-name">
                Full name
              </label>
              <input
                id="member-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="Member full name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600" htmlFor="member-name-mm">
                Myanmar name
              </label>
              <input
                id="member-name-mm"
                value={form.nameMM}
                onChange={(event) => setForm((current) => ({ ...current, nameMM: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="မြန်မာအမည်"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="member-phone">
                  Phone
                </label>
                <input
                  id="member-phone"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="+95 9..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="member-plan">
                  Plan
                </label>
                <select
                  id="member-plan"
                  value={form.plan}
                  onChange={(event) => setForm((current) => ({ ...current, plan: event.target.value as PlanType }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                >
                  {PLAN_OPTIONS.map((plan) => (
                    <option key={plan}>{plan}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="member-expiry">
                  Expiry date
                </label>
                <input
                  id="member-expiry"
                  type="date"
                  value={form.expiryDate}
                  onChange={(event) => setForm((current) => ({ ...current, expiryDate: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600" htmlFor="member-trainer">
                  Trainer ID
                </label>
                <input
                  id="member-trainer"
                  value={form.trainerId}
                  onChange={(event) => setForm((current) => ({ ...current, trainerId: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="t1, t2..."
                />
              </div>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">
              <Users size={16} />
              Add Member
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Member Directory</h3>
              <p className="text-xs text-slate-500">
                {filteredMembers.length} visible · {assignedCount} assigned to trainers
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                <Search size={15} className="text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 bg-transparent text-sm outline-none"
                  placeholder="Name, phone, ID..."
                />
              </label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as FilterStatus)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
              >
                <option>All</option>
                <option>Active</option>
                <option>Expired</option>
                <option>Suspended</option>
                <option>Overdue</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="py-3 pr-3">Member</th>
                  <th className="px-3 py-3">Plan</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Payment</th>
                  <th className="px-3 py-3">Expiry</th>
                  <th className="px-3 py-3">Trainer</th>
                  <th className="py-3 pl-3">Last visit</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 align-top last:border-0">
                    <td className="py-3 pr-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                          {member.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.nameMM}</p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <Phone size={11} />
                            {member.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={member.plan}
                        onChange={(event) => updateMember(member, "plan", event.target.value as PlanType)}
                        className="w-32 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold"
                      >
                        {PLAN_OPTIONS.map((plan) => (
                          <option key={plan}>{plan}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={member.status}
                        onChange={(event) => updateMember(member, "status", event.target.value as MemberStatus)}
                        className={`w-32 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold ring-1 ${statusTone(member.status)}`}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={member.paymentStatus}
                        onChange={(event) => updateMember(member, "paymentStatus", event.target.value as PaymentStatus)}
                        className={`w-32 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold ring-1 ${paymentTone(member.paymentStatus)}`}
                      >
                        {PAYMENT_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="date"
                        value={member.expiryDate}
                        onChange={(event) => updateMember(member, "expiryDate", event.target.value)}
                        className="w-36 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        value={member.trainerId ?? ""}
                        onChange={(event) => updateMember(member, "trainerId", event.target.value || null)}
                        className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                        placeholder="None"
                      />
                    </td>
                    <td className="py-3 pl-3">
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <CalendarClock size={12} />
                        {formatDate(member.lastVisitDate)}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <UserCog size={12} />
                        {member.paymentStatus === "Paid" ? "Ready" : "Needs follow-up"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
              No members match this filter.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
