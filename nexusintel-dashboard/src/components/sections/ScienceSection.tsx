"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LabelList, Cell
} from 'recharts';
import SectionHeader from '../SectionHeader';

const spaceData = [
  { year: '2020', launches: 114, label: '114' },
  { year: '2021', launches: 146, label: '146' },
  { year: '2022', launches: 186, label: '186' },
  { year: '2023', launches: 223, label: '223' },
  { year: '2024', launches: 285, label: '285' },
  { year: '2025', launches: 340, label: '340' },
];

const researchData = [
  { field: 'AI/ML', delta: 82, label: '+82%', color: '#8B5CF6' },
  { field: 'Space', delta: 90, label: '+90%', color: '#00D4FF' },
  { field: 'Biotech', delta: 65, label: '+65%', color: '#00FF88' },
  { field: 'Quantum', delta: 48, label: '+48%', color: '#FFD700' },
  { field: 'Fusion', delta: 35, label: '+35%', color: '#FF8C00' },
];

export default function ScienceSection() {
  return (
    <div id="science-intel" className="glass-panel p-4 min-h-[350px]">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader 
          title="Global Research & Science" 
          subtitle="Space, Biotech & Deep-Field Exploration"
          href="/intelligence/science"
          color="var(--neon-purple)"
        />
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[8.5px] font-mono text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>NORAD & ESA ORBITAL MATRIX · ACTIVE</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Space Launches Chart */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Global Space Launch Momentum</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Annual orbital insertions (Commercial + Sovereign)</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-neon-purple border border-purple-500/20">
              340 Launches (All-Time High)
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spaceData} margin={{ top: 18, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLaunch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} 
                />
                <YAxis 
                  domain={[80, 360]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-purple-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.year} Total Launches</p>
                          <p className="font-mono text-purple-400 font-bold text-sm">{data.launches} Orbital Missions</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="launches" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorLaunch)" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8B5CF6', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">2020 Rate</span>
              <span className="text-[11px] font-mono font-bold text-[var(--text)]">114 / yr</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">2025 Projected</span>
              <span className="text-[11px] font-mono font-bold text-neon-purple">340 / yr</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Compound Growth</span>
              <span className="text-[11px] font-mono font-bold text-neon-green">+198%</span>
            </div>
          </div>
        </div>

        {/* Research field delta */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Scientific Publication Acceleration (%)</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Peer-reviewed breakthrough velocity by strategic discipline</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-neon-blue border border-blue-500/20">
              Space & AI LEADING
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={researchData} margin={{ top: 20, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis 
                  dataKey="field" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--text)', fontWeight: 600 }} 
                />
                <YAxis 
                  domain={[0, 105]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
                  unit="%"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-cyan-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.field} Research</p>
                          <p className="font-mono text-neon-blue font-bold text-sm">+{data.delta}% Annual Growth</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="delta" radius={[4, 4, 0, 0]} barSize={26}>
                  <LabelList dataKey="label" position="top" fill="var(--text)" fontSize={9.5} fontWeight={700} />
                  {researchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Fastest Surge</span>
              <span className="text-[11px] font-mono font-bold text-neon-blue">Space (+90%)</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">High Impact</span>
              <span className="text-[11px] font-mono font-bold text-neon-purple">AI/ML (+82%)</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Frontier Tech</span>
              <span className="text-[11px] font-mono font-bold text-amber-400">Fusion (+35%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakthrough Telemetry */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Quantum Coherence', val: '1,120 Qubits', status: 'Fault-Tolerant Gate', color: 'purple' },
          { label: 'Fusion Net Gain', val: 'Q=1.34', status: 'Ignition Confirmed', color: 'orange' },
          { label: 'Gene Editing Vectors', val: '99.4% Precision', status: 'In-Vivo Clinical', color: 'green' },
          { label: 'Constellation Nodes', val: '12,480 Active', status: 'LEO Sat Network', color: 'blue' }
        ].map(stat => (
          <div key={stat.label} className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] flex flex-col justify-between shadow-sm">
            <span className="text-[8.5px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{stat.label}</span>
            <span className="text-base font-bold font-mono text-[var(--text)] mt-1">{stat.val}</span>
            <span className="text-[8px] font-semibold text-[var(--text-secondary)] mt-1">{stat.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
