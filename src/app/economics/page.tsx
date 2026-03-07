"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

export default function EconomicsPage() {
  const [tickerItems] = useState([
    "S&P 500: 5,124.50 (+0.4%)",
    "OIL (BRENT): $84.20 (-1.2%)",
    "GOLD: $2,165.30 (+0.8%)",
    "USD/CNY: 7.21 (+0.05%)",
    "EUR/USD: 1.09 (-0.12%)",
    "BITCOIN: $68,450 (+2.5%)",
  ]);

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <div className="flex justify-between items-center">
            <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase">Global Economic Intelligence</h1>
            <div className="flex gap-4">
                <div className="text-right">
                    <div className="text-[10px] text-text-secondary uppercase">Global GDP Trend</div>
                    <div className="text-lg font-bold text-neon-green">+3.2%</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-text-secondary uppercase">Inflation Avg</div>
                    <div className="text-lg font-bold text-neon-orange">4.1%</div>
                </div>
            </div>
        </div>

        {/* Scrolling Ticker */}
        <div className="glass-panel py-2 overflow-hidden bg-black/40">
           <motion.div 
             initial={{ x: "100%" }}
             animate={{ x: "-100%" }}
             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             className="flex gap-12 whitespace-nowrap"
           >
             {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="text-[10px] font-orbitron font-bold text-neon-blue tracking-tighter">
                    {item}
                </span>
             ))}
           </motion.div>
        </div>

        <div className="flex-1 glass-panel relative overflow-hidden flex items-center justify-center p-8">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="relative w-full h-full max-w-4xl max-h-[600px]">
                {/* Simplified World Map SVG with Trade Routes */}
                <svg viewBox="0 0 800 400" className="w-full h-full opacity-60">
                    {/* Continents Placeholders */}
                    <rect x="100" y="100" width="150" height="200" rx="10" fill="white" opacity="0.1" />
                    <rect x="350" y="50" width="250" height="150" rx="10" fill="white" opacity="0.1" />
                    <rect x="600" y="250" width="100" height="100" rx="10" fill="white" opacity="0.1" />
                    
                    {/* Trade Routes (Bezier Curves) */}
                    {[
                        { d: "M200,200 Q400,100 500,150", color: "#00D4FF" },
                        { d: "M150,250 Q300,300 450,150", color: "#00FF88" },
                        { d: "M550,150 Q650,200 650,300", color: "#FFD700" },
                        { d: "M400,70 Q500,50 550,120", color: "#FF8C00" },
                        { d: "M180,150 Q100,200 150,300", color: "#8B5CF6" },
                    ].map((route, i) => (
                        <motion.path 
                            key={i}
                            d={route.d}
                            stroke={route.color}
                            strokeWidth="1"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, delay: i * 0.4 }}
                        />
                    ))}

                    {/* Port Markers */}
                    {[
                        { x: 200, y: 200 }, { x: 500, y: 150 }, { x: 450, y: 150 },
                        { x: 650, y: 300 }, { x: 550, y: 120 }
                    ].map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#00D4FF" className="animate-pulse" />
                    ))}
                </svg>

                <div className="absolute top-4 left-4 glass-panel p-3">
                    <div className="text-[10px] text-text-secondary uppercase mb-2">Maritime Trade Density</div>
                    <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "74%" }}
                            className="h-full bg-neon-blue"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </DashboardShell>
  );
}
