"use client";

import { heatmapData, DAYS, HOURS } from "@/lib/mockData";
import { useState } from "react";

function getIntensity(count: number): number {
  const max = 60;
  return Math.min(count / max, 1);
}

function getHeatColor(intensity: number): string {
  if (intensity === 0) return "#f8fafc";
  // Navy to teal gradient
  const r = Math.round(15 + intensity * (13 - 15));
  const g = Math.round(23 + intensity * (148 - 23));
  const b = Math.round(42 + intensity * (136 - 42));
  const alpha = 0.15 + intensity * 0.85;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getBusyLabel(intensity: number): string {
  if (intensity >= 0.85) return "Peak";
  if (intensity >= 0.6) return "Busy";
  if (intensity >= 0.35) return "Moderate";
  return "Quiet";
}

export default function OccupancyHeatmap() {
  const [tooltip, setTooltip] = useState<{
    day: string;
    hour: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Build lookup map
  const lookup = new Map<string, number>();
  heatmapData.forEach((d) => {
    lookup.set(`${d.day}-${d.hour}`, d.count);
  });

  const peakEntry = heatmapData.reduce(
    (best, d) => (d.count > best.count ? d : best),
    heatmapData[0]
  );

  return (
    <div className="card p-6 animate-fade-in-up delay-400">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-semibold text-slate-900 text-base">
            Occupancy Heatmap
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Member check-ins by day & hour
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Peak hour</p>
          <p className="font-semibold text-teal-600 text-sm">
            {peakEntry.day} {peakEntry.hour}
          </p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 420 }}>
          {/* Hour Labels */}
          <div
            className="grid mb-2"
            style={{
              gridTemplateColumns: `48px repeat(${HOURS.length}, 1fr)`,
              gap: "4px",
            }}
          >
            <div />
            {HOURS.map((h) => (
              <div
                key={h}
                className="text-center text-slate-400"
                style={{ fontSize: "10px", fontWeight: 500 }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day) => (
            <div
              key={day}
              className="grid mb-1"
              style={{
                gridTemplateColumns: `48px repeat(${HOURS.length}, 1fr)`,
                gap: "4px",
              }}
            >
              <div
                className="flex items-center text-slate-500"
                style={{ fontSize: "11px", fontWeight: 500 }}
              >
                {day}
              </div>
              {HOURS.map((hour) => {
                const count = lookup.get(`${day}-${hour}`) ?? 0;
                const intensity = getIntensity(count);
                const bg = getHeatColor(intensity);

                return (
                  <div
                    key={hour}
                    className="heatmap-cell"
                    style={{
                      background: bg,
                      height: 28,
                      border:
                        intensity > 0.8
                          ? "1px solid rgba(13,148,136,0.3)"
                          : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ day, hour, count, x: rect.left, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-slate-400 text-xs">Quiet</span>
        <div
          className="flex-1 h-2 rounded-full"
          style={{
            background:
              "linear-gradient(to right, rgba(15,23,42,0.05), rgba(13,148,136,1))",
          }}
        />
        <span className="text-slate-400 text-xs">Peak</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x + 16,
            top: tooltip.y - 60,
          }}
        >
          <div
            className="glass rounded-xl px-3 py-2 shadow-xl text-xs"
            style={{ border: "1px solid rgba(13,148,136,0.2)" }}
          >
            <p className="font-semibold text-slate-800">
              {tooltip.day} at {tooltip.hour}
            </p>
            <p className="text-slate-500">
              {tooltip.count} check-ins ·{" "}
              <span style={{ color: "#0d9488" }}>
                {getBusyLabel(getIntensity(tooltip.count))}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
