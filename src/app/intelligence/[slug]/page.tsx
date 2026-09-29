"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import TopInfoBar from "@/components/TopInfoBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const domainConfigs: Record<string, any> = {
  defense: {
    title: "Military & Defense",
    color: "#C41E3A",
    subtitle: "Strategic Arms Transfers, SIPRI Expenditure & Theater Deployments",
    description:
      "Deep-dive telemetry on bilateral weapons deliveries, missile tests, naval carrier task groups, and defense industrial capacity.",
    stats: [
      { label: "Active Deployments", val: "2.4M", delta: "12 Theaters" },
      { label: "Defense Outlay", val: "$2.44T", delta: "+4.8% YoY" },
      { label: "Tracked Transfers", val: "148 Deals", delta: "72h Log" },
    ],
  },
  technology: {
    title: "Technology & Innovation",
    color: "#5B2D8E",
    subtitle: "Semiconductors, Sovereign AI Compute & Export Controls",
    description:
      "Deep-dive telemetry into advanced packaging fab utilization, EUV lithography tooling, and global AI venture capital flows.",
    stats: [
      { label: "Compute Capacity", val: "4.2 ExaFLOPS", delta: "+15%" },
      { label: "Fab Utilization", val: "94.2%", delta: "-0.5%" },
      { label: "R&D Expenditure", val: "$1.2T", delta: "+8.2%" },
    ],
  },
  agriculture: {
    title: "Agriculture & Food Security",
    color: "#1A6B5A",
    subtitle: "Arable Drought Vulnerability, Grain Chokepoints & Fertilizer Spreads",
    description:
      "Monitoring global wheat, rice, and maize reserves, Black Sea corridor trade volumes, and fertilizer supply chains.",
    stats: [
      { label: "Wheat Deficit", val: "-4.2M Tons", delta: "High Risk" },
      { label: "Fertilizer Cost", val: "142.4", delta: "+2.1%" },
      { label: "Soil Moisture", val: "64%", delta: "Monitored" },
    ],
  },
  climate: {
    title: "Climate & Geospatial Risk",
    color: "#1D4E89",
    subtitle: "Thermal Anomaly Tracking, Atmospheric PPM & Natural Disaster Vectors",
    description:
      "Synthesizing ocean surface temperatures, polar ice extent, wildfire hazard indexes, and tropical storm trajectories.",
    stats: [
      { label: "Surface Anomaly", val: "+1.28°C", delta: "Critical" },
      { label: "CO2 PPM Delta", val: "+2.4 ppm", delta: "+0.6%" },
      { label: "Active Storms", val: "4 Systems", delta: "Tracked" },
    ],
  },
  economy: {
    title: "Global Economy & Commodities",
    color: "#B8860B",
    subtitle: "Inflation Pressures, Sovereign Spreads & Energy Markets",
    description:
      "Real-time benchmark monitoring across Brent crude, gold bullion, freight rates, and emerging market debt refinancing.",
    stats: [
      { label: "GDP Baseline", val: "2.4%", delta: "IMF Est." },
      { label: "Trade Flow", val: "1,842 BDI", delta: "-14%" },
      { label: "Brent Spot", val: "$82.4", delta: "+1.2%" },
    ],
  },
  cyber: {
    title: "Cyber & Digital Defense",
    color: "#C41E3A",
    subtitle: "Nation-State Incursions, Zero-Day Vulnerabilities & Grid Security",
    description:
      "Aggregating honeypot intrusions, ransomware extortions, submarine communications cable health, and critical grid defense.",
    stats: [
      { label: "Incursion Volume", val: "720/wk", delta: "+18%" },
      { label: "Active Zero-Days", val: "14 Vulns", delta: "Alert" },
      { label: "Grid Integrity", val: "88.4%", delta: "-0.2%" },
    ],
  },
  science: {
    title: "Scientific Research & Space",
    color: "#5B2D8E",
    subtitle: "Orbital Launches, Deep-Tech Publications & Fusion Milestones",
    description:
      "Tracking orbital payloads, biotechnology CRISPR breakthroughs, quantum computing hardware, and fusion energy plasma duration.",
    stats: [
      { label: "Annual Launches", val: "340 Orbit", delta: "+19%" },
      { label: "Breakthroughs", val: "142 Logged", delta: "Active" },
      { label: "Fusion Record", val: "480 Sec", delta: "Milestone" },
    ],
  },
  metals: {
    title: "Strategic Metals & Rare Earths",
    color: "#B8600B",
    subtitle: "Critical Minerals, Refined Lithium & Sovereign Stockpiles",
    description:
      "Tracking neodymium, gallium, germanium, cobalt, and lithium refining monopoly nodes and strategic stockpiling legislation.",
    stats: [
      { label: "Lithium Index", val: "$18.4k/t", delta: "+3.2%" },
      { label: "Refining Chokepoint", val: "78% East Asia", delta: "Monopoly" },
      { label: "Reserves Ratio", val: "4.2 Mos", delta: "Watch" },
    ],
  },
};

const historicalData = [
  { year: "2020", value: 114 },
  { year: "2021", value: 146 },
  { year: "2022", value: 186 },
  { year: "2023", value: 223 },
  { year: "2024", value: 285 },
  { year: "2025", value: 332 },
];

const regionalData = [
  { field: "APAC", delta: 82 },
  { field: "North America", delta: 65 },
  { field: "Europe", delta: 54 },
  { field: "Latin America", delta: 32 },
  { field: "Middle East & Africa", delta: 28 },
];

export default function IntelligenceDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "defense";
  const config = domainConfigs[slug] || domainConfigs.defense;
  const [insight, setInsight] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInsight = () => {
    setIsGenerating(true);
    setInsight("");
    const text = `Analyzing ${config.title} telemetry stream... Detected 14% anomalous shift in cross-border logistical dependencies and sovereign bilateral exposure. Projected standard deviation indicates elevated volatility in secondary supply chains over Q3. Strategic Recommendation: Accelerate secondary supplier audits and replenish sovereign reserve buffers. Telemetry confidence: 94.2%.`;

    let i = 0;
    const interval = setInterval(() => {
      setInsight(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 18);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1917] flex flex-col font-sans">
      <TopInfoBar />
      <Header />
      <CategoryNav />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Return to Global Intelligence Platform</span>
          </button>
          <div className="flex items-center gap-2 text-[10px] text-[#78716C] font-semibold uppercase">
            <span>Security Classification: UNCLASSIFIED</span>
            <span>&bull;</span>
            <span className="text-[#C41E3A] font-bold">DESK: {slug.toUpperCase()}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                INTELLIGENCE DOSSIER
              </span>
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-black uppercase text-[#1C1917] leading-tight">
              {config.title}
            </h1>
            <p className="text-sm text-[#44403C] font-medium leading-relaxed">
              {config.subtitle}. {config.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            {config.stats.map((stat: any) => (
              <div key={stat.label} className="p-3 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex flex-col">
                <span className="text-[8.5px] text-[#78716C] font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-lg font-orbitron font-bold text-[#1C1917] mt-0.5">
                  {stat.val}
                </span>
                <span className="text-[9px] font-bold text-[#1A6B5A] mt-0.5">{stat.delta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Dossier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: AI Synthesis & Strategic Alerts */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* AI Synthesis Card */}
            <div className="panel p-5 border-l-4" style={{ borderLeftColor: config.color }}>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2DBD0]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: config.color }} />
                  <div>
                    <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917]">
                      Executive AI Synthesis
                    </h3>
                    <span className="text-[8px] text-[#78716C] font-semibold block uppercase">
                      PROTOTYPE SYNTHESIS &bull; 18 OSINT NODES
                    </span>
                  </div>
                </div>
                <button
                  onClick={generateInsight}
                  disabled={isGenerating}
                  className="analysis-cta text-[9px] py-1 px-2.5 uppercase tracking-wider disabled:opacity-50"
                >
                  {isGenerating ? "Synthesizing..." : "Generate →"}
                </button>
              </div>

              <div className="bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-3.5 min-h-[200px] text-xs leading-relaxed text-[#1C1917]">
                {insight ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[8px] text-[#78716C] font-bold uppercase pb-1 border-b border-[#E2DBD0]">
                      <span className="text-[#C41E3A]">OSINT ENGINE // CONFIDENCE 94.2%</span>
                      <span>STATUS: NRT ANALYSIS</span>
                    </div>
                    <p className="font-medium">{insight}</p>
                    {!isGenerating && (
                      <div className="pt-3 border-t border-[#E2DBD0] flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold uppercase text-[#78716C]">
                          Actionable Contingencies:
                        </span>
                        <ul className="list-disc list-inside text-[#44403C] text-[11px] space-y-1">
                          <li>Diversify logistics maritime paths through alternative corridors</li>
                          <li>Hedge exposure against sudden foreign exchange spread divergence</li>
                          <li>Activate secondary supplier verification protocol</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#78716C] italic py-8">
                    Trigger automated OSINT synthesis to generate multi-vector risk assessment for this desk.
                  </div>
                )}
              </div>
            </div>

            {/* Strategic Bulletins */}
            <div className="panel p-5">
              <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917] pb-3 mb-3 border-b-2 border-[#1C1917]">
                Sector Threat Bulletins
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 border-l-2 border-[#C41E3A] bg-[#F3EFE6] flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[8.5px]">
                      <span className="font-bold text-[#C41E3A] uppercase">Active Anomaly Notice</span>
                      <span className="text-[#78716C] font-semibold">{i * 2}h ago</span>
                    </div>
                    <h4 className="text-xs font-playfair font-black text-[#1C1917]">
                      Heightened friction detected in {config.title} transit points
                    </h4>
                    <p className="text-[11px] text-[#44403C]">
                      Elevated risk indices reported across bilateral inspection checkpoints.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Historical Analysis & Data Sources */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Historical Trend Chart */}
            <div className="panel p-5">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#1C1917]">
                <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917]">
                  Multi-Year Telemetry & Volume Index
                </h3>
                <span className="text-[9px] text-[#78716C] font-bold uppercase tracking-wider">
                  2020–2025 TREND
                </span>
              </div>
              <div className="h-64 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,80,50,0.12)" vertical={false} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#78716C" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#78716C" }} />
                    <Tooltip
                      contentStyle={{
                        background: "#FAF7F0",
                        border: "1px solid #1C1917",
                        borderRadius: "2px",
                        fontSize: "10px",
                        color: "#1C1917",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={config.color}
                      strokeWidth={2.5}
                      fill="url(#detailGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional & Source Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="panel p-5">
                <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917] pb-3 mb-3 border-b-2 border-[#1C1917]">
                  Regional Exposure Distribution
                </h3>
                <div className="h-44 bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,80,50,0.12)" vertical={false} />
                      <XAxis dataKey="field" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#78716C" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#78716C" }} />
                      <Tooltip
                        contentStyle={{
                          background: "#FAF7F0",
                          border: "1px solid #1C1917",
                          borderRadius: "2px",
                          fontSize: "10px",
                          color: "#1C1917",
                        }}
                      />
                      <Bar dataKey="delta" fill={config.color} radius={[2, 2, 0, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917] pb-3 mb-3 border-b-2 border-[#1C1917]">
                    OSINT Ingestion Integrity
                  </h3>
                  <div className="space-y-3 pt-1">
                    {[
                      { s: "Satellite Telemetry (Sentinel / SAR)", val: 98, color: "#1A6B5A" },
                      { s: "Ground Station Sensor Feeds", val: 84, color: "#1D4E89" },
                      { s: "Open-Source Dispatches & News", val: 76, color: "#B8860B" },
                    ].map((src) => (
                      <div key={src.s} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-[#44403C] font-medium">{src.s}</span>
                          <span className="font-orbitron font-bold text-[#1C1917]">{src.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#E2DBD0] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${src.val}%`, backgroundColor: src.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-2 bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] text-[9px] text-[#78716C]">
                  Last telemetry sync verified 4 minutes ago via NexusIntel Gateway.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cross-Domain Dossier Index Bar */}
        <div className="panel p-5 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-[#1C1917]">
            <div>
              <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917]">
                Cross-Domain Intelligence Desks
              </h3>
              <p className="text-[10px] text-[#78716C]">
                Explore related intelligence domains and threat telemetry across all specialized desks.
              </p>
            </div>
            <span className="text-[9px] font-bold text-[#C41E3A] uppercase tracking-wider">
              8 ACTIVE DESKS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {[
              { id: "defense", name: "Defense", color: "#C41E3A" },
              { id: "technology", name: "Technology", color: "#5B2D8E" },
              { id: "economy", name: "Economy", color: "#B8860B" },
              { id: "cyber", name: "Cyber", color: "#C41E3A" },
              { id: "climate", name: "Climate", color: "#1D4E89" },
              { id: "agriculture", name: "Agriculture", color: "#1A6B5A" },
              { id: "science", name: "Science", color: "#5B2D8E" },
              { id: "metals", name: "Metals", color: "#B8600B" },
            ].map((desk) => {
              const isActive = slug === desk.id;
              return (
                <Link
                  key={desk.id}
                  href={`/intelligence/${desk.id}`}
                  className={`p-2.5 rounded-sm border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isActive
                      ? "bg-[#1C1917] text-white border-[#1C1917]"
                      : "bg-[#F3EFE6] text-[#1C1917] border-[#E2DBD0] hover:border-[#1C1917] hover:bg-white"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isActive ? "#FFFFFF" : desk.color }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {desk.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
