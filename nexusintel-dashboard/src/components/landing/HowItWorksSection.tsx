"use client";

import { motion } from "framer-motion";
import { Database, Cpu, GitBranch, Monitor } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Data Collection",
      desc: "Global APIs, research datasets, news feeds",
      icon: <Database className="w-8 h-8 text-neon-blue" />,
    },
    {
      title: "AI Processing",
      desc: "Entity extraction, sentiment analysis",
      icon: <Cpu className="w-8 h-8 text-purple-400" />,
    },
    {
      title: "Intelligence Correlation",
      desc: "Connecting geopolitical, economic, & climate signals",
      icon: <GitBranch className="w-8 h-8 text-green-400" />,
    },
    {
      title: "Decision Dashboard",
      desc: "Visual intelligence platform",
      icon: <Monitor className="w-8 h-8 text-neon-cyan" />,
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#0a0d14] relative border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-orbitron font-bold text-white mb-4 tracking-wide uppercase">
            How The Platform Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-cyan mx-auto rounded-full" />
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mt-12">
          
          {/* Connector Line Desktop */}
          <div className="hidden md:block absolute top-[50px] left-10 right-10 h-[2px] bg-gradient-to-r from-neon-blue via-purple-500 to-neon-cyan opacity-30 z-0" />
          
          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center max-w-[280px] w-full"
            >
              {/* Step Circle */}
              <div className="w-24 h-24 rounded-full bg-[#05080f] border-2 border-white/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,100,255,0.1)] group hover:border-neon-blue hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all">
                {step.icon}
                <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-neon-blue text-[#0a0d14] flex items-center justify-center font-bold text-xs -mt-1 -mr-1">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white font-inter mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
          
        </div>
      </div>
    </section>
  );
}
