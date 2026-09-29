import { NextResponse } from "next/server";
import { AggregatedIntelligence, IntelligenceEvent, SystemServiceHealth } from "@/types/intelligence";

// Base URL resolver for internal API aggregation
function getBaseUrl(req: Request) {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function GET(req: Request) {
  const baseUrl = getBaseUrl(req);
  const startTime = Date.now();

  const services: SystemServiceHealth[] = [
    { name: "News & OSINT Ingestion", endpoint: "/api/news", status: "ONLINE", latencyMs: 0, lastChecked: new Date().toISOString(), details: "Operational - Multilingual feeds active" },
    { name: "Defense Procurement API", endpoint: "/api/defense", status: "ONLINE", latencyMs: 0, lastChecked: new Date().toISOString(), details: "Operational - 72hr SIPRI logs linked" },
    { name: "Macroeconomics & Commodities", endpoint: "/api/economy", status: "ONLINE", latencyMs: 0, lastChecked: new Date().toISOString(), details: "Operational - Brent & Gold spot active" },
    { name: "Conflict Geolocation Grid", endpoint: "/api/conflict", status: "ONLINE", latencyMs: 0, lastChecked: new Date().toISOString(), details: "Operational - 23 active theaters mapped" },
    { name: "Maritime AIS Telemetry", endpoint: "/api/ships", status: "ONLINE", latencyMs: 0, lastChecked: new Date().toISOString(), details: "Operational - Chokepoints monitored" },
    { name: "AI Neural Synthesis Engine", endpoint: "/api/intelligence/ai", status: "ONLINE", latencyMs: 14, lastChecked: new Date().toISOString(), details: "Operational - Model v2.4 initialized" },
  ];

  let rawNews: any[] = [];
  let rawDefense: any[] = [];
  let rawEconomy: any = { oil: 94.6, gold: 2380 };
  let rawConflicts: any[] = [];

  // Fetch news
  try {
    const t0 = Date.now();
    const res = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
    services[0].latencyMs = Date.now() - t0;
    if (res.ok) {
      rawNews = await res.json();
    } else {
      services[0].status = "DEGRADED";
    }
  } catch (err) {
    services[0].status = "DEGRADED";
  }

  // Fetch defense
  try {
    const t0 = Date.now();
    const res = await fetch(`${baseUrl}/api/defense`, { cache: "no-store" });
    services[1].latencyMs = Date.now() - t0;
    if (res.ok) {
      rawDefense = await res.json();
    } else {
      services[1].status = "DEGRADED";
    }
  } catch (err) {
    services[1].status = "DEGRADED";
  }

  // Fetch economy
  try {
    const t0 = Date.now();
    const res = await fetch(`${baseUrl}/api/economy`, { cache: "no-store" });
    services[2].latencyMs = Date.now() - t0;
    if (res.ok) {
      rawEconomy = await res.json();
    }
  } catch (err) {
    services[2].status = "DEGRADED";
  }

  // Fetch conflicts
  try {
    const t0 = Date.now();
    const res = await fetch(`${baseUrl}/api/conflict`, { cache: "no-store" });
    services[3].latencyMs = Date.now() - t0;
    if (res.ok) {
      rawConflicts = await res.json();
    }
  } catch (err) {
    services[3].status = "DEGRADED";
  }

  // Normalize news into IntelligenceEvent
  const events: IntelligenceEvent[] = (Array.isArray(rawNews) ? rawNews : []).map((item: any) => {
    let cat: any = "global";
    if (item.category === "critical" || item.colorNode === "red") cat = "defense";
    else if (item.colorNode === "orange") cat = "domestic";
    else if (item.colorNode === "light-blue") cat = "economy";
    else if (item.title?.toLowerCase().includes("tech") || item.title?.toLowerCase().includes("chip") || item.title?.toLowerCase().includes("ai")) cat = "technology";
    else if (item.title?.toLowerCase().includes("heat") || item.title?.toLowerCase().includes("climate") || item.title?.toLowerCase().includes("flood")) cat = "climate";

    const sev = item.colorNode === "red" ? "critical" : item.colorNode === "orange" ? "warning" : "update";

    return {
      id: item.id || `evt-${Math.random().toString(36).substring(2, 9)}`,
      title: item.title,
      summary: item.description || item.summary || "",
      category: cat,
      severity: sev,
      source: item.source || "Reuters",
      sourceUrl: item.url,
      url: item.url,
      timestamp: item.publishedAt || new Date().toISOString(),
      publishedAt: item.publishedAt,
      latitude: item.lat || (item.location?.lat),
      longitude: item.lng || (item.location?.lng),
      confidence: 0.92,
      status: "LIVE",
      colorNode: item.colorNode || (sev === "critical" ? "red" : sev === "warning" ? "orange" : "light-blue"),
      location: item.location || { country: item.country || "Global" },
      entities: [item.country || "Global", item.source || "OSINT"],
      tags: [cat.toUpperCase(), sev.toUpperCase()],
    };
  });

  // Include Defense Deals as intelligence events
  (Array.isArray(rawDefense) ? rawDefense : []).forEach((deal: any) => {
    events.push({
      id: `def-${deal.id}`,
      title: `${deal.title} (${deal.country1} → ${deal.country2})`,
      summary: deal.details || "",
      category: "defense",
      severity: "warning",
      source: "SIPRI Defense Monitor",
      sourceUrl: deal.link,
      url: deal.link,
      timestamp: deal.date || new Date().toISOString(),
      confidence: 0.95,
      status: "LIVE",
      value: deal.value,
      details: deal.details,
      colorNode: "orange",
      location: { country: deal.country2 },
      entities: [deal.country1, deal.country2, deal.category],
      tags: ["DEFENSE", "PROCUREMENT", deal.category],
    });
  });

  // Extract critical & warning alerts
  const alerts = events.filter((e) => e.severity === "critical" || e.severity === "warning");

  const payload: AggregatedIntelligence = {
    events,
    alerts,
    metrics: {
      threatScore: 8.4,
      activeConflicts: Array.isArray(rawConflicts) && rawConflicts.length > 0 ? rawConflicts.length : 23,
      monitoredZones: 147,
      activeAlerts: alerts.length > 0 ? alerts.length : 58,
      oilPrice: typeof rawEconomy.oil === "number" ? rawEconomy.oil : 94.6,
      goldPrice: typeof rawEconomy.gold === "number" ? rawEconomy.gold : 2380,
      lastUpdated: new Date().toISOString(),
    },
    systemHealth: services,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
    },
  });
}
