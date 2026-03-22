"use client";
import { useEffect, useRef } from "react";

// Donut Chart
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) / 2 - 4;
    const r = R * 0.55;
    const total = segments.reduce((s, x) => s + x.value, 0);
    let angle = -Math.PI / 2;

    ctx.clearRect(0, 0, W, H);
    segments.forEach((seg) => {
      const span = (seg.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, angle, angle + span);
      ctx.closePath();
      ctx.fillStyle = seg.color + "CC";
      ctx.shadowColor = seg.color;
      ctx.shadowBlur = 6;
      ctx.fill();

      // Inner donut hole
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#0B0F19";
      ctx.shadowBlur = 0;
      ctx.fill();

      angle += span;
    });

    // Center text
    ctx.fillStyle = "#E2E8F0";
    ctx.font = `bold 10px 'Orbitron', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#00D4FF";
    ctx.fillText("RISK", cx, cy - 4);
    ctx.font = `7px 'Inter', sans-serif`;
    ctx.fillStyle = "#94A3B8";
    ctx.fillText("INDEX", cx, cy + 6);
  }, [segments]);

  return <canvas ref={canvasRef} width={100} height={100} className="w-full h-full" />;
}

// Horizontal bar
function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] text-text-secondary w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${(value / max) * 100}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>
      <span className="text-[8px] font-bold w-6 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

// Line chart (Canvas)
function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data), min = Math.min(...data);
    const rng = max - min || 1;
    const pad = 4;
    const xStep = (W - pad * 2) / (data.length - 1);
    const pts = data.map((v, i) => ({ x: pad + i * xStep, y: H - pad - ((v - min) / rng) * (H - pad * 2) }));
    const hex = color.replace("#", "");
    const rv = parseInt(hex.substring(0, 2), 16), gv = parseInt(hex.substring(2, 4), 16), bv = parseInt(hex.substring(4, 6), 16);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `rgba(${rv},${gv},${bv},0.3)`);
    grad.addColorStop(1, `rgba(${rv},${gv},${bv},0)`);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H);
    pts.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    pts.forEach(({ x, y }, i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.stroke();
  }, [data, color]);
  return <canvas ref={ref} width={200} height={50} className="w-full h-full" />;
}

const riskSegments = [
  { label: "Conflict", value: 35, color: "#FF2244" },
  { label: "Economy", value: 28, color: "#FF8C00" },
  { label: "Political Instability", value: 22, color: "#FFD700" },
  { label: "Climate", value: 15, color: "#00FF88" },
];

const deployments = [
  { label: "Combat Operations", value: 43, max: 100, color: "#FF2244" },
  { label: "Peacekeeping Ops", value: 57, max: 100, color: "#00D4FF" },
  { label: "Reserve Mobilized", value: 65, max: 100, color: "#FF8C00" },
  { label: "Naval Operations", value: 38, max: 100, color: "#8B5CF6" },
];

const energyData = [180, 165, 190, 210, 195, 220, 240, 225, 210, 235, 250, 245];
const tradeData = [280, 260, 290, 310, 300, 330, 320, 340, 360, 345, 370, 380];

export default function BottomAnalytics() {
  return (
    <div className="bottom-analytics h-full">
      {/* Geopolitical Risk Assessment */}
      <div className="glass-panel p-2 flex flex-col">
        <div className="section-header">
          <span style={{ color: "#FF2244" }}>◉</span> Geopolitical Risk Assessment
        </div>
        <div className="flex gap-3 flex-1">
          <div style={{ width: "70px", height: "70px", flexShrink: 0 }}>
            <DonutChart segments={riskSegments} />
          </div>
          <div className="flex flex-col justify-center gap-1.5 flex-1">
            {riskSegments.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color, boxShadow: `0 0 4px ${s.color}` }} />
                <span className="text-[8px] text-text-secondary flex-1">{s.label}</span>
                <span className="text-[9px] font-bold" style={{ color: s.color }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Military Deployments */}
      <div className="glass-panel p-2 flex flex-col">
        <div className="section-header">
          <span style={{ color: "#FF8C00" }}>⚔</span> Military Deployments (Ongoing Ops)
        </div>
        <div className="flex flex-col gap-2 flex-1 justify-center">
          {deployments.map((d) => (
            <HBar key={d.label} {...d} />
          ))}
        </div>
        <div className="flex gap-3 mt-2 pt-2 border-t border-white/5">
          {[
            { label: "Total Personnel", val: "2.4M", color: "#FF2244" },
            { label: "Active Theaters", val: "12", color: "#FF8C00" },
            { label: "Naval Groups", val: "8", color: "#8B5CF6" },
          ].map((s) => (
            <div key={s.label} className="flex-1 text-center">
              <div className="font-orbitron text-[11px] font-bold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[6.5px] text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Resource Impacts */}
      <div className="glass-panel p-2 flex flex-col">
        <div className="section-header">
          <span style={{ color: "#00FFCC" }}>📊</span> Global Resource Impacts
        </div>
        <div className="flex gap-2 flex-1">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[7px] text-text-secondary">Energy Prices</span>
              <span className="text-[8px] font-bold" style={{ color: "#FF8C00" }}>+14.2%</span>
            </div>
            <div className="flex-1 min-h-0" style={{ height: "45px" }}>
              <MiniLineChart data={energyData} color="#FF8C00" />
            </div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[7px] text-text-secondary">Trade Routes</span>
              <span className="text-[8px] font-bold" style={{ color: "#00FFCC" }}>Suez: CRITICAL</span>
            </div>
            <div className="flex-1 min-h-0" style={{ height: "45px" }}>
              <MiniLineChart data={tradeData} color="#00FFCC" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
          {[
            { label: "Oil ($/bbl)", val: "$94.6", color: "#FF8C00", delta: "+2.4" },
            { label: "Gas ($/MMBtu)", val: "$8.9", color: "#FFD700", delta: "+0.7" },
            { label: "Gold ($/oz)", val: "$2,380", color: "#00FFCC", delta: "+15" },
          ].map((r) => (
            <div key={r.label} className="flex-1 glass-panel p-1 text-center rounded">
              <div className="text-[8px] font-bold" style={{ color: r.color }}>{r.val}</div>
              <div className="text-[6.5px] text-text-muted">{r.label}</div>
              <div className="text-[6.5px] text-neon-green">▲{r.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
