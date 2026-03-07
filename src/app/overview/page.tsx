"use client";
import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

function CountUp({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{displayValue}</motion.span>;
}

export default function OverviewPage() {
  const [stats, setStats] = useState([
    { label: "Global Events Monitored", value: 124580, color: "#00D4FF" },
    { label: "Critical Alerts", value: 142, color: "#EF4444" },
    { label: "Strategic Entities", value: 8904, color: "#10B981" },
    { label: "System Uptime", value: 99.99, color: "#00FF88" },
  ]);

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-4 flex flex-col items-center justify-center text-center"
            >
              <div className="text-3xl font-orbitron font-bold mb-1" style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}44` }}>
                <CountUp value={stat.value} />
                {stat.label.includes("Uptime") && "%"}
              </div>
              <div className="text-[10px] text-text-secondary uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 glass-panel relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 grid-bg opacity-10" />
          <div className="relative w-[500px] h-[500px]">
             {/* Mock Globe / Map with pulsing markers */}
             <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
                <circle cx="50" cy="50" r="45" stroke="#00D4FF" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="35" stroke="#00D4FF" strokeWidth="0.5" fill="none" opacity="0.5" />
             </svg>
             
             {/* Pulsing Markers */}
             {[
               { x: 30, y: 40, color: "#EF4444" },
               { x: 70, y: 35, color: "#F59E0B" },
               { x: 55, y: 65, color: "#10B981" },
               { x: 45, y: 25, color: "#00D4FF" },
               { x: 75, y: 70, color: "#EF4444" },
             ].map((marker, i) => (
               <div 
                 key={i}
                 className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2"
                 style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
               >
                 <motion.div 
                   animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute inset-0 rounded-full"
                   style={{ backgroundColor: marker.color }}
                 />
                 <div className="absolute inset-1 rounded-full bg-white shadow-[0_0_8px_white]" style={{ backgroundColor: marker.color }} />
               </div>
             ))}
             
             <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <h2 className="font-orbitron text-xl font-bold tracking-[8px] text-white opacity-80 uppercase">Global Overview</h2>
                <p className="text-[8px] text-neon-blue tracking-[4px] mt-2">REAL-TIME SURVEILLANCE ACTIVE</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
