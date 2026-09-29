"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IntelligenceEvent } from "@/types/intelligence";

const FALLBACK_DISPATCHES: Partial<IntelligenceEvent>[] = [
  { id: "tk-1", title: "Joint military exercise commences across Baltic littoral airspace", source: "NATO Command", severity: "warning", category: "defense", timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: "tk-2", title: "OPEC+ ministers convene emergency stabilization consultation", source: "Reuters", severity: "update", category: "economy", timestamp: new Date(Date.now() - 14 * 60000).toISOString() },
  { id: "tk-3", title: "Satellite imagery confirms hardened underground silo construction", source: "Jane's Intel", severity: "critical", category: "defense", timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: "tk-4", title: "Subsea communications cable outage investigated near Kattegat Strait", source: "CERT-EU", severity: "critical", category: "cyber", timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: "tk-5", title: "Intercontinental solid-propellant ballistic vehicle test tracked in Pacific", source: "USINDOPACOM", severity: "critical", category: "defense", timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
];

function getRelativeTime(iso?: string) {
  if (!iso) return "just now";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

export default function IntelTicker() {
  const [items, setItems] = useState<Partial<IntelligenceEvent>[]>(FALLBACK_DISPATCHES);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/intelligence")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.events) && data.events.length > 0) {
          setItems(data.events.slice(0, 10));
        }
      })
      .catch(() => {
        fetch("/api/news")
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              setItems(data.slice(0, 10));
            }
          })
          .catch(console.error);
      });
  }, []);

  const doubled = [...items, ...items];

  return (
    <div
      className="ticker-wrap flex items-center bg-[#C41E3A] text-white border-y border-[#1C1917] h-9 select-none overflow-hidden relative"
      role="region"
      aria-label="Live intelligence wire ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Editorial Ticker Label */}
      <div className="ticker-label flex items-center gap-2 px-3.5 bg-[#9F1730] font-playfair font-black text-xs tracking-wider uppercase h-full shrink-0 border-r border-white/20 z-10">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>LIVE INTELLIGENCE</span>
      </div>

      {/* Ticker Items Loop */}
      <div className="ticker-content flex-1 overflow-hidden relative">
        <div
          className={`flex items-center gap-8 whitespace-nowrap animate-ticker ${
            isPaused ? "pause-anim" : ""
          }`}
          style={{
            animationPlayState: isPaused ? "paused" : "running",
            width: "max-content",
          }}
        >
          {doubled.map((item, i) => (
            <Link
              key={`${item.id || i}-${i}`}
              href={item.category ? `/intelligence/${item.category}` : "/defense-intelligence"}
              className="ticker-item flex items-center gap-2 text-xs font-semibold hover:text-[#FAF7F0] hover:underline cursor-pointer transition-colors"
            >
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-black/25 text-white/90 uppercase font-mono">
                {item.severity || "UPDATE"}
              </span>
              <span className="font-medium text-white">{item.title}</span>
              <span className="text-white/70 text-[10px] font-mono">
                [{item.source} &bull; {getRelativeTime(item.timestamp || item.publishedAt)}]
              </span>
              <span className="text-white/40 ml-2">&bull;</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Accessible Pause / Play Toggle Button */}
      <div className="px-2.5 bg-[#9F1730] h-full flex items-center shrink-0 border-l border-white/20 z-10">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/80 hover:text-white px-2 py-0.5 rounded-xs bg-black/20 hover:bg-black/40 transition-colors flex items-center gap-1"
          aria-label={isPaused ? "Resume ticker" : "Pause ticker"}
          title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
        >
          {isPaused ? "▶ PLAY" : "❚❚ PAUSE"}
        </button>
      </div>

      <style jsx>{`
        .pause-anim {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}
