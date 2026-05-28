"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type DirectoryStatus = "Active" | "Overdue";

type DirectoryMember = {
  id: string;
  name: string;
  phone: string;
  plan: string;
  status: DirectoryStatus;
  avatarBg: string;
};

const mockMembers: DirectoryMember[] = [
  { id: "dm-1", name: "Zaw Myint", phone: "+95 9 7654 3210", plan: "Premium", status: "Overdue", avatarBg: "#e11d48" },
  { id: "dm-2", name: "Thin Thin Aye", phone: "+95 9 8765 4321", plan: "Basic", status: "Overdue", avatarBg: "#f59e0b" },
  { id: "dm-3", name: "Kyaw Zin Htun", phone: "+95 9 9876 5432", plan: "Premium", status: "Active", avatarBg: "#0d9488" },
  { id: "dm-4", name: "Su Su Lwin", phone: "+95 9 6543 2109", plan: "Student", status: "Active", avatarBg: "#2563eb" },
  { id: "dm-5", name: "Aung Ko Ko", phone: "+95 9 5432 1098", plan: "Premium Plus", status: "Active", avatarBg: "#7c3aed" },
];

function avatarUrl(name: string, bg: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="${bg}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="28" font-weight="700" fill="white">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function MemberDirectory() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | DirectoryStatus>("All");

  const filteredMembers = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return mockMembers.filter((member) => {
      const matchesQuery =
        member.name.toLowerCase().includes(cleanQuery) ||
        member.phone.toLowerCase().includes(cleanQuery) ||
        member.plan.toLowerCase().includes(cleanQuery);
      const matchesStatus = status === "All" || member.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-semibold text-slate-950">Member Directory</h2>
          <p className="text-xs text-slate-500">Search and filter mock member records in real time</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
            <Search size={15} className="shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Search members..."
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as "All" | DirectoryStatus)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            aria-label="Filter members by status"
          >
            <option>All</option>
            <option>Active</option>
            <option>Overdue</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredMembers.map((member) => (
          <article key={member.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Image
                src={avatarUrl(member.name, member.avatarBg)}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-slate-900">{member.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
                      member.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-amber-50 text-amber-700 ring-amber-200"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{member.phone}</p>
                <p className="mt-2 text-xs font-semibold text-slate-700">{member.plan}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
