"use client";
import React, { useEffect } from "react";

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

export default function DefenseModal({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!deal) return null;

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FAF7F0] border-2 border-[#1C1917] shadow-2xl rounded-sm overflow-hidden flex flex-col relative max-h-[90vh]"
        style={{ color: "#1C1917" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E2DBD0] bg-[#F3EFE6] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C41E3A] animate-pulse" />
            <h2 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
              Strategic Defense Transfer Briefing
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close defense modal"
            className="w-7 h-7 rounded-sm flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#E2DBD0] transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto thin-scroll">
          <div>
            <div className="flex justify-between items-start mb-2 gap-4">
              <h3 className="font-playfair font-black text-lg text-[#1C1917] leading-snug">
                {deal.title}
              </h3>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider">Estimated Outlay</div>
                <div className="font-orbitron font-bold text-[#1A6B5A] text-base">{deal.value}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1 px-2.5 rounded-xs bg-[#F3EFE6] border border-[#E2DBD0] w-fit mb-3">
              <span className="text-xs font-bold text-[#1C1917]">{deal.country1}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <span className="text-xs font-bold text-[#1C1917]">{deal.country2}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-sm border border-[#E2DBD0]">
              <div className="text-[9px] text-[#78716C] uppercase tracking-wider font-bold mb-1">Date Logged</div>
              <div className="text-xs text-[#1C1917] font-medium">{formatDate(deal.date)}</div>
            </div>
            <div className="bg-white p-3 rounded-sm border border-[#E2DBD0]">
              <div className="text-[9px] text-[#78716C] uppercase tracking-wider font-bold mb-1">Defense Category</div>
              <div className="text-xs text-[#1C1917] font-bold uppercase">{deal.category}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-sm border border-[#E2DBD0]">
            <div className="text-[9px] text-[#C41E3A] uppercase tracking-wider font-black mb-1.5 flex items-center gap-1.5">
              <span>●</span> Intelligence Assessment
            </div>
            <p className="text-xs text-[#44403C] leading-relaxed">
              {deal.details}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2DBD0]">
            <div className="flex flex-wrap gap-1.5">
              {deal.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] px-2 py-0.5 rounded-xs bg-[#F3EFE6] border border-[#E2DBD0] text-[#44403C] uppercase tracking-wider font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>

            {deal.link && (
              <a
                href={deal.link}
                target="_blank"
                rel="noreferrer"
                className="analysis-cta text-xs"
              >
                <span>View Source Ledger</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
