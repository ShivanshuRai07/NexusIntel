"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Map, ArrowRight } from "lucide-react";

export default function MapPreviewSection() {
  return (
    <section className="py-24 px-6 bg-[#0B0F19] relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-霓虹-blue to-transparent opacity-20" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-sm font-bold font-orbitron uppercase tracking-widest">
              <Map className="w-4 h-4" /> Live Map Context
            </div>
            
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white leading-tight">
              Real-Time Global Intelligence Map
            </h2>
            
            <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
              Monitor global events, conflicts, alliances, climate risks, and strategic developments through an interactive intelligence map. Gain unparalleled situational awareness via an aggregated spatial visualization layer.
            </p>
            
            <Link href="/dashboard" className="inline-block">
              <button className="group relative overflow-hidden rounded bg-neon-blue px-6 py-3 font-semibold text-[#0a0d14] transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] flex items-center gap-2">
                Explore Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Holographic Map Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 relative w-full aspect-video rounded-xl border border-neon-blue/30 bg-[#0a0d14] shadow-[0_0_50px_rgba(0,200,255,0.15)] overflow-hidden flex items-center justify-center p-1"
            style={{ perspective: "1000px" }}
          >
            {/* Scanline overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-30" 
                 style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0, 240, 255, 0.2) 3px, rgba(0, 240, 255, 0.2) 3px)' }} />
                 
            <div className="relative w-full h-full rounded-lg bg-[#05080f] overflow-hidden flex items-center justify-center border border-white/5">
              {/* Map stylistic dots/vectors */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-blue/20 via-transparent to-transparent" />
              <div 
                className="w-[120%] h-[120%] opacity-20 absolute"
                style={{
                   backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300f0ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              
              {/* Simulated Map UI Elements */}
              <div className="absolute w-full h-full p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-32 h-8 bg-white/10 backdrop-blur rounded border border-white/10 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-red-500/20 border border-red-500/50" />
                    <div className="w-8 h-8 rounded bg-neon-blue/20 border border-neon-blue/50" />
                  </div>
                </div>
                
                {/* Simulated events on map */}
                <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(255,0,0,1)] animate-ping" />
                <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_rgba(0,255,255,1)] animate-pulse" />
                <div className="absolute top-[40%] left-[50%] w-4 h-4 bg-orange-500 blur-[2px] rounded-full animate-pulse" />
                <div className="absolute top-[70%] left-[30%] w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(0,255,0,1)]" />

                <div className="w-48 h-16 bg-white/5 backdrop-blur rounded border border-white/10 self-end" />
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
