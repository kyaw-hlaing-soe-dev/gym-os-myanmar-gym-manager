"use client";

import { TrendingUp, TrendingDown, Minus, Dumbbell, Users } from "lucide-react";
import { trainerStats } from "@/lib/mockData";

export default function TrainerPerformance() {
  return (
    <div className="card p-6 animate-fade-in-up delay-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-slate-900 text-base">
            Trainer Performance
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Session logs & client retention
          </p>
        </div>
        <button className="text-teal-600 text-xs font-semibold hover:underline">
          View all →
        </button>
      </div>

      {/* Trainer Cards */}
      <div className="space-y-3">
        {trainerStats.map((trainer, i) => {
          const TrendIcon =
            trainer.trend === "up"
              ? TrendingUp
              : trainer.trend === "down"
              ? TrendingDown
              : Minus;
          const trendColor =
            trainer.trend === "up"
              ? "#0d9488"
              : trainer.trend === "down"
              ? "#e11d48"
              : "#94a3b8";

          return (
            <div
              key={trainer.id}
              id={`trainer-${trainer.id}`}
              className="group flex items-center gap-4 p-3.5 rounded-xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-200"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              {/* Rank */}
              <span
                className="font-mono-data font-bold text-lg w-6 text-center flex-shrink-0"
                style={{
                  color: i === 0 ? "#d97706" : i === 1 ? "#94a3b8" : "#a16207",
                }}
              >
                {i + 1}
              </span>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(135deg, #0d9488, #0f766e)"
                      : "linear-gradient(135deg, #475569, #334155)",
                }}
              >
                {trainer.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 text-sm">
                    {trainer.name}
                  </p>
                  <TrendIcon size={14} style={{ color: trendColor }} />
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Users size={10} />
                    <span>{trainer.clients} clients</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Dumbbell size={10} />
                    <span>{trainer.sessionsThisMonth} sessions</span>
                  </div>
                </div>
              </div>

              {/* Retention */}
              <div className="text-right flex-shrink-0">
                <p
                  className="font-mono-data font-bold text-base"
                  style={{
                    color:
                      trainer.retentionRate >= 90
                        ? "#0d9488"
                        : trainer.retentionRate >= 80
                        ? "#d97706"
                        : "#e11d48",
                  }}
                >
                  {trainer.retentionRate}%
                </p>
                <p className="text-slate-400 text-[10px]">retention</p>
              </div>

              {/* Retention Bar */}
              <div className="w-16 flex-shrink-0">
                <div
                  className="rounded-full overflow-hidden"
                  style={{ background: "#f1f5f9", height: 4 }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${trainer.retentionRate}%`,
                      background:
                        trainer.retentionRate >= 90
                          ? "#0d9488"
                          : trainer.retentionRate >= 80
                          ? "#f59e0b"
                          : "#e11d48",
                      transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div
        className="mt-5 pt-4 grid grid-cols-3 gap-4"
        style={{ borderTop: "1px solid #f1f5f9" }}
      >
        <div className="text-center">
          <p className="font-mono-data font-bold text-slate-800 text-lg">
            {trainerStats.reduce((s, t) => s + t.clients, 0)}
          </p>
          <p className="text-slate-400 text-xs">Total Clients</p>
        </div>
        <div className="text-center">
          <p className="font-mono-data font-bold text-slate-800 text-lg">
            {trainerStats.reduce((s, t) => s + t.sessionsThisMonth, 0)}
          </p>
          <p className="text-slate-400 text-xs">Sessions / Mo</p>
        </div>
        <div className="text-center">
          <p
            className="font-mono-data font-bold text-lg"
            style={{ color: "#0d9488" }}
          >
            {(
              trainerStats.reduce((s, t) => s + t.retentionRate, 0) /
              trainerStats.length
            ).toFixed(0)}
            %
          </p>
          <p className="text-slate-400 text-xs">Avg Retention</p>
        </div>
      </div>
    </div>
  );
}
