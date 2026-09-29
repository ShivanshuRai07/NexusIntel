"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import SectionHeader from "../SectionHeader";

const spaceData = [
  { year: "2020", launches: 114 },
  { year: "2021", launches: 146 },
  { year: "2022", launches: 186 },
  { year: "2023", launches: 223 },
  { year: "2024", launches: 285 },
  { year: "2025", launches: 340 },
];

const researchData = [
  { field: "AI/ML", delta: 82 },
  { field: "Biotech", delta: 65 },
  { field: "Quantum", delta: 48 },
  { field: "Fusion", delta: 35 },
  { field: "Space", delta: 90 },
];

export default function ScienceSection() {
  return (
    <div id="science-intel" className="panel p-5 min-h-[350px]">
      <SectionHeader
        title="Global Scientific & Deep-Tech Research"
        subtitle="Orbital Launches, Quantum Assets & Fusion Milestones"
        href="/intelligence/science"
        category="SCIENCE & SPACE"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Space Launches Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Global Space Launch Trajectory
            </span>
            <span className="text-[10px] text-[#5B2D8E] font-orbitron font-bold">Orbit Density: HIGH</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spaceData}>
                <defs>
                  <linearGradient id="colorLaunch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B2D8E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5B2D8E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,80,50,0.12)" vertical={false} />
                <XAxis
                  dataKey="year"
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
                  contentStyle={{
                    background: "#FAF7F0",
                    border: "1px solid #1C1917",
                    borderRadius: "2px",
                    fontSize: "10px",
                    color: "#1C1917",
                  }}
                  itemStyle={{ color: "#5B2D8E", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="launches"
                  stroke="#5B2D8E"
                  fillOpacity={1}
                  fill="url(#colorLaunch)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Research field delta */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Frontier Research Output Growth (%)
            </span>
            <span className="text-[10px] text-[#1D4E89] font-bold">ANNUAL DELTA</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={researchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,80,50,0.12)" vertical={false} />
                <XAxis
                  dataKey="field"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 8.5, fill: "#78716C" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 8.5, fill: "#78716C" }}
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
                <Bar dataKey="delta" fill="#1D4E89" radius={[2, 2, 0, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Discovery log */}
      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#5B2D8E] animate-pulse" />
          <span className="text-[10px] font-bold text-[#1C1917] uppercase tracking-wider">
            Scientific Breakthrough Dispatches
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              tag: "SPACE TELEMETRY",
              title: "James Webb Observatory confirms candidate biosignatures on K2-18b atmospheric spectrograph",
              status: "Peer Verification",
            },
            {
              tag: "BIOTECHNOLOGY",
              title: "CRISPR-Cas12 in-vivo delivery achieves 98% target site fidelity in multi-center clinical trials",
              status: "Phase III Ongoing",
            },
            {
              tag: "MAGNETIC FUSION",
              title: "Tokamak consortium sustains high-confinement plasma mode for 480 continuous seconds",
              status: "Milestone Logged",
            },
          ].map((log, i) => (
            <div
              key={i}
              className="p-3.5 rounded-sm bg-[#F3EFE6] border border-[#E2DBD0] flex flex-col hover:border-[#1C1917] transition-all"
            >
              <span className="text-[8px] text-[#5B2D8E] font-black uppercase tracking-wider mb-1">
                {log.tag}
              </span>
              <h4 className="text-xs font-playfair font-black text-[#1C1917] leading-snug mb-2">
                {log.title}
              </h4>
              <div className="mt-auto pt-2 border-t border-[#E2DBD0] flex justify-between items-center text-[9px]">
                <span className="text-[#78716C] italic">{log.status}</span>
                <span className="text-[#C41E3A] font-bold">Briefing &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
