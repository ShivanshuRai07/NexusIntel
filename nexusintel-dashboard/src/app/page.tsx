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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userId, setUserId] = useState("analyst.clearance@nexusintel.gov");
  const [password, setPassword] = useState("••••••••");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Layout resize state
  const [leftWidth] = useState(300);
  const [rightWidth] = useState(300);
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 400);
  };

  // Professional Enterprise Gateway (Clean, Institutional)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center p-4 relative font-sans">
        <div className="w-full max-w-md bg-[#0F1626] border border-slate-700/80 rounded-xl p-8 shadow-2xl relative z-10">
          
          {/* Organization Masthead */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 text-sky-400 mb-3 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              NexusIntel <span className="text-sky-400">Enterprise</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Strategic Intelligence & Situational Awareness</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium text-center">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Organizational Identity / Username
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Security Credential / Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs tracking-wide transition-colors shadow-sm disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Validating Session...</span>
              ) : (
                <span>Authenticate Workspace Access →</span>
              )}
            </button>
          </form>

          {/* Institutional Compliance Notice */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-center">
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Official institutional portal. Unauthorized connection attempts are logged in compliance with security guidelines.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render Full Command Dashboard
  return (
    <div className="flex flex-col h-screen bg-[#080C14] text-slate-100 font-sans overflow-hidden">
      <Header />
      
      <div className="flex-1 overflow-hidden p-2 pt-1.5 flex gap-2 relative w-full">
        
        {/* LEFT SIDEBAR (Live News & Defense) */}
        <div style={{ width: leftWidth, minWidth: 260, maxWidth: 500 }} className="h-full shrink-0 flex flex-col relative z-20">
          <LeftSidebar />
        </div>

        {/* MIDDLE SECTION (Map + Analytics + Deep Dives) */}
        <div className="flex-1 min-w-[400px] h-full flex flex-col relative overflow-y-auto thin-scroll scroll-smooth z-10 px-0.5">
          <div className="flex flex-col min-h-full gap-2">
            
            {!isMapMaximized && (
              <div className="shrink-0 h-auto min-h-[95px]">
                <TopAnalytics />
              </div>
            )}

            <div className={`shrink-0 relative transition-all duration-300 ${isMapMaximized ? "h-[calc(100vh-68px)]" : "h-[470px]"}`}>
              <MapCenter isMaximized={isMapMaximized} onToggleMaximize={() => setIsMapMaximized(!isMapMaximized)} />
            </div>

            {!isMapMaximized && (
              <div className="shrink-0 h-auto min-h-[95px]">
                <BottomAnalytics />
              </div>
            )}

            {/* DEEP DIVE DOMAIN SECTIONS */}
            {!isMapMaximized && (
              <div className="flex flex-col gap-4 pb-20 mt-1">
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

        {/* RIGHT SIDEBAR (Military Expenditure & Treaties) */}
        <div style={{ width: rightWidth, minWidth: 260, maxWidth: 500 }} className="h-full shrink-0 flex flex-col relative z-20">
          <RightSidebar />
        </div>

      </div>
    </div>
  );
}
