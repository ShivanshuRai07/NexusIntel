"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopInfoBar from "@/components/TopInfoBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { SystemServiceHealth } from "@/types/intelligence";

const DEFAULT_SERVICES: SystemServiceHealth[] = [
  { name: "OSINT Live Wire Feed", endpoint: "/api/news", status: "ONLINE", latencyMs: 18, lastChecked: "Just now", details: "Multilingual RSS & News API Ingestion active" },
  { name: "Strategic Defense Procurement", endpoint: "/api/defense", status: "ONLINE", latencyMs: 24, lastChecked: "Just now", details: "SIPRI bilateral arms transfer ledger active" },
  { name: "Econometric & Commodities Telemetry", endpoint: "/api/economy", status: "ONLINE", latencyMs: 12, lastChecked: "Just now", details: "Brent crude & spot gold real-time pricing" },
  { name: "Geospatial Conflict Map Grid", endpoint: "/api/conflict", status: "ONLINE", latencyMs: 22, lastChecked: "Just now", details: "ACLED theater coordinates & severity rings" },
  { name: "Maritime AIS Vessel Tracking", endpoint: "/api/ships", status: "ONLINE", latencyMs: 35, lastChecked: "Just now", details: "OpenSeaMap maritime chokepoints telemetry" },
  { name: "Neural OSINT Synthesis Model", endpoint: "/api/intelligence", status: "ONLINE", latencyMs: 16, lastChecked: "Just now", details: "Operational - Multimodal intelligence aggregator" },
];

const INITIAL_LOGS = [
  { time: "21:38:12", level: "INFO", source: "GATEWAY", msg: "Telemetry aggregation cycle completed. 148 active nodes indexed." },
  { time: "21:35:45", level: "SUCCESS", source: "AIS-TRACK", msg: "Vessel transponder positions synchronized across Suez & Malacca corridors." },
  { time: "21:30:00", level: "ALERT", source: "DEF-AUDIT", msg: "High-value bilateral procurement logged: $1.2B Airborne Early Warning system." },
  { time: "21:24:19", level: "INFO", source: "CLIMATE", msg: "Sea surface temperature thermal deviation calculated: +1.28°C baseline drift." },
  { time: "21:15:02", level: "AUTH", source: "SECURITY", msg: "Analyst session authenticated via cryptographic token." },
];

export default function AdminPage() {
  const [services, setServices] = useState<SystemServiceHealth[]>(DEFAULT_SERVICES);
  const [activeTab, setActiveTab] = useState<"HEALTH" | "USERS" | "SOURCES" | "ALERTS" | "LOGS">("HEALTH");
  const [currentRole, setCurrentRole] = useState<"ADMIN" | "SENIOR ANALYST" | "OPERATOR">("ADMIN");
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Alert settings toggles
  const [alertSettings, setAlertSettings] = useState({
    criticalFlash: true,
    cableOutage: true,
    defenseDeals: true,
    commoditiesVolatility: false,
    aisChokepoints: true,
  });

  const refreshHealth = () => {
    setIsRefreshing(true);
    fetch("/api/intelligence")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.systemHealth) && data.systemHealth.length > 0) {
          setServices(data.systemHealth);
        }
        setIsRefreshing(false);
      })
      .catch(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    refreshHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1917] flex flex-col font-sans">
      <TopInfoBar />
      <Header />
      <CategoryNav />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Return to Global Intelligence Platform</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#78716C] font-semibold uppercase">ACTIVE ROLE:</span>
            <div className="flex rounded-xs overflow-hidden border border-[#C8BFB0]">
              {(["ADMIN", "SENIOR ANALYST", "OPERATOR"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${
                    currentRole === r
                      ? "bg-[#1C1917] text-white"
                      : "bg-[#F3EFE6] text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Masthead */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1A6B5A] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C]">
                OPERATIONS CONTROL & AUDIT
              </span>
            </div>
            <h1 className="font-playfair text-3xl font-black uppercase text-[#1C1917]">
              System Health & Intelligence Administration
            </h1>
            <p className="text-xs text-[#44403C]">
              Real-time gateway diagnostics, API telemetry latency, audit trails, and multi-source ingestion controls.
            </p>
          </div>

          <button
            onClick={refreshHealth}
            disabled={isRefreshing}
            className="px-4 py-2 bg-[#1C1917] text-white hover:bg-[#333] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 transition-all self-start sm:self-end"
          >
            <span className={isRefreshing ? "animate-spin" : ""}>↻</span>
            <span>{isRefreshing ? "Pinging Nodes..." : "Refresh Diagnostic Health"}</span>
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b-2 border-[#1C1917] overflow-x-auto thin-scroll pb-px">
          {[
            { id: "HEALTH", label: "SYSTEM & API HEALTH" },
            { id: "ALERTS", label: "ALERT CONFIGURATION" },
            { id: "SOURCES", label: "DATA SOURCES" },
            { id: "USERS", label: "USER ACCESS CONTROL" },
            { id: "LOGS", label: "INGESTION AUDIT LOGS" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-t-2 border-x-2 -mb-0.5 rounded-t-xs ${
                activeTab === tab.id
                  ? "bg-white text-[#C41E3A] border-[#1C1917] font-black border-b-white"
                  : "bg-[#F3EFE6] text-[#78716C] border-transparent hover:text-[#1C1917]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: System Health */}
        {activeTab === "HEALTH" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="panel p-4 bg-white border border-[#E2DBD0]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#78716C]">Overall Platform Status</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-3 h-3 rounded-full bg-[#1A6B5A]" />
                  <span className="font-playfair text-xl font-black text-[#1C1917]">ALL SYSTEMS ONLINE</span>
                </div>
                <div className="text-[10px] text-[#1A6B5A] font-bold mt-1">6 of 6 Core Services Operational</div>
              </div>

              <div className="panel p-4 bg-white border border-[#E2DBD0]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#78716C]">Average Telemetry Latency</div>
                <div className="font-orbitron text-2xl font-bold text-[#1C1917] mt-1">21.4 ms</div>
                <div className="text-[10px] text-[#78716C] mt-1">Nominal threshold (&lt;100ms)</div>
              </div>

              <div className="panel p-4 bg-white border border-[#E2DBD0]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#78716C]">Active Ingestion Cycle</div>
                <div className="font-orbitron text-2xl font-bold text-[#1A6B5A] mt-1">24/7 STREAM</div>
                <div className="text-[10px] text-[#78716C] mt-1">Auto-refresh every 30 seconds</div>
              </div>
            </div>

            <div className="panel p-6 bg-white">
              <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917] pb-3 mb-4 border-b-2 border-[#1C1917]">
                Service Health & Diagnostic Matrix
              </h3>
              <div className="space-y-3">
                {services.map((svc) => (
                  <div
                    key={svc.name}
                    className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          svc.status === "ONLINE"
                            ? "bg-[#1A6B5A]"
                            : svc.status === "DEGRADED"
                            ? "bg-[#B8600B]"
                            : "bg-[#C41E3A]"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-playfair font-bold text-sm text-[#1C1917]">{svc.name}</h4>
                          <span className="font-mono text-[9px] text-[#78716C]">[{svc.endpoint}]</span>
                        </div>
                        <p className="text-xs text-[#44403C] mt-0.5">{svc.details}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[8.5px] font-bold text-[#78716C] uppercase block">Response Time</span>
                        <span className="font-orbitron font-bold text-xs text-[#1C1917]">{svc.latencyMs} ms</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-xs uppercase font-mono ${
                            svc.status === "ONLINE"
                              ? "bg-[#1A6B5A]/15 text-[#1A6B5A] border border-[#1A6B5A]/30"
                              : "bg-[#B8600B]/15 text-[#B8600B] border border-[#B8600B]/30"
                          }`}
                        >
                          {svc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Alert Configuration */}
        {activeTab === "ALERTS" && (
          <div className="panel p-6 bg-white space-y-4 animate-fade-in">
            <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917] pb-3 mb-2 border-b-2 border-[#1C1917]">
              Automated Alert Notification Protocols
            </h3>
            <p className="text-xs text-[#78716C] mb-4">
              Configure real-time threshold triggers for intelligence analyst dispatches and critical flash bulletins.
            </p>

            <div className="space-y-3">
              {[
                { key: "criticalFlash", title: "Red Flash Bulletins", desc: "Immediate broadcast for active missile exchanges, troop mobilization, and state-level declarations." },
                { key: "cableOutage", title: "Submarine Cable Telemetry Alerts", desc: "Trigger advisory if optical latency drops &gt;35% across transatlantic or Baltic corridors." },
                { key: "defenseDeals", title: "High-Outlay Arms Transfer Logs", desc: "Notify when bilateral strategic military transfers exceed $500M." },
                { key: "commoditiesVolatility", title: "Commodities Stagflation Shock", desc: "Flag crude oil or gold price movements exceeding 4.5% intraday." },
                { key: "aisChokepoints", title: "Maritime AIS Chokepoint Gridlock", desc: "Alert when commercial vessel throughput slows &gt;20% at Suez, Bab-el-Mandeb, or Malacca." },
              ].map((item) => (
                <div key={item.key} className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-playfair font-bold text-sm text-[#1C1917]">{item.title}</h4>
                    <p className="text-xs text-[#44403C] mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setAlertSettings((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      alertSettings[item.key as keyof typeof alertSettings] ? "bg-[#C41E3A]" : "bg-[#C8BFB0]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        alertSettings[item.key as keyof typeof alertSettings] ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Data Sources */}
        {activeTab === "SOURCES" && (
          <div className="panel p-6 bg-white space-y-4 animate-fade-in">
            <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917] pb-3 mb-2 border-b-2 border-[#1C1917]">
              Verified Intelligence Ingestion Repositories
            </h3>
            <div className="space-y-3">
              {[
                { name: "SIPRI Arms Transfers Database", type: "Defense Procurement", update: "Daily 00:00 UTC", auth: "VERIFIED PARTNER" },
                { name: "ACLED Armed Conflict Location Data", type: "Kinetic Geolocation", update: "Hourly Feed", auth: "VERIFIED OSINT" },
                { name: "NASA GIBS / VIIRS SNPP Satellite Radar", type: "Atmospheric & Earth Imaging", update: "12hr Mosaic", auth: "PUBLIC SCIENTIFIC" },
                { name: "OpenSeaMap AIS Vessel Telemetry", type: "Maritime Chokepoints", update: "Real-Time 15s", auth: "TRANSPONDER RADAR" },
                { name: "WMO Global Surface Temperature Anomaly", type: "Climate Data", update: "Weekly Composite", auth: "UN OCHA COMPLIANT" },
              ].map((src) => (
                <div key={src.name} className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-playfair font-bold text-sm text-[#1C1917]">{src.name}</h4>
                    <span className="text-[10px] text-[#78716C] uppercase font-mono">{src.type} &bull; Cycle: {src.update}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-xs bg-[#1A6B5A]/10 text-[#1A6B5A] border border-[#1A6B5A]/20 uppercase">
                    {src.auth}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Users */}
        {activeTab === "USERS" && (
          <div className="panel p-6 bg-white space-y-4 animate-fade-in">
            <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917] pb-3 mb-2 border-b-2 border-[#1C1917]">
              Analyst Credentials & Role Assignment
            </h3>
            <div className="space-y-3">
              {[
                { name: "Dr. Vinay Sharma", email: "v.sharma@nexusintel.global", role: "CHIEF INTELLIGENCE OFFICER", clearances: "TS / SCI EQUIVALENT", active: true },
                { name: "Elena Rostova", email: "e.rostova@nexusintel.global", role: "SENIOR GEOPOLITICAL ANALYST", clearances: "DEFENSE & TREATIES", active: true },
                { name: "Marcus Vance", email: "m.vance@nexusintel.global", role: "CYBER INCIDENT LEAD", clearances: "CRITICAL INFRASTRUCTURE", active: true },
                { name: "Public Gateway", email: "unclassified@nexusintel.global", role: "PUBLIC ACCESS", clearances: "UNCLASSIFIED REPOSITORIES", active: true },
              ].map((user) => (
                <div key={user.email} className="p-4 bg-[#F3EFE6] border border-[#E2DBD0] rounded-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-playfair font-bold text-sm text-[#1C1917]">{user.name}</h4>
                    <span className="text-xs text-[#78716C] font-mono">{user.email} &bull; {user.clearances}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded-xs bg-[#1C1917] text-white uppercase tracking-wider font-mono">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Logs */}
        {activeTab === "LOGS" && (
          <div className="panel p-6 bg-white space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 mb-2 border-b-2 border-[#1C1917]">
              <h3 className="font-playfair text-sm font-black uppercase tracking-wider text-[#1C1917]">
                Live Gateway Ingestion Audit Log
              </h3>
              <button
                onClick={() =>
                  setLogs((prev) => [
                    { time: new Date().toLocaleTimeString(), level: "INFO", source: "MANUAL", msg: "Diagnostics ping executed by analyst." },
                    ...prev,
                  ])
                }
                className="text-[10px] font-bold text-[#C41E3A] uppercase hover:underline"
              >
                + Append Verification Ping
              </button>
            </div>

            <div className="bg-[#1C1917] text-[#FAF7F0] p-4 rounded-sm font-mono text-xs space-y-2 max-h-96 overflow-y-auto thin-scroll">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#78716C]">{log.time}</span>
                  <span
                    className={`font-bold ${
                      log.level === "ALERT"
                        ? "text-[#C41E3A]"
                        : log.level === "SUCCESS"
                        ? "text-[#1A6B5A]"
                        : "text-[#B8860B]"
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-white/60">[{log.source}]</span>
                  <span className="text-white/90 flex-1">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
