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
    data.push(Number(current.toFixed(2)));
    current += (Math.random() - 0.5) * volatility + trend;
  }
  return data;
};

export default function MetalsIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [goldData, setGoldData] = useState<number[]>([]);
  const [silverData, setSilverData] = useState<number[]>([]);
  const [rareEarthDemand, setRareEarthDemand] = useState<{label: string, value: number}[]>([]);
  const [miningOutput, setMiningOutput] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setGoldData(generateLineData(2050, 12, 40, 5));
      setSilverData(generateLineData(1950, 12, 60, 2)); // Shifted for viz scaling
      
      const elements = ["LITHIUM", "COBALT", "NEODYMIUM", "PALLADIUM", "PLATINUM", "URANIUM"];
      setRareEarthDemand(elements.map(e => ({
        label: e,
        value: Number((Math.random() * 50 + 50).toFixed(1)) // Metric tons index
      })));

      setMiningOutput([
        { metal: "Gold", region: "South Africa", status: "STABLE", change: "+1.2%" },
        { metal: "Copper", region: "Chile", status: "DECLINED", change: "-3.5%" },
        { metal: "Lithium", region: "Australia", status: "SURGING", change: "+8.4%" },
        { metal: "Cobalt", region: "DR Congo", status: "DISRUPTED", change: "-12.0%" },
        { metal: "Silver", region: "Mexico", status: "STABLE", change: "+0.5%" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ background: "#0B0F19" }}>
      <Header />
      <div className="flex-1 overflow-y-auto p-6 text-white thin-scroll">
        <h1 className="text-3xl font-orbitron font-bold text-[#FFD700] mb-2">PRECIOUS METALS INTELLIGENCE</h1>
        <p className="text-text-secondary mb-8">Real-time tracking of Gold, Silver, Copper, and rare earth metals global markets.</p>
        
        {loading ? (
          <div className="flex items-center justify-center p-20">
             <span className="text-[#FFD700] font-bold tracking-widest uppercase animate-pulse font-orbitron text-xl">
               Initializing Commodity Market Sensors...
             </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Trends */}
            <div className="xl:col-span-2 glass-panel p-6 flex flex-col justify-between" style={{ minHeight: '350px' }}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-[#FFD700]">PRECIOUS METALS TRENDS (USD/oz)</h2>
                  <div className="flex gap-4 mt-2 text-xs font-orbitron text-text-muted">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#FFD700]"></span> GOLD</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#C0C0C0]"></span> SILVER COMPOSITE</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-orbitron text-[#FFD700]">${goldData[goldData.length-1]}</div>
                  <div className="text-xs text-emerald-400 mt-1 uppercase">BULLISH SENTIMENT</div>
                </div>
              </div>
              <div className="flex-1 w-full bg-black/20 rounded-lg p-4 border border-white/5 relative">
                <LineChart data={goldData} color="#FFD700" secondaryData={silverData} secondaryColor="#C0C0C0" height={220} />
              </div>
            </div>

            {/* Mining Output */}
            <div className="glass-panel p-6 flex flex-col" style={{ minHeight: '350px' }}>
               <div className="mb-6">
                 <h2 className="text-xl font-orbitron font-bold text-white">GLOBAL MINING OUTPUT</h2>
                 <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Supply Chain Monitoring</p>
               </div>
               <div className="flex-1 flex flex-col gap-3">
                 {miningOutput.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                     <div>
                       <div className="font-bold text-sm tracking-wide">{item.metal}</div>
                       <div className="text-[10px] text-text-muted uppercase tracking-widest">{item.region}</div>
                     </div>
                     <div className="text-right">
                       <div className={`text-xs font-bold ${item.status === 'SURGING' ? 'text-neon-cyan' : item.status === 'DISRUPTED' ? 'text-red-400' : item.status === 'DECLINED' ? 'text-orange-400' : 'text-text-secondary'}`}>
                         {item.status}
                       </div>
                       <div className="text-[10px] text-white/70">{item.change}</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Rare Earth Demand */}
            <div className="xl:col-span-3 glass-panel p-6 flex flex-col" style={{ minHeight: '350px' }}>
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-xl font-orbitron font-bold text-neon-cyan">CRITICAL MINERALS DEMAND INDEX</h2>
                   <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Tech & EV Manufacturing Requirement Projection</p>
                 </div>
              </div>
              <div className="flex-1 w-full bg-black/20 rounded-lg p-6 border border-white/5 flex items-end">
                <BarChart data={rareEarthDemand} color={(v) => v > 80 ? "#FF4444" : v > 60 ? "#FFD700" : "#00FFFF"} height={200} />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
