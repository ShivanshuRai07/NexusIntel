"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";

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
  const [leftWidth] = useState(285);
  const [rightWidth] = useState(285);
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const fillDemoCredentials = () => {
    setUserId("gov123");
    setPassword("gov123");
  };

  const isDark = theme === "dark";

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        {/* Day / Dark mode toggle in top-right */}
        <div className="absolute top-5 right-5 z-20">
          <button
            id="login-theme-toggle"
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all duration-200 hover:opacity-85 shadow-sm"
            style={{
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-secondary)",
              backdropFilter: "blur(12px)",
              cursor: "pointer",
            }}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
              {isDark ? "Day Mode" : "Dark Mode"}
            </span>
          </button>
        </div>

        {/* Ambient background patterns */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(var(--neon-blue) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.06,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(0,212,255,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="glass-panel w-full max-w-[430px] p-8 sm:p-9 rounded-2xl relative z-10 animate-fade-up">
          <div className="text-center mb-7">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-md"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.35)", color: "var(--neon-blue)" }}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1
              className="text-[22px] font-extrabold tracking-[4px] uppercase mb-1"
              style={{ color: "var(--text)" }}
            >
              NEXUS<span style={{ color: "var(--neon-blue)" }}>INTEL</span>
            </h1>
            <p className="text-[10px] tracking-[3px] uppercase font-semibold" style={{ color: "var(--text-secondary)" }}>
              Global Intelligence Command
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div
                className="p-3 rounded-lg text-xs font-semibold text-center animate-fade-up"
                style={{ background: "rgba(255,34,68,0.1)", border: "1px solid rgba(255,34,68,0.35)", color: "var(--neon-red)" }}
              >
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
                Government Clearance ID
              </label>
              <input
                id="login-userid"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. gov123"
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
                style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--neon-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
                Security Passcode
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm transition-all outline-none"
                style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--text)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--neon-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--input-border)")}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[10px] font-semibold text-neon-blue hover:underline tracking-wide cursor-pointer"
              >
                Auto-fill Demo Credentials (gov123)
              </button>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: "var(--neon-blue)",
                color: "#050C16",
                boxShadow: "0 0 24px rgba(0,212,255,0.3)",
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Authenticating Clearance..." : (
                <>
                  <span>Authenticate Clearance</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div
            className="mt-7 pt-4 text-center text-[9px] uppercase tracking-[2px] font-semibold"
            style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
          >
            RESTRICTED ACCESS · AUTHORIZED PERSONNEL ONLY
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--text)", transition: "background 0.3s ease, color 0.3s ease" }}
    >
      <Header />
      <div className="flex-1 overflow-hidden p-1.5 pt-1 flex relative w-full gap-1.5">
        <div style={{ width: leftWidth, minWidth: 200, maxWidth: 600 }} className="h-full shrink-0 flex flex-col relative z-[500]">
          <LeftSidebar />
        </div>

        <div className="flex-1 min-w-[400px] h-full flex flex-col relative overflow-y-auto thin-scroll scroll-smooth z-10">
          <div className="flex flex-col min-h-full">
            {!isMapMaximized && (
              <div className="shrink-0 mb-1.5 h-auto min-h-[95px]">
                <TopAnalytics />
              </div>
            )}
            <div className={`shrink-0 relative mb-1.5 transition-all duration-300 ${isMapMaximized ? "h-[calc(100vh-60px)]" : "h-[460px]"}`}>
              <MapCenter isMaximized={isMapMaximized} onToggleMaximize={() => setIsMapMaximized(!isMapMaximized)} />
            </div>
            {!isMapMaximized && (
              <div className="shrink-0 mb-4 h-auto min-h-[95px]">
                <BottomAnalytics />
              </div>
            )}
            {!isMapMaximized && (
              <div className="flex flex-col gap-5 p-1 pb-24">
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

        <div style={{ width: rightWidth, minWidth: 200, maxWidth: 600 }} className="h-full shrink-0 flex flex-col relative z-[500]">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
