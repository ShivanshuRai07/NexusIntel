"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function HeroSection() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00f0ff 1px, transparent 1px),
            linear-gradient(to bottom, #00f0ff 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)"
        }}
      />
      
      {/* Subtle Map / Radial Glow Behind */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 pointer-events-none">
        <div className="w-[800px] h-[800px] bg-neon-blue/20 rounded-full blur-[100px]" />
      </div>

      {init && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <Particles
            id="tsparticles"
            options={{
              background: { color: { value: "transparent" } },
              fpsLimit: 60,
              particles: {
                color: { value: "#00f0ff" },
                links: {
                  color: "#00f0ff",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                move: { enable: true, speed: 1 },
                number: { value: 60 },
                opacity: { value: 0.5 },
                size: { value: { min: 1, max: 3 } },
              },
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="absolute -inset-8 bg-neon-blue/20 blur-3xl rounded-full" />
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-neon-blue tracking-tighter mb-4 font-orbitron drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            NEXUSINTEL
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl font-semibold text-gray-300 tracking-wide mb-6 uppercase"
        >
          Global Intelligence Monitoring Platform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 font-inter"
        >
          Analyze global geopolitical developments, defense activities, economic trends, climate risks, and technological innovation through a real-time intelligence dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center"
        >
          <Link href="/dashboard">
            <button className="group relative overflow-hidden rounded-md bg-transparent border border-neon-blue px-10 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]">
              <span className="absolute inset-0 w-full h-full bg-neon-blue/20 group-hover:bg-neon-blue/40 transition-colors" />
              <span className="relative flex items-center gap-2 text-lg tracking-wider font-orbitron uppercase">
                Explore <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll indicator Bottom */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 pointer-events-none"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-neon-blue" />
        <span className="text-xs uppercase tracking-[0.3em] font-orbitron text-neon-blue">Scroll</span>
      </motion.div>
    </section>
  );
}
