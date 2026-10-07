"use client";
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LabelList
} from 'recharts';
import SectionHeader from '../SectionHeader';

const cyberAttackData = [
  { day: 'Mon', count: 420, label: '420' },
  { day: 'Tue', count: 512, label: '512' },
  { day: 'Wed', count: 680, label: '680' },
  { day: 'Thu', count: 590, label: '590' },
  { day: 'Fri', count: 720, label: '720' },
  { day: 'Sat', count: 310, label: '310' },
  { day: 'Sun', count: 280, label: '280' },
];

const threatVectorData = [
  { subject: 'Ransomware', A: 120, B: 110, fullMark: 150 },
  { subject: 'Phishing', A: 98, B: 130, fullMark: 150 },
  { subject: 'DDoS', A: 86, B: 130, fullMark: 150 },
  { subject: 'Zero-Day', A: 99, B: 100, fullMark: 150 },
  { subject: 'Supply Chain', A: 85, B: 90, fullMark: 150 },
  { subject: 'Insider', A: 65, B: 85, fullMark: 150 },
];

export default function CyberSection() {
  return (
    <div id="cyber-intel" className="glass-panel p-4 min-h-[350px]">
      <div className="flex items-center justify-between mb-1">
        <SectionHeader 
          title="Cyber & Digital Security" 
          subtitle="Nation-State Activity & Infrastructure Threats"
          href="/cyber-intelligence"
          color="var(--neon-red)"
        />
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--card-bg)] border border-[var(--border-subtle)] text-[8.5px] font-mono text-[var(--text-secondary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span>CISA KEV & MITRE ATT&CK · ACTIVE PROBES</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Attack Frequency Bar Chart */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Global Attack Frequency (Weekly)</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Blocked intrusion attempts across critical infrastructure</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-neon-red border border-red-500/20">
              3,512 Incursions / Wk
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cyberAttackData} margin={{ top: 22, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontWeight: 600 }} 
                />
                <YAxis 
                  domain={[0, 800]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} 
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded bg-[#0B0F19] border border-red-500/30 shadow-xl text-xs">
                          <p className="font-bold text-white mb-0.5">{data.day} Attack Incursions</p>
                          <p className="font-mono text-neon-red font-bold text-sm">{data.count} Events Blocked</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="var(--neon-red)" radius={[4, 4, 0, 0]} barSize={22}>
                  <LabelList dataKey="label" position="top" fill="var(--text)" fontSize={9.5} fontWeight={700} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-center">
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Peak Load (Fri)</span>
              <span className="text-[11px] font-mono font-bold text-neon-red">720 Attacks</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Weekend Mean</span>
              <span className="text-[11px] font-mono font-bold text-[var(--text)]">295 / Day</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded p-1.5">
              <span className="text-[7.5px] uppercase tracking-wider text-[var(--text-muted)] block">Mitigation Rate</span>
              <span className="text-[11px] font-mono font-bold text-neon-green">99.8%</span>
            </div>
          </div>
        </div>

        {/* Threat Vector Radar Chart */}
        <div className="flex flex-col bg-[var(--card-bg)] rounded-xl border border-[var(--border-subtle)] p-3.5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider block">Active Threat Vector Matrix</span>
              <span className="text-[8.5px] text-[var(--text-secondary)]">Multi-vector adversary exploitation intensity profile</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-neon-red border border-red-500/20 animate-pulse">
              ⚠ LIVE THREATS
            </span>
          </div>

          <div className="h-52 w-full flex items-center justify-center pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={threatVectorData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 9.5, fill: 'var(--text)', fontWeight: 600 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  tick={{ fontSize: 7.5, fill: 'var(--text-secondary)' }}
                  tickCount={4}
                  stroke="rgba(255,255,255,0.08)"
                />
                <Radar
                  name="Current Month"
                  dataKey="A"
                  stroke="#FF2244"
                  strokeWidth={2}
                  fill="#FF2244"
                  fillOpacity={0.35}
                  dot={{ fill: '#FF2244', r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Radar
                  name="Prev Month"
                  dataKey="B"
                  stroke="#00D4FF"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  fill="#00D4FF"
                  fillOpacity={0.1}
                  dot={{ fill: '#00D4FF', r: 2, strokeWidth: 0 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{
                    fontSize: '9px',
                    bottom: 0,
                    paddingTop: '4px',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0B0F19',
                    border: '1px solid rgba(255,34,68,0.4)',
                    borderRadius: '6px',
                    fontSize: '10px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Threat intensity scale */}
          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-around">
            {[
              { label: 'Low', color: 'var(--text-muted)' },
              { label: 'Medium', color: '#FF8C00' },
              { label: 'High', color: '#FF4444' },
              { label: 'Critical', color: '#FF0000' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 4px ${s.color}` }} />
                <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cyber Intelligence Ticker */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-red animate-blink" />
          <span className="text-[9px] font-bold text-[var(--text)] uppercase tracking-[2px]">High-Intensity Cyber Incidents</span>
        </div>
        {[
          { id: 'CE-01', title: 'Critical Infrastructure Probe: EU Maritime Grids', severity: 'High', source: 'CISA Alert', sub: 'Targeting SCADA pipeline communication relays' },
          { id: 'CE-02', title: 'Nation-State APT Campaign: StealthNet Exfiltration Identified', severity: 'Critical', source: 'FireEye Telemetry', sub: 'Zero-day vulnerability in perimeter firewalls' },
        ].map(event => (
          <div key={event.id} className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-subtle)] flex items-center justify-between group hover:border-red-500/40 transition-all shadow-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[8px] text-neon-red font-bold font-mono px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">{event.id}</span>
                <span className="text-[11px] text-[var(--text)] font-bold">{event.title}</span>
              </div>
              <span className="text-[8.5px] text-[var(--text-secondary)] mt-0.5">{event.sub} · Detected by <span className="font-semibold text-[var(--text)]">{event.source}</span></span>
            </div>
            <span className={`text-[8.5px] font-bold px-2 py-1 rounded shrink-0 ml-3 ${
              event.severity === 'Critical' ? 'bg-red-500/15 text-neon-red border border-red-500/30' : 'bg-orange-500/15 text-neon-orange border border-orange-500/30'
            }`}>
              {event.severity.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
