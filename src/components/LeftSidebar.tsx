"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import DefenseModal from "./DefenseModal";
import AllDealsModal from "./AllDealsModal";
import { IntelligenceEvent } from "@/types/intelligence";

const WIRE_FILTERS = ["ALL", "GLOBAL", "DOMESTIC", "DEFENSE", "ECONOMY"];

export default function LeftSidebar() {
  const feedRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // States for API data
  const [newsEvents, setNewsEvents] = useState<IntelligenceEvent[]>([]);
  const [defenseDeals, setDefenseDeals] = useState<any[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showAllDeals, setShowAllDeals] = useState(false);

  // Loading & error states
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [dealsError, setDealsError] = useState<string | null>(null);

  // Fetch news
  const fetchNews = useCallback(() => {
    setLoadingNews(true);
    setNewsError(null);
    fetch("/api/intelligence")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load intelligence wire");
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.events)) {
          setNewsEvents(data.events);
        } else {
          setNewsEvents([]);
        }
        setLoadingNews(false);
      })
      .catch(() => {
        // Fallback to /api/news directly
        fetch("/api/news")
          .then((res) => {
            if (!res.ok) throw new Error("Intelligence gateway offline");
            return res.json();
          })
          .then((data) => {
            setNewsEvents(Array.isArray(data) ? data : []);
            setLoadingNews(false);
          })
          .catch((err) => {
            setNewsError(err.message || "Failed to load intelligence wire");
            setLoadingNews(false);
          });
      });
  }, []);

  // Fetch defense deals
  const fetchDeals = useCallback(() => {
    setLoadingDeals(true);
    setDealsError(null);
    fetch("/api/defense")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load defense procurement logs");
        return res.json();
      })
      .then((data) => {
        setDefenseDeals(Array.isArray(data) ? data : []);
        setLoadingDeals(false);
      })
      .catch((err) => {
        setDealsError(err.message || "Arms transfer telemetry unreachable");
        setLoadingDeals(false);
      });
  }, []);

  useEffect(() => {
    fetchNews();
    fetchDeals();
  }, [fetchNews, fetchDeals]);

  // Working auto-scroller for news feed with pause on hover
  useEffect(() => {
    if (newsEvents.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setScrollPos((prev) => {
        const el = feedRef.current;
        if (!el) return prev;
        const max = el.scrollHeight / 2;
        const next = prev + 0.35;
        return next >= max ? 0 : next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [newsEvents, isPaused]);

  useEffect(() => {
    if (feedRef.current && !isPaused) feedRef.current.scrollTop = scrollPos;
  }, [scrollPos, isPaused]);

  // Filter news events based on active category filter
  const filteredEvents = newsEvents.filter((e) => {
    if (activeFilter === "ALL") return true;
    const cat = (e.category || "").toLowerCase();
    const filt = activeFilter.toLowerCase();
    if (filt === "defense") return cat === "defense" || e.colorNode === "red";
    if (filt === "domestic") return cat === "domestic" || e.colorNode === "orange";
    if (filt === "economy") return cat === "economy" || e.colorNode === "light-blue";
    if (filt === "global") return cat === "global" || e.colorNode === "green" || e.colorNode === "yellow-orange";
    return true;
  });

  const getRelativeTime = (isoString?: string) => {
    if (!isoString) return "just now";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
        {/* ========================================================
            COLUMN 1: LIVE WIRE INTELLIGENCE FEED
            ======================================================== */}
        <div className="panel p-5 flex flex-col shrink-0 relative">
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#1C1917]">
            <div className="flex items-center gap-2">
              <span className="live-indicator" />
              <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
                Live Wire Intelligence
              </h3>
            </div>
            <span className="text-[9px] text-[#78716C] uppercase font-bold tracking-widest font-mono">
              OSINT FEED
            </span>
          </div>

          {/* Working Category Filter Bar */}
          <div className="flex items-center gap-1 pb-3 mb-3 border-b border-[#E2DBD0] overflow-x-auto thin-scroll">
            {WIRE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-xs transition-colors shrink-0 ${
                  activeFilter === f
                    ? "bg-[#C41E3A] text-white font-black"
                    : "bg-[#F3EFE6] text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loadingNews ? (
            <div className="h-72 flex flex-col items-center justify-center gap-2 text-center">
              <div className="w-5 h-5 border-2 border-[#C41E3A] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-[#78716C] font-medium">Syncing live dispatch stream...</span>
            </div>
          ) : newsError ? (
            /* Error State with Retry */
            <div className="h-72 flex flex-col items-center justify-center gap-2 text-center p-4">
              <div className="text-xs font-bold text-[#C41E3A] uppercase">Wire Feed Unavailable</div>
              <p className="text-[11px] text-[#78716C] mb-2">{newsError}</p>
              <button
                onClick={fetchNews}
                className="px-3 py-1.5 bg-[#C41E3A] text-white text-[10px] font-bold uppercase rounded-xs"
              >
                Retry Wire &rarr;
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Empty State */
            <div className="h-72 flex flex-col items-center justify-center gap-2 text-center p-4">
              <div className="text-xs font-bold text-[#1C1917] uppercase">No Intelligence Events Found</div>
              <p className="text-[11px] text-[#78716C]">No dispatches match the {activeFilter} filter criteria.</p>
              <button
                onClick={() => setActiveFilter("ALL")}
                className="text-xs font-bold text-[#C41E3A] underline mt-1"
              >
                Reset to ALL Dispatches
              </button>
            </div>
          ) : (
            /* Working Feed List */
            <div
              className="h-[430px] overflow-hidden relative cursor-pointer"
              ref={feedRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div>
                {[...filteredEvents, ...filteredEvents].map((e, i) => (
                  <div
                    key={`${e.id}-${i}`}
                    className="article-card mb-3 p-3.5 group bg-white border border-[#E2DBD0] rounded-sm hover:border-[#1C1917] transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`severity-badge ${
                            e.severity === "critical"
                              ? "badge-critical"
                              : e.severity === "warning"
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {e.category?.toUpperCase() || "INTEL"}
                        </span>
                        <span className="text-[9px] font-bold text-[#78716C] uppercase tracking-wider">
                          {e.source || "OSINT"}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#78716C] font-mono">
                        {getRelativeTime(e.timestamp || e.publishedAt)}
                      </span>
                    </div>

                    {/* Headline */}
                    <h4 className="text-xs font-playfair font-black text-[#1C1917] leading-snug group-hover:text-[#C41E3A] transition-colors mb-1">
                      {e.title}
                    </h4>

                    {/* Description */}
                    {e.summary && (
                      <p className="text-[11px] text-[#44403C] leading-relaxed line-clamp-2 mb-2.5">
                        {e.summary}
                      </p>
                    )}

                    {/* Actionable CTAs: Dossier + Source */}
                    <div className="flex justify-between items-center pt-2 border-t border-[#E2DBD0]">
                      <span className="text-[9px] text-[#78716C]">
                        {e.location?.city ? `${e.location.city}, ` : ""}
                        {e.location?.country || "International"}
                      </span>
                      <div className="flex items-center gap-3">
                        {e.url && (
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-[#78716C] hover:text-[#1C1917] flex items-center gap-0.5 uppercase tracking-wider underline"
                            onClick={(ev) => ev.stopPropagation()}
                          >
                            Source [↗]
                          </a>
                        )}
                        <Link
                          href={`/intelligence/${e.category || "defense"}`}
                          className="analysis-cta text-[10px] py-1 px-2.5"
                          onClick={(ev) => ev.stopPropagation()}
                        >
                          <span>Full Analysis</span>
                          <span className="font-bold">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            COLUMN 2: DEFENSE PROCUREMENT & ARMS TRANSFERS
            ======================================================== */}
        <div className="panel p-5 flex flex-col shrink-0">
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#1C1917]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#C41E3A]">⚔</span>
              <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
                Defense & Strategic Deals
              </h3>
            </div>
            <button
              onClick={() => setShowAllDeals(true)}
              className="text-[10px] font-bold text-[#C41E3A] hover:text-[#9F1730] transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              All {defenseDeals.length} Deals &rarr;
            </button>
          </div>

          {loadingDeals ? (
            <div className="h-72 flex flex-col items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[#B8860B] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-[#78716C]">Decrypting arms registries...</span>
            </div>
          ) : dealsError ? (
            <div className="h-72 flex flex-col items-center justify-center gap-2 text-center p-4">
              <div className="text-xs font-bold text-[#C41E3A] uppercase">Defense Telemetry Error</div>
              <p className="text-[11px] text-[#78716C] mb-2">{dealsError}</p>
              <button
                onClick={fetchDeals}
                className="px-3 py-1.5 bg-[#C41E3A] text-white text-[10px] font-bold uppercase rounded-xs"
              >
                Retry Deals &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto thin-scroll pr-1">
              {defenseDeals.slice(0, 6).map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white border border-[#E2DBD0] rounded-sm p-3.5 cursor-pointer hover:border-[#1C1917] hover:shadow-sm transition-all group"
                  onClick={() => setSelectedDeal(deal)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#78716C] uppercase tracking-wider">
                      <span className="text-[#1C1917]">{deal.country1}</span>
                      <span className="text-[#C41E3A] font-black">&rarr;</span>
                      <span className="text-[#1C1917]">{deal.country2}</span>
                    </div>
                    <span className="text-[9px] text-[#78716C] font-mono">{getRelativeTime(deal.date)}</span>
                  </div>

                  <h4 className="text-xs font-playfair font-black text-[#1C1917] group-hover:text-[#C41E3A] transition-colors leading-snug mb-1.5">
                    {deal.title}
                  </h4>

                  <div className="flex justify-between items-center pt-2 border-t border-[#E2DBD0]">
                    <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-[#F3EFE6] text-[#44403C]">
                      {deal.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-orbitron text-xs font-bold text-[#1A6B5A]">
                        {deal.value}
                      </span>
                      <span className="text-[10px] font-bold text-[#C41E3A] group-hover:underline">
                        Details &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowAllDeals(true)}
                  className="w-full py-2 bg-[#F3EFE6] hover:bg-[#E2DBD0] border border-[#C8BFB0] rounded-sm text-[10px] font-bold text-[#1C1917] uppercase tracking-widest transition-all"
                >
                  View All Strategic Procurement Logs &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Defense Deal Detail Modal */}
      {selectedDeal && (
        <DefenseModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      )}

      {/* Full Deals List Overlay */}
      {showAllDeals && (
        <AllDealsModal
          deals={defenseDeals}
          onClose={() => setShowAllDeals(false)}
          onSelectDeal={(d: any) => setSelectedDeal(d)}
        />
      )}
    </>
  );
}
