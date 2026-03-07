"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

export default function SystemPage() {
  const [nodeCount, setNodeCount] = useState(0);
  const [status, setStatus] = useState("initializing");

  useEffect(() => {
    let count = 0;
    const target = 142857;
    const duration = 2000;
    const start = Date.now();

    const update = () => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      setNodeCount(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setStatus("locked");
      }
    };
    
    update();
  }, []);

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase">System Intelligence Status</h1>
        
        <div className="grid grid-cols-2 gap-6 flex-1">
           <div className="glass-panel p-8 flex flex-col items-center justify-center gap-4">
              <div className="text-[10px] text-text-secondary uppercase tracking-[4px]">Active Neural Nodes</div>
              <div className="text-5xl font-orbitron font-bold text-neon-blue">
                 {nodeCount.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-4">
                 <motion.div 
                    animate={status === 'locked' ? { opacity: 1 } : { opacity: [0, 1, 0] }}
                    transition={status === 'locked' ? {} : { duration: 0.5, repeat: Infinity }}
                    className={`w-3 h-3 rounded-full ${status === 'locked' ? 'bg-neon-green shadow-[0_0_10px_#00FF88]' : 'bg-neon-orange'}`}
                 />
                 <span className={`font-orbitron text-sm font-bold tracking-widest uppercase ${status === 'locked' ? 'text-neon-green' : 'text-neon-orange'}`}>
                    {status === 'locked' ? 'SYSTEM SECURE' : 'ESTABLISHING LINK...'}
                 </span>
              </div>
           </div>
           
           <div className="glass-panel p-6 flex flex-col gap-4 overflow-y-auto thin-scroll">
              <div className="section-header">
                 <span className="text-neon-blue">◈</span> CORE SUBSYSTEMS
              </div>
              <div className="space-y-4">
                 {[
                   { name: "Cognitive Engine", load: 24, status: "OPTIMAL" },
                   { name: "Data Ingestion (Global)", load: 88, status: "HEAVY LOAD" },
                   { name: "Encryption Layer", load: 12, status: "OPTIMAL" },
                   { name: "Map Rendering Cluster", load: 45, status: "OPTIMAL" },
                   { name: "Alert Dispatcher", load: 5, status: "IDLE" },
                 ].map((sub, i) => (
                   <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-bold text-white uppercase">{sub.name}</span>
                         <span className={`text-[8px] font-bold ${sub.status === 'OPTIMAL' ? 'text-neon-green' : 'text-neon-orange'}`}>{sub.status}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${sub.load}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full ${sub.load > 80 ? 'bg-neon-orange' : 'bg-neon-blue'}`}
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-panel p-6 col-span-2">
              <div className="section-header">
                 <span className="text-neon-blue">◈</span> SYSTEM LOGS (REAL-TIME)
              </div>
              <div className="mt-4 font-mono text-[10px] text-text-secondary space-y-1">
                 <p className="text-neon-green">[OK] Authentication service cluster healthy.</p>
                 <p>[INFO] Ingesting 12.4GB/s from maritime transponder network.</p>
                 <p className="text-neon-orange">[WARN] Latency spike detected in SE Asia relay nodes.</p>
                 <p>[INFO] Recalibrating AI Strategic Models for Baltic Scenario.</p>
                 <p className="text-neon-blue font-bold">[SYS] NexusIntel v2.4.0 operational.</p>
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
