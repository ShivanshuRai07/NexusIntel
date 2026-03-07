"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

function SlotNumber({ value }: { value: number }) {
  const digits = value.toString().split("");
  return (
    <div className="flex overflow-hidden h-8">
      {digits.map((digit, i) => (
        <div key={i} className="relative w-5 h-8">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={digit}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function AnalysisPage() {
  const [risks, setRisks] = useState([
    { label: "Geopolitical Instability", value: 84, color: "#EF4444" },
    { label: "Cyber Warfare Intensity", value: 62, color: "#F59E0B" },
    { label: "Supply Chain Congestion", value: 45, color: "#F59E0B" },
    { label: "Economic Default Risk", value: 28, color: "#10B981" },
    { label: "Energy Security Threat", value: 76, color: "#EF4444" },
  ]);

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase">AI Strategic Analysis</h1>
        
        <div className="grid grid-cols-1 gap-6 flex-1">
          <div className="glass-panel p-6 flex flex-col gap-8">
            {risks.map((risk, i) => (
              <div key={risk.label} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{risk.label}</span>
                  <div className="text-xl font-orbitron font-bold" style={{ color: risk.color }}>
                    <div className="flex items-center">
                      <SlotNumber value={risk.value} />
                      <span className="ml-1">%</span>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${risk.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.2 }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: risk.color,
                      boxShadow: `0 0 15px ${risk.color}66`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="glass-panel p-6">
             <div className="section-header">
                <span className="text-neon-blue">◈</span> AI RECOMMENDATIONS
             </div>
             <div className="mt-4 space-y-4">
                {[
                  "Heighten surveillance in Sector 7-G due to anomalous troop movements.",
                  "Diversify energy procurement channels; current dependency ratio exceeds 40%.",
                  "Deploy defensive cyber-assets to financial core sub-networks.",
                ].map((text, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + (i * 0.3) }}
                    className="p-3 bg-white/5 border-l-2 border-neon-blue rounded-r text-[10px] text-text-secondary leading-relaxed"
                  >
                    {text}
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
