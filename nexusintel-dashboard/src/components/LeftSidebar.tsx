"use client";
import { useEffect, useRef, useState } from "react";
import DefenseModal from "./DefenseModal";
import AllDealsModal from "./AllDealsModal";

const fallbackTicker = [
  "STRATEGIC NOTICE: JOINT MARITIME SURVEILLANCE EXERCISE CONDUCTED IN BALTIC REGION",
  "INFRASTRUCTURE MONITOR: STRAIT OF MALACCA COMMERCIAL VESSEL DENSITY ELEVATED",
  "TELECOMS LOG: SUBSEA DATA BACKBONE INSPECTION IN NORTH ATLANTIC CONCLUDED",
  "COMMODITY REPORT: GLOBAL PETROLEUM EXPORTERS CONFIRM QUARTERLY PRODUCTION QUOTAS",
];

export default function LeftSidebar() {
  const feedRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const [newsEvents, setNewsEvents] = useState<any[]>([]);
  const [defenseDeals, setDefenseDeals] = useState<any[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showAllDeals, setShowAllDeals] = useState(false);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNewsEvents(data);
      })
      .catch(console.error);

    fetch('/api/defense')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDefenseDeals(data);
      })
      .catch(console.error);
  }, []);

  const getRelativeTime = (isoString: string) => {
    if (!isoString) return "just now";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (isNaN(diff) || diff < 0) return "recently";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  const getCategoryTheme = (colorNode: string) => {
    switch (colorNode) {
      case "red":
        return {
          label: "FLASHPOINT",
          border: "border-l-rose-500",
          tagBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          dot: "bg-rose-500",
        };
      case "orange":
        return {
          label: "SECURITY ADVISORY",
          border: "border-l-amber-500",
          tagBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          dot: "bg-amber-500",
        };
      case "green":
        return {
          label: "POSITIVE DEVELOPMENT",
          border: "border-l-emerald-500",
          tagBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-500",
        };
      case "light-blue":
      default:
        return {
          label: "INTELLIGENCE UPDATE",
          border: "border-l-sky-500",
          tagBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
          dot: "bg-sky-500",
        };
    }
  };

  const filteredNews = newsEvents.filter(e => {
    const matchesSearch = !searchQuery || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.source && e.source.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === "critical") return e.colorNode === "red";
    if (activeCategory === "alerts") return e.colorNode === "orange";
    if (activeCategory === "general") return e.colorNode === "light-blue" || e.colorNode === "green";
    return true;
  });

  const tickerList = newsEvents.length > 0 
    ? newsEvents.slice(0, 6).map(e => `${e.source.toUpperCase()}: ${e.title}`)
    : fallbackTicker;

  return (
    <>
      <div className="flex flex-col gap-2 h-full overflow-y-auto thin-scroll pr-1 pb-4">
        
        {/* Global Live Intelligence Wire */}
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3 flex flex-col shrink-0 h-[460px] shadow-sm transition-colors">
          
          {/* Header & Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Global Wire Feed
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                className="text-[9px] px-2 py-0.5 rounded border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
              >
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                {filteredNews.length} items
              </span>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="mt-2 mb-2 flex flex-col gap-1.5">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter bulletins..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 text-[9px]">
              {[
                { id: "all", label: "All" },
                { id: "critical", label: "High Priority" },
                { id: "alerts", label: "Advisories" },
                { id: "general", label: "General" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    activeCategory === tab.id
                      ? "bg-sky-500/15 text-sky-300 border border-sky-500/30 font-medium"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bulletins Scrollable Area */}
          {filteredNews.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <span className="text-xs text-slate-400 mb-1">No reports matching filter</span>
              <span className="text-[10px] text-slate-500 font-mono">Listening for live wire updates...</span>
            </div>
          ) : (
            <div
              ref={feedRef}
              className="flex-1 overflow-y-auto thin-scroll space-y-2 pr-1"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {filteredNews.map((e, i) => {
                const theme = getCategoryTheme(e.colorNode);
                return (
                  <div
                    key={`${e.id}-${i}`}
                    className={`p-2.5 rounded-md bg-slate-900/60 border border-slate-800/80 border-l-[3px] ${theme.border} hover:bg-slate-800/50 hover:border-slate-700 transition-all group`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                        <span className="font-mono text-[9px] font-semibold text-slate-300 uppercase tracking-wide">
                          {e.source || "WIRE SERVICE"}
                        </span>
                      </div>
                      <span className="text-[8.5px] text-slate-400 font-mono">
                        {getRelativeTime(e.publishedAt)}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-100 group-hover:text-sky-300 transition-colors leading-snug mb-1">
                      {e.title}
                    </p>

                    {e.description && (
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-2 line-clamp-2">
                        {e.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span className={`text-[8.5px] font-medium px-1.5 py-0.5 rounded border ${theme.tagBg}`}>
                        {theme.label}
                      </span>
                      {e.url && e.url !== "#" && (
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[8.5px] text-slate-400 hover:text-sky-400 flex items-center gap-1 font-mono transition-colors"
                        >
                          Dispatch Link ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Defense Procurement & Strategic Contracts */}
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3 flex flex-col shrink-0 h-[380px] shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Defense Procurement
              </h2>
            </div>
            <button
              onClick={() => setShowAllDeals(true)}
              className="text-[9px] font-medium text-slate-400 hover:text-sky-400 transition-colors"
            >
              View Full Register →
            </button>
          </div>

          {defenseDeals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-xs text-slate-400 font-mono">Loading procurement records...</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto thin-scroll space-y-1.5 pr-1">
              {defenseDeals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  className="p-2 rounded bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide">
                      {deal.country1} → {deal.country2}
                    </span>
                    <span className="text-[8.5px] text-slate-500 font-mono">
                      {getRelativeTime(deal.date)}
                    </span>
                  </div>

                  <p className="text-[10.5px] font-medium text-slate-200 group-hover:text-amber-300 transition-colors leading-snug mb-1.5">
                    {deal.title}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <span className="text-[8px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                      {deal.category}
                    </span>
                    <span className="font-mono text-[9.5px] font-semibold text-emerald-400">
                      {deal.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Intelligence Ticker Banner */}
        <div className="bg-[#0B101D] border border-slate-800 rounded-lg p-2 overflow-hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
              WIRE PULSE
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
                {[...tickerList, ...tickerList].map((item, i) => (
                  <span key={i} className="text-[9px] text-slate-300 shrink-0 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {selectedDeal && (
        <DefenseModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      )}

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
