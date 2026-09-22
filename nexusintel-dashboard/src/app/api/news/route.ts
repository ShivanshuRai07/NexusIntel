import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/news", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error proxying to backend news API:", error);
  }

  return NextResponse.json([
    {
      id: "news-live-fallback",
      title: "NexusIntel Global Intelligence Monitoring Connected",
      description: "Real-time international press and intelligence feed operational.",
      source: "Global Press Wire",
      url: "#",
      publishedAt: new Date().toISOString(),
      category: "alert",
      colorNode: "light-blue",
      country: "Global",
      lat: 20.0,
      lng: 0.0
    }
  ]);
}
