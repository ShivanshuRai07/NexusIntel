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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SectionHeader from "../SectionHeader";

const yieldData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 98 },
  { month: "Mar", value: 95 },
  { month: "Apr", value: 92 },
  { month: "May", value: 88 },
  { month: "Jun", value: 85 },
];

const riskData = [
  { name: "Low Risk", value: 45, color: "#1A6B5A" },
  { name: "Monitored", value: 30, color: "#B8860B" },
  { name: "Extreme Stress", value: 25, color: "#C41E3A" },
];

export default function AgriSection() {
  return (
    <div id="agri-intel" className="panel p-5 min-h-[350px]">
      <SectionHeader
        title="Agriculture & Global Food Security"
        subtitle="Grain Indices, Arable Drought Exposure & Logistics"
        href="/agriculture-intelligence"
        category="FOOD SECURITY"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Crop Yield Forecast */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Global Wheat Benchmark Index
            </span>
            <span className="text-[10px] text-[#C41E3A] font-orbitron font-bold">+18.4% Volatility</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A6B5A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1A6B5A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,80,50,0.12)" vertical={false} />
                <XAxis
                  dataKey="month"
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
                  itemStyle={{ color: "#1A6B5A", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1A6B5A"
                  fillOpacity={1}
                  fill="url(#colorYield)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Drought Risk Pie */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Global Arable Acreage Risk Profile
            </span>
            <span className="text-[10px] text-[#B8860B] font-bold">FAO DATA</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] flex items-center justify-center p-2 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#FAF7F0",
                    border: "1px solid #1C1917",
                    borderRadius: "2px",
                    fontSize: "10px",
                    color: "#1C1917",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-orbitron font-bold text-[#C41E3A]">25%</span>
              <span className="text-[8px] text-[#78716C] uppercase font-bold tracking-tight">Extreme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agri Supply Chain Stats */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-[#1A6B5A]" />
          <span className="text-[10px] font-bold text-[#1C1917] uppercase tracking-wider">
            Supply Chain Bottleneck Indicators
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Potash / Fertilizer Cost", val: "+24%", color: "#C41E3A" },
            { label: "Transit Port Delay", val: "8.2 Days", color: "#B8600B" },
            { label: "Soil Moisture Index", val: "64%", color: "#1A6B5A" },
            { label: "Export Restrictions", val: "12 Nations", color: "#C41E3A" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-sm bg-[#F3EFE6] border border-[#E2DBD0]">
              <span className="text-[8.5px] text-[#78716C] font-bold uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className="text-sm font-orbitron font-bold block mt-1" style={{ color: stat.color }}>
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
