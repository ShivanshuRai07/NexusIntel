"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

export default function ReportsPage() {
  const reports = [
    { id: 1, title: "Baltic Sector Defense Posture", classification: "TOP SECRET", date: "2026-03-05", author: "AI-STRAT-1" },
    { id: 2, title: "Semiconductor Trade War Expansion", classification: "SECRET", date: "2026-03-04", author: "ECON-ANALYTICS" },
    { id: 3, title: "OPEC+ Energy Supply Scenarios", classification: "CONFIDENTIAL", date: "2026-03-04", author: "ENERGY-DESK" },
    { id: 4, title: "Submarine Cable Security Audit", classification: "TOP SECRET", date: "2026-03-03", author: "NET-GUARD" },
    { id: 5, title: "Regional Water Scarcity Impact", classification: "UNCLASSIFIED", date: "2026-03-02", author: "ENV-MONITOR" },
    { id: 6, title: "Quantum Encryption Transition", classification: "TOP SECRET", date: "2026-03-01", author: "CYBER-CMD" },
  ];

  const getClassificationColor = (c: string) => {
    switch (c) {
        case "TOP SECRET": return "#EF4444";
        case "SECRET": return "#F59E0B";
        case "CONFIDENTIAL": return "#10B981";
        default: return "#00D4FF";
    }
  };

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase">Strategic Intelligence Reports</h1>
        
        <div className="grid grid-cols-3 gap-6 overflow-y-auto thin-scroll pr-2">
           {reports.map((report, i) => (
              <motion.div 
                 key={report.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: i * 0.08 }}
                 className="glass-panel p-5 flex flex-col gap-4 group hover:border-neon-blue/40 transition-all"
              >
                 <div className="flex justify-between items-start">
                    <motion.span 
                       initial={{ opacity: 0 }}
                       whileInView={{ opacity: [0, 1, 0, 1] }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.4, delay: i * 0.08 + 0.5 }}
                       className="status-badge text-[8px] font-bold px-2 py-0.5 rounded"
                       style={{ 
                         color: getClassificationColor(report.classification),
                         borderColor: getClassificationColor(report.classification),
                         backgroundColor: `${getClassificationColor(report.classification)}11`
                       }}
                    >
                       {report.classification}
                    </motion.span>
                    <span className="text-[8px] text-text-muted font-mono">{report.date}</span>
                 </div>
                 
                 <h3 className="text-sm font-bold text-white leading-snug group-hover:text-neon-blue transition-colors">
                    {report.title}
                 </h3>
                 
                 <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-[8px] text-text-secondary">
                    <span className="uppercase tracking-widest">BY {report.author}</span>
                    <button className="text-neon-blue hover:text-white transition-colors flex items-center gap-1 uppercase font-bold">
                       Access [↗]
                    </button>
                 </div>
              </motion.div>
           ))}
        </div>
      </div>
    </DashboardShell>
  );
}
