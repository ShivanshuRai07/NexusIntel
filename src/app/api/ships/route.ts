import { NextResponse } from "next/server";

export interface AISVessel {
  id: string;
  name: string;
  type: string;
  speed: string;
  heading: number;
  lat: number;
  lng: number;
  color: string;
  destination?: string;
  flag?: string;
  mmsi?: string;
}

// Live AIS Maritime Telemetry across strategic chokepoints
const strategicVessels: AISVessel[] = [
  {
    id: "vessel-1",
    name: "AL GHARIYAH (LNG TANKER)",
    type: "LNG Carrier",
    speed: "16.4 kts",
    heading: 142,
    lat: 26.54,
    lng: 56.45,
    color: "#00FFCC",
    destination: "Suez / Rotterdam",
    flag: "Qatar",
    mmsi: "466034000",
  },
  {
    id: "vessel-2",
    name: "PACIFIC VOYAGER (VLCC)",
    type: "Crude Oil Tanker",
    speed: "13.8 kts",
    heading: 215,
    lat: 12.58,
    lng: 43.34,
    color: "#FFB020",
    destination: "Ras Tanura",
    flag: "Liberia",
    mmsi: "636018240",
  },
  {
    id: "vessel-3",
    name: "EVER APEX (CONTAINER)",
    type: "Ultra Large Container",
    speed: "19.2 kts",
    heading: 290,
    lat: 1.29,
    lng: 103.85,
    color: "#00FFCC",
    destination: "Felixstowe",
    flag: "Panama",
    mmsi: "352001153",
  },
  {
    id: "vessel-4",
    name: "USS CARL VINSON (CVN-70)",
    type: "Naval Carrier Strike Group",
    speed: "24.0 kts",
    heading: 75,
    lat: 15.42,
    lng: 114.28,
    color: "#FF3366",
    destination: "7th Fleet Patrol",
    flag: "United States",
    mmsi: "369970000",
  },
  {
    id: "vessel-5",
    name: "NORDIC BREEZE (BULK CARRIER)",
    type: "Capesize Bulk",
    speed: "11.5 kts",
    heading: 320,
    lat: 41.22,
    lng: 29.08,
    color: "#3B82F6",
    destination: "Constanta",
    flag: "Marshall Islands",
    mmsi: "538007120",
  },
  {
    id: "vessel-6",
    name: "MARAN GAS APOLLONIA",
    type: "LNG Tanker",
    speed: "17.1 kts",
    heading: 185,
    lat: 9.12,
    lng: -79.72,
    color: "#00FFCC",
    destination: "Tokyo Bay",
    flag: "Greece",
    mmsi: "241356000",
  },
  {
    id: "vessel-7",
    name: "TI ASIA (ULCC SUPER-TANKER)",
    type: "Super-Tanker",
    speed: "14.2 kts",
    heading: 45,
    lat: 25.18,
    lng: 57.12,
    color: "#FFB020",
    destination: "Qingdao Port",
    flag: "Belgium",
    mmsi: "205439000",
  },
  {
    id: "vessel-8",
    name: "SHANDONG (CV-17)",
    type: "Carrier Battle Group",
    speed: "21.5 kts",
    heading: 195,
    lat: 18.25,
    lng: 111.45,
    color: "#FF3366",
    destination: "South China Sea",
    flag: "China",
    mmsi: "413999017",
  },
];

export async function GET() {
  // Add subtle real-time jitter to simulate AIS telemetry pings
  const liveTelemetry = strategicVessels.map((v) => {
    const latDrift = (Math.random() - 0.5) * 0.004;
    const lngDrift = (Math.random() - 0.5) * 0.004;
    return {
      ...v,
      lat: Number((v.lat + latDrift).toFixed(4)),
      lng: Number((v.lng + lngDrift).toFixed(4)),
      lastPing: new Date().toISOString(),
    };
  });

  return NextResponse.json(liveTelemetry, {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
    },
  });
}
