"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import TopInfoBar from "@/components/TopInfoBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";

export default function GlobalIntelligencePage() {
  const [news, setNews] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to retrieve global intelligence wire");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalNews();
  }, [fetchGlobalNews]);

  const filteredNews = news.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "SECURITY") return item.colorNode === "red" || item.colorNode === "orange";
    if (filter === "DIPLOMACY") return item.colorNode === "blue" || item.colorNode === "purple";
    if (filter === "SANCTIONS") return item.colorNode === "yellow-orange" || item.source?.includes("Reuters");
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
            <span>Desk: MULTILATERAL DIPLOMACY</span>
          </div>
        </div>

        {/* Masthead Headline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1D4E89]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                GLOBAL GEOPOLITICS
              </span>
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-black uppercase text-[#1C1917]">
              Global Affairs & Diplomatic Strategy
            </h1>
            <p className="text-sm text-[#44403C] font-medium leading-relaxed">
              Continuous synthesis of treaty alignments, bilateral security pacts, United Nations security resolutions, and multilateral sanctions regimes.
            </p>
          </div>

          <Link href="/intelligence/defense" className="analysis-cta text-xs shrink-0 self-start sm:self-end">
            <span>DESK DOSSIER &rarr;</span>
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Active Diplomatic Treaties", val: "184", sub: "Global Monitor" },
            { label: "UN Security Council Res.", val: "14", sub: "In Review" },
            { label: "Sanctioned Sovereign Entities", val: "2,410", sub: "OFAC / EU" },
            { label: "Cross-Border Flashpoints", val: "23", sub: "Level: High" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex flex-col">
              <span className="text-[9px] text-[#78716C] font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-xl font-orbitron font-bold text-[#1C1917] mt-1">{stat.val}</span>
              <span className="text-[9px] text-[#1D4E89] font-medium mt-0.5">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Dispatches Feed */}
        <div className="panel p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-[#1C1917]">
            <div>
              <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
                Multilateral Intelligence Wire
              </h3>
              <span className="text-[10px] text-[#78716C] font-bold uppercase">
                {filteredNews.length} DISPATCHES LOGGED
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["ALL", "SECURITY", "DIPLOMACY", "SANCTIONS"].map((cat) => (
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
              {[1, 2, 4, 5].map((i) => (
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
              <button onClick={fetchGlobalNews} className="analysis-cta text-xs">
                Retry Connection
              </button>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="p-8 text-center bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm text-xs text-[#78716C]">
              No global intelligence events match filter &ldquo;{filter}&rdquo;.
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
                      <span className="text-[#C41E3A] font-bold">{item.source || "OSINT"}</span>
                      <span>{item.location?.country || "International"}</span>
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
                          className="text-[#1D4E89] font-bold hover:underline"
                        >
                          Read Wire &rarr;
                        </a>
                      )}
                      <Link
                        href="/intelligence/defense"
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
