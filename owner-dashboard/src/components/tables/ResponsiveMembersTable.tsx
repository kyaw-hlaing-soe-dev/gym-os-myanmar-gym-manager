import type { Member } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";

type Props = {
  members: Member[];
};

function statusClass(status: Member["status"]) {
  if (status === "Active") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "Expired") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-red-50 text-red-700 ring-red-200";
}

export default function ResponsiveMembersTable({ members }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-semibold text-slate-950">Member Table</h2>
        <p className="text-xs text-slate-500">Horizontally scrolls on small screens</p>
      </div>
      <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] table-fixed divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-400">
            <tr>
              <th className="w-[220px] px-4 py-3">Name</th>
              <th className="w-[160px] px-4 py-3">Phone</th>
              <th className="w-[140px] px-4 py-3">Plan</th>
              <th className="w-[140px] px-4 py-3">Status</th>
              <th className="w-[120px] px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {members.slice(0, 8).map((member) => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">{member.name}</p>
                      <p className="truncate text-xs text-slate-400">{member.nameMM}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{member.phone}</td>
                <td className="px-4 py-3 text-slate-600">{member.plan}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClass(member.status)}`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                    aria-label={`Open actions for ${member.name}`}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
