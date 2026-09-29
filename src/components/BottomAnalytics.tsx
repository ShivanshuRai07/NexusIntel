"use client";
import { useEffect, useRef } from "react";

// Donut Chart with editorial canvas styling
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2,
      cy = H / 2;
    const R = Math.min(W, H) / 2 - 4;
    const r = R * 0.58;
    const total = segments.reduce((s, x) => s + x.value, 0);
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

      // Inner donut hole (warm white cream)
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "#FAF7F0";
      ctx.fill();

      angle += span;
    });

    // Center text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 9px 'Orbitron', monospace";
    ctx.fillStyle = "#C41E3A";
    ctx.fillText("RISK", cx, cy - 5);
    ctx.font = "600 7px 'Inter', sans-serif";
    ctx.fillStyle = "#78716C";
    ctx.fillText("INDEX", cx, cy + 6);
  }, [segments]);

  return <canvas ref={canvasRef} width={100} height={100} className="w-full h-full" />;
}

// Horizontal bar with editorial styling
function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[#44403C] font-medium w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#E2DBD0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${(value / max) * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="text-[10px] font-orbitron font-bold w-7 text-right" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

// Line chart (Canvas) with clean gradient
function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = c.width,
      H = c.height;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data),
      min = Math.min(...data);
    const rng = max - min || 1;
    const pad = 4;
    const xStep = (W - pad * 2) / (data.length - 1);
    const pts = data.map((v, i) => ({
      x: pad + i * xStep,
      y: H - pad - ((v - min) / rng) * (H - pad * 2),
    }));

    const hex = color.replace("#", "");
    const rv = parseInt(hex.substring(0, 2), 16) || 0;
    const gv = parseInt(hex.substring(2, 4), 16) || 0;
    const bv = parseInt(hex.substring(4, 6), 16) || 0;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `rgba(${rv},${gv},${bv},0.25)`);
    grad.addColorStop(1, `rgba(${rv},${gv},${bv},0.01)`);

    ctx.beginPath();
    ctx.moveTo(pts[0].x, H);
    pts.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    pts.forEach(({ x, y }, i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.75;
    ctx.stroke();
  }, [data, color]);

  return <canvas ref={ref} width={200} height={50} className="w-full h-full" />;
}

const riskSegments = [
  { label: "Conflict Theater", value: 35, color: "#C41E3A" },
  { label: "Energy Volatility", value: 28, color: "#B8600B" },
  { label: "Political Instability", value: 22, color: "#B8860B" },
  { label: "Climate Severity", value: 15, color: "#1A6B5A" },
];

const deployments = [
  { label: "Combat Operations", value: 43, max: 100, color: "#C41E3A" },
  { label: "Peacekeeping Tasks", value: 57, max: 100, color: "#1D4E89" },
  { label: "Reserves Mobilized", value: 65, max: 100, color: "#B8600B" },
  { label: "Carrier Strike Groups", value: 38, max: 100, color: "#5B2D8E" },
];

const energyData = [180, 165, 190, 210, 195, 220, 240, 225, 210, 235, 250, 245];
const tradeData = [280, 260, 290, 310, 300, 330, 320, 340, 360, 345, 370, 380];

export default function BottomAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
      {/* Geopolitical Risk Assessment */}
      <div className="panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#1C1917]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C41E3A]" />
            <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917]">
              Geopolitical Risk Assessment
            </h3>
          </div>
          <span className="text-[9px] font-bold text-[#78716C] uppercase">Q3 SCORE</span>
        </div>

        <div className="flex gap-4 items-center flex-1 py-1">
          <div style={{ width: "88px", height: "88px", flexShrink: 0 }}>
            <DonutChart segments={riskSegments} />
          </div>
          <div className="flex flex-col justify-center gap-1.5 flex-1">
            {riskSegments.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-[#44403C] flex-1">{s.label}</span>
                <span className="text-[10px] font-orbitron font-bold" style={{ color: s.color }}>
                  {s.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Military Deployments */}
      <div className="panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#1C1917]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#B8600B]">⚔</span>
            <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917]">
              Active Strategic Deployments
            </h3>
          </div>
          <span className="text-[9px] font-bold text-[#78716C] uppercase">READINESS</span>
        </div>

        <div className="flex flex-col gap-2 flex-1 justify-center py-1">
          {deployments.map((d) => (
            <HBar key={d.label} {...d} />
          ))}
        </div>

        <div className="flex gap-2 mt-2 pt-2 border-t border-[#E2DBD0]">
          {[
            { label: "Personnel", val: "2.4M", color: "#C41E3A" },
            { label: "Theaters", val: "12", color: "#B8600B" },
            { label: "Naval Groups", val: "8", color: "#5B2D8E" },
          ].map((s) => (
            <div key={s.label} className="flex-1 text-center bg-[#F3EFE6] py-1 rounded-sm border border-[#E2DBD0]">
              <div className="font-orbitron text-xs font-bold" style={{ color: s.color }}>
                {s.val}
              </div>
              <div className="text-[8px] text-[#78716C] uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Resource Impacts */}
      <div className="panel p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#1C1917]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1A6B5A]">📊</span>
            <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917]">
              Resource & Trade Flows
            </h3>
          </div>
          <span className="text-[9px] font-bold text-[#78716C] uppercase">DAILY DELTA</span>
        </div>

        <div className="flex gap-3 flex-1 py-1">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-[#78716C] uppercase">Energy Basket</span>
              <span className="text-[10px] font-orbitron font-bold text-[#B8600B]">+14.2%</span>
            </div>
            <div className="flex-1 min-h-[48px]">
              <MiniLineChart data={energyData} color="#B8600B" />
            </div>
          </div>
          <div className="w-px bg-[#E2DBD0]" />
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-[#78716C] uppercase">Suez Chokepoint</span>
              <span className="text-[10px] font-orbitron font-bold text-[#C41E3A]">HIGH RISK</span>
            </div>
            <div className="flex-1 min-h-[48px]">
              <MiniLineChart data={tradeData} color="#1A6B5A" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-2 pt-2 border-t border-[#E2DBD0]">
          {[
            { label: "Brent Crude", val: "$94.6", color: "#B8600B", delta: "+2.4" },
            { label: "Henry Hub Gas", val: "$8.9", color: "#B8860B", delta: "+0.7" },
            { label: "Gold (oz)", val: "$2,380", color: "#1A6B5A", delta: "+15" },
          ].map((r) => (
            <div key={r.label} className="flex-1 bg-[#F3EFE6] p-1.5 text-center rounded-sm border border-[#E2DBD0]">
              <div className="font-orbitron text-[11px] font-bold" style={{ color: r.color }}>
                {r.val}
              </div>
              <div className="text-[7.5px] text-[#78716C] uppercase tracking-wider font-semibold">{r.label}</div>
              <div className="text-[8px] font-orbitron text-[#1A6B5A] font-bold">▲{r.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
