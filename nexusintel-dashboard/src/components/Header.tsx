"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [utcTime, setUtcTime] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [threatIndex] = useState(8.4);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19) + " UTC");
      setLocalTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setDateStr(now.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "2-digit", 
        year: "numeric" 
      }));
    };
    updateClock();
    const t = setInterval(updateClock, 1000);
    return () => clearInterval(t);
  }, []);

  const getThreatLevel = (val: number) => {
    if (val >= 8) return { label: "ELEVATED", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", bar: "bg-rose-500" };
    if (val >= 6) return { label: "MODERATE", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", bar: "bg-amber-500" };
    return { label: "NORMAL", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", bar: "bg-emerald-500" };
  };

  const threat = getThreatLevel(threatIndex);

  return (
    <header className="bg-[var(--bg-header)] border-b border-[var(--border)] px-4 py-2.5 h-14 shrink-0 flex items-center justify-between relative z-30 select-none transition-colors duration-200">
      {/* Brand & Organization */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-sky-400 shadow-sm">
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wider text-[var(--text-primary)] font-sans">
              NEXUS<span className="text-sky-500 font-bold">INTEL</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/70 text-slate-300 font-mono border border-slate-700/70 font-medium">
              v2.4
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-secondary)] font-medium tracking-wide">
            Global Strategic Intelligence & Risk Monitor
          </p>
        </div>
      </div>

      {/* Center Operational Intelligence Telemetry */}
      <div className="hidden lg:flex items-center gap-6">
        {/* Threat Gauge */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-[var(--panel-card)] border border-[var(--border)]">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
              Global Threat Rating
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`font-mono text-base font-bold ${threat.color}`}>
                {threatIndex.toFixed(1)}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">/ 10</span>
              <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${threat.bg} ${threat.color} ${threat.border}`}>
                {threat.label}
              </span>
            </div>
          </div>
          <div className="w-16">
            <div className="h-1.5 rounded-full bg-slate-700/40 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${threat.bar}`}
                style={{ width: `${(threatIndex / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Telemetry Stat Nodes */}
        <div className="flex items-center gap-5 border-l border-[var(--border)] pl-5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">23</span>
            </div>
            <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">Active Flashpoints</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">147</span>
            </div>
            <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">Strategic Corridors</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">58</span>
            </div>
            <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">Signals (24h)</span>
          </div>
        </div>
      </div>

      {/* Right: Operational Status, Theme Toggle & Clocks */}
      <div className="flex items-center gap-3">
        
        {/* Dark & Night/Day Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to Day Mode" : "Switch to Night Mode"}
          title={theme === "dark" ? "Switch to Day Mode" : "Switch to Night Mode"}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all shadow-sm bg-[var(--panel-card)] border-[var(--border)] hover:border-sky-500/50"
        >
          {theme === "dark" ? (
            <>
              <span className="text-sm leading-none">🌙</span>
              <span className="font-mono text-[10px] font-semibold text-slate-200">NIGHT MODE</span>
            </>
          ) : (
            <>
              <span className="text-sm leading-none">☀️</span>
              <span className="font-mono text-[10px] font-semibold text-slate-700">DAY MODE</span>
            </>
          )}
        </button>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--panel-card)] border border-[var(--border)]">
          <div className="live-pulse" />
          <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider font-mono">
            LIVE TELEMETRY
          </span>
        </div>

        {/* Dual Clock */}
        <div className="text-right border-l border-[var(--border)] pl-3 hidden sm:block">
          <div className="font-mono text-xs font-semibold text-[var(--text-primary)] tracking-tight">
            {localTime} <span className="text-[var(--text-muted)] text-[10px] font-normal">({utcTime})</span>
          </div>
          <div className="text-[10px] text-[var(--text-secondary)] font-medium tracking-tight">
            {dateStr}
          </div>
        </div>

        {/* Analyst Profile Pill */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-7 h-7 rounded bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center justify-center text-xs font-semibold">
            AS
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-[10px] font-semibold text-[var(--text-primary)] leading-tight">Analyst Session</span>
            <span className="text-[8.5px] text-emerald-500 font-mono">AUTHORIZED</span>
          </div>
        </div>
      </div>
    </header>
  );
}
