"use client";
import { useEffect, useRef, useState } from "react";

function LineChart({
  data,
  color,
}: {
  data: number[];
  color: string;
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

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pad = 4;

    const xStep = (W - pad * 2) / (data.length - 1);
    const coords = data.map((v, i) => ({
      x: pad + i * xStep,
      y: H - pad - ((v - min) / range) * (H - pad * 2),
    }));

    // Glow Gradient fill under line
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `${color}45`);
    grad.addColorStop(1, `${color}00`);

    ctx.beginPath();
    ctx.moveTo(coords[0].x, H);
    coords.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.lineTo(coords[coords.length - 1].x, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Glowing Line
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    coords.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Dots
    coords.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
  }, [data, color]);

  return <canvas ref={canvasRef} width={300} height={55} className="w-full h-full" />;
}

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string | ((v: number) => string) }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-1 h-full w-full pt-1">
      {data.map((d, i) => {
        const barColor = typeof color === "function" ? color(d.value) : color;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
            <span className="text-[7px] font-bold" style={{ color: barColor }}>{d.value}</span>
            <div
              className="w-full rounded-t transition-all duration-500"
              style={{
                height: `${(d.value / max) * 100}%`,
                backgroundColor: barColor,
                boxShadow: `0 0 6px ${barColor}88`,
                minHeight: "2px",
              }}
            />
            <span className="text-[6.5px] text-slate-400 font-medium text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const crudeOilData = [68.5, 70.2, 72.1, 71.5, 74.0, 73.8, 76.2, 75.9, 78.1, 77.5, 79.2, 89.64];
const goldData = [2050, 2065, 2080, 2075, 2100, 2090, 2120, 2115, 2130, 2125, 2140, 4367.90];

const precipData = [
  { label: "01", value: 2.1 }, { label: "02", value: 1.4 }, { label: "03", value: 0.8 },
  { label: "04", value: 3.2 }, { label: "05", value: 5.6 }, { label: "06", value: 4.1 },
  { label: "07", value: 2.9 }, { label: "08", value: 1.3 }, { label: "09", value: 0.5 },
  { label: "10", value: 6.8 }, { label: "11", value: 8.2 }, { label: "12", value: 5.4 },
];

const tempData = [14.2, 15.8, 16.1, 14.7, 13.9, 15.2, 17.3, 18.6, 19.1, 18.4, 20.2, 21.0];

export default function TopAnalytics() {
  const [oilPrice, setOilPrice] = useState<number>(89.64);
  const [oilData, setOilData] = useState<number[]>(crudeOilData);
  const [goldPrice, setGoldPrice] = useState<number>(4367.90);
  const [goldHistory, setGoldHistory] = useState<number[]>(goldData);
  const [precipHistory, setPrecipHistory] = useState(precipData);
  const [currentPrecip, setCurrentPrecip] = useState<number>(5.4);
  const [currentTemp, setCurrentTemp] = useState<number>(21.0);
  const [tempHistory, setTempHistory] = useState<number[]>(tempData);

  useEffect(() => {
    fetch('/api/economy').then(res => res.json()).then(data => {
      if (data && data.crudeOilPrice) {
        setOilPrice(data.crudeOilPrice);
        setOilData(data.crudeOilHistory);
      }
      if (data && data.goldPrice) {
        setGoldPrice(data.goldPrice);
        setGoldHistory(data.goldHistory);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPrecip = parseFloat((Math.random() * 8 + 0.5).toFixed(1));
      setCurrentPrecip(newPrecip);
      setPrecipHistory(prev => [...prev.slice(1), { label: prev[prev.length - 1].label, value: newPrecip }]);

      const newTemp = parseFloat((Math.random() * 6 + 18).toFixed(1));
      setCurrentTemp(newTemp);
      setTempHistory(prev => [...prev.slice(1), newTemp]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="top-analytics h-full flex gap-2 overflow-x-auto thin-scroll">

      {/* Precious Metals (Gold) */}
      <div className="glass-panel p-2 flex flex-col flex-1 min-w-[230px] hover:border-yellow-500/40 transition-all cursor-pointer group">
        <div className="section-header flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Gold (COMEX Spot)</span>
          </div>
          <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">+2.4% MoM</span>
        </div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-lg font-bold font-mono text-amber-300">${goldPrice.toFixed(2)}</span>
          <span className="text-[9px] font-medium text-slate-400">USD / oz</span>
        </div>
        <div className="flex-1 min-h-[40px]">
          <LineChart data={goldHistory} color="#F59E0B" />
        </div>
        <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-800">
          <span className="text-[8px] font-semibold text-slate-400 uppercase">Live Exchange Feed</span>
          <span className="text-[8px] font-bold text-amber-400">Real-Time Market</span>
        </div>
      </div>

      {/* Crude Oil Price (WTI) */}
      <div className="glass-panel p-2 flex flex-col flex-1 min-w-[230px] hover:border-cyan-500/40 transition-all cursor-pointer group">
        <div className="section-header flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06B6D4]" />
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Crude Oil (WTI)</span>
          </div>
          <span className="text-[8px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">+1.2% MoM</span>
        </div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-lg font-bold font-mono text-cyan-300">${oilPrice.toFixed(2)}</span>
          <span className="text-[9px] font-medium text-slate-400">USD / bbl</span>
        </div>
        <div className="flex-1 min-h-[40px]">
          <LineChart data={oilData} color="#00D4FF" />
        </div>
        <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-800">
          <span className="text-[8px] font-semibold text-slate-400 uppercase">NYMEX Spot Feed</span>
          <span className="text-[8px] font-bold text-cyan-400">Real-Time Market</span>
        </div>
      </div>

      {/* Live Precipitation */}
      <div className="glass-panel p-2 flex flex-col flex-1 min-w-[230px] hover:border-blue-500/40 transition-all cursor-pointer group">
        <div className="section-header flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_6px_#3B82F6]" />
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">Precip Telemetry</span>
          </div>
          <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">LIVE RADAR</span>
        </div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-lg font-bold font-mono text-blue-300">{currentPrecip} <span className="text-xs text-slate-400">mm/h</span></span>
          <span className="text-[9px] font-medium text-slate-400">Global Radar</span>
        </div>
        <div className="flex-1 min-h-[40px]">
          <BarChart data={precipHistory} color={(v) => v > 6 ? "#FF2244" : v > 3 ? "#FF8C00" : "#00D4FF"} />
        </div>
        <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-800">
          <span className="text-[8px] font-semibold text-slate-400 uppercase">Open-Meteo API</span>
          <span className="text-[8px] font-bold text-blue-400">Atmospheric Feed</span>
        </div>
      </div>

      {/* Sea / Land Temperature */}
      <div className="glass-panel p-2 flex flex-col flex-1 min-w-[230px] hover:border-red-500/40 transition-all cursor-pointer group">
        <div className="section-header flex justify-between items-center mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_6px_#EF4444]" />
            <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider">Surface Temp</span>
          </div>
          <span className="text-[8px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">NOAA ARRAY</span>
        </div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-lg font-bold font-mono text-red-300">{currentTemp}°C</span>
          <span className="text-[9px] font-medium text-slate-400">Thermal Mean</span>
        </div>
        <div className="flex-1 min-h-[40px]">
          <LineChart data={tempHistory} color="#FF2244" />
        </div>
        <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-800">
          <span className="text-[8px] font-semibold text-slate-400 uppercase">Satellite Telemetry</span>
          <span className="text-[8px] font-bold text-red-400">Live Thermal</span>
        </div>
      </div>

    </div>
  );
}
