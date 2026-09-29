"use client";
import React, { useState } from "react";
import Link from "next/link";
import TopInfoBar from "@/components/TopInfoBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

const sovereignFunds = [
  { fund: "Norway Government Pension Fund", aum: "$1,620B", mandate: "Global Equity & Fixed Income", delta: "+8.4%", sector: "EQUITY" },
  { fund: "China Investment Corp (CIC)", aum: "$1,350B", mandate: "Strategic Infrastructure & Tech", delta: "+5.1%", sector: "INFRASTRUCTURE" },
  { fund: "SAFE Investment Company", aum: "$1,090B", mandate: "FX Reserves & Sovereign Debt", delta: "+3.9%", sector: "EQUITY" },
  { fund: "Abu Dhabi Investment Authority", aum: "$993B", mandate: "Direct Private Equity & Energy", delta: "+7.2%", sector: "ENERGY" },
  { fund: "Public Investment Fund (PIF)", aum: "$925B", mandate: "Vision 2030 & Frontier Tech", delta: "+14.8%", sector: "TECH" },
  { fund: "GIC Private Limited", aum: "$770B", mandate: "Global Real Estate & Direct PE", delta: "+6.4%", sector: "INFRASTRUCTURE" },
  { fund: "Temasek Holdings", aum: "$288B", mandate: "Life Sciences & Deep Tech", delta: "+4.2%", sector: "TECH" },
  { fund: "Qatar Investment Authority", aum: "$475B", mandate: "LNG Shipping & Sovereign Real Assets", delta: "+5.8%", sector: "ENERGY" },
];

export default function InvestmentIntelligencePage() {
  const [filter, setFilter] = useState("ALL");

  const filteredFunds = sovereignFunds.filter((f) => {
    if (filter === "ALL") return true;
    return f.sector === filter;
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
            <span>Status: <strong className="text-[#1A6B5A]">LIVE MONITORED</strong></span>
            <span>&bull;</span>
            <span>Desk: STRATEGIC CAPITAL & SOVEREIGN ALLOCATIONS</span>
          </div>
        </div>

        {/* Masthead Headline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1A6B5A]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                CAPITAL ALLOCATION
              </span>
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-black uppercase text-[#1C1917]">
              Strategic Investment & Sovereign Wealth Intelligence
            </h1>
            <p className="text-sm text-[#44403C] font-medium leading-relaxed">
              Cross-border FDI flows, sovereign wealth fund allocations, defense technology venture financings, and national security investment screening (CFIUS/FDI).
            </p>
          </div>

          <Link href="/intelligence/economy" className="analysis-cta text-xs shrink-0 self-start sm:self-end">
            <span>ECONOMY DOSSIER &rarr;</span>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Global Sovereign AUM", val: "$12.4T", sub: "+6.8% YoY Expansion" },
            { label: "Defense Tech Venture Flow", val: "$34.2B", sub: "Annual Deal Volume" },
            { label: "Semiconductor Capex", val: "$172B", sub: "Global Fab Construction" },
            { label: "CFIUS Scrutiny Ratio", val: "28.4%", sub: "Filings Under Investigation" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex flex-col">
              <span className="text-[9px] text-[#78716C] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-xl font-orbitron font-bold text-[#1C1917] mt-1">{stat.val}</span>
              <span className="text-[9px] text-[#1A6B5A] font-medium mt-0.5">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Sovereign Wealth Funds Table */}
        <div className="panel p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-[#1C1917]">
            <div>
              <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
                Sovereign Wealth Fund Deployments
              </h3>
              <span className="text-[10px] text-[#78716C] font-bold uppercase">
                {filteredFunds.length} OF {sovereignFunds.length} ALLOCATORS DISPLAYED
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["ALL", "EQUITY", "INFRASTRUCTURE", "ENERGY", "TECH"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-[9.5px] font-bold uppercase px-3 py-1 rounded-sm border transition-all ${
                    filter === cat
                      ? "bg-[#1C1917] text-white border-[#1C1917]"
                      : "bg-[#F3EFE6] text-[#78716C] border-[#E2DBD0] hover:border-[#1C1917] hover:text-[#1C1917]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFunds.map((f, i) => (
              <div
                key={f.fund}
                className="p-3.5 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#1C1917] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="font-orbitron font-bold text-xs text-[#78716C]">#{i + 1}</span>
                  <div>
                    <h4 className="font-playfair font-bold text-sm text-[#1C1917]">{f.fund}</h4>
                    <span className="text-[10px] text-[#78716C]">{f.mandate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[9px] text-[#78716C] uppercase font-bold block">Estimated AUM</span>
                    <span className="font-orbitron font-bold text-sm text-[#1C1917]">{f.aum}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#78716C] uppercase font-bold block">1-Yr Delta</span>
                    <span className="font-orbitron font-bold text-xs text-[#1A6B5A]">{f.delta}</span>
                  </div>
                  <Link
                    href="/intelligence/economy"
                    className="analysis-cta text-[9px] py-1 px-2.5 uppercase"
                  >
                    Dossier &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
