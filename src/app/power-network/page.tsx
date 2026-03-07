"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/DashboardShell";

export default function PowerNetworkPage() {
  const nodes = [
    { id: 1, x: 200, y: 100, label: "HQ-ALPHA", type: "hub" },
    { id: 2, x: 100, y: 200, label: "RELAY-1", type: "node" },
    { id: 3, x: 300, y: 200, label: "RELAY-2", type: "node" },
    { id: 4, x: 150, y: 350, label: "ENDPOINT-A", type: "end" },
    { id: 5, x: 350, y: 350, label: "ENDPOINT-B", type: "end" },
    { id: 6, x: 500, y: 150, label: "HQ-BETA", type: "hub" },
    { id: 7, x: 600, y: 250, label: "RELAY-3", type: "node" },
    { id: 8, x: 550, y: 400, label: "ENDPOINT-C", type: "end" },
  ];

  const edges = [
    { from: 1, to: 2 }, { from: 1, to: 3 },
    { from: 2, to: 4 }, { from: 3, to: 5 },
    { from: 6, to: 7 }, { from: 7, to: 8 },
    { from: 3, to: 6 }, // Cross link
  ];

  return (
    <DashboardShell>
      <div className="p-6 h-full flex flex-col gap-6">
        <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase">Global Power Network</h1>
        
        <div className="flex-1 glass-panel relative overflow-hidden bg-black/40">
           <div className="absolute inset-0 grid-bg opacity-10" />
           
           <svg viewBox="0 0 800 600" className="w-full h-full">
              {/* Edges first so they are behind nodes */}
              {edges.map((edge, i) => {
                 const fromNode = nodes.find(n => n.id === edge.from)!;
                 const toNode = nodes.find(n => n.id === edge.to)!;
                 return (
                    <motion.line 
                       key={`edge-${i}`}
                       x1={fromNode.x} y1={fromNode.y}
                       x2={toNode.x} y2={toNode.y}
                       stroke="#00D4FF"
                       strokeWidth="1.5"
                       strokeDasharray="10 5"
                       initial={{ pathLength: 0, opacity: 0 }}
                       whileInView={{ pathLength: 1, opacity: 0.4 }}
                       viewport={{ once: true }}
                       transition={{ 
                         duration: 1.5, 
                         delay: 1 + (i * 0.1),
                         ease: "easeInOut"
                       }}
                       style={{ filter: "drop-shadow(0 0 8px #00D4FF66)" }}
                    />
                 );
              })}

              {/* Nodes */}
              {nodes.map((node, i) => (
                 <motion.g 
                    key={`node-${node.id}`}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: i * 0.1 
                    }}
                 >
                    <circle 
                        cx={node.x} cy={node.y} r={node.type === 'hub' ? 8 : 5}
                        fill={node.type === 'hub' ? '#00D4FF' : '#10B981'}
                        className={node.type === 'hub' ? 'animate-pulse' : ''}
                    />
                    <text 
                        x={node.x} y={node.y + 20} 
                        textAnchor="middle" 
                        className="fill-text-secondary text-[10px] uppercase font-orbitron tracking-tight"
                    >
                        {node.label}
                    </text>
                 </motion.g>
              ))}
           </svg>

           <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <div className="glass-panel p-3">
                 <div className="text-[10px] text-text-secondary uppercase mb-1">Network Integrity</div>
                 <div className="text-xl font-bold text-neon-blue">98.4%</div>
              </div>
              <div className="glass-panel p-3">
                 <div className="text-[10px] text-text-secondary uppercase mb-1">Active Nodes</div>
                 <div className="text-xl font-bold text-neon-green">1,248</div>
              </div>
           </div>
        </div>
      </div>
    </DashboardShell>
  );
}
