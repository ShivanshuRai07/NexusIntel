"use client";
import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import SectionHeader from "../SectionHeader";

const tempAnomalyData = [
  { year: "2019", temp: 0.95 },
  { year: "2020", temp: 1.02 },
  { year: "2021", temp: 0.85 },
  { year: "2022", temp: 0.89 },
  { year: "2023", temp: 1.15 },
  { year: "2024", temp: 1.28 },
];

const disasterData = [
  { region: "East Asia", count: 12, risk: 85 },
  { region: "N. America", count: 8, risk: 65 },
  { region: "Europe", count: 5, risk: 45 },
  { region: "S. Asia", count: 18, risk: 92 },
  { region: "Africa", count: 14, risk: 78 },
];

export default function ClimateSection() {
  return (
    <div id="climate-intel" className="panel p-5 min-h-[350px]">
      <SectionHeader
        title="Climate Anomalies & Environmental Risks"
        subtitle="Thermal Deviations, Disaster Clusters & Atmospheric Telemetry"
        href="/climate-intelligence"
        category="CLIMATE SECURITY"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Temp Anomaly Bars */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Global Surface Temp Anomaly (°C)
            </span>
            <span className="text-[10px] text-[#C41E3A] font-orbitron font-bold">+1.28°C Deviation</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tempAnomalyData}>
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
                  domain={[0, 1.5]}
                  ticks={[0, 0.35, 0.7, 1.05, 1.4]}
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
                  formatter={(val: number) => [`${val}°C`, "Temp Anomaly"]}
                />
                <Bar dataKey="temp" radius={[2, 2, 0, 0]} barSize={22}>
                  {tempAnomalyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.temp > 1.2 ? "#C41E3A" : entry.temp > 1.0 ? "#B8600B" : "#1A6B5A"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disaster Alerts */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
              Disaster Event Regional Clusters
            </span>
            <span className="text-[10px] text-[#B8600B] font-orbitron font-bold">18 ACTIVE REGIONS</span>
          </div>
          <div className="h-48 w-full bg-[#F3EFE6] rounded-sm border border-[#E2DBD0] p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: 0 }}>
                <XAxis
                  type="category"
                  dataKey="region"
                  name="Region"
                  axisLine={false}
                  tick={{ fontSize: 8, fill: "#78716C" }}
                />
                <YAxis
                  type="number"
                  dataKey="count"
                  name="Event Count"
                  axisLine={false}
                  tick={{ fontSize: 8, fill: "#78716C" }}
                />
                <ZAxis type="number" dataKey="risk" range={[40, 280]} name="Risk Index" />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3", stroke: "#78716C" }}
                  contentStyle={{
                    background: "#FAF7F0",
                    border: "1px solid #1C1917",
                    borderRadius: "2px",
                    fontSize: "10px",
                    color: "#1C1917",
                  }}
                />
                <Scatter name="Disasters" data={disasterData} fill="#B8600B" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Environmental Status */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: "🔥", label: "Wildfire Danger", val: "Critical", color: "#C41E3A" },
          { icon: "🌊", label: "Coastal Surge", val: "Moderate", color: "#1D4E89" },
          { icon: "🌪️", label: "Typhoon Tracks", val: "2 Tracked", color: "#B8600B" },
          { icon: "💨", label: "Air Quality PM2.5", val: "142 AQI", color: "#B8600B" },
        ].map((node) => (
          <div
            key={node.label}
            className="p-3 rounded-sm bg-[#F3EFE6] border border-[#E2DBD0] flex items-center gap-3"
          >
            <span className="text-xl">{node.icon}</span>
            <div className="flex flex-col">
              <span className="text-[8.5px] text-[#78716C] font-bold uppercase tracking-wider">
                {node.label}
              </span>
              <span className="text-xs font-orbitron font-bold mt-0.5" style={{ color: node.color }}>
                {node.val}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
