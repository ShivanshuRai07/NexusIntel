"use client";
import { useState } from "react";

const players = [
  {
    flag: "🇺🇸", name: "United States", code: "USA",
    alliance: "NATO", status: "critical",
    activity: 92, trend: "+4%",
    military: 95, economic: 88, diplomatic: 76,
    deployments: ["Europe", "Pacific", "ME"],
  },
  {
    flag: "🇨🇳", name: "China", code: "CHN",
    alliance: "SCO", status: "warning",
    activity: 88, trend: "+7%",
    military: 87, economic: 91, diplomatic: 72,
    deployments: ["Taiwan Strait", "SCS"],
  },
  {
    flag: "🇷🇺", name: "Russia", code: "RUS",
    alliance: "CSTO", status: "critical",
    activity: 85, trend: "-2%",
    military: 82, economic: 54, diplomatic: 38,
    deployments: ["Ukraine", "Belarus"],
  },
  {
    flag: "🇪🇺", name: "European Union", code: "EU",
    alliance: "NATO", status: "warning",
    activity: 71, trend: "+3%",
    military: 68, economic: 84, diplomatic: 82,
    deployments: ["Eastern Europe"],
  },
  {
    flag: "🇮🇳", name: "India", code: "IND",
    alliance: "QUAD", status: "monitor",
    activity: 68, trend: "+5%",
    military: 74, economic: 79, diplomatic: 65,
    deployments: ["Himalayan Border"],
  },
  {
    flag: "🇬🇧", name: "United Kingdom", code: "GBR",
    alliance: "NATO", status: "monitor",
    activity: 62, trend: "+1%",
    military: 72, economic: 76, diplomatic: 80,
    deployments: ["Red Sea"],
  },
];

const alliances = [
  { name: "NATO", members: 31, color: "#00D4FF", active: true },
  { name: "SCO", members: 9, color: "#8B5CF6", active: true },
  { name: "CSTO", members: 6, color: "#FF2244", active: true },
  { name: "QUAD", members: 4, color: "#00FF88", active: false },
  { name: "BRICS", members: 11, color: "#FF8C00", active: true },
];

const statusColors: Record<string, string> = {
  critical: "#FF2244",
  warning: "#FF8C00",
  monitor: "#00D4FF",
  stable: "#00FF88",
};

export default function RightSidebar() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-1.5 h-full overflow-hidden">
      {/* Key Global Players */}
      <div className="glass-panel p-2.5 flex flex-col flex-1 overflow-hidden">
        <div className="section-header">
          <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" stroke="#00D4FF" strokeWidth="1" fill="none" /><circle cx="5" cy="5" r="2" fill="#00D4FF" /></svg>
          Key Global Players
        </div>
        <div className="flex-1 overflow-y-auto thin-scroll space-y-1.5">
          {players.map((p, i) => (
            <div
              key={p.code}
              className="rounded p-2 cursor-pointer transition-all"
              style={{
                background: selected === i ? `rgba(${p.status === 'critical' ? '255,34,68' : '0,212,255'},0.08)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${selected === i ? statusColors[p.status] : 'rgba(255,255,255,0.06)'}`,
              }}
              onClick={() => setSelected(selected === i ? null : i)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{p.flag}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-text-primary">{p.name}</span>
                      <span className="text-[7px] px-1 py-0.5 rounded" style={{ background: `${statusColors[p.status]}22`, color: statusColors[p.status], border: `1px solid ${statusColors[p.status]}44` }}>
                        {p.alliance}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: statusColors[p.status] }} />
                      <span className="text-[7px] text-text-secondary uppercase tracking-wider">{p.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold font-orbitron" style={{ color: statusColors[p.status] }}>{p.activity}%</div>
                  <div className="text-[7px] text-text-muted">{p.trend}</div>
                </div>
              </div>

              {/* Activity bar */}
              <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${p.activity}%`, background: `linear-gradient(90deg, ${statusColors[p.status]}88, ${statusColors[p.status]})`, boxShadow: `0 0 6px ${statusColors[p.status]}` }} />
              </div>

              {/* Expanded details */}
              {selected === i && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    {[
                      { label: "Military", val: p.military, color: "#FF2244" },
                      { label: "Economic", val: p.economic, color: "#00FF88" },
                      { label: "Diplomatic", val: p.diplomatic, color: "#00D4FF" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-[9px] font-bold" style={{ color: stat.color }}>{stat.val}</div>
                        <div className="text-[7px] text-text-muted">{stat.label}</div>
                        <div className="mt-0.5 h-0.5 bg-white/5 rounded-full overflow-hidden">
                          <div style={{ width: `${stat.val}%`, background: stat.color, height: '100%', borderRadius: '9999px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.deployments.map((d) => (
                      <span key={d} className="text-[7px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00D4FF' }}>
                        📍 {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Alliance Network */}
      <div className="glass-panel p-2.5">
        <div className="section-header">
          <span>⚡</span> Alliance Network
        </div>
        <div className="space-y-1.5">
          {alliances.map((a) => (
            <div key={a.name} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.color, boxShadow: `0 0 6px ${a.color}` }} />
              <span className="text-[9px] font-bold" style={{ color: a.color }}>{a.name}</span>
              <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div style={{ width: `${Math.min(a.members * 6, 100)}%`, background: a.color, height: '100%' }} />
              </div>
              <span className="text-[8px] text-text-secondary">{a.members}</span>
              {a.active && <div className="w-1 h-1 rounded-full bg-neon-green animate-blink" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
