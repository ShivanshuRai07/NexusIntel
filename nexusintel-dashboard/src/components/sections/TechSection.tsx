"use client";
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, LabelList
} from 'recharts';
import SectionHeader from '../SectionHeader';

const aiData = [
  { year: '2020', value: 45, label: '$45B' },
  { year: '2021', value: 82, label: '$82B' },
  { year: '2022', value: 110, label: '$110B' },
  { year: '2023', value: 165, label: '$165B' },
  { year: '2024', value: 240, label: '$240B' },
  { year: '2025', value: 380, label: '$380B' },
];

const semiData = [
  { region: 'Taiwan', capacity: 92, label: '92%', status: 'Stable', color: '#00D4FF' },
  { region: 'S. Korea', capacity: 85, label: '85%', status: 'Stable', color: '#00D4FF' },
  { region: 'USA', capacity: 65, label: '65%', status: 'Growing', color: '#00FF88' },
  { region: 'EU', capacity: 58, label: '58%', status: 'Critical', color: '#FF2244' },
  { region: 'Japan', capacity: 72, label: '72%', status: 'Stable', color: '#00D4FF' },
];

export default function TechSection() {
  return (
    <div id="tech-intel" className="glass-panel p-4 min-h-[350px]">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader 
          title="Technology & Innovation Intelligence" 
          subtitle="Semiconductors, AI Investment & Cyber-Resilience"
          href="/technology-intelligence"
          color="var(--neon-purple)"
        />
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[8.5px] font-mono text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span>SEMI FOUNDRY NETWORK · LIVE SYNC</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* AI Investment Chart */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Global AI Capital Deployment ($B)</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Venture + Sovereign AI infrastructure spend</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-neon-green border border-emerald-500/20">
              +52% YoY
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiData} margin={{ top: 22, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--text-secondary)' }}
                  unit="$B"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-purple-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.year} Total Investment</p>
                          <p className="font-mono text-purple-400 font-bold text-sm">${data.value} Billion</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--neon-purple)" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: '#8B5CF6', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                  activeDot={{ r: 6 }}
                >
                  <LabelList dataKey="label" position="top" fill="var(--text)" fontSize={9.5} fontWeight={700} offset={8} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">2020 Baseline</span>
              <span className="text-[11px] font-mono font-bold text-[var(--text)]">$45B</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">2025 Forecast</span>
              <span className="text-[11px] font-mono font-bold text-neon-purple">$380B</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Growth Multiple</span>
              <span className="text-[11px] font-mono font-bold text-neon-green">8.4x</span>
            </div>
          </div>
        </div>

        {/* Semiconductor Capacity Chart */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Semiconductor Fab Utilization (%)</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Advanced node production load across major hubs</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-neon-blue border border-blue-500/20">
              Demand: PEAK
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semiData} layout="vertical" margin={{ top: 10, right: 35, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} unit="%" />
                <YAxis 
                  dataKey="region" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--text)', fontWeight: 600 }}
                  width={68}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-cyan-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.region} Foundry Node</p>
                          <p className="font-mono text-neon-blue font-bold text-sm">{data.capacity}% Capacity</p>
                          <p className="text-[9px] text-slate-400 mt-1 uppercase">Supply Status: <span className="font-semibold text-white">{data.status}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="capacity" radius={[0, 4, 4, 0]} barSize={18}>
                  <LabelList dataKey="label" position="right" fill="var(--text)" fontSize={9.5} fontWeight={700} />
                  {semiData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.status === 'Critical' ? '#FF2244' : (entry.status === 'Growing' ? '#00FF88' : '#00D4FF')} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Highest Load</span>
              <span className="text-[11px] font-mono font-bold text-neon-blue">Taiwan (92%)</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Fastest Growth</span>
              <span className="text-[11px] font-mono font-bold text-neon-green">USA (+28%)</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Supply Choke</span>
              <span className="text-[11px] font-mono font-bold text-neon-red">EU Fabs (58%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cyber Section Summary */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Ransomware Avg Extortion', value: '$2.1M', sub: 'Critical Infrastructure Focus', delta: '+12% MoM', color: 'red' },
          { label: 'Zero-Day Vulnerabilities', value: '14 Active', sub: 'SCADA / Aerospace Systems', delta: '+3 Discovered', color: 'orange' },
          { label: 'Core Network Integrity', value: '88.4%', sub: 'Global Routing Stability', delta: 'Nominal Range', color: 'blue' }
        ].map(stat => (
          <div key={stat.label} className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] flex flex-col justify-between shadow-sm">
            <span className="text-[8.5px] text-[var(--text-muted)] uppercase font-bold tracking-wider">{stat.label}</span>
            <div className="flex items-baseline justify-between mt-1.5">
              <span className="text-base font-bold font-mono text-[var(--text)] leading-none">{stat.value}</span>
              <span className={`text-[9px] font-bold ${stat.color === 'red' ? 'text-neon-red' : (stat.color === 'orange' ? 'text-neon-orange' : 'text-neon-blue')}`}>
                {stat.delta}
              </span>
            </div>
            <span className="text-[7.5px] text-[var(--text-secondary)] mt-1.5">{stat.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
