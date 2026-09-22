"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic imports for the main dashboard components
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const LeftSidebar = dynamic(() => import("@/components/LeftSidebar"), { ssr: false });
const MapCenter = dynamic(() => import("@/components/MapCenter"), { ssr: false });
const RightSidebar = dynamic(() => import("@/components/RightSidebar"), { ssr: false });
const TopAnalytics = dynamic(() => import("@/components/TopAnalytics"), { ssr: false });
const BottomAnalytics = dynamic(() => import("@/components/BottomAnalytics"), { ssr: false });
const TechSection = dynamic(() => import("@/components/sections/TechSection"), { ssr: false });
const AgriSection = dynamic(() => import("@/components/sections/AgriSection"), { ssr: false });
const ClimateSection = dynamic(() => import("@/components/sections/ClimateSection"), { ssr: false });
const EconomySection = dynamic(() => import("@/components/sections/EconomySection"), { ssr: false });
const CyberSection = dynamic(() => import("@/components/sections/CyberSection"), { ssr: false });
const ScienceSection = dynamic(() => import("@/components/sections/ScienceSection"), { ssr: false });

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Layout resize state
  const [leftWidth, setLeftWidth] = useState(280);
  const [rightWidth, setRightWidth] = useState(280);
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      if (userId === "gov123" && password === "gov123") {
        setIsAuthenticated(true);
      } else {
        setErrorMsg("Access Denied: Invalid Security Credentials.");
      }
      setIsLoading(false);
    }, 400);
  };

  // Render Login Gateway Card if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#00D4FF_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Security Login Card */}
        <div className="w-full max-w-md glass-panel p-8 rounded-xl border border-cyan-500/30 bg-[#0F1628]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10">
          
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 mb-3 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-wider text-white font-mono uppercase">
              NEXUS<span className="text-cyan-400">INTEL</span>
            </h1>
            <p className="text-xs text-slate-400 tracking-widest uppercase mt-1">Government Security Gateway</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-semibold text-center animate-shake">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Government Clearance ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID (e.g. gov123)"
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-cyan-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Security Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-cyan-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] active:scale-[0.98] disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Authenticate Clearance</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Notice */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <p className="text-[10px] text-slate-500 tracking-wider uppercase">
              RESTRICTED ACCESS · AUTHORIZED PERSONNEL ONLY
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render Full Command Dashboard when authenticated
  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-white font-sans overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden p-1.5 pt-0 flex relative w-full">
        
        {/* LEFT SIDEBAR */}
        <div style={{ width: leftWidth, minWidth: 200, maxWidth: 600 }} className="h-full shrink-0 flex flex-col relative z-[500]">
          <LeftSidebar />
        </div>

        {/* MIDDLE SECTION (Map + Analytics + Domains) */}
        <div className="flex-1 min-w-[400px] h-full flex flex-col relative py-0 overflow-y-auto thin-scroll scroll-smooth z-10 px-1">
          <div className="flex flex-col min-h-full">
            {!isMapMaximized && (
              <div className="shrink-0 mb-2 h-auto min-h-[95px]">
                <TopAnalytics />
              </div>
            )}
            <div className={`shrink-0 relative mb-2 transition-all duration-300 ${isMapMaximized ? "h-[calc(100vh-60px)]" : "h-[460px]"}`}>
              <MapCenter isMaximized={isMapMaximized} onToggleMaximize={() => setIsMapMaximized(!isMapMaximized)} />
            </div>
            {!isMapMaximized && (
              <div className="shrink-0 mb-4 h-auto min-h-[95px]">
                <BottomAnalytics />
              </div>
            )}

            {/* DOMAIN SECTIONS */}
            {!isMapMaximized && (
              <div className="flex flex-col gap-6 p-1.5 pb-20">
                <TechSection />
                <AgriSection />
                <ClimateSection />
                <EconomySection />
                <CyberSection />
                <ScienceSection />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: rightWidth, minWidth: 200, maxWidth: 600 }} className="h-full shrink-0 flex flex-col relative z-[500]">
          <RightSidebar />
        </div>

      </div>
    </div>
  );
}
