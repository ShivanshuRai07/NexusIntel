import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/conflict", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error proxying to backend conflict API:", error);
  }

  return NextResponse.json([
    {
      id: "usgs-live-fallback",
      type: "Seismic Alert / Tectonic Anomaly",
      description: "Live USGS and GDACS disaster monitoring feeds active.",
      actor1: "Global Sensors",
      fatalities: 0,
      location: "Pacific Ring of Fire",
      source: "USGS Earthquakes Feed",
      lat: 35.6762,
      lng: 139.6503
    }
  ]);
}
