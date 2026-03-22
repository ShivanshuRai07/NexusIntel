"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";

// Reusable Chart Components
function LineChart({
  data,
  color,
  secondaryData,
  secondaryColor,
  height = 150
}: {
  data: number[];
  color: string;
  secondaryData?: number[];
  secondaryColor?: string;
  height?: number;
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
    const pad = 10;

    const drawLine = (pts: number[], c: string) => {
      const xStep = (W - pad * 2) / (pts.length === 1 ? 1 : pts.length - 1);
      const coords = pts.map((v, i) => ({
        x: pad + i * xStep,
        y: H - pad - ((v - min) / range) * (H - pad * 2),
      }));

      // Area gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      const hex = c.replace("#", "");
      let r = 255, g = 255, b = 255;
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
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
      ctx.lineWidth = 2;
      ctx.shadowColor = c;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dots
      coords.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
        ctx.strokeStyle = "#0B0F19";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    if (secondaryData && secondaryColor) drawLine(secondaryData, secondaryColor);
    drawLine(data, color);
  }, [data, color, secondaryData, secondaryColor, height]);

  return <canvas ref={canvasRef} width={600} height={height} className="w-full h-full object-contain" />;
}

function BarChart({ data, color, height = 150 }: { data: { label: string; value: number }[]; color: string | ((v: number) => string); height?: number }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-1 w-full" style={{ height: `${height}px` }}>
      {data.map((d, i) => {
        const barColor = typeof color === "function" ? color(d.value) : color;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-1 h-full justify-end">
            <span className="text-xs font-bold font-orbitron" style={{ color: barColor }}>{d.value}</span>
            <div
              className="w-full rounded-t transition-all duration-1000"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: `linear-gradient(to top, ${barColor}44, ${barColor})`,
                boxShadow: `0 -2px 10px ${barColor}66`,
                minHeight: "4px",
              }}
            />
            <span className="text-[10px] text-text-muted text-center leading-none mt-1">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const generateLineData = (start: number, count: number, volatility: number, trend = 0) => {
  let current = start;
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(Number(current.toFixed(1)));
    current += (Math.random() - 0.5) * volatility + trend;
  }
  return data;
};

export default function AgricultureIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [wheatYield, setWheatYield] = useState<number[]>([]);
  const [cornYield, setCornYield] = useState<number[]>([]);
  const [droughtSeverity, setDroughtSeverity] = useState<{label: string, value: number}[]>([]);
  const [supplyChainTracker, setSupplyChainTracker] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setWheatYield(generateLineData(780, 12, 10, -2)); // Million tons globally
      setCornYield(generateLineData(1200, 12, 15, 1));
      
      const regions = ["US MIDWEST", "UKRAINE", "BRAZIL", "INDIA", "CHINA", "AUSTRALIA"];
      setDroughtSeverity(regions.map(r => ({
        label: r,
        value: Number((Math.random() * 8 + 2).toFixed(1)) // Severity 1-10
      })));

      setSupplyChainTracker([
        { item: "Fertilizer Exports", region: "Black Sea", status: "RESTRICTED", level: "HIGH" },
        { item: "Soybean Shipments", region: "South America", status: "NOMINAL", level: "LOW" },
        { item: "Rice Export Bans", region: "South Asia", status: "ACTIVE", level: "CRITICAL" },
        { item: "Irrigation Systems", region: "Mediterranean", status: "STRESSED", level: "HIGH" },
        { item: "Grain Transit", region: "Panama Canal", status: "DELAYED", level: "MED" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ background: "#0B0F19" }}>
      <Header />
      <div className="flex-1 overflow-y-auto p-6 text-white thin-scroll">
        <h1 className="text-3xl font-orbitron font-bold text-neon-green mb-2">AGRICULTURE & FOOD SECURITY</h1>
        <p className="text-text-secondary mb-8">Crop production forecasts, drought alerts, fertilizer supply chains, and global food price monitoring.</p>
        
        {loading ? (
          <div className="flex items-center justify-center p-20">
             <span className="text-neon-green font-bold tracking-widest uppercase animate-pulse font-orbitron text-xl">
               Computing Crop Yield Forecasts...
             </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Yield Forecast */}
            <div className="xl:col-span-2 glass-panel p-6 flex flex-col justify-between" style={{ minHeight: '350px' }}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-neon-green">GLOBAL CROP YIELD FORECAST (MMT)</h2>
                  <div className="flex gap-4 mt-2 text-xs font-orbitron text-text-muted">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-neon-green"></span> CORN</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#FFD700]"></span> WHEAT</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-orbitron text-neon-green">{cornYield[cornYield.length-1]} MMT</div>
                  <div className="text-xs text-orange-400 mt-1 uppercase">YIELD PRESSURE DETECTED</div>
                </div>
              </div>
              <div className="flex-1 w-full bg-black/20 rounded-lg p-4 border border-white/5 relative">
                <LineChart data={cornYield} color="#39FF14" secondaryData={wheatYield} secondaryColor="#FFD700" height={220} />
              </div>
            </div>

            {/* Supply Chain */}
            <div className="glass-panel p-6 flex flex-col" style={{ minHeight: '350px' }}>
               <div className="mb-6">
                 <h2 className="text-xl font-orbitron font-bold text-white">FOOD SUPPLY CHAIN</h2>
                 <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Logistics & Export Restrictions</p>
               </div>
               <div className="flex-1 flex flex-col gap-3">
                 {supplyChainTracker.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                     <div>
                       <div className="font-bold text-sm tracking-wide text-white">{item.item}</div>
                       <div className="text-[10px] text-text-muted uppercase tracking-widest">{item.region}</div>
                     </div>
                     <div className="text-right">
                       <span className={`px-2 py-1 text-[9px] rounded font-bold ${item.level === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : item.level === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : item.level === 'MED' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                         {item.status}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Drought Severity */}
            <div className="xl:col-span-3 glass-panel p-6 flex flex-col" style={{ minHeight: '350px' }}>
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-xl font-orbitron font-bold text-[#FFD700]">GLOBAL DROUGHT SEVERITY INDEX</h2>
                   <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Aridity Impact on Major Agricultural Basins</p>
                 </div>
              </div>
              <div className="flex-1 w-full bg-black/20 rounded-lg p-6 border border-white/5 flex items-end">
                <BarChart data={droughtSeverity} color={(v) => v > 7 ? "#FF4444" : v > 4 ? "#FF8C00" : "#39FF14"} height={200} />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
