"use client";
import React, { useEffect, useState } from "react";

interface Deal {
  id: string;
  title: string;
  country1: string;
  country2: string;
  date: string;
  details: string;
  value: string;
  category: string;
  tags: string[];
  link?: string;
}

interface AllDealsModalProps {
  deals: Deal[];
  onClose: () => void;
  onSelectDeal: (deal: Deal) => void;
}

export default function AllDealsModal({ deals, onClose, onSelectDeal }: AllDealsModalProps) {
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const getRelativeTime = (isoString: string) => {
    if (!isoString) return "just now";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const categories = ["ALL", ...Array.from(new Set(deals.map((d) => d.category || "General")))];

  const filteredDeals = deals.filter((deal) => {
    const matchesCat = filterCategory === "ALL" || deal.category === filterCategory;
    const matchesSearch =
      !search.trim() ||
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.country1.toLowerCase().includes(search.toLowerCase()) ||
      deal.country2.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] bg-[#FAF7F0] border-2 border-[#1C1917] shadow-2xl rounded-sm overflow-hidden flex flex-col relative"
        style={{ color: "#1C1917" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2DBD0] bg-[#F3EFE6] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#C41E3A] animate-pulse" />
            <div>
              <h2 className="font-playfair text-lg font-black uppercase tracking-wider text-[#1C1917]">
                Global Strategic Defense Events
              </h2>
              <p className="text-[10px] text-[#78716C] uppercase font-bold tracking-widest">
                72-Hour Arms Transfers & Strategic Procurement Ledger &bull; {deals.length} Active Records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close deals modal"
            className="w-8 h-8 rounded-sm flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#E2DBD0] transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 bg-[#FAF7F0] border-b border-[#E2DBD0] flex items-center justify-between gap-4 flex-wrap shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto thin-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-xs transition-colors ${
                  filterCategory === cat
                    ? "bg-[#1C1917] text-white font-black"
                    : "bg-[#F3EFE6] text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals by country or name..."
            className="px-3 py-1 bg-white border border-[#C8BFB0] rounded-xs text-xs text-[#1C1917] placeholder-[#78716C] outline-none focus:border-[#C41E3A]"
          />
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 thin-scroll bg-[#FAF7F0]">
          {filteredDeals.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-[#78716C] font-semibold text-sm">
              No defense procurement logs match your filter criteria.
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => {
                  onClose();
                  onSelectDeal(deal);
                }}
                className="bg-white border border-[#E2DBD0] rounded-sm p-4 cursor-pointer hover:border-[#1C1917] hover:shadow-md transition-all flex flex-col md:flex-row gap-4"
              >
                {/* Meta / Time */}
                <div className="shrink-0 md:w-36 flex flex-col md:border-r border-[#E2DBD0] pr-4">
                  <div className="text-[9px] text-[#78716C] uppercase tracking-wider font-bold mb-0.5">Time Logged</div>
                  <div className="text-xs font-bold text-[#1C1917]">{getRelativeTime(deal.date)}</div>
                  <div className="text-[9px] text-[#78716C] mt-0.5">{new Date(deal.date).toLocaleDateString()}</div>
                  <div className="mt-3">
                    <span className="text-[8px] font-bold text-[#C41E3A] px-2 py-0.5 rounded-xs bg-[#C41E3A]/10 border border-[#C41E3A]/20 uppercase">
                      {deal.category}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-orbitron font-bold text-[#1A6B5A]">
                    {deal.value}
                  </div>
                </div>

                {/* Main Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-[#78716C] uppercase tracking-wider mb-1 font-bold">
                    <span className="text-[#1C1917]">{deal.country1}</span>
                    <span className="text-[#C41E3A] font-black">→</span>
                    <span className="text-[#1C1917]">{deal.country2}</span>
                  </div>
                  <h3 className="text-sm font-playfair font-black text-[#1C1917] mb-1.5 leading-snug hover:text-[#C41E3A] transition-colors">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-[#44403C] leading-relaxed line-clamp-2">
                    {deal.details}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {deal.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-xs bg-[#F3EFE6] text-[#78716C] font-semibold uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#C41E3A] flex items-center gap-1">
                      Inspect Strategic Transfer &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
