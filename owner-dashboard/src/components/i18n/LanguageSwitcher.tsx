"use client";

import { Languages } from "lucide-react";
import { useLanguage, type Language } from "./LanguageProvider";

const languageLabels: Record<Language, string> = {
  en: "English",
  mm: "Burmese",
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm sm:flex">
      <Languages size={14} className="text-slate-400" />
      <span className="sr-only">Dashboard language</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="bg-transparent text-xs font-semibold text-slate-700 outline-none"
        aria-label="Dashboard language"
      >
        {(["en", "mm"] as Language[]).map((option) => (
          <option key={option} value={option}>
            {languageLabels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
