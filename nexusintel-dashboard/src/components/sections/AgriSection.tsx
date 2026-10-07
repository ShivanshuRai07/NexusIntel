"use client";
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import SectionHeader from '../SectionHeader';

const yieldData = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 98 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 92 },
  { month: 'May', value: 88 },
  { month: 'Jun', value: 85 },
];

const riskData = [
  { name: 'Low Risk', value: 45, color: '#00FF88', label: '45%' },
  { name: 'Monitor', value: 30, color: '#FFD700', label: '30%' },
  { name: 'Extreme', value: 25, color: '#FF2244', label: '25%' },
];

export default function AgriSection() {
  return (
    <div id="agri-intel" className="glass-panel p-4 min-h-[350px]">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader 
          title="Agriculture & Food Security" 
          subtitle="Crop Yield Forecasts & Market Stability"
          href="/agriculture-intelligence"
          color="var(--neon-green)"
        />
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[8.5px] font-mono text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>FAO & USDA GLOBAL TELEMETRY · LIVE</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Crop Yield Forecast */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Global Wheat Price Index</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Benchmark commodities against historic 100 pt baseline</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-neon-red border border-red-500/20">
              -15% (Supply Crunch)
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF88" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} 
                />
                <YAxis 
                  domain={[75, 105]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-emerald-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.month} Index Score</p>
                          <p className="font-mono text-neon-green font-bold text-sm">{data.value} Pts</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00FF88" 
                  fillOpacity={1} 
                  fill="url(#colorYield)" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#00FF88', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Peak Index (Jan)</span>
              <span className="text-[11px] font-mono font-bold text-[var(--text)]">100.0</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Current Low (Jun)</span>
              <span className="text-[11px] font-mono font-bold text-neon-red">85.0</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Volatility Grade</span>
              <span className="text-[11px] font-mono font-bold text-neon-orange">Elevated</span>
            </div>
          </div>
        </div>

        {/* Global Drought Risk Pie with Visible Legend Breakdown */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Global Arable Land Risk Profile</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Satellite soil moisture and drought vulnerability indices</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-neon-amber border border-amber-500/20">
              55% AT RISK
            </span>
          </div>

          <div className="h-52 w-full flex items-center justify-center relative pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-cyan-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.name}</p>
                          <p className="font-mono text-neon-blue font-bold text-sm">{data.value}% of Global Arable Land</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-bold font-mono text-[var(--text)]">25%</span>
              <span className="text-[7.5px] text-neon-red font-bold uppercase tracking-tight">Extreme</span>
            </div>
          </div>

          {/* Visible Legend / Breakdown */}
          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            {riskData.map(r => (
              <div key={r.name} className="bg-[var(--surface-2)] rounded p-1.5 flex flex-col items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                  <span className="text-[7.5px] uppercase font-bold text-[var(--text-muted)]">{r.name}</span>
                </div>
                <span className="text-[11px] font-mono font-bold mt-0.5" style={{ color: r.color }}>{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agri Supply Chain Stats */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Fertilizer Cost', val: '+24% YoY', status: 'Critical Surge', color: 'red' },
          { label: 'Logistics Delay', val: '8.2 Days', status: 'Port Bottleneck', color: 'orange' },
          { label: 'Soil Hydration', val: '64% Optimal', status: 'Stable Mean', color: 'green' },
          { label: 'Export Restrictions', val: '12 Nations', status: 'Active Bans', color: 'orange' }
        ].map(stat => (
          <div key={stat.label} className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] flex flex-col justify-between shadow-sm">
            <span className="text-[8.5px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{stat.label}</span>
            <span className="text-base font-bold font-mono text-[var(--text)] mt-1">{stat.val}</span>
            <span className={`text-[8px] font-bold mt-1 ${stat.color === 'red' ? 'text-neon-red' : (stat.color === 'orange' ? 'text-neon-orange' : 'text-neon-green')}`}>
              {stat.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
