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

    drawLine(data, color);
    if (secondaryData && secondaryColor) drawLine(secondaryData, secondaryColor);
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

// Mock Data Generators for Dashboard
const generateLineData = (start: number, count: number, volatility: number) => {
  let current = start;
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(Number(current.toFixed(2)));
    current += (Math.random() - 0.5) * volatility;
  }
  return data;
};

// Economic Page Component
export default function EconomicIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [inflationData, setInflationData] = useState<number[]>([]);
  const [supplyChainData, setSupplyChainData] = useState<{label: string, value: number}[]>([]);
  const [currencyData, setCurrencyData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API Fetch
    setTimeout(() => {
      setInflationData(generateLineData(3.5, 12, 0.4));
      
      const scData = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map(month => ({
        label: month,
        value: Number((Math.random() * 50 + 50).toFixed(1)) // Index 50-100
      }));
      setSupplyChainData(scData);

      setCurrencyData([
        { pair: "EUR/USD", rate: 1.0854, change: "+0.12%" },
        { pair: "GBP/USD", rate: 1.2643, change: "-0.05%" },
        { pair: "USD/JPY", rate: 150.21, change: "+0.34%" },
        { pair: "USD/CNY", rate: 7.1982, change: "+0.01%" },
        { pair: "USD/INR", rate: 82.89, change: "-0.10%" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ background: "#0B0F19" }}>
      <Header />
      <div className="flex-1 overflow-y-auto p-6 text-white thin-scroll">
        <h1 className="text-3xl font-orbitron font-bold text-[#FFD700] mb-2">GLOBAL ECONOMIC INTELLIGENCE</h1>
        <p className="text-text-secondary mb-8">Inflation monitoring, global trade flows, commodity prices, and supply chain disruptions.</p>
        
        {loading ? (
          <div className="flex items-center justify-center p-20">
             <span className="text-neon-cyan font-bold tracking-widest uppercase animate-pulse font-orbitron text-xl">
               Retrieving Global Intelligence Matrices...
             </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Global Inflation YoY */}
            <div className="xl:col-span-2 glass-panel p-6 flex flex-col justify-between" style={{ minHeight: '350px' }}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-[#FF4444]">GLOBAL INFLATION INDEX (YoY)</h2>
                  <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">World Bank / FRED Aggregated Data</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-orbitron text-[#FF4444]">{inflationData[inflationData.length-1]}%</div>
                  <div className="text-xs text-emerald-400 mt-1 uppercase">Target: 2.0%</div>
                </div>
              </div>
              <div className="flex-1 w-full bg-black/20 rounded-lg p-4 border border-white/5 relative">
                <LineChart data={inflationData} color="#FF4444" height={220} />
                <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[10px] text-text-muted">
                  <span>12 Months Ago</span>
                  <span>Present</span>
                </div>
              </div>
            </div>

            {/* Currency Matrices */}
            <div className="glass-panel p-6 flex flex-col" style={{ minHeight: '350px' }}>
               <div className="mb-6">
                 <h2 className="text-xl font-orbitron font-bold text-neon-cyan">CURRENCY MATRICES</h2>
                 <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Live Forex Monitoring</p>
               </div>
               <div className="flex-1 flex flex-col gap-3">
                 {currencyData.map((currency, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                     <span className="font-bold font-orbitron text-sm">{currency.pair}</span>
                     <div className="flex space-x-4 items-center">
                       <span className="font-mono text-gray-300">{currency.rate}</span>
                       <span className={`text-xs font-bold ${currency.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                         {currency.change}
                       </span>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-4 text-[10px] text-text-muted text-center uppercase tracking-widest">
                 Updating in real-time...
               </div>
            </div>

            {/* Supply Chain Disruption Index */}
            <div className="xl:col-span-3 glass-panel p-6 flex flex-col" style={{ minHeight: '350px' }}>
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-xl font-orbitron font-bold text-[#FF8C00]">SUPPLY CHAIN DISRUPTION INDEX</h2>
                   <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Logistics & Trade Flow Pressure</p>
                 </div>
                 <div className="px-3 py-1 rounded bg-[#FF8C00]/20 border border-[#FF8C00]/50 text-[#FF8C00] text-sm font-bold font-orbitron">
                   ELEVATED RISK
                 </div>
              </div>
              <div className="flex-1 w-full bg-black/20 rounded-lg p-6 border border-white/5 flex items-end">
                <BarChart data={supplyChainData} color={(v) => v > 80 ? "#FF4444" : v > 60 ? "#FF8C00" : "#FFD700"} height={200} />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
