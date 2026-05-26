"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import KPICards from "@/components/KPICards";
import GymOverview from "@/components/GymOverview";
import ChurnRiskPanel from "@/components/ChurnRiskPanel";
import TrainerPerformance from "@/components/TrainerPerformance";
import EquipmentManager from "@/components/EquipmentManager";
import PaymentReconciliation from "@/components/PaymentReconciliation";
import SocialMediaHub from "@/components/SocialMediaHub";

// Dynamically import chart-heavy components to avoid SSR width/height issues
const RevenueChart = dynamic(() => import("@/components/RevenueChart"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 h-96 flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading chart...</div>
    </div>
  ),
});

const OccupancyHeatmap = dynamic(() => import("@/components/OccupancyHeatmap"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 h-64 flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading heatmap...</div>
    </div>
  ),
});

const ActivityFeed = dynamic(() => import("@/components/ActivityFeed"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 h-48 flex items-center justify-center">
      <div className="text-slate-400 text-sm animate-pulse">Loading activity...</div>
    </div>
  ),
});

const UtilityCostTracker = dynamic(
  () => import("@/components/UtilityCostTracker"),
  {
    ssr: false,
    loading: () => (
      <div className="card p-6 h-64 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading utilities...</div>
      </div>
    ),
  }
);

export default function ManagerDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="flex min-h-screen" style={{ background: "var(--surface-bg)" }}>
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Section: Overview */}
          {activeSection === "overview" && (
            <>
              {/* Gym Overview Card */}
              <GymOverview />

              {/* KPI Cards */}
              <KPICards />

              {/* Revenue Chart + Churn Risk (side by side on xl) */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                  <RevenueChart />
                </div>
                <div className="xl:col-span-1">
                  <ChurnRiskPanel />
                </div>
              </div>

              {/* Trainer + Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <TrainerPerformance />
                <OccupancyHeatmap />
              </div>

              {/* Activity + Notifications */}
              <ActivityFeed />
            </>
          )}

          {/* Section: Churn */}
          {activeSection === "churn" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Churn Risk Center</h1>
                <p className="text-slate-500 text-sm mt-1">
                  AI-predicted at-risk members — updated nightly at 2AM
                </p>
              </div>
              <KPICards />
              <ChurnRiskPanel />
            </div>
          )}

          {/* Section: Revenue */}
          {activeSection === "revenue" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Revenue Analytics</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Monthly revenue, targets, and member value
                </p>
              </div>
              <KPICards />
              <RevenueChart />
              <ActivityFeed />
            </div>
          )}

          {/* Section: Payments */}
          {activeSection === "payments" && <PaymentReconciliation />}

          {/* Section: Trainers */}
          {activeSection === "trainers" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Trainer Management</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Performance metrics, session logs, and client retention
                </p>
              </div>
              <TrainerPerformance />
            </div>
          )}

          {/* Section: Members */}
          {activeSection === "members" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Member Management</h1>
                <p className="text-slate-500 text-sm mt-1">
                  All gym members, plans, and activity status
                </p>
              </div>
              <KPICards />
              <ChurnRiskPanel />
            </div>
          )}

          {/* Section: Occupancy */}
          {activeSection === "occupancy" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Occupancy Analytics</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Gym traffic patterns by hour and day
                </p>
              </div>
              <OccupancyHeatmap />
              <ActivityFeed />
            </div>
          )}

          {/* Section: Utilities */}
          {activeSection === "utilities" && <UtilityCostTracker />}

          {/* Section: Equipment */}
          {activeSection === "equipment" && <EquipmentManager />}

          {/* Section: Social Media */}
          {activeSection === "social" && <SocialMediaHub />}

          {/* Section: Notifications */}
          {activeSection === "notifications" && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Churn alerts, payment reminders, and system updates
                </p>
              </div>
              <ActivityFeed />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          className="px-6 py-3 border-t flex items-center justify-between"
          style={{ borderColor: "#e2e8f0", background: "rgba(255,255,255,0.7)" }}
        >
          <p className="text-slate-400 text-xs">
            GymOS Myanmar · AI-Powered Platform ·{" "}
            <span className="text-teal-600 font-medium">Claude API</span>
          </p>
          <p className="text-slate-400 text-xs">
            Last sync: just now ·{" "}
            <span className="text-green-500 font-medium">● Live</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
