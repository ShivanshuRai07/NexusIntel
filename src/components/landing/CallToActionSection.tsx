"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToActionSection() {
  return (
    <section className="relative py-32 px-6 bg-[#0B0F19] overflow-hidden flex flex-col items-center justify-center text-center">
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-neon-blue/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl"
      >
        <h2 className="text-5xl md:text-6xl font-black text-white font-orbitron mb-8 uppercase tracking-wide">
          Explore Global Intelligence <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-cyan">
            With NexusIntel
          </span>
        </h2>
        
        <Link href="/dashboard">
          <button className="group mt-8 relative overflow-hidden rounded bg-neon-blue px-12 py-5 font-bold text-[#0a0d14] text-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] flex items-center justify-center gap-3 mx-auto">
            <span className="font-orbitron tracking-wider uppercase">Explore Dashboard</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </motion.div>
      
    </section>
  );
}
