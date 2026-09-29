"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Defence budgets (2024 SIPRI estimates, USD billions)
const defenceBudgets = [
  { flag: "🇺🇸", name: "United States", code: "USA", budget: 886, change: "+3.2%", color: "#1D4E89", rank: 1 },
  { flag: "🇨🇳", name: "China", code: "CHN", budget: 296, change: "+7.2%", color: "#C41E3A", rank: 2 },
  { flag: "🇷🇺", name: "Russia", code: "RUS", budget: 109, change: "+24%", color: "#B8600B", rank: 3 },
  { flag: "🇮🇳", name: "India", code: "IND", budget: 83, change: "+4.2%", color: "#1A6B5A", rank: 4 },
  { flag: "🇸🇦", name: "Saudi Arabia", code: "KSA", budget: 75, change: "+2.9%", color: "#B8860B", rank: 5 },
  { flag: "🇬🇧", name: "United Kingdom", code: "GBR", budget: 68, change: "+1.8%", color: "#5B2D8E", rank: 6 },
  { flag: "🇩🇪", name: "Germany", code: "DEU", budget: 66, change: "+9.4%", color: "#2D6A4F", rank: 7 },
  { flag: "🇰🇷", name: "South Korea", code: "KOR", budget: 47, change: "+3.9%", color: "#C44536", rank: 8 },
  { flag: "🇫🇷", name: "France", code: "FRA", budget: 46, change: "+2.1%", color: "#3B82F6", rank: 9 },
  { flag: "🇯🇵", name: "Japan", code: "JPN", budget: 45, change: "+26%", color: "#DC2626", rank: 10 },
];

const maxBudget = Math.max(...defenceBudgets.map((d) => d.budget));

const alliances = [
  { name: "NATO", members: 31, color: "#1D4E89", status: "High Readiness" },
  { name: "SCO", members: 9, color: "#5B2D8E", status: "Active Dialogue" },
  { name: "CSTO", members: 6, color: "#C41E3A", status: "Border Deployment" },
  { name: "QUAD", members: 4, color: "#1A6B5A", status: "Maritime Patrols" },
  { name: "BRICS+", members: 11, color: "#B8860B", status: "Financial Pact" },
];

export default function RightSidebar() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [criticalNews, setCriticalNews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        const reds = (Array.isArray(data) ? data : [])
          .filter((item: any) => item.colorNode === "red" || item.colorNode === "orange")
          .slice(0, 3);
        setCriticalNews(reds);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Critical Flash Dispatches */}
      {criticalNews.length > 0 && (
        <div className="panel p-4 flex flex-col border-l-4 border-l-[#C41E3A]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2DBD0]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C41E3A] animate-ping" />
              <h3 className="font-playfair text-xs font-black uppercase tracking-wider text-[#C41E3A]">
                Critical Flash Bulletins
              </h3>
            </div>
            <span className="text-[9px] font-bold text-[#78716C] uppercase">RED DESK</span>
          </div>

          <div className="space-y-2.5">
            {criticalNews.map((item, idx) => (
              <div key={idx} className="pb-2 border-b border-[#E2DBD0] last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between text-[8px] text-[#78716C] font-semibold uppercase mb-0.5">
                  <span className="text-[#C41E3A] font-bold">{item.source || "FLASH"}</span>
                  <span>{item.location?.country || "ZONE 1"}</span>
                </div>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs font-playfair font-black text-[#1C1917] leading-tight hover:text-[#C41E3A] transition-colors"
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link
                    href="/intelligence/defense"
                    className="block text-xs font-playfair font-black text-[#1C1917] leading-tight hover:text-[#C41E3A] transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
                <div className="mt-1 flex items-center justify-between text-[8px] text-[#78716C]">
                  <span>OSINT Verified</span>
                  <Link href="/intelligence/defense" className="text-[#C41E3A] font-bold hover:underline">
                    Dossier &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Defence Budget Rankings */}
      <div className="panel p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#1C1917]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#B8860B]">🏛</span>
            <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
              SIPRI Military Budgets
            </h3>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#F3EFE6] border border-[#C8BFB0] text-[#44403C] font-bold uppercase tracking-wider">
            2024–25 USD
          </span>
        </div>

        <div className="space-y-2">
          {defenceBudgets.map((country, i) => {
            const isExpanded = expanded === i;
            const barWidth = `${(country.budget / maxBudget) * 100}%`;
            const isPositive = country.change.startsWith("+");
            return (
              <div
                key={country.code}
                className="rounded-sm p-2 cursor-pointer transition-all border border-transparent hover:border-[#C8BFB0] hover:bg-[#F3EFE6]/60"
                style={{
                  background: isExpanded ? "#F3EFE6" : "transparent",
                  borderColor: isExpanded ? "#C8BFB0" : "transparent",
                }}
                onClick={() => setExpanded(isExpanded ? null : i)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-orbitron text-[#78716C] min-w-[18px]">
                    #{country.rank}
                  </span>
                  <span className="text-base leading-none">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C1917] truncate">{country.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className="text-xs font-bold font-orbitron text-[#1C1917]">
                          ${country.budget}B
                        </span>
                        <span
                          className={`text-[9px] font-bold font-orbitron ${
                            isPositive ? "text-[#C41E3A]" : "text-[#1A6B5A]"
                          }`}
                        >
                          {country.change}
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-1 h-1.5 rounded-full overflow-hidden bg-[#E2DBD0]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: barWidth,
                          backgroundColor: country.color,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-[#E2DBD0] grid grid-cols-2 gap-2 text-center animate-fade-in">
                    <div className="bg-white p-1 rounded-sm border border-[#E2DBD0]">
                      <div className="text-[10px] font-bold font-orbitron" style={{ color: country.color }}>
                        {country.code}
                      </div>
                      <div className="text-[8px] text-[#78716C] uppercase font-medium">Standard Code</div>
                    </div>
                    <div className="bg-white p-1 rounded-sm border border-[#E2DBD0]">
                      <div
                        className={`text-[10px] font-bold font-orbitron ${
                          isPositive ? "text-[#C41E3A]" : "text-[#1A6B5A]"
                        }`}
                      >
                        {country.change}
                      </div>
                      <div className="text-[8px] text-[#78716C] uppercase font-medium">YoY Procurement</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alliance Network */}
      <div className="panel p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#1C1917]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1D4E89]">🛡</span>
            <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
              Strategic Treaty Blocs
            </h3>
          </div>
          <span className="text-[9px] text-[#78716C] uppercase font-bold tracking-widest">
            READINESS
          </span>
        </div>

        <div className="space-y-3">
          {alliances.map((a) => (
            <div key={a.name} className="flex flex-col gap-1 p-2 rounded-sm bg-[#F3EFE6]/50 border border-[#E2DBD0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-xs font-bold text-[#1C1917]">{a.name}</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1A6B5A]">
                  {a.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#78716C] pt-0.5">
                <span>Signatory Members: <strong className="text-[#1C1917] font-orbitron">{a.members} Nations</strong></span>
                <span className="text-[8px] uppercase tracking-widest text-[#78716C]">Active Treaty</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
