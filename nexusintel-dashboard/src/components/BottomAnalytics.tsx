"use client";
import { useEffect, useRef } from "react";

// Clean High-DPR Donut Chart
function CrispDonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
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

    const W = rect.width, H = rect.height;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) / 2 - 2;
    const r = R * 0.65;
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    let angle = -Math.PI / 2;

    ctx.clearRect(0, 0, W, H);
    segments.forEach((seg) => {
      const span = (seg.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, angle, angle + span);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Donut inner hole
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      const isLight = document.documentElement.classList.contains("light");
      ctx.fillStyle = isLight ? "#FFFFFF" : "#0D1424";
      ctx.fill();

      angle += span;
    });

    // Clean center typography
    const isLight = document.documentElement.classList.contains("light");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 10px 'Inter', sans-serif`;
    ctx.fillStyle = isLight ? "#0F172A" : "#F1F5F9";
    ctx.fillText("RISK", cx, cy - 5);
    ctx.font = `500 8px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isLight ? "#64748B" : "#94A3B8";
    ctx.fillText("DISTRIB", cx, cy + 6);
  }, [segments]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

// Clean Horizontal Bar
function CrispProgressBar({ label, value, max, color, sublabel }: { label: string; value: number; max: number; color: string; sublabel?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10.5px]">
        <span className="text-[var(--text-primary)] font-medium">{label}</span>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="font-semibold text-[var(--text-primary)]">{value}</span>
          {sublabel && <span className="text-[9px] text-[var(--text-muted)] font-normal">{sublabel}</span>}
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-700/30 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(100, (value / max) * 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

const riskSegments = [
  { label: "Sovereign & Territorial", value: 36, color: "#EF4444" },
  { label: "Trade & Supply Bottlenecks", value: 28, color: "#F59E0B" },
  { label: "Energy & Infrastructure", value: 22, color: "#38BDF8" },
  { label: "Ecological / Climate", value: 14, color: "#10B981" },
];

const chokepoints = [
  { name: "Strait of Hormuz", status: "ELEVATED VIGILANCE", level: "amber", flow: "21.0M bpd (crude)" },
  { name: "Bab-el-Mandeb / Red Sea", status: "ACTIVE DISRUPTIONS", level: "red", flow: "Rerouting around Cape" },
  { name: "Strait of Malacca", status: "NORMAL TRANSIT", level: "emerald", flow: "98K vessels / yr" },
  { name: "Panama Canal", status: "REDUCED CAPACITY", level: "amber", flow: "Draft restriction lifted" },
];

export default function BottomAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-full">

      {/* Geopolitical Risk Distribution */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3 flex flex-col shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Risk Category Breakdown
            </h2>
          </div>
          <span className="text-[9px] font-mono text-[var(--text-muted)]">GLOBAL COMPOSITE</span>
        </div>

        <div className="flex items-center gap-4 flex-1">
          <div className="w-20 h-20 shrink-0">
            <CrispDonutChart segments={riskSegments} />
          </div>
          <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
            {riskSegments.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-[var(--text-secondary)] truncate">{s.label}</span>
                </div>
                <span className="font-mono font-semibold text-[var(--text-primary)] shrink-0 ml-2">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Theater Deployments */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3 flex flex-col justify-between shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Active Security Theaters
            </h2>
          </div>
          <span className="text-[9px] font-mono text-[var(--text-muted)]">COALITIONS</span>
        </div>

        <div className="space-y-2 flex-1 justify-center flex flex-col">
          <CrispProgressBar label="Maritime Task Forces" value={42} max={60} color="#38BDF8" sublabel="fleets" />
          <CrispProgressBar label="Forward Air Patrol Wings" value={68} max={100} color="#818CF8" sublabel="squadrons" />
          <CrispProgressBar label="Multinational Peacekeeping" value={87} max={120} color="#34D399" sublabel="k personnel" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-[10px]">
          <div>
            <div className="font-mono font-semibold text-slate-100">14</div>
            <div className="text-[8.5px] text-slate-400">UN Missions</div>
          </div>
          <div>
            <div className="font-mono font-semibold text-sky-400">9 Carrier Grps</div>
            <div className="text-[8.5px] text-slate-400">Deployed</div>
          </div>
          <div>
            <div className="font-mono font-semibold text-emerald-400">DEFCON 4</div>
            <div className="text-[8.5px] text-slate-400">General State</div>
          </div>
        </div>
      </div>

      {/* Maritime Chokepoint & Route Vulnerability */}
      <div className="bg-[#0D1424] border border-slate-800 rounded-lg p-3 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Critical Maritime Corridors
            </h2>
          </div>
          <span className="text-[9px] font-mono text-slate-400">AIS SURVEILLANCE</span>
        </div>

        <div className="space-y-1.5 flex-1 justify-center flex flex-col">
          {chokepoints.map((cp) => {
            const statusColor = cp.level === "red" 
              ? "text-rose-400 bg-rose-500/10 border-rose-500/20" 
              : cp.level === "amber" 
              ? "text-amber-400 bg-amber-500/10 border-amber-500/20" 
              : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";

            return (
              <div key={cp.name} className="flex items-center justify-between p-1.5 rounded bg-slate-900/50 border border-slate-800/80">
                <div className="min-w-0 pr-2">
                  <div className="text-[11px] font-medium text-slate-200 truncate">{cp.name}</div>
                  <div className="text-[8.5px] text-slate-400">{cp.flow}</div>
                </div>
                <span className={`text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded border shrink-0 ${statusColor}`}>
                  {cp.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
