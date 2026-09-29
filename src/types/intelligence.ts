export type IntelligenceCategory =
  | "global"
  | "domestic"
  | "defense"
  | "economy"
  | "investment"
  | "technology"
  | "cyber"
  | "climate"
  | "agriculture"
  | "science"
  | "metals";

export type IntelligenceSeverity = "critical" | "warning" | "update" | "normal";

export type IntelligenceStatus = "LIVE" | "NRT" | "HISTORICAL";

export interface IntelligenceEvent {
  id: string;
  title: string;
  summary: string;
  category: IntelligenceCategory;
  severity: IntelligenceSeverity;
  source: string;
  sourceUrl?: string;
  timestamp: string;
  publishedAt?: string;
  latitude?: number;
  longitude?: number;
  confidence?: number;
  status: IntelligenceStatus;
  entities?: string[];
  countries?: string[];
  tags?: string[];
  colorNode?: string;
  url?: string;
  location?: {
    city?: string;
    country?: string;
  };
  details?: string;
  value?: string;
}

export interface SystemServiceHealth {
  name: string;
  endpoint: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  latencyMs: number;
  lastChecked: string;
  details: string;
}

export interface AggregatedIntelligence {
  events: IntelligenceEvent[];
  alerts: IntelligenceEvent[];
  metrics: {
    threatScore: number;
    activeConflicts: number;
    monitoredZones: number;
    activeAlerts: number;
    oilPrice: number;
    goldPrice: number;
    lastUpdated: string;
  };
  systemHealth: SystemServiceHealth[];
  lastUpdated: string;
}
