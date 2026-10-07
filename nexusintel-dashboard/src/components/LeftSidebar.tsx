"use client";
import { useEffect, useRef, useState } from "react";
import DefenseModal from "./DefenseModal";
import AllDealsModal from "./AllDealsModal";

const tickerItems = [
  "⚡ INTEL: JOINT MILITARY EXERCISES COMMENCE IN BALTIC MARITIME SECTOR",
  "📡 SATELLITE: NEW INFRASTRUCTURE DEVELOPMENT OBSERVED NEAR STRATEGIC STRAITS",
  "🌐 SECURITY: SUBMARINE TELECOM CABLE MAINTENANCE IN ATLANTIC COMPLETED",
  "🛢 ECONOMY: OPEC+ SCHEDULES QUARTERLY POLICY REVIEW MEETING",
];

export default function LeftSidebar() {
  const feedRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  
  const [newsEvents, setNewsEvents] = useState<any[]>([]);
  const [defenseDeals, setDefenseDeals] = useState<any[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showAllDeals, setShowAllDeals] = useState(false);

  useEffect(() => {
    fetch('/api/news').then(res => res.json()).then(data => {
      if(Array.isArray(data)) setNewsEvents(data);
    }).catch(console.error);

    fetch('/api/defense').then(res => res.json()).then(data => {
      if(Array.isArray(data)) setDefenseDeals(data);
    }).catch(console.error);
  }, []);

  // Auto-scroller for news feed
  useEffect(() => {
    if (newsEvents.length === 0) return;
    const interval = setInterval(() => {
      setScrollPos(prev => {
        const el = feedRef.current;
        if (!el) return prev;
        const max = el.scrollHeight / 2;
        const next = prev + 0.3;
        return next >= max ? 0 : next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [newsEvents]);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = scrollPos;
  }, [scrollPos]);

  const colorMap: Record<string, string> = {
    "red": "#FF2244",
    "green": "#00FF88",
    "orange": "#FF8C00",
    "yellow-orange": "#FFD700",
    "light-blue": "#00D4FF"
  };

  const tagMap: Record<string, string> = {
    "red": "CRITICAL",
    "green": "POSITIVE",
    "orange": "DOMESTIC ALERT",
    "yellow-orange": "UPCOMING RISK",
    "light-blue": "NATION POSITIVE"
  };

  const getRelativeTime = (isoString: string) => {
    if(!isoString) return "just now";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if(isNaN(diff) || diff < 0) return "recently";
    if(diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff/60)}h ago`;
  };

  const dynamicTicker = newsEvents.length > 0 
    ? newsEvents.map(e => `⚡ INTEL: ${e.title.toUpperCase()}`) 
    : tickerItems;

  return (
    <>
      <div className="flex flex-col gap-2 h-full overflow-y-auto thin-scroll relative pr-1 pb-4">
        {/* Global Live News Feed */}
        <div className="glass-panel p-2.5 flex flex-col shrink-0 h-[450px] relative">
          <div className="section-header cursor-pointer transition-colors rounded">
            <div className="live-dot" />
            Global Live News Feed
          </div>

          {newsEvents.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] text-neon-blue animate-pulse font-mono">Establishing secure link...</span>
            </div>
          ) : (
            <div className="overflow-hidden flex-1 mask-fade" ref={feedRef} style={{ overflowY: 'hidden', position: 'relative' }}>
              <div>
                {[...newsEvents, ...newsEvents].map((e, i) => {
                  const uiColor = colorMap[e.colorNode] || "#00D4FF";
                  return (
                    <div
                      key={`${e.id}-${i}`}
                      className="mb-2 p-2.5 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)] border-l-2 hover:border-[var(--glass-border)] transition-all group relative overflow-hidden"
                      style={{ borderLeftColor: uiColor }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: uiColor }} />
                          <span className="font-mono font-bold text-[8px] tracking-[1.5px]" style={{ color: uiColor }}>
                            {e.source.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[7px] text-[var(--text-secondary)] font-medium">{getRelativeTime(e.publishedAt)}</span>
                      </div>

                      <p className="text-[10.5px] font-bold text-[var(--text)] leading-tight mb-1 group-hover:text-neon-blue transition-colors">
                        {e.title}
                      </p>
                      <p className="text-[9px] text-[var(--text-secondary)] leading-normal mb-1.5 line-clamp-2">
                        {e.description}
                      </p>

                      <div className="flex justify-between items-center pt-1 border-t border-[var(--border-subtle)]">
                        <span className="status-badge text-[6px] py-0.5 px-1.5" style={{ color: uiColor, background: `${uiColor}15`, border: `1px solid ${uiColor}30` }}>
                          {tagMap[e.colorNode] || "INTEL UPDATE"}
                        </span>
                        <a 
                          href={e.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[7px] font-bold text-neon-blue hover:text-white flex items-center gap-1 uppercase tracking-widest bg-neon-blue/10 px-1.5 py-0.5 rounded border border-neon-blue/20 transition-all"
                        >
                          Source [↗]
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Defense Deals */}
        <div className="glass-panel p-2.5 flex flex-col shrink-0 h-[400px]">
          <div className="section-header flex items-center justify-between">
            <div>
              <span className="text-neon-orange">⚔</span> Defense News & Strategic Deals
            </div>
            <button 
              onClick={() => setShowAllDeals(true)}
              className="text-[9px] font-bold text-neon-orange uppercase tracking-widest hover:underline transition-colors"
            >
              See All →
            </button>
          </div>
          
          {defenseDeals.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] text-neon-orange animate-pulse font-mono">Decrypting defense logs...</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto thin-scroll space-y-1.5 pr-1">
              {defenseDeals.map((deal) => (
                <div 
                  key={deal.id} 
                  className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded p-2 cursor-pointer hover:border-neon-orange/40 hover:bg-neon-orange/5 transition-all group"
                  onClick={() => setSelectedDeal(deal)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5 text-[8px] text-[var(--text-secondary)] uppercase tracking-widest">
                      <span>{deal.country1}</span>
                      <span>→</span>
                      <span>{deal.country2}</span>
                    </div>
                    <span className="text-[8px] text-[var(--text-secondary)]">{getRelativeTime(deal.date)}</span>
                  </div>
                  <div className="text-[9.5px] font-bold text-[var(--text)] group-hover:text-neon-orange transition-colors leading-snug">
                    {deal.title}
                  </div>
                  <div className="flex justify-between items-center mt-1.5 pt-1 border-t border-[var(--border-subtle)]">
                    <span className="text-[7px] text-neon-blue px-1 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20">
                      {deal.category}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-neon-green">{deal.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic News Ticker */}
        <div className="glass-panel-red p-1.5 overflow-hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-red-500 shrink-0 animate-blink font-mono">INTEL WIRE</span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-8 animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
                {[...dynamicTicker, ...dynamicTicker].map((item, i) => (
                  <span key={i} className="text-[8px] text-[var(--text)] shrink-0 font-medium">{item}</span>
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
        <AllDealsModal deals={defenseDeals} onClose={() => setShowAllDeals(false)} onSelectDeal={(d: any) => setSelectedDeal(d)} />
      )}
    </>
  );
}
