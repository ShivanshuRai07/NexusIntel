"use client";
import { useState } from "react";

// SIPRI Verified Defence Budgets (USD billions)
const defenceBudgets = [
  { flag: "🇺🇸", name: "United States", code: "USA", budget: 886, change: "+3.2%", color: "#38BDF8", rank: 1, share: "39.1%" },
  { flag: "🇨🇳", name: "China", code: "CHN", budget: 296, change: "+7.2%", color: "#F87171", rank: 2, share: "13.1%" },
  { flag: "🇷🇺", name: "Russia", code: "RUS", budget: 109, change: "+24.0%", color: "#FB923C", rank: 3, share: "4.8%" },
  { flag: "🇮🇳", name: "India", code: "IND", budget: 83, change: "+4.2%", color: "#34D399", rank: 4, share: "3.7%" },
  { flag: "🇸🇦", name: "Saudi Arabia", code: "KSA", budget: 75, change: "+2.9%", color: "#FBBF24", rank: 5, share: "3.3%" },
  { flag: "🇬🇧", name: "United Kingdom", code: "GBR", budget: 68, change: "+1.8%", color: "#818CF8", rank: 6, share: "3.0%" },
  { flag: "🇩🇪", name: "Germany", code: "DEU", budget: 66, change: "+9.4%", color: "#60A5FA", rank: 7, share: "2.9%" },
  { flag: "🇰🇷", name: "South Korea", code: "KOR", budget: 47, change: "+3.9%", color: "#F472B6", rank: 8, share: "2.1%" },
  { flag: "🇫🇷", name: "France", code: "FRA", budget: 46, change: "+2.1%", color: "#A78BFA", rank: 9, share: "2.0%" },
  { flag: "🇯🇵", name: "Japan", code: "JPN", budget: 45, change: "+26.0%", color: "#4ADE80", rank: 10, share: "2.0%" },
];

const maxBudget = Math.max(...defenceBudgets.map(d => d.budget));

const strategicAlliances = [
  { name: "NATO", title: "North Atlantic Treaty Org", members: 32, status: "Active Defense", color: "#38BDF8" },
  { name: "AUKUS", title: "Trilateral Security Pact", members: 3, status: "Pillar II Expansion", color: "#818CF8" },
  { name: "QUAD", title: "Quadrilateral Security Dialogue", members: 4, status: "Maritime Domain", color: "#34D399" },
  { name: "SCO", title: "Shanghai Cooperation Org", members: 10, status: "Security Dialogue", color: "#FBBF24" },
  { name: "BRICS+", title: "Geoeconomic Bloc", members: 10, status: "Multilateral Trade", color: "#FB923C" },
];

export default function RightSidebar() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filterRegion, setFilterRegion] = useState("all");

  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden pb-4">
      {/* Defence Budget Rankings */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3 flex flex-col flex-1 overflow-hidden shadow-sm transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Military Expenditure
            </h2>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">
            SIPRI DATA
          </span>
        </div>

        {/* Global Total Context Pill */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded p-2 mb-2 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[10px]">Global Annual Spend:</span>
          <span className="font-mono font-bold text-slate-100">$2.44 Trillion</span>
        </div>

        {/* List of Countries */}
        <div className="flex-1 overflow-y-auto thin-scroll space-y-1.5 pr-0.5">
          {defenceBudgets.map((country, i) => {
            const isExpanded = expanded === i;
            const barWidth = `${(country.budget / maxBudget) * 100}%`;
            return (
              <div
                key={country.code}
                onClick={() => setExpanded(isExpanded ? null : i)}
                className={`rounded-md p-2 cursor-pointer transition-all border ${
                  isExpanded 
                    ? "bg-slate-800/70 border-slate-600" 
                    : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-slate-400 w-4 text-center">
                    {country.rank}
                  </span>
                  <span className="text-base leading-none">{country.flag}</span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-200 truncate">
                        {country.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className="font-mono text-[10.5px] font-semibold text-slate-100">
                          ${country.budget}B
                        </span>
                        <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">
                          {country.change}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 h-1.5 rounded-full overflow-hidden bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: barWidth,
                          backgroundColor: country.color,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 grid grid-cols-3 gap-2 text-center bg-slate-950/50 rounded p-1.5">
                    <div>
                      <div className="text-[8px] text-slate-400 uppercase">ISO Code</div>
                      <div className="text-[10px] font-mono font-bold text-slate-200">{country.code}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-400 uppercase">Global Share</div>
                      <div className="text-[10px] font-mono font-bold text-sky-400">{country.share}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-400 uppercase">Growth (YoY)</div>
                      <div className="text-[10px] font-mono font-bold text-emerald-400">{country.change}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Treaties & Security Blocs */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg p-3 shrink-0 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Strategic Alliances
            </h2>
          </div>
          <span className="text-[8.5px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            MONITORED
          </span>
        </div>

        <div className="space-y-2 mt-1">
          {strategicAlliances.map((a) => (
            <div key={a.name} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-900/50 border border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
                <div>
                  <div className="font-semibold text-slate-200 text-[11px] leading-none">{a.name}</div>
                  <div className="text-[9px] text-slate-400">{a.status}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-slate-300 font-semibold">{a.members} nations</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
