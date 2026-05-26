"use client";

import { notifications, gymMeta } from "@/lib/mockData";
import {
  AlertTriangle,
  CreditCard,
  QrCode,
  Activity,
  Bell,
  CheckCheck,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { recentActivity } from "@/lib/mockData";

const notifIcons = {
  churn: { icon: AlertTriangle, bg: "#ffe4e6", color: "#e11d48" },
  payment: { icon: CreditCard, bg: "#fef3c7", color: "#d97706" },
  checkin: { icon: QrCode, bg: "#ccfbf1", color: "#0d9488" },
  system: { icon: Activity, bg: "#dae2fd", color: "#3a547d" },
};

export default function ActivityFeed() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Today's Check-ins Bar Chart */}
      <div className="card p-6 animate-fade-in-up delay-500">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-slate-900 text-base">
              Daily Check-ins
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Last 7 days activity</p>
          </div>
          <div className="text-right">
            <p className="font-mono-data font-bold text-xl text-slate-900">
              {recentActivity[recentActivity.length - 1].checkins}
            </p>
            <p className="text-slate-400 text-xs">today</p>
          </div>
        </div>

        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={recentActivity}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              barSize={24}
            >
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 20px rgba(15,23,42,0.08)",
                }}
                labelStyle={{ color: "#475569", fontWeight: 600 }}
                cursor={{ fill: "rgba(13,148,136,0.05)" }}
              />
              <Bar
                dataKey="checkins"
                fill="#0d9488"
                radius={[6, 6, 0, 0]}
                name="Check-ins"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 gap-3 mt-4 pt-4"
          style={{ borderTop: "1px solid #f1f5f9" }}
        >
          <div>
            <p className="font-mono-data font-bold text-slate-800 text-sm">
              {Math.round(
                recentActivity.reduce((s, d) => s + d.checkins, 0) /
                  recentActivity.length
              )}
            </p>
            <p className="text-slate-400 text-xs">Avg/day</p>
          </div>
          <div>
            <p className="font-mono-data font-bold text-slate-800 text-sm">
              {Math.max(...recentActivity.map((d) => d.checkins))}
            </p>
            <p className="text-slate-400 text-xs">Peak day</p>
          </div>
          <div>
            <p className="font-mono-data font-bold text-teal-600 text-sm">
              {gymMeta.avgAttendanceRate}%
            </p>
            <p className="text-slate-400 text-xs">Attendance</p>
          </div>
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="card p-6 animate-fade-in-up delay-500">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-slate-500" />
            <h2 className="font-semibold text-slate-900 text-base">
              Notifications
            </h2>
            <span
              className="badge"
              style={{ background: "#ffe4e6", color: "#e11d48" }}
            >
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>
          <button className="flex items-center gap-1 text-teal-600 text-xs font-semibold hover:underline">
            <CheckCheck size={12} />
            Mark all read
          </button>
        </div>

        <div className="space-y-2">
          {notifications.map((notif) => {
            const cfg = notifIcons[notif.type];
            const Icon = cfg.icon;
            return (
              <div
                key={notif.id}
                id={`notif-${notif.id}`}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  !notif.read ? "bg-teal-50/60" : "hover:bg-slate-50"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: cfg.bg }}
                >
                  <Icon size={14} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      !notif.read ? "text-slate-800 font-medium" : "text-slate-600"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">{notif.time}</p>
                </div>
                {!notif.read && (
                  <div className="notif-dot flex-shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>

        <button className="w-full mt-4 pt-4 text-teal-600 text-xs font-semibold hover:underline border-t border-slate-100">
          View all notifications →
        </button>
      </div>
    </div>
  );
}
