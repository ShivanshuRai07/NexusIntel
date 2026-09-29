"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t-2 border-[#1C1917] bg-[#1C1917] text-[#FAF7F0]">
      {/* Top Banner / Masthead Imprint */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#44403C]">
          {/* Brand Info */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 bg-[#C41E3A] text-white font-serif font-black text-lg rounded-sm">
                N
              </span>
              <span className="font-playfair text-xl font-black tracking-wider text-white">
                NEXUSINTEL
              </span>
            </div>
            <p className="text-xs text-[#A8A29E] leading-relaxed">
              Global intelligence platform synthesizing real-time defense events, macroeconomic shifts, geospatial telemetry, and strategic risk indexes for decision-makers.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#A8A29E] font-medium pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#1A6B5A] animate-pulse" />
              <span>LIVE TELEMETRY ACTIVE &bull; 24/7 MONITORING</span>
            </div>
          </div>

          {/* Intelligence Desks */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E2DBD0] border-b border-[#44403C] pb-1.5">
              Intelligence Desks
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A8A29E]">
              <li>
                <Link href="/defense-intelligence" className="hover:text-white transition-colors">
                  Defense & Arms Transfers
                </Link>
              </li>
              <li>
                <Link href="/economic-intelligence" className="hover:text-white transition-colors">
                  Global Economy & Commodities
                </Link>
              </li>
              <li>
                <Link href="/technology-intelligence" className="hover:text-white transition-colors">
                  Semiconductors & AI Assets
                </Link>
              </li>
              <li>
                <Link href="/cyber-intelligence" className="hover:text-white transition-colors">
                  Cyber Operations & Threats
                </Link>
              </li>
              <li>
                <Link href="/climate-intelligence" className="hover:text-white transition-colors">
                  Geospatial Climate Telemetry
                </Link>
              </li>
              <li>
                <Link href="/agriculture-intelligence" className="hover:text-white transition-colors">
                  Agritech & Food Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Strategic Features */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E2DBD0] border-b border-[#44403C] pb-1.5">
              Operations & Data
            </h4>
            <ul className="space-y-1.5 text-xs text-[#A8A29E]">
              <li>
                <a href="#nexusintel-map" className="hover:text-white transition-colors">
                  Interactive Conflict & Vessel Map
                </a>
              </li>
              <li>
                <Link href="/metals-intelligence" className="hover:text-white transition-colors">
                  Strategic Metals & Reserves
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-white transition-colors">
                  SIPRI Military Budget Analysis
                </Link>
              </li>
              <li>
                <Link href="/global" className="hover:text-white transition-colors">
                  Alliance Network Assessments
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-white transition-colors">
                  Executive Briefings & Dispatches
                </Link>
              </li>
            </ul>
          </div>

          {/* Source Verification & Telemetry */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#E2DBD0] border-b border-[#44403C] pb-1.5">
              Verified Sources
            </h4>
            <p className="text-[11px] text-[#A8A29E] leading-relaxed">
              Synthesized from open-source intelligence (OSINT), satellite radar feeds, UN OCHA reports, SIPRI defense repositories, maritime AIS transponders, and commodities exchanges.
            </p>
            <div className="mt-2 p-2.5 rounded bg-[#292524] border border-[#44403C] text-[10px] text-[#E2DBD0]">
              <div className="font-semibold text-white mb-0.5">EDITION 2026.09</div>
              <div>Security Classification: UNCLASSIFIED // PUBLIC RELEASE</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78716C] gap-3">
          <div>
            &copy; {new Date().getFullYear()} NEXUSINTEL GLOBAL INTELLIGENCE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase">
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-white transition-colors">Intelligence Ethics</Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-white transition-colors">API Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
