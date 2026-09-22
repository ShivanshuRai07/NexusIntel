"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [tensionIndex] = useState(8.4);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" }));
    };
    updateClock();
    const t = setInterval(updateClock, 1000);
    return () => clearInterval(t);
  }, []);

  const tensionColor = tensionIndex >= 8 ? "#FF2244" : tensionIndex >= 6 ? "#FF8C00" : "#00FF88";

  return (
    <header className="glass-panel flex items-center justify-between px-4 py-2 h-14 shrink-0 relative overflow-hidden mb-1">
      {/* Brand & Platform Identity */}
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <h1 className="font-mono text-lg font-bold text-white tracking-widest leading-none">
            NEXUS<span className="text-cyan-400">INTEL</span>
          </h1>
          <p className="text-[9px] text-slate-400 tracking-[3px] uppercase leading-none mt-1">Global Intelligence Command</p>
        </div>
      </div>

      {/* Global Tension Index */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-black/40 border border-slate-700/60 px-3.5 py-1.5 rounded-md">
          <div>
            <p className="text-[8px] text-slate-400 uppercase tracking-widest font-semibold">Global Threat Index</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-xl font-bold" style={{ color: tensionColor, textShadow: `0 0 10px ${tensionColor}55` }}>
                {tensionIndex}
              </span>
              <span className="text-[10px] text-slate-400">/ 10</span>
              <span className="text-[10px] font-bold" style={{ color: tensionColor }}>— HIGH</span>
            </div>
          </div>
          <div className="w-20">
            <div className="h-1.5 rounded-full bg-slate-800 relative overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ width: `${(tensionIndex / 10) * 100}%`, backgroundColor: tensionColor, boxShadow: `0 0 8px ${tensionColor}` }} 
              />
            </div>
          </div>
        </div>

        {/* System Telemetry */}
        <div className="flex gap-5">
          {[
            { label: "Active Conflicts", value: "23", color: "#FF2244" },
            { label: "Monitored Zones", value: "147", color: "#00D4FF" },
            { label: "Alerts Today", value: "58", color: "#FF8C00" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="font-mono text-sm font-bold" style={{ color: item.color, textShadow: `0 0 8px ${item.color}44` }}>
                {item.value}
              </div>
              <div className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live + Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded">
          <div className="live-dot" />
          <span className="font-mono text-[10px] font-bold text-red-400 tracking-widest">LIVE DISPATCH</span>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm font-bold text-cyan-400">{time}</div>
          <div className="text-[8px] text-slate-400 tracking-wider">{date} · GMT+5:30</div>
        </div>
      </div>
    </header>
  );
}
