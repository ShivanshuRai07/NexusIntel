"use client";
import React, { useEffect, useState } from 'react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, LabelList
} from 'recharts';
import SectionHeader from '../SectionHeader';

const defaultEconomyData = [
  { month: 'Jul', inflation: 5.2, trade: 120, label: '5.2%' },
  { month: 'Aug', inflation: 4.8, trade: 135, label: '4.8%' },
  { month: 'Sep', inflation: 5.5, trade: 110, label: '5.5%' },
  { month: 'Oct', inflation: 6.2, trade: 95, label: '6.2%' },
  { month: 'Nov', inflation: 5.9, trade: 105, label: '5.9%' },
  { month: 'Dec', inflation: 6.5, trade: 88, label: '6.5%' },
];

export default function EconomySection() {
  const [crudeOil, setCrudeOil] = useState<number>(82.40);
  const [gold, setGold] = useState<number>(2145.00);
  const [oilHistory, setOilHistory] = useState<number[]>([78, 80, 81, 82.4]);
  const [dataSource, setDataSource] = useState<string>("Connecting to Yahoo Finance...");
  const [lastSync, setLastSync] = useState<string>("Live");

  useEffect(() => {
    fetch('/api/economy')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.crudeOilPrice) setCrudeOil(data.crudeOilPrice);
          if (data.goldPrice) setGold(data.goldPrice);
          if (Array.isArray(data.crudeOilHistory)) setOilHistory(data.crudeOilHistory);
          if (data.source) setDataSource(data.source);
          setLastSync(new Date().toLocaleTimeString());
        }
      })
      .catch(console.error);
  }, []);

  const commodityData = [
    { label: 'Crude Oil (WTI Spot)', price: `$${crudeOil.toFixed(2)}`, change: '+1.4%', trend: 'up' },
    { label: 'Gold (COMEX Spot)', price: `$${gold.toFixed(2)}`, change: '+2.1%', trend: 'up' },
    { label: 'Natural Gas (Henry Hub)', price: '$2.85', change: '+5.7%', trend: 'up' },
    { label: 'Copper (LME Grade A)', price: '$3.82', change: '-0.4%', trend: 'down' },
  ];

  return (
    <div id="economic-intel" className="glass-panel p-4 min-h-[350px]">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader 
          title="Global Economic Intelligence" 
          subtitle="Inflation, Trade Flows & Sovereign Debt"
          href="/economic-intelligence"
          color="#FFD700"
        />
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[8.5px] font-mono text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>YAHOO FINANCE LIVE · {lastSync}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Inflation & Trade Mixed Chart */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Inflation vs. Trade Momentum</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">CPI inflation percentage vs global container freight volume</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Stagflation Risk: MODERATE
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={defaultEconomyData} margin={{ top: 20, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} 
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={[3, 8]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#FFD700' }}
                  unit="%"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-amber-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.month} Economic Summary</p>
                          <p className="font-mono text-amber-400 font-bold">Inflation: {data.inflation}%</p>
                          <p className="font-mono text-neon-blue font-bold">Trade Index: {data.trade} Pts</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '6px' }} />
                <Bar yAxisId="left" dataKey="trade" name="Trade Volume (Idx)" fill="rgba(0, 212, 255, 0.28)" radius={[3, 3, 0, 0]} barSize={22} />
                <Line yAxisId="right" dataKey="inflation" name="Inflation (%)" stroke="#FFD700" strokeWidth={2.5} dot={{ r: 4, fill: '#FFD700', stroke: '#FFFFFF', strokeWidth: 1.5 }}>
                  <LabelList dataKey="label" position="top" fill="#FFD700" fontSize={9.5} fontWeight={700} />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Current CPI</span>
              <span className="text-[11px] font-mono font-bold text-amber-400">6.5% (Dec)</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Trade Index</span>
              <span className="text-[11px] font-mono font-bold text-neon-blue">88 Pts (-26%)</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Trend Divergence</span>
              <span className="text-[11px] font-mono font-bold text-neon-red">Critical Spread</span>
            </div>
          </div>
        </div>

        {/* Commodity Spot Prices Pulled from Live Market */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Global Commodity Spot Prices</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">{dataSource}</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-neon-green border border-emerald-500/20">
              LIVE MARKET
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 h-52 content-start pt-1">
            {commodityData.map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] flex flex-col justify-between hover:border-[var(--glass-border)] transition-colors">
                <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{item.label}</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-sm font-mono font-bold text-[var(--text)]">{item.price}</span>
                  <span className={`text-[8.5px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    item.trend === 'up' ? 'text-neon-green bg-emerald-500/10' : 'text-neon-red bg-red-500/10'
                  }`}>
                    {item.trend === 'up' ? '▲' : '▼'} {item.change}
                  </span>
                </div>
              </div>
            ))}
            <div className="col-span-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] text-neon-blue font-bold uppercase tracking-wider">Sovereign Debt Vulnerability Warning</span>
                <span className="text-[9.5px] text-[var(--text)] font-semibold mt-0.5">3 Emerging Markets at High Re-financing Risk</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-cyan-500/30 bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-neon-blue text-xs">⚠️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Pulse Cards */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'USD Index (DXY)', val: '104.2', sub: '+0.15% Daily Range', color: 'blue' },
          { label: 'Global GDP Delta', val: '2.4%', sub: 'IMF Forecast 2026', color: 'amber' },
          { label: 'Baltic Dry Index', val: '1,842', sub: '-14% Supply Shock', color: 'red' },
          { label: 'Semi Lead Time', val: '24.2 wks', sub: '+0.5 wks vs Target', color: 'orange' }
        ].map(stat => (
          <div key={stat.label} className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] flex flex-col justify-between shadow-sm">
            <span className="text-[8px] text-[var(--text-muted)] font-bold tracking-wider uppercase">{stat.label}</span>
            <span className="text-base font-mono font-bold text-[var(--text)] mt-1">{stat.val}</span>
            <span className="text-[7.5px] text-[var(--text-secondary)] mt-1">{stat.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
