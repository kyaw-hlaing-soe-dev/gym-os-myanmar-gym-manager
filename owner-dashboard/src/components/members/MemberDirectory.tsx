"use client";

import { CalendarClock, Phone, Search, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { Member } from "@/lib/types";

type Props = {
  members: Member[];
};

type FilterStatus = "All" | "Active" | "Expired" | "Overdue";

function paymentTone(status: Member["paymentStatus"]) {
  if (status === "Paid") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Overdue") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-red-50 text-red-700 ring-red-200";
}

function statusTone(status: Member["status"]) {
  if (status === "Active") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Expired") return "bg-red-50 text-red-700 ring-red-200";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

function formatDate(date: string | null) {
  if (!date) return "No visit";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function nextAction(member: Member) {
  if (member.status === "Expired") return "Renew before check-in";
  if (member.paymentStatus === "Overdue" || member.paymentStatus === "Unpaid") return "Collect payment";
  return "Ready to check in";
}

function matchesQuery(member: Member, value: string) {
  const query = value.trim().toLowerCase();
  if (!query) return true;

  return (
    member.id.toLowerCase().includes(query) ||
    member.name.toLowerCase().includes(query) ||
    member.nameMM.includes(value.trim()) ||
    member.phone.toLowerCase().includes(query) ||
    member.plan.toLowerCase().includes(query)
  );
}

export default function MemberDirectory({ members }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("All");

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesStatus =
        status === "All" ||
        member.status === status ||
        (status === "Overdue" &&
          (member.paymentStatus === "Overdue" || member.paymentStatus === "Unpaid"));

      return matchesStatus && matchesQuery(member, query);
    });
  }, [members, query, status]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold text-slate-950">Member Directory</h2>
          <p className="text-xs text-slate-500">Real member list · အဖွဲ့ဝင်ရှာဖွေရန်</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Name, phone, ID..."
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as FilterStatus)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            aria-label="Filter members by status"
          >
            <option>All</option>
            <option>Active</option>
            <option>Expired</option>
            <option>Overdue</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredMembers.map((member) => (
          <article key={member.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {member.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900">{member.name}</h3>
                    <p className="truncate text-xs text-slate-500">{member.nameMM}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${statusTone(member.status)}`}>
                    {member.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone size={12} />
                    <span className="truncate">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock size={12} />
                    <span>{member.plan} · Exp {formatDate(member.expiryDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck size={12} />
                    <span>Last visit {formatDate(member.lastVisitDate)}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${paymentTone(member.paymentStatus)}`}>
                    {member.paymentStatus}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{nextAction(member)}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredMembers.length === 0 ? (
        <div className="rounded-xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
          No members match this filter.
        </div>
      ) : null}
    </section>
  );
}
