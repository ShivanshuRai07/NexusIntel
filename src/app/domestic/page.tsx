"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import TopInfoBar from "@/components/TopInfoBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export default function DomesticIntelligencePage() {
  const [domesticNews, setDomesticNews] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomesticData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = (Array.isArray(data) ? data : []).filter(
        (n: any) =>
          n.colorNode === "orange" ||
          n.colorNode === "yellow-orange" ||
          n.colorNode === "light-blue" ||
          n.colorNode === "red"
      );
      setDomesticNews(items.length > 0 ? items : (Array.isArray(data) ? data : []));
    } catch (err: any) {
      setError(err?.message || "Failed to retrieve domestic stability telemetry");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomesticData();
  }, [fetchDomesticData]);

  const filteredNews = domesticNews.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "INFRASTRUCTURE") return item.colorNode === "orange" || item.source?.includes("Alert");
    if (filter === "SECURITY") return item.colorNode === "red";
    if (filter === "PUBLIC SAFETY") return item.colorNode === "yellow-orange" || item.colorNode === "light-blue";
    return true;
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
            <span>Status: <strong className="text-[#1A6B5A]">NRT ACTIVE</strong></span>
            <span>&bull;</span>
            <span>Desk: INTERNAL STABILITY & HOMELAND SECURITY</span>
          </div>
        </div>

        {/* Masthead Headline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#B8600B]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                DOMESTIC SECURITY
              </span>
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-black uppercase text-[#1C1917]">
              Domestic Stability & Critical Infrastructure
            </h1>
            <p className="text-sm text-[#44403C] font-medium leading-relaxed">
              Real-time monitoring of homeland security alerts, public order dynamics, critical utilities protection, and regional civil defense readiness.
            </p>
          </div>

          <Link href="/intelligence/cyber" className="analysis-cta text-xs shrink-0 self-start sm:self-end">
            <span>DESK DOSSIER &rarr;</span>
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Infrastructure Security Index", val: "91.8%", sub: "Nominal Operating Status" },
            { label: "Domestic Advisory Level", val: "MODERATE", sub: "National Threat Level 2" },
            { label: "Monitored Grid Nodes", val: "1,240", sub: "Power & Telecom Feeds" },
            { label: "Civil Defense Readiness", val: "HIGH", sub: "Emergency Protocol Ready" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex flex-col">
              <span className="text-[9px] text-[#78716C] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-xl font-orbitron font-bold text-[#1C1917] mt-1">{stat.val}</span>
              <span className="text-[9px] text-[#B8600B] font-medium mt-0.5">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Domestic News Wire */}
        <div className="panel p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-[#1C1917]">
            <div>
              <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
                Domestic Intelligence Wire & Alerts
              </h3>
              <span className="text-[10px] text-[#78716C] font-bold uppercase">
                {filteredNews.length} REGIONAL DISPATCHES
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["ALL", "INFRASTRUCTURE", "SECURITY", "PUBLIC SAFETY"].map((cat) => (
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm animate-pulse space-y-2">
                  <div className="h-3 w-24 bg-[#E2DBD0] rounded" />
                  <div className="h-4 w-3/4 bg-[#E2DBD0] rounded" />
                  <div className="h-3 w-full bg-[#E2DBD0] rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex flex-col items-center justify-center gap-3">
              <span className="text-xs font-bold text-[#C41E3A] uppercase tracking-wider">
                Telemetry Connection Interrupted
              </span>
              <p className="text-xs text-[#78716C] max-w-sm">{error}</p>
              <button onClick={fetchDomesticData} className="analysis-cta text-xs">
                Retry Connection
              </button>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="p-8 text-center bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm text-xs text-[#78716C]">
              No domestic intelligence items match filter &ldquo;{filter}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNews.slice(0, 10).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex flex-col justify-between hover:border-[#1C1917] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-[9px] text-[#78716C] font-semibold uppercase mb-1">
                      <span className="text-[#B8600B] font-bold">{item.source || "DOMESTIC"}</span>
                      <span>{item.location?.city || item.location?.country || "Homeland Grid"}</span>
                    </div>
                    <h4 className="font-playfair text-sm font-bold text-[#1C1917] leading-snug mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#44403C] line-clamp-2">{item.description}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#E2DBD0] flex justify-between items-center text-[10px]">
                    <span className="text-[#78716C]">Classification: UNCLASS</span>
                    <div className="flex items-center gap-3">
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#B8600B] font-bold hover:underline"
                        >
                          Read Wire &rarr;
                        </a>
                      )}
                      <Link
                        href="/intelligence/cyber"
                        className="text-[#C41E3A] font-bold hover:underline"
                      >
                        Full Analysis &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
