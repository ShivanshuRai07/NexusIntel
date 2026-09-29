"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import SectionHeader from "../SectionHeader";

const cyberAttackData = [
  { day: "Mon", count: 420 },
  { day: "Tue", count: 512 },
  { day: "Wed", count: 680 },
  { day: "Thu", count: 590 },
  { day: "Fri", count: 720 },
  { day: "Sat", count: 310 },
  { day: "Sun", count: 280 },
];

const threatVectorData = [
  { subject: "Ransomware", A: 120, B: 110, fullMark: 150 },
  { subject: "Phishing", A: 98, B: 130, fullMark: 150 },
  { subject: "DDoS Swarm", A: 86, B: 130, fullMark: 150 },
  { subject: "Zero-Day", A: 99, B: 100, fullMark: 150 },
  { subject: "Supply Chain", A: 85, B: 90, fullMark: 150 },
  { subject: "Insider Risk", A: 65, B: 85, fullMark: 150 },
];

export default function CyberSection() {
  return (
    <div id="cyber-intel" className="panel p-5 min-h-[350px]">
      <SectionHeader
        title="Cyber Operations & Digital Resilience"
        subtitle="Nation-State Incursions, Attack Volumes & Vulnerability Vectors"
        href="/cyber-intelligence"
        category="CYBER DEFENSE"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Attack Frequency Bar Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Global Attack Frequency (Weekly Incursions)
            </span>
            <span className="text-[10px] text-[#C41E3A] font-orbitron font-bold">Incursions: HIGH</span>
          </div>
          <div className="h-56 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cyberAttackData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,80,50,0.12)" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#78716C" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#78716C" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(100,80,50,0.08)" }}
                  contentStyle={{
                    background: "#FAF7F0",
                    border: "1px solid #1C1917",
                    borderRadius: "2px",
                    fontSize: "10px",
                    color: "#1C1917",
                  }}
                />
                <Bar dataKey="count" fill="#C41E3A" radius={[2, 2, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Vector Radar Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Active Threat Vector Matrix
            </span>
            <span className="text-[10px] text-[#C41E3A] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>
          <div className="h-56 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] flex items-center justify-center p-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={threatVectorData}>
                <PolarGrid stroke="#C8BFB0" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 8.5, fill: "#1C1917", fontWeight: 700 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  tick={{ fontSize: 7, fill: "#78716C" }}
                  tickCount={4}
                  stroke="#E2DBD0"
                />
                <Radar
                  name="Current Month"
                  dataKey="A"
                  stroke="#C41E3A"
                  strokeWidth={2}
                  fill="#C41E3A"
                  fillOpacity={0.25}
                  dot={{ fill: "#C41E3A", r: 2.5 }}
                />
                <Radar
                  name="Prev Month"
                  dataKey="B"
                  stroke="#1D4E89"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  fill="#1D4E89"
                  fillOpacity={0.1}
                  dot={{ fill: "#1D4E89", r: 2 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{
                    fontSize: "9px",
                    bottom: 2,
                    color: "#78716C",
                    fontWeight: 600,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FAF7F0",
                    border: "1px solid #1C1917",
                    borderRadius: "2px",
                    fontSize: "10px",
                    color: "#1C1917",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* High-Intensity Cyber Events */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-[#C41E3A]" />
          <span className="text-[10px] font-bold text-[#1C1917] uppercase tracking-wider">
            Critical Infrastructure Cyber Dispatches
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: "CE-01",
              title: "Critical Grid Probe: European Transmission Supervisory Nodes",
              severity: "High",
              source: "CISA / CERT-EU",
            },
            {
              id: "CE-02",
              title: "Nation-State APT Campaign: StealthNet Exfiltration Vector",
              severity: "Critical",
              source: "Mandiant Intelligence",
            },
          ].map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-sm bg-[#F3EFE6] border border-[#E2DBD0] flex items-center justify-between hover:border-[#1C1917] transition-all"
            >
              <div className="flex flex-col pr-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[8px] text-[#C41E3A] font-bold font-orbitron">{event.id}</span>
                  <span className="text-xs font-playfair font-black text-[#1C1917]">{event.title}</span>
                </div>
                <span className="text-[9px] text-[#78716C]">Sourced from {event.source}</span>
              </div>
              <span
                className={`text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0 ${
                  event.severity === "Critical"
                    ? "bg-[#C41E3A]/10 text-[#C41E3A] border border-[#C41E3A]/30"
                    : "bg-[#B8600B]/10 text-[#B8600B] border border-[#B8600B]/30"
                }`}
              >
                {event.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
