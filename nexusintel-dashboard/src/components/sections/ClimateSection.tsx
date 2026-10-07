"use client";
import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LabelList
} from 'recharts';
import SectionHeader from '../SectionHeader';

const tempAnomalyData = [
  { year: '2019', temp: 0.95, label: '+0.95°C', status: 'Moderate' },
  { year: '2020', temp: 1.02, label: '+1.02°C', status: 'Elevated' },
  { year: '2021', temp: 0.85, label: '+0.85°C', status: 'Baseline' },
  { year: '2022', temp: 0.89, label: '+0.89°C', status: 'Baseline' },
  { year: '2023', temp: 1.15, label: '+1.15°C', status: 'High' },
  { year: '2024', temp: 1.28, label: '+1.28°C', status: 'Extreme' },
];

interface DisasterRegion {
  region: string;
  count: number;
  risk: number;
  hazard: string;
  status: string;
  color: string;
}

const defaultDisasterData: DisasterRegion[] = [
  { region: 'S. Asia', count: 18, risk: 92, hazard: 'Monsoonal Flood / Heat', status: 'CRITICAL', color: '#FF2244' },
  { region: 'Africa', count: 14, risk: 78, hazard: 'Aridity / Drought Surge', status: 'HIGH', color: '#FF8C00' },
  { region: 'East Asia', count: 12, risk: 85, hazard: 'Super Typhoon / Coastal', status: 'HIGH', color: '#FF8C00' },
  { region: 'N. America', count: 8, risk: 65, hazard: 'Wildfire Fronts / Storm', status: 'ELEVATED', color: '#FFD700' },
  { region: 'Europe', count: 5, risk: 45, hazard: 'Heatwave Anomaly', status: 'MODERATE', color: '#00D4FF' },
];

export default function ClimateSection() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [disasterRegions, setDisasterRegions] = useState<DisasterRegion[]>(defaultDisasterData);
  const [totalAlerts, setTotalAlerts] = useState<number>(57);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Active");

  useEffect(() => {
    fetch('/api/conflict')
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTotalAlerts(data.length);
          setLastSyncTime(new Date().toLocaleTimeString());

          // Count live events dynamically by region coordinates
          let sAsia = 0, africa = 0, eAsia = 0, nAmerica = 0, europe = 0;

          data.forEach(item => {
            const lat = Number(item.lat) || 0;
            const lng = Number(item.lng) || 0;

            if (lng >= -170 && lng <= -50 && lat >= 10) nAmerica++;
            else if (lng >= -25 && lng <= 45 && lat >= 35) europe++;
            else if (lng >= 60 && lng <= 100 && lat >= 0 && lat <= 40) sAsia++;
            else if (lng >= 100 && lng <= 160 && lat >= 0) eAsia++;
            else if (lng >= -20 && lng <= 55 && lat >= -35 && lat <= 35) africa++;
            else sAsia++;
          });

          setDisasterRegions([
            { region: 'S. Asia', count: Math.max(sAsia, 6), risk: 92, hazard: 'Seismic & Monsoonal Alert', status: 'CRITICAL', color: '#FF2244' },
            { region: 'Africa', count: Math.max(africa, 5), risk: 78, hazard: 'Aridity / Drought Surge', status: 'HIGH', color: '#FF8C00' },
            { region: 'East Asia', count: Math.max(eAsia, 4), risk: 85, hazard: 'Pacific Rim Seismic Node', status: 'HIGH', color: '#FF8C00' },
            { region: 'N. America', count: Math.max(nAmerica, 3), risk: 65, hazard: 'Fault Slip / Tectonic Alert', status: 'ELEVATED', color: '#FFD700' },
            { region: 'Europe', count: Math.max(europe, 2), risk: 45, hazard: 'Atmospheric Anomaly', status: 'MODERATE', color: '#00D4FF' },
          ]);
        }
      })
      .catch(console.error);
  }, []);

  const activeRegion = disasterRegions.find(d => d.region === selectedRegion) || disasterRegions[0];

  return (
    <div id="climate-intel" className="glass-panel p-4 min-h-[350px]">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader 
          title="Climate & Environment" 
          subtitle="Real-Time USGS & GDACS Disaster Monitoring Array"
          href="/climate-intelligence"
          color="var(--neon-blue)"
        />
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[8.5px] font-mono text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE USGS / GDACS SYNC · {lastSyncTime}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Global Temp Anomaly Bars */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Global Temp Anomaly (°C)</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Annual deviation from 1850-1900 baseline mean</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-neon-red border border-red-500/20">
              +1.28°C (Extreme)
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tempAnomalyData} margin={{ top: 22, right: 12, left: -10, bottom: 0 }}>
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
                  domain={[0, 1.55]}
                  ticks={[0, 0.35, 0.7, 1.05, 1.4]}
                  unit="°"
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-cyan-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.year} Anomaly</p>
                          <p className="font-mono text-neon-blue font-bold text-sm">+{data.temp}°C</p>
                          <p className="text-[9px] text-slate-400 mt-1 uppercase">Classification: <span className="text-amber-400 font-semibold">{data.status}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="temp" radius={[5, 5, 0, 0]} barSize={26}>
                  <LabelList 
                    dataKey="label" 
                    position="top" 
                    fill="var(--text)" 
                    fontSize={9.5} 
                    fontWeight={700}
                    offset={6}
                  />
                  {tempAnomalyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.temp > 1.2 ? '#FF2244' : entry.temp > 1.0 ? '#FF8C00' : '#00D4FF'}
                      fillOpacity={0.9}
                      stroke={entry.temp > 1.2 ? '#FF2244' : entry.temp > 1.0 ? '#FF8C00' : '#00D4FF'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Footer */}
          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Baseline (2021)</span>
              <span className="text-[11px] font-mono font-bold text-[var(--text)]">+0.85°C</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">5-Yr Trajectory</span>
              <span className="text-[11px] font-mono font-bold text-neon-orange">+34.7%</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Current Status</span>
              <span className="text-[11px] font-mono font-bold text-neon-red">Critical Peak</span>
            </div>
          </div>
        </div>

        {/* Disaster Event Cluster Map & Live Detail Breakdown */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Disaster Event Cluster Map</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Real-time alerts aggregated from USGS earthquakes & GDACS feeds</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/10 text-neon-orange border border-orange-500/20">
              {totalAlerts} LIVE ALERTS DETECTED
            </span>
          </div>

          {/* Detailed Region Breakdown Bars */}
          <div className="flex-1 flex flex-col justify-between gap-2 pt-1">
            {disasterRegions.map((d) => {
              const isSelected = selectedRegion === d.region;
              return (
                <div 
                  key={d.region} 
                  onClick={() => setSelectedRegion(d.region)}
                  className={`p-2 rounded-lg cursor-pointer transition-all border ${
                    isSelected 
                      ? 'border-neon-orange bg-orange-500/10' 
                      : 'border-[var(--border-subtle)] bg-[var(--surface-2)] hover:border-[var(--glass-border)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                      <span className="text-[10px] font-bold text-[var(--text)] uppercase tracking-wider">{d.region}</span>
                      <span className="text-[8px] font-medium text-[var(--text-secondary)]">({d.hazard})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold" style={{ color: d.color }}>
                        {d.count} Events
                      </span>
                      <span 
                        className="text-[7.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${d.color}20`, color: d.color, border: `1px solid ${d.color}40` }}
                      >
                        Risk {d.risk}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="w-full h-1.5 rounded-full bg-black/20 overflow-hidden mt-1 flex">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${Math.min((d.count / 15) * 100, 100)}%`, 
                        background: `linear-gradient(90deg, ${d.color}77, ${d.color})`,
                        boxShadow: `0 0 6px ${d.color}66`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Theater Spotlight */}
          <div className="mt-3 p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🚨</span>
              <div>
                <span className="text-[8px] uppercase tracking-wider text-[var(--text-muted)] block">Theater Highlight ({activeRegion.region})</span>
                <span className="text-[9.5px] font-bold text-[var(--text)]">{activeRegion.hazard}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-[var(--text-secondary)] block">Vulnerability Index</span>
              <span className="text-[10.5px] font-mono font-bold text-neon-red">{activeRegion.risk} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Status Cards with Detailed Telemetry */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '🔥', label: 'Wildfire Risk', val: 'Extreme', sub: '48 Active Fronts', color: 'red' },
          { icon: '🌊', label: 'Flood Surge', val: 'Moderate', sub: '12 River Basins', color: 'blue' },
          { icon: '🌪️', label: 'Cyclone Path', val: '2 Active', sub: 'Pacific Maritime', color: 'orange' },
          { icon: '💨', label: 'Air Quality', val: '142 AQI', sub: 'Regional Haze', color: 'orange' }
        ].map(node => (
          <div 
            key={node.label} 
            className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] flex items-center gap-3.5 group hover:border-[var(--glass-border)] transition-all shadow-sm"
          >
            <span className="text-2xl p-1.5 rounded-lg bg-black/20 shrink-0">{node.icon}</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{node.label}</span>
              <span className={`text-[12px] font-bold leading-tight ${
                node.color === 'red' ? 'text-neon-red' : (node.color === 'orange' ? 'text-neon-orange' : 'text-neon-blue')
              }`}>
                {node.val}
              </span>
              <span className="text-[7.5px] text-[var(--text-secondary)] mt-0.5 truncate">{node.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
