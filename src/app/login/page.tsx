"use client";
import { motion } from "framer-motion";
import { Shield, Lock, User } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-red/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-neon-blue/10 rounded-xl flex items-center justify-center border border-neon-blue/30 mb-6 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
             <Shield className="w-8 h-8 text-neon-blue" />
          </div>
          
          <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest uppercase mb-2">Access Portal</h1>
          <p className="text-[10px] text-text-secondary tracking-[2px] uppercase mb-8">Secure Terminal Initiation</p>
          
          <form className="w-full space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-text-muted uppercase tracking-wider ml-1">Personnel ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                   type="text" 
                   className="w-full bg-white/5 border border-white/10 rounded px-10 py-2.5 text-sm text-white focus:border-neon-blue/50 focus:bg-white/10 outline-none transition-all font-mono"
                   placeholder="ID-842-99-X"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-text-muted uppercase tracking-wider ml-1">Access Cipher</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                   type="password" 
                   className="w-full bg-white/5 border border-white/10 rounded px-10 py-2.5 text-sm text-white focus:border-neon-blue/50 focus:bg-white/10 outline-none transition-all font-mono"
                   placeholder="••••••••"
                />
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-neon-blue py-3 rounded font-orbitron font-bold text-white tracking-widest text-sm mt-4 shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] transition-all"
            >
              AUTHENTICATE
            </motion.button>
          </form>
          
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link href="/" className="text-[10px] text-text-secondary hover:text-white transition-colors uppercase tracking-widest">
              Return to Public Node
            </Link>
            <div className="flex gap-4">
               <span className="text-[8px] text-red-500 font-bold animate-pulse">CLASSIFIED</span>
               <span className="text-[8px] text-neon-blue font-bold">NEXUS v2.4</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
           <p className="text-[9px] text-text-muted leading-relaxed uppercase tracking-widest">
             Unauthorized access attempts are logged and traced. <br/>
             By proceeding, you agree to the Geopolitical Security Protocol.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
