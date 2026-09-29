"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  colorNode: string;
  country?: string;
  category?: string;
}

const PLACEHOLDER_IMAGES: Record<string, string> = {
  red: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=500&fit=crop&q=80",
  orange: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=500&fit=crop&q=80",
  "yellow-orange": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=500&fit=crop&q=80",
  "light-blue": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=500&fit=crop&q=80",
  green: "https://images.unsplash.com/photo-1542601906897-eced01e0e01d?w=1200&h=500&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=500&fit=crop&q=80",
};

const SEVERITY_MAP: Record<string, { label: string; cls: string }> = {
  red: { label: "CRITICAL", cls: "badge-critical" },
  orange: { label: "WARNING", cls: "badge-warning" },
  "yellow-orange": { label: "ALERT", cls: "badge-warning" },
  "light-blue": { label: "UPDATE", cls: "badge-update" },
  green: { label: "POSITIVE", cls: "badge-normal" },
};

const CATEGORY_MAP: Record<string, { name: string; slug: string }> = {
  red: { name: "GLOBAL DEFENSE", slug: "defense" },
  orange: { name: "DOMESTIC ALERT", slug: "domestic" },
  "yellow-orange": { name: "STRATEGIC RISK", slug: "global" },
  "light-blue": { name: "MACROECONOMY", slug: "economy" },
  green: { name: "MULTILATERAL", slug: "global" },
};

function getRelativeTime(iso: string) {
  if (!iso) return "just now";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff} min ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

export default function HeroSection() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const fetchHeroItems = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/news")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load intelligence news feed");
        return r.json();
      })
      .then((data: NewsItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.slice(0, 5));
        } else {
          setItems([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Intelligence stream unreachable");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchHeroItems();
  }, [fetchHeroItems]);

  // Working auto-advance carousel with pause on hover
  useEffect(() => {
    if (items.length < 2 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
  }, [items.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  if (loading) {
    return (
      <div className="w-full relative overflow-hidden rounded-sm bg-[#F3EFE6] border border-[#E2DBD0] min-h-[380px] p-8 flex flex-col justify-end">
        <div className="shimmer mb-3" style={{ height: "18px", width: "160px" }} />
        <div className="shimmer mb-3" style={{ height: "36px", width: "75%" }} />
        <div className="shimmer" style={{ height: "18px", width: "45%" }} />
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="w-full rounded-sm bg-[#F3EFE6] border border-[#E2DBD0] p-10 flex flex-col items-center justify-center text-center">
        <div className="w-3 h-3 rounded-full bg-[#C41E3A] mb-3 animate-ping" />
        <h3 className="font-playfair font-black text-base text-[#1C1917] mb-1">
          {error ? "INTELLIGENCE WIRE OFFLINE" : "NO RECENT INTELLIGENCE DISPATCHES"}
        </h3>
        <p className="text-xs text-[#78716C] max-w-md mb-4">
          {error || "Telemetry gateway returned zero active nodes for this period."}
        </p>
        <button
          onClick={fetchHeroItems}
          className="px-4 py-2 bg-[#C41E3A] hover:bg-[#9F1730] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-all"
        >
          Retry Connection &rarr;
        </button>
      </div>
    );
  }

  const item = items[current] || items[0];
  const sev = SEVERITY_MAP[item.colorNode] ?? SEVERITY_MAP["light-blue"];
  const cat = CATEGORY_MAP[item.colorNode] ?? { name: "INTELLIGENCE", slug: "global" };
  const img = imageErrors[current]
    ? PLACEHOLDER_IMAGES.default
    : PLACEHOLDER_IMAGES[item.colorNode] ?? PLACEHOLDER_IMAGES.default;

  return (
    <div
      className="w-full relative overflow-hidden rounded-sm border border-[#1C1917] shadow-lg group select-none"
      style={{ background: "#1C1917", minHeight: "420px" }}
      aria-label="Featured intelligence story carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Tint */}
      <img
        src={img}
        alt={item.title}
        className="w-full h-full object-cover absolute inset-0 opacity-40 transition-transform duration-1000 scale-100 group-hover:scale-105"
        onError={() => setImageErrors((prev) => ({ ...prev, [current]: true }))}
      />

      {/* Dark Vignette Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/70 to-transparent" />

      {/* Prev / Next Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous intelligence story"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm bg-black/50 hover:bg-[#C41E3A] text-white border border-white/20 flex items-center justify-center transition-all z-20 shadow-md"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next intelligence story"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm bg-black/50 hover:bg-[#C41E3A] text-white border border-white/20 flex items-center justify-center transition-all z-20 shadow-md"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Hero Content Overlay */}
      <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-end min-h-[420px]">
        {/* Category & Status Row */}
        <div className="flex items-center gap-3 mb-2.5">
          <span className={`severity-badge ${sev.cls} text-[9px] font-black uppercase tracking-wider`}>
            {sev.label}
          </span>
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest font-mono">
            {cat.name}
          </span>
          {isPaused && (
            <span className="ml-auto text-[9px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded-xs">
              PAUSED
            </span>
          )}
        </div>

        {/* Headline */}
        <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight max-w-4xl mb-3 drop-shadow-sm">
          {item.title}
        </h2>

        {/* Description */}
        {item.description && (
          <p className="text-xs sm:text-sm text-[#E2DBD0] leading-relaxed max-w-3xl line-clamp-2 mb-4">
            {item.description}
          </p>
        )}

        {/* Provenance Metadata + Actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-white/15">
          <div className="flex items-center gap-2 text-xs text-[#C8BFB0]">
            <span className="font-bold text-white uppercase">{item.source || "OSINT"}</span>
            <span>&bull;</span>
            <span>{getRelativeTime(item.publishedAt)}</span>
            {item.country && (
              <>
                <span>&bull;</span>
                <span className="text-white/80">{item.country.toUpperCase()}</span>
              </>
            )}
            <span>&bull;</span>
            <span className="text-[#1A6B5A] font-bold">VERIFIED DISPATCH</span>
          </div>

          <div className="flex items-center gap-3">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-white/80 hover:text-white uppercase tracking-wider underline transition-colors"
              >
                Source Wire [↗]
              </a>
            )}
            <Link
              href={`/intelligence/${cat.slug}`}
              className="analysis-cta-dark shadow-md"
            >
              <span>VIEW FULL ANALYSIS</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Working Carousel Dots */}
        {items.length > 1 && (
          <div className="flex items-center gap-2 mt-5">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current ? "w-8 bg-[#C41E3A]" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
