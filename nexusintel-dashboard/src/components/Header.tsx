"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [tensionIndex] = useState(8.4);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      );
    };
    updateClock();
    const t = setInterval(updateClock, 1000);
    return () => clearInterval(t);
  }, []);

  const tensionColor =
    tensionIndex >= 8 ? "#FF2244" : tensionIndex >= 6 ? "#FF8C00" : "#00FF88";
  const isDark = theme === "dark";

  return (
    <header
      className="flex items-center justify-between px-5 h-14 shrink-0 relative overflow-hidden"
      style={{
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--glass-border)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, var(--neon-blue), transparent)",
          opacity: 0.5,
        }}
      />

      {/* Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="w-8 h-8 flex items-center justify-center rounded-lg"
          style={{
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.35)",
            color: "var(--neon-blue)",
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <div>
          <h1
            className="text-[17px] font-extrabold tracking-[3px] leading-none uppercase"
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--text)" }}
          >
            NEXUS<span style={{ color: "var(--neon-blue)" }}>INTEL</span>
          </h1>
          <p className="text-[8px] tracking-[3px] uppercase leading-none mt-1 font-medium" style={{ color: "var(--text-secondary)" }}>
            Global Intelligence Command
          </p>
        </div>
      </div>

      {/* Centre: Threat + Telemetry */}
      <div className="flex items-center gap-5 flex-1 justify-center px-6">
        <div
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg"
          style={{ background: "var(--card-bg)", border: "1px solid var(--border-subtle)" }}
        >
          <div>
            <p className="text-[7.5px] uppercase tracking-widest font-bold" style={{ color: "var(--text-secondary)" }}>
              Global Threat Index
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: tensionColor, textShadow: `0 0 12px ${tensionColor}55` }}
              >
                {tensionIndex}
              </span>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>/ 10</span>
              <span className="text-[10px] font-bold" style={{ color: tensionColor }}>— HIGH</span>
            </div>
          </div>
          <div className="w-20">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(tensionIndex / 10) * 100}%`, backgroundColor: tensionColor, boxShadow: `0 0 10px ${tensionColor}` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          {[
            { label: "Active Conflicts", value: "23", color: "#FF2244" },
            { label: "Monitored Zones", value: "147", color: "var(--neon-blue)" },
            { label: "Alerts Today", value: "58", color: "#FF8C00" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div
                className="text-sm font-bold"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: item.color, textShadow: `0 0 8px ${item.color}55` }}
              >
                {item.value}
              </div>
              <div className="text-[7.5px] uppercase tracking-wider mt-0.5 font-semibold" style={{ color: "var(--text-muted)" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: LIVE + Clock + Theme toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
          style={{ background: "rgba(255,34,68,0.1)", border: "1px solid rgba(255,34,68,0.28)" }}
        >
          <div className="live-dot" />
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#FF2244" }}>LIVE</span>
        </div>

        <div className="text-right">
          <div
            className="text-[13px] font-bold tabular-nums"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--neon-blue)" }}
          >
            {time}
          </div>
          <div className="text-[7.5px] tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>
            {date} · GMT+5:30
          </div>
        </div>

        <div className="w-px h-7" style={{ background: "var(--border-subtle)" }} />

        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all duration-200 hover:opacity-80"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
          aria-label="Toggle theme"
          title={isDark ? "Switch to Day mode" : "Switch to Dark mode"}
        >
          {isDark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            {isDark ? "Day" : "Dark"}
          </span>
        </button>
      </div>
    </header>
  );
}
