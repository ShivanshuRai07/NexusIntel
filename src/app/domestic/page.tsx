"use client";
import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

function Gauge({ value, color }: { value: number, color: string }) {
  const spring = useSpring(0, { stiffness: 60, damping: 15 });
  const rotate = useTransform(spring, [0, 100], [-90, 90]);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <div className="relative w-48 h-24 overflow-hidden">
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <path 
           d="M10,45 A40,40 0 0,1 90,45" 
           fill="none" 
           stroke="rgba(255,255,255,0.05)" 
           strokeWidth="10" 
           strokeLinecap="round" 
        />
        <motion.path 
           d="M10,45 A40,40 0 0,1 90,45" 
           fill="none" 
           stroke={color} 
           strokeWidth="10" 
           strokeLinecap="round" 
           strokeDasharray="125 125"
           initial={{ strokeDashoffset: 125 }}
           animate={{ strokeDashoffset: 125 - (125 * (value / 100)) }}
           transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        />
      </svg>
      <motion.div 
         style={{ rotate, originX: "50%", originY: "100%" }}
         className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-20 bg-white rounded-full shadow-[0_0_10px_white]"
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xl font-orbitron font-bold text-white">
        {value}%
      </div>
    </div>
  );
}

export default function DomesticPage() {
  const sentimentData = [40, 45, 42, 50, 55, 52, 60, 58, 65, 70, 68, 72];

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase">Domestic Intelligence Monitor</h1>
        
        <div className="grid grid-cols-2 gap-6 flex-1">
           <div className="glass-panel p-6 flex flex-col items-center justify-center gap-6">
              <div className="section-header w-full">
                 <span className="text-neon-blue">◈</span> PUBLIC SENTIMENT INDEX
              </div>
              <Gauge value={72} color="#10B981" />
              <div className="text-center">
                 <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">State of Support</div>
                 <div className="text-neon-green font-bold">STABLE / INCREASING</div>
              </div>
           </div>
           
           <div className="glass-panel p-6 flex flex-col">
              <div className="section-header">
                 <span className="text-neon-blue">◈</span> SENTIMENT TREND (12H)
              </div>
              <div className="flex-1 mt-4 relative">
                 <svg viewBox="0 0 400 200" className="w-full h-full">
                    <motion.path 
                       d={`M0,${200 - sentimentData[0] * 2} ${sentimentData.map((v, i) => `L${(i * 400) / 11},${200 - v * 2}`).join(" ")}`}
                       fill="none"
                       stroke="#00D4FF"
                       strokeWidth="2"
                       initial={{ pathLength: 0 }}
                       whileInView={{ pathLength: 1 }}
                       viewport={{ once: true }}
                       transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    {/* Area fill */}
                    <motion.path 
                       d={`M0,200 L0,${200 - sentimentData[0] * 2} ${sentimentData.map((v, i) => `L${(i * 400) / 11},${200 - v * 2}`).join(" ")} L400,200 Z`}
                       fill="url(#grad)"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 0.2 }}
                       transition={{ duration: 1, delay: 1.5 }}
                    />
                    <defs>
                       <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
                       </linearGradient>
                    </defs>
                 </svg>
              </div>
           </div>

           <div className="glass-panel p-6 col-span-2">
              <div className="section-header">
                 <span className="text-neon-orange">◈</span> CRITICAL DOMESTIC ALERTS
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                 {[
                   { type: "Infrastructure", msg: "Power grid maintenance in Zone 4 completed.", status: "RESOLVED" },
                   { type: "Social", msg: "Minor protest detected in Sector 2 Capital.", status: "MONITORING" },
                   { type: "Transport", msg: "High speed rail line 12 resumed operations.", status: "ACTIVE" },
                 ].map((alert, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[8px] font-bold text-neon-blue uppercase">{alert.type}</span>
                         <span className={`text-[7px] font-bold ${alert.status === 'RESOLVED' ? 'text-neon-green' : 'text-neon-orange'}`}>{alert.status}</span>
                      </div>
                      <p className="text-[10px] text-text-secondary">{alert.msg}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
