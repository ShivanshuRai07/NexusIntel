"use client";
import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SectionHeader from "../SectionHeader";

const economyData = [
  { month: "Jul", inflation: 5.2, trade: 120 },
  { month: "Aug", inflation: 4.8, trade: 135 },
  { month: "Sep", inflation: 5.5, trade: 110 },
  { month: "Oct", inflation: 6.2, trade: 95 },
  { month: "Nov", inflation: 5.9, trade: 105 },
  { month: "Dec", inflation: 6.5, trade: 88 },
];

const commodityData = [
  { label: "Brent Crude", price: "$82.4", change: "+1.2%", trend: "up" },
  { label: "Spot Gold", price: "$2,145", change: "-0.4%", trend: "down" },
  { label: "Natural Gas", price: "$2.85", change: "+5.7%", trend: "up" },
  { label: "LME Copper", price: "$3.82", change: "+0.8%", trend: "up" },
];

export default function EconomySection() {
  return (
    <div id="economic-intel" className="panel p-5 min-h-[350px]">
      <SectionHeader
        title="Global Economic & Trade Intelligence"
        subtitle="Stagflation Stress, Trade Volume Momentum & Commodities"
        href="/economic-intelligence"
        category="MACROECONOMICS"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Inflation & Trade Mixed Chart */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Inflation Rate vs. Maritime Trade Volume
            </span>
            <span className="text-[10px] text-[#B8600B] font-orbitron font-bold">Stagflation: MODERATE</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={economyData}>
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
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "9px", paddingTop: "8px" }} />
                <Bar
                  dataKey="trade"
                  name="Trade Volume"
                  fill="#1D4E89"
                  radius={[2, 2, 0, 0]}
                  barSize={18}
                />
                <Line
                  dataKey="inflation"
                  name="Inflation %"
                  stroke="#C41E3A"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#C41E3A" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commodity Ticker Cards */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Strategic Commodity Spot Prices
            </span>
            <span className="text-[10px] text-[#1A6B5A] font-bold">LIVE TELEMETRY</span>
          </div>
          <div className="grid grid-cols-2 gap-3 h-48 content-start">
            {commodityData.map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-sm bg-[#F3EFE6] border border-[#E2DBD0] flex flex-col justify-between hover:border-[#1C1917] transition-all"
              >
                <span className="text-[8.5px] text-[#78716C] font-bold uppercase tracking-wider">
                  {item.label}
                </span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-base font-orbitron font-bold text-[#1C1917]">{item.price}</span>
                  <span
                    className={`text-[9px] font-orbitron font-bold ${
                      item.trend === "up" ? "text-[#C41E3A]" : "text-[#1A6B5A]"
                    }`}
                  >
                    {item.trend === "up" ? "▲" : "▼"} {item.change}
                  </span>
                </div>
              </div>
            ))}
            <div className="col-span-2 p-3 rounded-sm bg-[#F3EFE6] border-l-4 border-l-[#B8600B] border border-[#E2DBD0] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#B8600B] font-black uppercase tracking-wider">
                  Sovereign Debt Refinancing Alert
                </span>
                <span className="text-[10px] text-[#44403C] font-medium mt-0.5">
                  3 Emerging Markets facing heightened rollover spread premiums
                </span>
              </div>
              <div className="w-7 h-7 rounded-sm border border-[#B8600B] flex items-center justify-center bg-white shrink-0 ml-2">
                <span className="text-xs">⚠️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Economic Pulse */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "USD Index (DXY)", val: "104.2", sub: "+0.15% Strengthening" },
          { label: "Global GDP Delta", val: "2.4%", sub: "IMF Baseline Est." },
          { label: "Baltic Dry Index", val: "1,842", sub: "-14% Freight Dip" },
          { label: "Semi Lead-Time", val: "24.2 wks", sub: "+0.5 wks Stretch" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-3 rounded-sm bg-[#F3EFE6] border-l-2 border-l-[#1C1917] border border-[#E2DBD0]"
          >
            <span className="text-[8px] text-[#78716C] font-bold tracking-wider block uppercase">
              {stat.label}
            </span>
            <span className="text-sm font-orbitron font-bold text-[#1C1917] block mt-0.5">
              {stat.val}
            </span>
            <span className="text-[8px] text-[#1D4E89] font-medium block mt-0.5">{stat.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
