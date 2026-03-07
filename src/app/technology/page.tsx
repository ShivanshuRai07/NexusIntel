"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

export default function TechnologyPage() {
  const [timelineItems] = useState([
    { year: "2026.Q2", title: "Quantum Supremacy in Cryptanalysis", details: "Major decryption protocols potentially compromised by Sector 9-X." },
    { year: "2026.Q3", title: "Autonomous Swarm Deployment", details: "Integration of AI-driven tactical drones in regional defense networks." },
    { year: "2026.Q4", title: "Next-Gen Fusion Prototype", details: "Sustainable plasma containment achieved in experimental facility." },
    { year: "2027.Q1", title: "Global Mesh Network Alpha", details: "Decentralized satellite communication layer reaches critical density." },
  ]);

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase">Technology Intelligence</h1>
        
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Radar Section */}
          <div className="flex-[0.6] glass-panel relative overflow-hidden flex items-center justify-center bg-black/40">
             <style jsx>{`
                @keyframes sweep {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .radar-sweep {
                  animation: sweep 4s linear infinite;
                  background: conic-gradient(from 0deg, rgba(0, 212, 255, 0.4) 0%, transparent 15%, transparent 100%);
                }
             `}</style>
             
             <div className="relative w-80 h-80 rounded-full border border-neon-blue/20 flex items-center justify-center">
                {/* Concentric circles */}
                <div className="absolute w-full h-full rounded-full border border-neon-blue/10" />
                <div className="absolute w-3/4 h-3/4 rounded-full border border-neon-blue/10" />
                <div className="absolute w-1/2 h-1/2 rounded-full border border-neon-blue/10" />
                <div className="absolute w-1/4 h-1/4 rounded-full border border-neon-blue/10" />
                
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-neon-blue/10" />
                <div className="absolute h-full w-[1px] bg-neon-blue/10" />
                
                {/* The Sweep */}
                <div className="absolute inset-0 radar-sweep rounded-full" />
                
                {/* Target Blips */}
                {[
                  { x: 120, y: 80, label: "BIO-SIG" },
                  { x: 250, y: 150, label: "GEO-ALT" },
                  { x: 100, y: 220, label: "NET-INT" },
                ].map((blip, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: [0, 1, 0] }}
                     transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                     className="absolute w-2 h-2 bg-neon-green rounded-full shadow-[0_0_10px_#00FF88]"
                     style={{ left: blip.x, top: blip.y }}
                   />
                ))}
                
                <div className="z-10 bg-black/60 px-3 py-1 rounded border border-neon-blue/30 backdrop-blur-sm">
                   <span className="text-[10px] font-orbitron font-bold text-neon-blue animate-pulse">RADAR SCAN ACTIVE</span>
                </div>
             </div>
          </div>
          
          {/* Timeline Section */}
          <div className="flex-[0.4] glass-panel p-6 flex flex-col gap-6 overflow-y-auto thin-scroll">
             <div className="section-header">
                🚀 TECH ADVANCEMENT TIMELINE
             </div>
             <div className="space-y-6 relative ml-4 border-l border-white/10 pl-6 py-2">
                {timelineItems.map((item, i) => (
                   <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.2 }}
                      className="relative"
                   >
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-neon-blue shadow-[0_0_8px_#00D4FF]" />
                      
                      <div className="text-[10px] font-orbitron font-bold text-neon-blue mb-1">{item.year}</div>
                      <h3 className="text-xs font-bold text-white mb-1 uppercase">{item.title}</h3>
                      <p className="text-[10px] text-text-secondary leading-relaxed">{item.details}</p>
                   </motion.div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
