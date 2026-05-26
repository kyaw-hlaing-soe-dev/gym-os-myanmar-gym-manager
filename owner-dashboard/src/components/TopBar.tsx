"use client";

import { Bell, Search, RefreshCw, ChevronDown } from "lucide-react";
import { useState } from "react";
import { gymMeta, notifications } from "@/lib/mockData";

export default function TopBar() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="flex items-center gap-4 px-6 py-4 border-b"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "#e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Page Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-slate-900 font-semibold text-lg leading-tight">
          Manager Dashboard
        </h1>
        <p className="text-slate-400 text-xs mt-0.5">
          {gymMeta.name} · {dateStr} · {timeStr}
        </p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-56">
        <Search size={14} className="text-slate-400 flex-shrink-0" />
        <input
          id="topbar-search"
          type="text"
          placeholder="Search members..."
          className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none flex-1 w-full"
        />
      </div>

      {/* Refresh */}
      <button
        id="topbar-refresh"
        onClick={handleRefresh}
        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-all"
        aria-label="Refresh data"
      >
        <RefreshCw
          size={15}
          className={isRefreshing ? "animate-spin" : ""}
        />
      </button>

      {/* Notifications */}
      <button
        id="topbar-notifications"
        className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-all"
        aria-label="Notifications"
      >
        <Bell size={15} />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{
              background: "#e11d48",
              color: "white",
              width: "18px",
              height: "18px",
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* Avatar Menu */}
      <button
        id="topbar-profile"
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}
        >
          KA
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-slate-800 text-xs font-semibold leading-tight">
            {gymMeta.owner}
          </p>
          <p className="text-slate-400 text-[10px]">Manager</p>
        </div>
        <ChevronDown size={12} className="text-slate-400" />
      </button>
    </header>
  );
}
