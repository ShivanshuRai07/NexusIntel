"use client";
import { useEffect, useRef, useState } from "react";

function CrispSparkline({
  data,
  color,
  fillColor,
}: {
  data: number[];
  color: string;
  fillColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);

    if (data.length < 2) return;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pad = 4;

    const xStep = (W - pad * 2) / (data.length - 1);
    const coords = data.map((v, i) => ({
      x: pad + i * xStep,
      y: H - pad - ((v - min) / range) * (H - pad * 2),
    }));

    // Area fill with soft gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, fillColor || `${color}20`);
    grad.addColorStop(1, `${color}00`);

    ctx.beginPath();
    ctx.moveTo(coords[0].x, H);
    coords.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.lineTo(coords[coords.length - 1].x, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Clean, crisp stroke (no artificial neon blur)
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    coords.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.75;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // End point highlight dot
    const last = coords[coords.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }, [data, color, fillColor]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

function CrispBarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <div className="flex items-end gap-1 h-full w-full pt-1">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <div className="w-full bg-slate-800/80 rounded-t h-full flex items-end">
            <div
              className="w-full rounded-t transition-all duration-300"
              style={{
                height: `${Math.max(8, (d.value / max) * 100)}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <span className="text-[7.5px] text-slate-400 font-mono">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const crudeOilHistory = [78.5, 79.2, 80.1, 79.5, 81.0, 80.8, 82.2, 81.9, 83.1, 82.5, 83.8, 84.60];
const goldHistoryData = [2320, 2335, 2340, 2330, 2355, 2350, 2365, 2360, 2380, 2375, 2390, 2398.40];

const radarData = [
  { label: "00", value: 1.8 }, { label: "04", value: 2.4 }, { label: "08", value: 1.1 },
  { label: "12", value: 3.5 }, { label: "16", value: 4.8 }, { label: "20", value: 3.2 },
  { label: "24", value: 2.1 },
];

const balticData = [1620, 1645, 1680, 1670, 1710, 1735, 1750, 1790, 1810, 1840];

export default function TopAnalytics() {
  const [oilPrice, setOilPrice] = useState<number>(84.60);
  const [oilData, setOilData] = useState<number[]>(crudeOilHistory);
  const [goldPrice, setGoldPrice] = useState<number>(2398.40);
  const [goldData, setGoldData] = useState<number[]>(goldHistoryData);

  useEffect(() => {
    fetch('/api/economy').then(res => res.json()).then(data => {
      if (data && data.crudeOilPrice) {
        setOilPrice(data.crudeOilPrice);
        if (data.crudeOilHistory) setOilData(data.crudeOilHistory);
      }
      if (data && data.goldPrice) {
        setGoldPrice(data.goldPrice);
        if (data.goldHistory) setGoldData(data.goldHistory);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-full">

      {/* Commodity: Gold Spot */}
      <div className="bg-[var(--panel)] border border-[var(--border)] hover:border-slate-500/40 rounded-lg p-2.5 flex flex-col justify-between transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              Gold (XAU/USD)
            </span>
          </div>
          <span className="text-[9px] font-mono font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            +1.84%
          </span>
        </div>

        <div className="flex items-baseline justify-between my-1">
          <span className="font-mono text-base font-bold text-[var(--text-primary)]">
            ${goldPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[9px] text-[var(--text-muted)]">USD / troy oz</span>
        </div>

        <div className="h-9 w-full my-0.5">
          <CrispSparkline data={goldData} color="#F59E0B" />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] text-[8.5px] text-[var(--text-muted)]">
          <span>COMEX Spot Feed</span>
          <span className="font-mono text-[var(--text-secondary)]">24H Range: 2,365 - 2,402</span>
        </div>
      </div>

      {/* Energy: Brent / WTI Crude Oil */}
      <div className="bg-[var(--panel)] border border-[var(--border)] hover:border-slate-500/40 rounded-lg p-2.5 flex flex-col justify-between transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              Crude Oil (Brent)
            </span>
          </div>
          <span className="text-[9px] font-mono font-medium text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
            +0.65%
          </span>
        </div>

        <div className="flex items-baseline justify-between my-1">
          <span className="font-mono text-base font-bold text-[var(--text-primary)]">
            ${oilPrice.toFixed(2)}
          </span>
          <span className="text-[9px] text-[var(--text-muted)]">USD / bbl</span>
        </div>

        <div className="h-9 w-full my-0.5">
          <CrispSparkline data={oilData} color="#38BDF8" />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] text-[8.5px] text-[var(--text-muted)]">
          <span>ICE Futures Europe</span>
          <span className="font-mono text-[var(--text-secondary)]">Vol: 248.6K contracts</span>
        </div>
      </div>

      {/* Maritime Freight: Baltic Dry Index */}
      <div className="bg-[var(--panel)] border border-[var(--border)] hover:border-slate-500/40 rounded-lg p-2.5 flex flex-col justify-between transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              Baltic Dry Index (BDI)
            </span>
          </div>
          <span className="text-[9px] font-mono font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            +3.12%
          </span>
        </div>

        <div className="flex items-baseline justify-between my-1">
          <span className="font-mono text-base font-bold text-[var(--text-primary)]">
            1,840 <span className="text-[10px] font-normal text-[var(--text-muted)]">pts</span>
          </span>
          <span className="text-[9px] text-[var(--text-muted)]">Shipping Benchmark</span>
        </div>

        <div className="h-9 w-full my-0.5">
          <CrispSparkline data={balticData} color="#818CF8" />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] text-[8.5px] text-[var(--text-muted)]">
          <span>Global Bulk Shipping</span>
          <span className="font-mono text-[var(--text-secondary)]">Capesize: +4.8%</span>
        </div>
      </div>

      {/* Climate & Weather Radar Activity */}
      <div className="bg-[var(--panel)] border border-[var(--border)] hover:border-slate-500/40 rounded-lg p-2.5 flex flex-col justify-between transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              Global Storm Disruption
            </span>
          </div>
          <span className="text-[9px] font-mono font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            MODERATE
          </span>
        </div>

        <div className="flex items-baseline justify-between my-1">
          <span className="font-mono text-base font-bold text-[var(--text-primary)]">
            3.8 <span className="text-[10px] font-normal text-[var(--text-muted)]">index</span>
          </span>
          <span className="text-[9px] text-[var(--text-muted)]">Logistics Impact</span>
        </div>

        <div className="h-9 w-full my-0.5">
          <CrispBarChart data={radarData} color="#2DD4BF" />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] text-[8.5px] text-[var(--text-muted)]">
          <span>NOAA / ECMWF Data</span>
          <span className="font-mono text-[var(--text-secondary)]">6 Major Maritime Depressions</span>
        </div>
      </div>

    </div>
  );
}
