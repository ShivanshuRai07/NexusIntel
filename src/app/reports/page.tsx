"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopInfoBar from "@/components/TopInfoBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

interface Report {
  id: string;
  title: string;
  date: string;
  pages: string;
  classification: string;
  desk: string;
  summary: string;
  findings: string[];
  methodology: string;
}

const allReports: Report[] = [
  {
    id: "REP-2026-Q3",
    title: "Global Geopolitical Threat Assessment & Conflict Horizon (2026–2028)",
    date: "September 2026",
    pages: "48 Pages",
    classification: "PUBLIC MONOGRAPH",
    desk: "DEFENSE",
    summary:
      "Comprehensive multi-theater analysis of conventional deterrent balances in Eastern Europe, Taiwan Strait maritime logistics, and Middle Eastern missile saturation doctrines.",
    findings: [
      "Conventional ammunition inventory replenishment lag remains the primary operational bottleneck across European coalition arsenals.",
      "Dual-use commercial satellite imagery and synthetic aperture radar (SAR) have compressed military tactical surprise windows to under 90 minutes.",
      "Carrier Strike Group rotation tempos in the Western Pacific reflect sustained elevated readiness levels.",
    ],
    methodology: "Synthesized from 1,400+ verified OSINT feeds, satellite telemetry, UN resolutions, and SIPRI procurement registers.",
  },
  {
    id: "REP-2026-TECH",
    title: "Sovereign AI Infrastructure & Semiconductor Chokepoint Vulnerability",
    date: "August 2026",
    pages: "36 Pages",
    classification: "EXECUTIVE BRIEF",
    desk: "TECHNOLOGY",
    summary:
      "Assessing EUV tooling export restrictions, advanced CoWoS packaging capacity constraints in East Asia, and sovereign compute cluster energy footprints.",
    findings: [
      "Advanced packaging fab utilization in Taiwan exceeds 94%, with lead times stretching beyond 24 weeks.",
      "Sovereign AI data center electrical grid interconnection delays average 3.2 years across Tier-1 OECD markets.",
      "High-bandwidth memory (HBM3e) allocation contracts are locked through Q4 2027.",
    ],
    methodology: "Fab equipment supplier telemetry, patent citation graphs, and energy interconnect filings.",
  },
  {
    id: "REP-2026-COMM",
    title: "Critical Maritime Chokepoints: Suez, Malacca & Bab-el-Mandeb Stress Test",
    date: "July 2026",
    pages: "42 Pages",
    classification: "STRATEGIC DOSSIER",
    desk: "COMMODITIES",
    summary:
      "Quantitative trade volume rerouting scenarios, maritime insurance premium spikes, and container freight impact across European and Asian manufacturing hubs.",
    findings: [
      "Cape of Good Hope rerouting incurs an average 12.4-day transit delay and $840k in additional bunker fuel per voyage.",
      "Marine hull war-risk insurance premiums remain elevated at 0.7% of insured vessel value.",
      "VLCC tanker availability for European imports tightened by 18% over the trailing quarter.",
    ],
    methodology: "Real-time AIS transponder tracking, Lloyd's List intelligence, and commodities exchange data.",
  },
  {
    id: "REP-2026-CYBER",
    title: "Nation-State Cyber Incursions into Civil Energy Grids & Submarine Cables",
    date: "June 2026",
    pages: "28 Pages",
    classification: "SECURITY AUDIT",
    desk: "CYBER",
    summary:
      "Mapping documented pre-positioning campaigns targeting Baltic subsea energy interconnectors and high-voltage transmission SCADA networks.",
    findings: [
      "Living-off-the-land (LotL) persistence techniques were identified in 64% of documented industrial control intrusions.",
      "Submarine cable optical monitoring stations detected 4 separate unannounced acoustic mapping passes.",
      "Grid operator patch velocity for ICS firmware vulnerabilities averages 114 days from disclosure.",
    ],
    methodology: "De-anonymized honeypot telemetry, CISA/CERT-EU emergency advisories, and OT network anomaly captures.",
  },
];

const DESK_FILTERS = ["ALL", "DEFENSE", "TECHNOLOGY", "COMMODITIES", "CYBER"];

export default function ReportsPage() {
  const [activeDesk, setActiveDesk] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedReport(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredReports = allReports.filter((r) => {
    const matchesDesk = activeDesk === "ALL" || r.desk === activeDesk;
    const matchesSearch =
      !search.trim() ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    return matchesDesk && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1917] flex flex-col font-sans">
      <TopInfoBar />
      <Header />
      <CategoryNav />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Return to Global Intelligence Platform</span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-[#78716C] font-semibold uppercase">
            <span>Desk: EXECUTIVE RESEARCH & INTELLIGENCE MONOGRAPHS</span>
          </div>
        </div>

        {/* Masthead Headline */}
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#C41E3A]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
              EXECUTIVE BRIEFINGS
            </span>
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl font-black uppercase text-[#1C1917]">
            Intelligence Reports & Strategic Monographs
          </h1>
          <p className="text-sm text-[#44403C] font-medium leading-relaxed">
            In-depth analytical whitepapers, quarterly strategic forecasts, and risk assessments compiled by NexusIntel senior defense, macroeconomic, and cyber analysts.
          </p>
        </div>

        {/* Working Desk Filter & Search Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#E2DBD0]">
          <div className="flex items-center gap-1.5 overflow-x-auto thin-scroll">
            {DESK_FILTERS.map((desk) => (
              <button
                key={desk}
                onClick={() => setActiveDesk(desk)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-colors shrink-0 ${
                  activeDesk === desk
                    ? "bg-[#C41E3A] text-white font-black"
                    : "bg-[#F3EFE6] text-[#78716C] hover:text-[#1C1917] border border-[#E2DBD0]"
                }`}
              >
                {desk}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by keyword or ID..."
              className="px-3 py-1.5 bg-white border border-[#C8BFB0] rounded-xs text-xs text-[#1C1917] placeholder-[#78716C] outline-none focus:border-[#C41E3A] w-64"
            />
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.length === 0 ? (
            <div className="col-span-2 py-16 text-center">
              <h3 className="font-playfair font-bold text-base text-[#1C1917]">No Matching Monographs Located</h3>
              <p className="text-xs text-[#78716C] mt-1">Adjust your desk filter or search query to locate relevant publications.</p>
            </div>
          ) : (
            filteredReports.map((rep) => (
              <div
                key={rep.id}
                className="panel p-6 flex flex-col justify-between hover:border-[#1C1917] hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between text-[9px] text-[#78716C] font-bold uppercase tracking-wider pb-2 mb-2 border-b border-[#E2DBD0]">
                    <span className="text-[#C41E3A] font-orbitron">{rep.id}</span>
                    <span>{rep.date} &bull; {rep.pages}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-xs bg-[#F3EFE6] border border-[#E2DBD0] text-[#44403C] uppercase">
                      {rep.desk} DESK
                    </span>
                  </div>
                  <h3 className="font-playfair text-base font-black text-[#1C1917] group-hover:text-[#C41E3A] transition-colors leading-snug mb-2">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-[#44403C] leading-relaxed mb-4">
                    {rep.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2DBD0] flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#78716C] uppercase font-mono">
                    {rep.classification}
                  </span>
                  <button
                    onClick={() => setSelectedReport(rep)}
                    className="analysis-cta text-xs py-1.5 px-3"
                  >
                    <span>Read Monograph</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Interactive Report Dossier Reader Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-3xl bg-[#FAF7F0] border-2 border-[#1C1917] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b-2 border-[#1C1917] bg-[#F3EFE6] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C41E3A] animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-[#C41E3A] uppercase">
                  {selectedReport.id} // {selectedReport.classification}
                </span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-7 h-7 flex items-center justify-center rounded-sm text-[#78716C] hover:text-[#1C1917] hover:bg-[#E2DBD0] font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto thin-scroll space-y-5 bg-[#FAF7F0]">
              <div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-xs bg-[#C41E3A]/10 text-[#C41E3A] uppercase font-mono">
                  {selectedReport.desk}
                </span>
                <h2 className="font-playfair font-black text-xl text-[#1C1917] mt-2 leading-snug">
                  {selectedReport.title}
                </h2>
                <div className="text-[10px] text-[#78716C] mt-1 font-mono">
                  Published: {selectedReport.date} &bull; Monograph Length: {selectedReport.pages}
                </div>
              </div>

              <div className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#C41E3A] mb-1.5">
                  Executive Briefing
                </h4>
                <p className="text-xs text-[#1C1917] leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>

              <div>
                <h4 className="font-playfair font-black text-sm text-[#1C1917] mb-2">
                  Key Strategic Findings
                </h4>
                <ul className="space-y-2">
                  {selectedReport.findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#44403C] leading-relaxed">
                      <span className="font-bold text-[#C41E3A] mt-0.5">&bull;</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#E2DBD0] text-[11px] text-[#78716C]">
                <strong>Methodology & Ingestion:</strong> {selectedReport.methodology}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t-2 border-[#1C1917] flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#1C1917] text-white hover:bg-[#333] text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span>Print / Save PDF</span>
                </button>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#1A6B5A] font-bold">● ARCHIVE STATUS: VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
