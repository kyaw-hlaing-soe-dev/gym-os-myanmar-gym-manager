"use client";

import { Users } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const dictionary = {
  en: {
    totalMembers: "Total Members",
  },
  mm: {
    totalMembers: "စုစုပေါင်းအဖွဲ့ဝင်များ",
  },
};

export default function StatsCard({ value }: { value: string }) {
  const { language } = useLanguage();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-bold uppercase text-slate-400">
          {dictionary[language].totalMembers}
        </p>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Users size={18} />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
