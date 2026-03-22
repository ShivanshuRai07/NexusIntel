"use client";

import { motion } from "framer-motion";
import { Globe, ShieldAlert, Cpu, ThermometerSun, Tractor, TrendingUp, Shield } from "lucide-react";

export default function DomainsSection() {
  const domains = [
    {
      title: "Geopolitics",
      icon: <Globe className="w-8 h-8 text-neon-blue group-hover:text-white transition-colors" />,
      desc: "Monitor global shifting alliances, political instability, and diplomatic moves.",
      glow: "hover:shadow-[0_0_25px_rgba(0,180,255,0.5)]"
    },
    {
      title: "Defense & Strategic Monitoring",
      icon: <ShieldAlert className="w-8 h-8 text-red-500 group-hover:text-white transition-colors" />,
      desc: "Track troop movements, military spending, and strategic military operations.",
      glow: "hover:shadow-[0_0_25px_rgba(255,50,50,0.5)]"
    },
    {
      title: "Technology & Innovation",
      icon: <Cpu className="w-8 h-8 text-purple-500 group-hover:text-white transition-colors" />,
      desc: "Analyze emerging tech trends, AI advancements, and semiconductor developments.",
      glow: "hover:shadow-[0_0_25px_rgba(180,50,255,0.5)]"
    },
    {
      title: "Climate Intelligence",
      icon: <ThermometerSun className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />,
      desc: "Detect extreme weather events, natural disasters, and climate risks.",
      glow: "hover:shadow-[0_0_25px_rgba(255,165,0,0.5)]"
    },
    {
      title: "Agriculture & Food Security",
      icon: <Tractor className="w-8 h-8 text-green-500 group-hover:text-white transition-colors" />,
      desc: "Monitor crop yields, supply chain disruptions, and global food stability.",
      glow: "hover:shadow-[0_0_25px_rgba(50,255,50,0.5)]"
    },
    {
      title: "Global Economic Intelligence",
      icon: <TrendingUp className="w-8 h-8 text-yellow-500 group-hover:text-white transition-colors" />,
      desc: "Track global markets, inflation, commodities, and economic policies.",
      glow: "hover:shadow-[0_0_25px_rgba(255,255,50,0.5)]"
    },
    {
      title: "Cyber Threat Monitoring",
      icon: <Shield className="w-8 h-8 text-neon-cyan group-hover:text-white transition-colors" />,
      desc: "Stay ahead of global cyber attacks, ransomware groups, and infrastructure vulnerabilities.",
      glow: "hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]"
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#0a0d14] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4 tracking-wide uppercase">
            Platform Intelligence Domains
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-cyan mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {domains.map((domain, idx) => (
            <motion.div
              key={domain.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className={`group flex flex-col p-6 rounded-xl bg-white/5 border border-white/10 ${domain.glow} transition-all duration-300 backdrop-blur-sm cursor-default`}
            >
              <div className="bg-white/5 p-4 rounded-lg w-fit mb-4 border border-white/5 group-hover:bg-white/10 transition-colors">
                {domain.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-inter tracking-wide">{domain.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{domain.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
