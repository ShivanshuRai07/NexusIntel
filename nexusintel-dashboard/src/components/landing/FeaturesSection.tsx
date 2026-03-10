"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Network, AlertTriangle, Layers } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Real-Time Global Monitoring",
      icon: <Activity className="w-6 h-6 text-neon-blue" />,
      desc: "Streams of active data are analyzed per-second generating intelligence loops."
    },
    {
      title: "AI-Based Intelligence Analysis",
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      desc: "Advanced neural networks interpret documents, news, and signals automatically."
    },
    {
      title: "Cross-Domain Data Integration",
      icon: <Network className="w-6 h-6 text-green-400" />,
      desc: "Fusing geopolitical, economic, climate, and technological indicators into one layer."
    },
    {
      title: "Strategic Risk Alerts",
      icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
      desc: "Early-warning alerts generated for critical disruptions worldwide."
    },
    {
      title: "Interactive Global Map",
      icon: <Layers className="w-6 h-6 text-neon-cyan" />,
      desc: "Multi-layered geospatial visualization engine for comprehensive oversight."
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#0a0d14] relative border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        <div className="md:w-1/3">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-orbitron font-bold text-white mb-6 uppercase tracking-wider leading-tight"
          >
            Platform Features
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 leading-relaxed"
          >
            NexusIntel provides a sophisticated array of analytical capabilities to process complex global phenomena into actionable situational awareness.
          </motion.p>
        </div>

        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className={`p-6 bg-white/5 border border-white/10 rounded-lg hover:border-neon-blue/50 transition-colors ${idx === 4 ? "sm:col-span-2 sm:w-1/2 justify-self-center" : ""}`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-white/5 rounded">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white tracking-wide">{feature.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
