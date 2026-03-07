"use client";
import { useEffect, useRef } from "react";

// Pure SVG/Canvas-based charts — no external library needed
function LineChart({
  data,
  color,
  secondaryData,
  secondaryColor,
}: {
  data: number[];
  color: string;
  secondaryData?: number[];
  secondaryColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const allData = secondaryData ? [...data, ...secondaryData] : data;
    const max = Math.max(...allData);
    const min = Math.min(...allData);
    const range = max - min || 1;
    const pad = 4;

    const drawLine = (pts: number[], c: string) => {
      const xStep = (W - pad * 2) / (pts.length - 1);
      const coords = pts.map((v, i) => ({
        x: pad + i * xStep,
        y: H - pad - ((v - min) / range) * (H - pad * 2),
      }));

      // Area gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      const hex = c.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.moveTo(coords[0].x, H);
      coords.forEach(({ x, y }) => ctx.lineTo(x, y));
      ctx.lineTo(coords[coords.length - 1].x, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(coords[0].x, coords[0].y);
      coords.forEach(({ x, y }) => ctx.lineTo(x, y));
      ctx.strokeStyle = c;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = c;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dots
      coords.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });
    };

    drawLine(data, color);
    if (secondaryData && secondaryColor) drawLine(secondaryData, secondaryColor);
  }, [data, color, secondaryData, secondaryColor]);

  return <canvas ref={canvasRef} width={300} height={60} className="w-full h-full" />;
}

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string | ((v: number) => string) }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-0.5 h-full w-full">
      {data.map((d, i) => {
        const barColor = typeof color === "function" ? color(d.value) : color;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
            <span className="text-[6px] font-bold" style={{ color: barColor }}>{d.value}</span>
            <div
              className="w-full rounded-t transition-all duration-1000"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: `linear-gradient(to top, ${barColor}44, ${barColor})`,
                boxShadow: `0 -2px 6px ${barColor}66`,
                minHeight: "2px",
              }}
            />
            <span className="text-[5.5px] text-text-muted text-center leading-none">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const conflictTrendData = [8, 12, 10, 15, 18, 14, 20, 22, 19, 23, 21, 25];
const diplomaticData = [15, 18, 22, 20, 17, 24, 28, 26, 30, 27, 32, 35];

const stabilityData = [
  { label: "Europe", value: 68 },
  { label: "Asia", value: 54 },
  { label: "ME", value: 32 },
  { label: "Africa", value: 41 },
  { label: "Americas", value: 72 },
  { label: "Pacific", value: 65 },
];

const stabilityColor = (v: number) =>
  v >= 65 ? "#00FF88" : v >= 50 ? "#FFD700" : v >= 35 ? "#FF8C00" : "#FF2244";

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

import { useState } from "react";

export default function TopAnalytics() {
  const [economyData, setEconomyData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/economy').then(res => res.json()).then(setEconomyData).catch(console.error);
  }, []);

  const stabilityDisplayData = economyData.length > 0 
    ? economyData.map(d => ({ label: d.region, value: d.stability_score }))
    : [
        { label: "Europe", value: 68 },
        { label: "Asia", value: 54 },
        { label: "ME", value: 32 },
        { label: "Africa", value: 41 },
        { label: "Americas", value: 72 },
        { label: "Pacific", value: 65 },
      ];

  return (
    <div className="top-analytics h-full">
      {/* Conflict Trends */}
      <div className="glass-panel p-2.5 flex flex-col">
        <div className="section-header">
          <span className="w-2 h-2 rounded-full bg-neon-red" style={{ boxShadow: "0 0 6px #FF2244" }} />
          Conflict Trends (Active Fronts)
        </div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: "#FF2244" }} />
              <span className="text-[7px] text-text-secondary">Conflicts</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: "#00D4FF" }} />
              <span className="text-[7px] text-text-secondary">Diplomatic</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-[7px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,34,68,0.15)", color: "#FF2244" }}>+12% MoM</span>
          </div>
        </div>
        <div className="flex-1 min-h-0" style={{ height: "70px" }}>
          <LineChart data={conflictTrendData} color="#FF2244" secondaryData={diplomaticData} secondaryColor="#00D4FF" />
        </div>
        <div className="flex justify-between mt-1 px-0.5">
          {months.map((m) => <span key={m} className="text-[5.5px] text-text-muted">{m}</span>)}
        </div>
      </div>

      {/* Regional Stability */}
      <div className="glass-panel p-2.5 flex flex-col">
        <div className="section-header">
          <span className="w-2 h-2 rounded-full" style={{ background: "#00D4FF", boxShadow: "0 0 6px #00D4FF" }} />
          Regional Stability Scores
        </div>
        <div className="flex-1 min-h-0" style={{ height: "80px" }}>
          <BarChart data={stabilityDisplayData} color={stabilityColor} />
        </div>
        <div className="flex justify-between mt-1 items-center">
          <span className="text-[6px] text-text-muted font-orbitron uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">
            SOURCE: IMF / WORLD BANK
          </span>
          <div className="flex gap-2">
            {[
              { label: "Stable", color: "#00FF88" },
              { label: "Moderate", color: "#FFD700" },
              { label: "High Risk", color: "#FF2244" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                <span className="text-[6px] text-text-secondary">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
