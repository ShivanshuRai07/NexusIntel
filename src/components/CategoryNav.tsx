"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IntelligenceEvent } from "@/types/intelligence";

const navItems = [
  { label: "HOME",        href: "/" },
  { label: "GLOBAL",      href: "/global" },
  { label: "DOMESTIC",    href: "/domestic" },
  { label: "DEFENSE",     href: "/defense-intelligence" },
  { label: "ECONOMY",     href: "/economic-intelligence" },
  { label: "INVESTMENT",  href: "/investment" },
  { label: "TECHNOLOGY",  href: "/technology-intelligence" },
  { label: "CLIMATE",     href: "/climate-intelligence" },
  { label: "CYBER",       href: "/cyber-intelligence" },
  { label: "SCIENCE",     href: "/science-intelligence" },
  { label: "REPORTS",     href: "/reports" },
];

export default function CategoryNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allEvents, setAllEvents] = useState<IntelligenceEvent[]>([]);
  const [searchResults, setSearchResults] = useState<IntelligenceEvent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch intelligence data for client-side multi-vector search
  useEffect(() => {
    fetch("/api/intelligence")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.events)) {
          setAllEvents(data.events);
        }
      })
      .catch(() => {
        fetch("/api/news")
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setAllEvents(data);
          })
          .catch(console.error);
      });
  }, []);

  // Filter search results in real time
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    setIsSearching(true);

    const matches = allEvents.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(q);
      const summaryMatch = item.summary?.toLowerCase().includes(q);
      const catMatch = item.category?.toLowerCase().includes(q);
      const sourceMatch = item.source?.toLowerCase().includes(q);
      const countryMatch =
        item.location?.country?.toLowerCase().includes(q) ||
        (Array.isArray(item.entities) && item.entities.some((e) => e.toLowerCase().includes(q)));

      return titleMatch || summaryMatch || catMatch || sourceMatch || countryMatch;
    });

    setSearchResults(matches);
    setIsSearching(false);
  }, [searchQuery, allEvents]);

  // Focus input when modal opens & handle Escape key
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSearchOpen(false);
          setSearchQuery("");
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [searchOpen]);

  // Handle clicking search result
  const handleSelectResult = (item: IntelligenceEvent) => {
    setSearchOpen(false);
    setSearchQuery("");
    const slug = item.category || "defense";
    router.push(`/intelligence/${slug}`);
  };

  return (
    <>
      <nav
        aria-label="Intelligence categories"
        className="w-full sticky top-0 z-50 bg-[#FAF7F0] border-b-2 border-[#1C1917] shadow-sm"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-12">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C1917] p-1.5 border border-[#C8BFB0] rounded-sm hover:bg-[#F3EFE6]"
            aria-label="Open navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>DESKS</span>
          </button>

          {/* Desktop Nav Links */}
          <div
            className="hidden md:flex items-center gap-1 overflow-x-auto thin-scroll h-full"
            style={{ scrollbarWidth: "none" }}
          >
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center h-full px-3 text-[11px] font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-[#C41E3A] font-black"
                      : "text-[#44403C] hover:text-[#1C1917]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C41E3A]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Bar (Search + Admin Link) */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3EFE6] border border-[#C8BFB0] rounded-sm transition-all"
              title="System Health & Operations Control"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A6B5A]" />
              <span>SYS HEALTH</span>
            </Link>

            {/* Real Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search intelligence dispatches"
              className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-sm shrink-0 transition-all border border-[#C8BFB0] bg-white text-[#78716C] hover:text-[#1C1917] hover:border-[#1C1917] text-xs shadow-xs"
              style={{ minWidth: "140px" }}
            >
              <div className="flex items-center gap-2">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="text-[11px] font-medium">Search Intel...</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[8.5px] font-mono font-bold bg-[#F3EFE6] border border-[#E2DBD0] rounded-xs text-[#78716C]">
                ESC
              </kbd>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-[280px] bg-[#FAF7F0] h-full shadow-2xl flex flex-col border-r-2 border-[#1C1917] p-5">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#1C1917] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-sm bg-[#C41E3A] text-white flex items-center justify-center font-serif font-black text-sm">
                  N
                </span>
                <span className="font-playfair font-black text-sm text-[#1C1917]">
                  INTELLIGENCE DESKS
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-sm text-[#78716C] hover:text-[#1C1917] hover:bg-[#E2DBD0]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2.5 px-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-[#C41E3A] text-white font-black"
                        : "text-[#1C1917] hover:bg-[#F3EFE6]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#E2DBD0] mt-auto flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center bg-[#F3EFE6] border border-[#C8BFB0] rounded-sm text-[11px] font-bold text-[#1C1917] uppercase tracking-wider"
              >
                System & API Health
              </Link>
              <div className="text-[10px] text-center text-[#78716C]">
                Security: UNCLASSIFIED // PUBLIC RELEASE
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Global Interactive Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-2xl bg-[#FAF7F0] border-2 border-[#1C1917] shadow-2xl rounded-sm overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b-2 border-[#1C1917] bg-[#F3EFE6] flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by headline, country, keyword, entity, or source..."
                className="flex-1 bg-transparent text-sm font-semibold text-[#1C1917] placeholder-[#78716C] outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-[#78716C] hover:text-[#1C1917] px-2 py-0.5 rounded-sm"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-[#78716C] hover:text-[#1C1917] rounded-sm hover:bg-[#E2DBD0]"
              >
                ✕
              </button>
            </div>

            {/* Search Results Area */}
            <div className="p-4 max-h-[60vh] overflow-y-auto thin-scroll space-y-2 bg-[#FAF7F0]">
              {!searchQuery.trim() ? (
                <div className="py-8 text-center text-xs text-[#78716C]">
                  Type keywords to search live intelligence wires, military procurement, commodities, and cyber alerts.
                </div>
              ) : isSearching ? (
                <div className="py-8 text-center text-xs text-[#78716C] animate-pulse">
                  Querying intelligence streams...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="font-playfair font-bold text-sm text-[#1C1917]">No Matching Intelligence Events</div>
                  <p className="text-xs text-[#78716C] mt-1">Try searching for broader terms like &quot;Ukraine&quot;, &quot;Defense&quot;, &quot;Semiconductor&quot;, or &quot;Oil&quot;.</p>
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] pb-1 border-b border-[#E2DBD0]">
                    Found {searchResults.length} Verified Intelligence Items
                  </div>
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      className="p-3 bg-white border border-[#E2DBD0] rounded-sm hover:border-[#1C1917] hover:shadow-sm cursor-pointer transition-all flex flex-col gap-1 group"
                    >
                      <div className="flex items-center justify-between text-[9px]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`severity-badge ${
                              item.severity === "critical"
                                ? "badge-critical"
                                : item.severity === "warning"
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {item.category?.toUpperCase() || "INTEL"}
                          </span>
                          <span className="font-bold text-[#78716C]">{item.source}</span>
                        </div>
                        <span className="text-[#78716C]">
                          {item.location?.country || "International"}
                        </span>
                      </div>
                      <h4 className="font-playfair text-xs font-black text-[#1C1917] group-hover:text-[#C41E3A] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      {item.summary && (
                        <p className="text-[11px] text-[#44403C] line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-end text-[10px] font-bold text-[#C41E3A]">
                        Open Dossier &rarr;
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
