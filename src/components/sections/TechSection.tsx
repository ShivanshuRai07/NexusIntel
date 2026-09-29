"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import SectionHeader from "../SectionHeader";

const aiData = [
  { year: "2020", value: 45 },
  { year: "2021", value: 82 },
  { year: "2022", value: 110 },
  { year: "2023", value: 165 },
  { year: "2024", value: 240 },
  { year: "2025", value: 380 },
];

const semiData = [
  { region: "Taiwan", capacity: 92, status: "Stable" },
  { region: "S. Korea", capacity: 85, status: "Stable" },
  { region: "USA", capacity: 65, status: "Growing" },
  { region: "EU", capacity: 58, status: "Critical" },
  { region: "Japan", capacity: 72, status: "Stable" },
];

export default function TechSection() {
  return (
    <div id="tech-intel" className="panel p-5 min-h-[350px]">
      <SectionHeader
        title="Technology & Innovation Intelligence"
        subtitle="Semiconductors, AI Investment & Strategic Compute"
        href="/technology-intelligence"
        category="TECH INTELLIGENCE"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* AI Investment Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Global AI Private Investment ($bn)
            </span>
            <span className="text-[10px] text-[#1A6B5A] font-orbitron font-bold">+52% YoY</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiData}>
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#5B2D8E"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#5B2D8E", strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semiconductor Capacity Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Semiconductor Fab Utilization (%)
            </span>
            <span className="text-[10px] text-[#1D4E89] font-bold">Demand: HIGH</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semiData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,80,50,0.12)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="region"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#78716C" }}
                  width={60}
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
                <Bar dataKey="capacity" radius={[0, 2, 2, 0]} barSize={14}>
                  {semiData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.status === "Critical"
                          ? "#C41E3A"
                          : entry.status === "Growing"
                          ? "#1A6B5A"
                          : "#1D4E89"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cyber Section Summary */}
      <div className="mt-5 flex flex-col">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-[#C41E3A] animate-pulse" />
          <span className="text-[10px] font-bold text-[#1C1917] uppercase tracking-wider">
            Critical Cyber Hotspots
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Ransomware Median", value: "$2.1M", delta: "+12%", color: "red" },
            { label: "Zero-Day Exploits", value: "14 Active", delta: "+3", color: "orange" },
            { label: "Grid Defense Integrity", value: "88.4%", delta: "-0.2%", color: "blue" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-sm bg-[#F3EFE6] border border-[#E2DBD0] flex flex-col">
              <span className="text-[9px] text-[#78716C] uppercase font-bold tracking-wider">{stat.label}</span>
              <div className="flex items-end justify-between mt-1">
                <span className="text-base font-orbitron font-bold text-[#1C1917] leading-none">
                  {stat.value}
                </span>
                <span
                  className={`text-[9px] font-orbitron font-bold ${
                    stat.color === "red"
                      ? "text-[#C41E3A]"
                      : stat.color === "orange"
                      ? "text-[#B8600B]"
                      : "text-[#1D4E89]"
                  }`}
                >
                  {stat.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
