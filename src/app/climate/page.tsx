"use client";
import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

function TempCount({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(spring, (current) => current.toFixed(1));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{displayValue}</motion.span>;
}

export default function ClimatePage() {
  const regions = [
    { id: "arctic", label: "Arctic", risk: "#EF4444", temp: 2.4 },
    { id: "amazon", label: "Amazon Basin", risk: "#F59E0B", temp: 1.8 },
    { id: "sahel", label: "Sahel Region", risk: "#EF4444", temp: 3.1 },
    { id: "se_asia", label: "SE Asia", risk: "#F59E0B", temp: 1.5 },
    { id: "australia", label: "Australia Interior", risk: "#EF4444", temp: 2.2 },
  ];

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase">Climate & Environmental Risk</h1>
        
        <div className="grid grid-cols-5 gap-4">
          {regions.map((region, i) => (
            <motion.div 
               key={region.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass-panel p-4 text-center"
            >
               <div className="text-xl font-orbitron font-bold text-white mb-1">
                 +<TempCount value={region.temp} />°C
               </div>
               <div className="text-[10px] text-text-secondary uppercase tracking-widest">{region.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 glass-panel relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <svg viewBox="0 0 800 400" className="w-[80%] h-auto">
               {/* Simplified Continent Blobs */}
               {[
                 { d: "M100,100 Q150,50 200,100 T300,150 T200,300 T100,100", id: "arctic" },
                 { d: "M400,200 Q450,150 500,200 T600,250 T500,350 T400,200", id: "amazon" },
                 { d: "M550,50 Q600,20 650,50 T700,100 T600,150 T550,50", id: "sahel" },
                 { d: "M650,250 Q700,220 750,250 T780,300 T700,350 T650,250", id: "se_asia" },
                 { d: "M200,320 Q250,300 300,320 T350,350 T300,380 T200,320", id: "australia" },
               ].map((region, i) => {
                 const config = regions.find(r => r.id === region.id)!;
                 return (
                   <motion.path 
                     key={i}
                     d={region.d}
                     initial={{ fill: "#333333" }}
                     whileInView={{ fill: config.risk }}
                     viewport={{ once: true }}
                     transition={{ duration: 2, delay: 0.5 + (i * 0.3) }}
                     stroke="rgba(255,255,255,0.1)"
                     strokeWidth="1"
                   />
                 );
               })}
            </svg>
            
            <div className="absolute top-6 left-6 glass-panel p-4 flex flex-col gap-2">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded bg-[#EF4444]" />
                 <span className="text-[10px] text-text-secondary uppercase">Extreme Risk</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded bg-[#F59E0B]" />
                 <span className="text-[10px] text-text-secondary uppercase">Moderate Risk</span>
               </div>
            </div>
        </div>
      </div>
    </DashboardShell>
  );
}
