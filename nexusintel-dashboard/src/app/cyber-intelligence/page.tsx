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
    data.push(Math.round(current));
    current += (Math.random() - 0.5) * volatility + trend;
  }
  return data;
};

export default function CyberIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [globalIntrusions, setGlobalIntrusions] = useState<number[]>([]);
  const [botnetActivity, setBotnetActivity] = useState<number[]>([]);
  const [threatVectors, setThreatVectors] = useState<{label: string, value: number}[]>([]);
  const [cisaAlerts, setCisaAlerts] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setGlobalIntrusions(generateLineData(8500, 12, 1200, 200)); // Incidents per hour
      setBotnetActivity(generateLineData(4200, 12, 800, 100)); // Active commands/hr
      
      const vectors = ["PHISHING", "RANSOMWARE", "ZERO-DAY", "DDoS", "INSIDER", "SUPPLY CHAIN"];
      setThreatVectors(vectors.map(v => ({
        label: v,
        value: Number((Math.random() * 80 + 20).toFixed(0)) // Threat index
      })));

      setCisaAlerts([
        { id: "AA24-061A", title: "Nation-State Actors Exploit Ivanti Vulnerabilities", actor: "APT29", severity: "CRITICAL" },
        { id: "AA24-057A", title: "LockBit Ransomware Affiliates Targeted", actor: "FINANCIAL", severity: "HIGH" },
        { id: "CU-00192", title: "Critical Infrastructure DDoS Attacks", actor: "HACTIVIST", severity: "HIGH" },
        { id: "VU-98124", title: "Zero-Day in Enterprise VPN Software", actor: "UNKNOWN", severity: "CRITICAL" },
        { id: "AA24-012C", title: "Healthcare Sector Ransomware Campaign", actor: "ALPHV", severity: "HIGH" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden" style={{ background: "#0B0F19" }}>
      <Header />
      <div className="flex-1 overflow-y-auto p-6 text-white thin-scroll">
        <h1 className="text-3xl font-orbitron font-bold text-[#FF1493] mb-2">CYBER SECURITY INTELLIGENCE</h1>
        <p className="text-text-secondary mb-8">Global cyber attack alerts, ransomware campaigns, vulnerability disclosures, and nation-state cyber activity.</p>
        
        {loading ? (
          <div className="flex items-center justify-center p-20">
             <span className="text-[#FF1493] font-bold tracking-widest uppercase animate-pulse font-orbitron text-xl">
               Monitoring Global Network Intrusions...
             </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Global Intrusions */}
            <div className="xl:col-span-2 glass-panel p-6 flex flex-col justify-between" style={{ minHeight: '350px' }}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-orbitron font-bold text-[#FF1493]">GLOBAL NETWORK INTRUSIONS / HR</h2>
                  <div className="flex gap-4 mt-2 text-xs font-orbitron text-text-muted">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#FF1493]"></span> ALL INTRUSIONS</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#8A2BE2]"></span> BOTNET ACTIVITY</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-orbitron text-[#FF1493]">{globalIntrusions[globalIntrusions.length-1].toLocaleString()}</div>
                  <div className="text-xs text-red-500 mt-1 uppercase">ELEVATED THREAT LEVEL</div>
                </div>
              </div>
              <div className="flex-1 w-full bg-black/20 rounded-lg p-4 border border-white/5 relative">
                <LineChart data={globalIntrusions} color="#FF1493" secondaryData={botnetActivity} secondaryColor="#8A2BE2" height={220} />
              </div>
            </div>

            {/* CISA Alerts */}
            <div className="glass-panel p-6 flex flex-col" style={{ minHeight: '350px' }}>
               <div className="mb-6">
                 <h2 className="text-xl font-orbitron font-bold text-white">ACTIVE THREAT ALERTS</h2>
                 <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">CISA & Global Intel Agencies</p>
               </div>
               <div className="flex-1 flex flex-col gap-3">
                 {cisaAlerts.map((alert, idx) => (
                   <div key={idx} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className={`px-1.5 py-0.5 text-[8px] rounded font-bold ${alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'}`}>
                           {alert.severity}
                         </span>
                         <span className="font-mono text-[10px] text-text-muted">{alert.id}</span>
                       </div>
                       <div className="text-xs text-white max-w-[180px] truncate font-bold">{alert.title}</div>
                     </div>
                     <div className="text-right">
                       <span className="text-[10px] bg-[#FF1493]/10 text-[#FF1493] px-1.5 py-0.5 rounded uppercase tracking-widest">{alert.actor}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Threat Vectors */}
            <div className="xl:col-span-3 glass-panel p-6 flex flex-col" style={{ minHeight: '350px' }}>
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-xl font-orbitron font-bold text-[#8A2BE2]">DOMINANT THREAT VECTORS</h2>
                   <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Relative Frequency & Efficacy Index</p>
                 </div>
              </div>
              <div className="flex-1 w-full bg-black/20 rounded-lg p-6 border border-white/5 flex items-end">
                <BarChart data={threatVectors} color={(v) => v > 75 ? "#FF1493" : v > 50 ? "#8A2BE2" : "#4B0082"} height={200} />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
