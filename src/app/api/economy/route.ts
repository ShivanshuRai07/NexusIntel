import { NextResponse } from 'next/server';

// Modelling data after World Bank, IMF, and UN datasets
const ECONOMY_INTEL = [
  {
    region: "Asia-Pacific",
    gdp_growth: 4.8,
    inflation: 2.1,
    stability_score: 72, // UN Human Development Index derived
    source: "International Monetary Fund",
    outlook: "Positive",
    drivers: ["Tech Exports", "Semiconductor FABs"]
  },
  {
    region: "Sub-Saharan Africa",
    gdp_growth: 3.2,
    inflation: 12.4,
    stability_score: 41,
    source: "World Bank",
    outlook: "Volatile",
    drivers: ["Energy Scarcity", "Conflict Disruptions"]
  },
  {
    region: "Eurozone",
    gdp_growth: 0.9,
    inflation: 2.8,
    stability_score: 85,
    source: "IMF / OECD",
    outlook: "Stable",
    drivers: ["Energy Transition", "Industrial Re-shoring"]
  }
];

export async function GET() {
  return NextResponse.json(ECONOMY_INTEL);
}
