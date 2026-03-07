"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronRight } from "lucide-react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import DashboardShell from "@/components/DashboardShell";

const MapCenter = dynamic(() => import("@/components/MapCenter"), { ssr: false });

function Typewriter({ text, speed = 60 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default function Home() {
  const [init, setInit] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesConfig = useMemo(() => ({
    fullScreen: { enable: false },
    background: { color: "transparent" },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "grab" },
        resize: { enable: true },
      },
      modes: {
        push: { quantity: 4 },
        grab: { distance: 200, links: { opacity: 0.5 } },
      },
    },
    particles: {
      color: { value: theme === "dark" ? "#00D4FF" : "#1A2B5E" },
      links: {
        color: theme === "dark" ? "#00D4FF" : "#1A2B5E",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: { default: "bounce" as const },
        random: false,
        speed: 1,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <DashboardShell theme={theme}>
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        {/* Background Particles */}
        {init && (
          <Particles
            id="tsparticles"
            options={particlesConfig}
            className="absolute inset-0 z-0 pointer-events-none"
          />
        )}

        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center p-8 z-10">
          {/* Background Video with Overlay */}
          <div className="absolute inset-0 overflow-hidden z-[-1]">
             <video 
               autoPlay 
               muted 
               loop 
               playsInline 
               className="w-full h-full object-cover opacity-30"
             >
               <source src="/hero-video.mp4" type="video/mp4" />
             </video>
             <div className={`absolute inset-0 transition-colors duration-500 ${
               theme === "dark" ? "bg-[#0B0F19]/80" : "bg-[#EFF3F8]/40"
             }`} />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl"
          >
            <h1 className={`font-orbitron text-5xl font-black tracking-[12px] uppercase mb-4 ${
              theme === "dark" ? "neon-text-blue" : "text-[#1A2B5E]"
            }`}>
              NexusIntel
            </h1>
            <div className={`text-lg font-medium tracking-[4px] uppercase h-8 ${
              theme === "dark" ? "text-text-secondary" : "text-[#1A2B5E]/70"
            }`}>
              <Typewriter text="Global Strategic Intelligence. AI-Driven Ontology." />
            </div>
            
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 2 }}
               className="mt-12 flex gap-4 justify-center"
            >
               <button className="bg-neon-blue px-8 py-3 rounded font-orbitron font-bold text-white tracking-widest hover:shadow-[0_0_20px_#00D4FF] transition-all flex items-center gap-2">
                 EXPLORE NETWORK <ChevronRight className="w-4 h-4" />
               </button>
               <button className={`px-8 py-3 rounded font-orbitron font-bold tracking-widest border transition-all ${
                 theme === "dark" ? "border-white/20 text-white hover:bg-white/10" : "border-[#1A2B5E]/20 text-[#1A2B5E] hover:bg-[#1A2B5E]/5"
               }`}>
                 REPORTS
               </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Map Section */}
        <section className="relative h-[600px] flex flex-col items-center justify-center overflow-hidden border-t border-white/5">
           <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${
             theme === "dark" ? "opacity-100" : "opacity-30"
           }`}>
              <img 
                src="/world-map.png" 
                alt="World Map" 
                className="w-full h-full object-cover"
              />
           </div>

           {/* Pulsing Glowing Markers */}
           <div className="absolute inset-0 z-10">
              {[
                { x: "25%", y: "35%", color: "#EF4444" },
                { x: "45%", y: "45%", color: "#F59E0B" },
                { x: "70%", y: "30%", color: "#10B981" },
                { x: "80%", y: "60%", color: "#00D4FF" },
                { x: "35%", y: "70%", color: "#8B5CF6" },
              ].map((marker, i) => (
                <div 
                  key={i}
                  className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: marker.x, top: marker.y }}
                >
                  <motion.div 
                     animate={{ scale: [1, 3, 1], opacity: [0.6, 0, 0.6] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute inset-0 rounded-full"
                     style={{ backgroundColor: marker.color }}
                  />
                  <div className="absolute inset-[3px] rounded-full bg-white shadow-[0_0_10px_white]" style={{ backgroundColor: marker.color }} />
                </div>
              ))}
           </div>

           <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`z-20 glass-panel p-8 max-w-lg text-center ${
                theme === "light" ? "bg-white/80 border-[#1A2B5E]/10" : ""
              }`}
           >
              <h2 className={`font-orbitron font-bold text-xl mb-4 tracking-widest ${
                theme === "dark" ? "text-white" : "text-[#1A2B5E]"
              }`}>REAL-TIME COGNITIVE MAPPING</h2>
              <p className={`text-sm leading-relaxed ${
                theme === "dark" ? "text-text-secondary" : "text-[#1A2B5E]/70"
              }`}>
                The NexusIntel core map aggregates billions of data points across maritime, aerial, and terrestrial sensors to provide a unified strategic operating picture.
              </p>
           </motion.div>
        </section>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className={`absolute top-6 right-6 z-50 p-3 rounded-full shadow-lg border backdrop-blur-md transition-all ${
            theme === "dark" 
              ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" 
              : "bg-black/5 border-black/10 text-indigo-900 hover:bg-black/10"
          }`}
        >
          {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>
    </DashboardShell>
  );
}
