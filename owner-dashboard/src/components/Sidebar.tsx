"use client";

import {
  LayoutDashboard,
  Users,
  Dumbbell,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  Building2,
  GitBranch,
  Lightbulb,
  Wrench,
  Wallet,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { gymMeta, notifications } from "@/lib/mockData";

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "churn", label: "Churn Risk", icon: Zap, badge: 8 },
  { id: "revenue", label: "Revenue", icon: BarChart3 },
  { id: "payments", label: "Payments", icon: Wallet, badge: 4 },
  { id: "trainers", label: "Trainers", icon: Dumbbell },
  { id: "members", label: "Members", icon: Users },
  { id: "occupancy", label: "Occupancy", icon: GitBranch },
  { id: "utilities", label: "Utilities", icon: Lightbulb },
  { id: "equipment", label: "Equipment", icon: Wrench },
  { id: "social", label: "Social Media", icon: Share2 },
];

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const unread = notifications.filter((n) => !n.read).length;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out`}
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #0a1628 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        minHeight: "100vh",
      }}
    >
      {/* Logo & Gym Info */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #0d9488, #0f766e)",
              color: "white",
              boxShadow: "0 4px 12px rgba(13,148,136,0.4)",
            }}
          >
            G
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm leading-tight truncate">
                GymOS Myanmar
              </p>
              <p className="text-slate-400 text-xs truncate">
                {gymMeta.branch}
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <ChevronRight
              size={16}
              className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
            />
          </button>
        </div>

        {!collapsed && (
          <div
            className="mt-3 px-3 py-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center gap-2">
              <Building2 size={12} className="text-teal-400 flex-shrink-0" />
              <span className="text-slate-400 text-xs truncate">
                {gymMeta.name}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
              <span className="text-teal-400 text-xs font-medium">
                {gymMeta.subscriptionPlan} Plan — Active
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Owner Info */}
      {!collapsed && (
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #3a547d, #1e2d4a)" }}
            >
              KA
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {gymMeta.owner}
              </p>
              <p className="text-slate-400 text-xs">Gym Manager</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {!collapsed && (
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-2 mt-1">
            Dashboard
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "active text-teal-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "rgba(239,68,68,0.2)",
                        color: "#f87171",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {!collapsed && (
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mt-4 mb-2">
            System
          </p>
        )}

        <button
          id="nav-notifications"
          onClick={() => onNavigate("notifications")}
          className={`sidebar-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeSection === "notifications"
              ? "active text-teal-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <div className="relative flex-shrink-0">
            <Bell size={18} />
            {unread > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "#e11d48", color: "white" }}
              >
                {unread}
              </span>
            )}
          </div>
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Notifications</span>
              {unread > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(225,29,72,0.2)", color: "#f87171" }}
                >
                  {unread}
                </span>
              )}
            </>
          )}
        </button>

        <button className="sidebar-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all">
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/[0.06]">
        <button className="sidebar-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-400 transition-all">
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
