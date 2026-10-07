"use client";
import { useEffect, useRef, useState } from "react";

// TILE LAYERS (All 100% Free Esri High-Resolution Cartography - Zero API Key Required & Zero Watermarks)
const TILE_LAYERS = {
  dark: {
    base: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    ref: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri & NOAA",
    label: "🌙 Intel Dark",
  },
  satellite: {
    base: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ref: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri & Maxar",
    label: "🛰 Satellite",
  },
  light: {
    base: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    ref: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri & HERE",
    label: "🌐 Enterprise Light",
  },
};

// Map color codes to hex for leaflet
const COLOR_MAP: Record<string, string> = {
  "red": "#FF2244",           // Wars, attacks, high severity
  "green": "#00FF88",         // Positive global news
  "orange": "#FF8C00",        // Domestic alerts / warnings
  "yellow-orange": "#FFD700", // Risks / natural hazards
  "light-blue": "#00D4FF"     // Infrastructure / economy
};

const filterOptions = ["All News Nodes", "Critical (Red)", "Warnings (Orange)", "Positive (Green)", "Economy (Blue)"];
const mapModes = ["Standard", "Satellite Clouds 🛰️", "Live Doppler Radar 🌧️", "Live Ships 🚢"];

interface MapCenterProps {
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export default function MapCenter({ isMaximized = false, onToggleMaximize }: MapCenterProps) {
  const mapRef = useRef<any>(null);
  
  // Base layers
  const tileLayerRef = useRef<any>(null);
  const satLabelLayerRef = useRef<any>(null);
  
  // Overlay mode layer (clouds/radar/ships)
  const modeOverlayLayerRef = useRef<any>(null);
  const modeRefLayerRef = useRef<any>(null);

  // Markers groups
  const markersGroupRef = useRef<any>(null);
  const conflictGroupRef = useRef<any>(null);
  const shipsGroupRef = useRef<any>(null);
  
  // State
  const [activeFilter, setActiveFilter] = useState("All News Nodes");
  const [currentMode, setCurrentMode] = useState("Standard");
  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_LAYERS>("dark");
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newsMarkers, setNewsMarkers] = useState<any[]>([]);
  const [conflictMarkers, setConflictMarkers] = useState<any[]>([]);
  const [liveShips, setLiveShips] = useState<any[]>([]);
  const [radarTimestamp, setRadarTimestamp] = useState<string>("");

  // Fetch live news & real conflict events
  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNewsMarkers(data);
      })
      .catch(console.error);

    fetch('/api/conflict')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setConflictMarkers(data);
      })
      .catch(console.error);
  }, [refreshKey]);

  // Poll live ships if mode is active
  useEffect(() => {
    if (currentMode !== "Live Ships 🚢") {
      setLiveShips([]);
      return;
    }
    
    if (activeLayer !== 'dark') {
      setActiveLayer('dark');
      switchLayer('dark');
    }

    const fetchShips = () => {
      fetch('/api/ships').then(res => res.json()).then(data => {
        if (Array.isArray(data)) setLiveShips(data);
      }).catch(console.error);
    };
    fetchShips();

    const interval = setInterval(fetchShips, 6000);
    return () => clearInterval(interval);
  }, [currentMode, refreshKey]);

  // Initialize Map with Watermark-Free Esri High-Resolution Cartography
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let mapInstance: any = null;

    import("leaflet").then((L) => {
      const container = document.getElementById("nexusintel-map");
      if (!container) return;

      if ((container as any)._leaflet_id) {
        return;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(container, {
        center: [25, 18],
        zoom: 3,
        zoomControl: true,
        attributionControl: true,
        minZoom: 2,
        maxZoom: 18,
        preferCanvas: true,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
      });

      map.getContainer().style.background = "#050C1A";

      // Base tile
      const baseTile = L.tileLayer(TILE_LAYERS[activeLayer].base, {
        attribution: TILE_LAYERS[activeLayer].attribution,
        maxZoom: 18,
      }).addTo(map);
      tileLayerRef.current = baseTile;

      // Reference labels / political borders overlay
      const refTile = L.tileLayer(TILE_LAYERS[activeLayer].ref, {
        opacity: 0.75,
        maxZoom: 18,
        zIndex: 2,
      }).addTo(map);
      satLabelLayerRef.current = refTile;

      mapRef.current = map;
      mapInstance = map;
      setIsLoaded(true);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapRef.current = null;
      }
    };
  }, [refreshKey]);

  // Build Intelligence Markers (News & USGS / GDACS Conflicts)
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    import("leaflet").then((L) => {
      if (markersGroupRef.current) mapRef.current.removeLayer(markersGroupRef.current);
      if (conflictGroupRef.current) mapRef.current.removeLayer(conflictGroupRef.current);

      const nexusGroup = L.layerGroup();
      
      // 1. Live News Markers
      newsMarkers.forEach((news) => {
        if (activeFilter === "Critical (Red)" && news.colorNode !== "red") return;
        if (activeFilter === "Warnings (Orange)" && !["orange", "yellow-orange"].includes(news.colorNode)) return;
        if (activeFilter === "Positive (Green)" && news.colorNode !== "green") return;
        if (activeFilter === "Economy (Blue)" && news.colorNode !== "light-blue") return;

        const color = COLOR_MAP[news.colorNode] || "#00D4FF";
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:transparent;border:2px solid ${color};animation:nexus-pulse 2s ease-out infinite;opacity:0.75;"></div>
              <div style="width:7px;height:7px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color};z-index:10;"></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([news.lat, news.lng], { icon });

        marker.bindPopup(`
          <div style="background:rgba(10,15,25,0.98);border:1px solid ${color};border-radius:10px;padding:12px;min-width:250px;color:#E2E8F0;font-family:Inter,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            <div style="display:flex;align-items:center;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:6px;">
              <strong style="font-size:10px;color:${color};letter-spacing:1px;text-transform:uppercase;">⚡ ${news.source}</strong>
            </div>
            <h4 style="font-size:12px;font-weight:700;color:#FFF;margin-bottom:6px;line-height:1.35;">${news.title}</h4>
            <p style="font-size:10px;color:#94A3B8;line-height:1.45;margin-bottom:10px;">${news.description}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;border-top:1px solid rgba(255,255,255,0.06);padding-top:6px;">
              <span style="color:#00D4FF;font-weight:600;">📍 ${news.country}</span>
              <a href="${news.url || '#'}" target="_blank" style="color:${color};text-decoration:none;font-weight:bold;">DISPATCH [↗]</a>
            </div>
          </div>
        `, { className: "nexusintel-popup" });
        nexusGroup.addLayer(marker);
      });

      // 2. Conflict / Seismic Real-Time Markers
      conflictMarkers.forEach((event) => {
        const isSeismic = event.type?.toLowerCase().includes("seismic");
        const markerColor = isSeismic ? "#FF8C00" : "#FF2244";

        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <div style="position:absolute;inset:0;border:1px dashed ${markerColor};border-radius:50%;animation:rotate-ring 5s linear infinite;"></div>
              <div style="width:2px;height:12px;background:${markerColor};position:absolute;"></div>
              <div style="width:12px;height:2px;background:${markerColor};position:absolute;"></div>
              <div style="width:4px;height:4px;background:${markerColor};border-radius:50%;box-shadow:0 0 8px ${markerColor};"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([event.lat, event.lng], { icon });
        marker.bindPopup(`
          <div style="background:rgba(20,5,10,0.98);border:1px solid ${markerColor};border-radius:10px;padding:12px;min-width:240px;color:#FFF;font-family:Inter,sans-serif;">
            <div style="font-size:9px;color:${markerColor};text-transform:uppercase;margin-bottom:6px;letter-spacing:1px;font-weight:700;">
              ⚠️ ${event.type || 'SEISMIC / CRISIS EVENT'}
            </div>
            <div style="font-size:11.5px;font-weight:700;margin-bottom:8px;line-height:1.3;">${event.description}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:9px;border-top:1px solid rgba(255,34,68,0.2);padding-top:8px;">
              <div>LOC: <span style="font-weight:bold;color:#E2E8F0;">${event.location}</span></div>
              <div>FATALITIES: <span style="font-weight:bold;color:${markerColor};">${event.fatalities || 0}</span></div>
              <div style="grid-column: span 2; color:#94A3B8; font-size:8px;">FEED: ${event.source}</div>
            </div>
          </div>
        `);
        nexusGroup.addLayer(marker);
      });

      nexusGroup.addTo(mapRef.current);
      markersGroupRef.current = nexusGroup;
    });
  }, [isLoaded, newsMarkers, conflictMarkers, activeFilter, refreshKey]);

  // Build Ship Markers (OpenSeaMap & AIS)
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    import("leaflet").then((L) => {
      if (shipsGroupRef.current) mapRef.current.removeLayer(shipsGroupRef.current);
      if (liveShips.length === 0) return;

      const shipLayer = L.layerGroup();
      liveShips.forEach((ship) => {
        const color = ship.color || "#00FFCC";
        
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="transform: rotate(${ship.heading}deg); width: 14px; height: 18px; position: relative; filter: drop-shadow(0 0 3px ${color});">
              <svg viewBox="0 0 14 18" style="width: 100%; height: 100%; overflow: visible;">
                <path d="M7 0 L14 18 L7 14 L0 18 Z" fill="white" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
          `,
          iconSize: [14, 18],
          iconAnchor: [7, 9],
          popupAnchor: [0, -10],
        });

        const marker = L.marker([ship.lat, ship.lng], { icon });
        marker.bindTooltip(`
          <strong style="color:${color};font-size:11px">${ship.name}</strong><br/>
          <span style="font-size:9px;color:#94A3B8">Type: ${ship.type} | SPD: ${ship.speed}</span><br/>
          <span style="font-size:8px;color:#64748B">HDG: ${ship.heading}°</span>
        `, { className: "nexusintel-tooltip" });

        shipLayer.addLayer(marker);
      });

      shipLayer.addTo(mapRef.current);
      shipsGroupRef.current = shipLayer;
    });
  }, [liveShips, isLoaded]);

  // Handle Mode Overlays (100% Free RainViewer Doppler / NASA GIBS / OpenSeaMap - 0 API Key Required)
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    import("leaflet").then((L) => {
      if (modeOverlayLayerRef.current) mapRef.current.removeLayer(modeOverlayLayerRef.current);
      if (modeRefLayerRef.current) mapRef.current.removeLayer(modeRefLayerRef.current);

      if (currentMode === "Standard") return;

      // 1. Live Ships & Nautical Beacons
      if (currentMode === "Live Ships 🚢") {
        modeOverlayLayerRef.current = L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
          opacity: 0.85,
          zIndex: 10,
          attribution: "&copy; OpenSeaMap Nautical Chart",
        }).addTo(mapRef.current);
        return;
      }

      // 2. Real-Time Live Doppler Precipitation Radar (RainViewer Free Tier - No Key Required)
      if (currentMode === "Live Doppler Radar 🌧️") {
        fetch("https://api.rainviewer.com/public/weather-maps.json")
          .then((res) => res.json())
          .then((data) => {
            const radarPath = data?.radar?.past?.slice(-1)[0]?.path;
            if (radarPath && mapRef.current) {
              const dateObj = new Date((data?.radar?.past?.slice(-1)[0]?.time || 0) * 1000);
              setRadarTimestamp(dateObj.toLocaleTimeString());
              
              const radarTile = L.tileLayer(
                `https://tilecache.rainviewer.com${radarPath}/256/{z}/{x}/{y}/2/1_1.png`,
                {
                  opacity: 0.75,
                  zIndex: 12,
                  attribution: "&copy; RainViewer Global Radar",
                }
              ).addTo(mapRef.current);
              modeOverlayLayerRef.current = radarTile;
            }
          })
          .catch((err) => {
            console.error("Error loading RainViewer radar:", err);
          });
        return;
      }

      // 3. Satellite Clouds (NASA GIBS VIIRS High Resolution - No Key Required)
      if (currentMode === "Satellite Clouds 🛰️") {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - 2);
        const dateStr = d.toISOString().split("T")[0];

        const viirsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${dateStr}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

        const cloudsLayer = L.tileLayer(viirsUrl, {
          attribution: "&copy; NASA GIBS / VIIRS TrueColor",
          opacity: 0.95,
          zIndex: 6,
          maxZoom: 9,
        });

        // Add reference place borders over the cloud layer
        modeRefLayerRef.current = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          {
            opacity: 0.7,
            zIndex: 15,
          }
        ).addTo(mapRef.current);

        cloudsLayer.addTo(mapRef.current);
        modeOverlayLayerRef.current = cloudsLayer;
      }
    });
  }, [currentMode, isLoaded]);

  // Switch base layer
  const switchLayer = (key: keyof typeof TILE_LAYERS) => {
    setActiveLayer(key);
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      if (tileLayerRef.current) mapRef.current.removeLayer(tileLayerRef.current);
      if (satLabelLayerRef.current) mapRef.current.removeLayer(satLabelLayerRef.current);

      const newBaseTile = L.tileLayer(TILE_LAYERS[key].base, {
        attribution: TILE_LAYERS[key].attribution,
        maxZoom: 18,
      }).addTo(mapRef.current);
      tileLayerRef.current = newBaseTile;

      const newRefTile = L.tileLayer(TILE_LAYERS[key].ref, {
        opacity: 0.75,
        maxZoom: 18,
        zIndex: 2,
      }).addTo(mapRef.current);
      satLabelLayerRef.current = newRefTile;
    });
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden h-full relative">
      {/* Controls row top */}
      <div className="flex flex-col border-b border-[var(--border-subtle)] shrink-0 z-10 relative bg-[var(--surface-1)] backdrop-blur-md">
        
        {/* Top Header & Base Maps */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border-subtle)]">
          <div className="section-header mb-0 flex items-center gap-3" style={{ margin: 0, border: "none", padding: 0 }}>
            <div className="flex items-center">
              <span className="animate-blink text-neon-blue mr-1.5">●</span> 
              <span className="font-bold text-[11px] text-[var(--text)]">REAL-TIME GLOBAL INTEL MAP</span>
              {currentMode !== "Standard" && (
                <span className="ml-3 px-1.5 py-0.5 rounded bg-neon-green/10 border border-neon-green/30 text-[8px] text-neon-green uppercase font-bold tracking-widest animate-pulse">
                  {currentMode} ACTIVE {radarTimestamp && `(${radarTimestamp})`}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-neon-blue text-[8px] font-bold px-2 py-1 rounded border border-cyan-500/30 flex items-center gap-1 transition-all"
                title="Force Reload Map Nodes & Feeds"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                RELOAD INTEL
              </button>
              <button
                onClick={() => {
                  if (mapRef.current) mapRef.current.setView([25, 18], 3);
                }}
                className="bg-[var(--card-bg)] hover:bg-white/10 text-[var(--text-secondary)] text-[8px] font-bold px-2 py-1 rounded border border-[var(--border-subtle)] flex items-center gap-1 transition-all"
                title="Reset Map View"
              >
                🎯 RE-CENTER
              </button>
              {onToggleMaximize && (
                <button
                  onClick={onToggleMaximize}
                  className="bg-[var(--card-bg)] hover:bg-white/10 text-[var(--text)] text-[8px] font-bold px-2 py-1 rounded border border-[var(--border-subtle)] flex items-center gap-1 transition-all"
                  title={isMaximized ? "Restore Default View" : "Maximize Map"}
                >
                  {isMaximized ? "RESTORE" : "MAXIMIZE"}
                </button>
              )}
            </div>
          </div>

          {/* Base Layer Switcher */}
          <div className="flex rounded overflow-hidden border border-[var(--border-subtle)]">
            {(Object.entries(TILE_LAYERS) as [keyof typeof TILE_LAYERS, typeof TILE_LAYERS[keyof typeof TILE_LAYERS]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => switchLayer(key)}
                className="text-[7.5px] px-2.5 py-1 font-bold uppercase tracking-wider transition-all"
                style={{
                  background: activeLayer === key ? "rgba(0,212,255,0.18)" : "transparent",
                  color: activeLayer === key ? "var(--neon-blue)" : "var(--text-secondary)",
                  borderRight: "1px solid var(--border-subtle)",
                }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Modes */}
        <div className="flex items-center justify-between px-3 py-1.5">
          {/* News Markers Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[7.5px] text-[var(--text-muted)] font-bold uppercase tracking-widest">News Node Filter:</span>
            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none bg-[var(--card-bg)] text-neon-blue text-[8.5px] font-bold uppercase tracking-wider border border-[var(--border-subtle)] rounded px-2.5 py-1 pr-7 cursor-pointer outline-none hover:border-cyan-500/50 transition-all"
              >
                {filterOptions.map((f) => (
                  <option key={f} value={f} className="bg-[#0B101A] text-white py-1">
                    {f}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-neon-blue">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Map Modes */}
          <div className="flex items-center gap-2">
            <span className="text-[7.5px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Tactical Layer Mode:</span>
            <div className="relative">
              <select
                value={currentMode}
                onChange={(e) => setCurrentMode(e.target.value)}
                className="appearance-none bg-[var(--card-bg)] text-purple-400 text-[8.5px] font-bold uppercase tracking-wider border border-[var(--border-subtle)] rounded px-2.5 py-1 pr-7 cursor-pointer outline-none hover:border-purple-500/50 transition-all"
              >
                {mapModes.map((m) => (
                  <option key={m} value={m} className="bg-[#0B101A] text-white py-1">
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-purple-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative overflow-hidden">
        <div id="nexusintel-map" style={{ width: "100%", height: "100%", background: "#050C1A", pointerEvents: "auto" }} />
        
        {/* Node Intel Legend */}
        <div className="absolute bottom-4 left-3 z-20 glass-panel p-2.5 text-[8px] space-y-1.5 pointer-events-none shadow-lg">
          <div className="text-[var(--text)] font-bold uppercase tracking-wider mb-1">Live Intelligence Array</div>
          {[
            { dot: "#FF2244", label: "USGS Earthquakes & Conflict Alerts" },
            { dot: "#FF8C00", label: "Domestic Alerts / GDACS Emergencies" },
            { dot: "#00FF88", label: "Diplomatic Pacts / Treaties" },
            { dot: "#00D4FF", label: "Strategic Infrastructure & Trade" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: l.dot, boxShadow: `0 0 5px ${l.dot}` }} />
              <span className="text-[var(--text-secondary)] font-medium">{l.label}</span>
            </div>
          ))}
          <div className="pt-1 border-t border-[var(--border-subtle)] text-[7px] text-[var(--text-muted)] font-mono">
            {newsMarkers.length + conflictMarkers.length} Active Nodes Tracked
          </div>
        </div>

        {/* Live Doppler Radar Banner when active */}
        {currentMode === "Live Doppler Radar 🌧️" && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-cyan-950/85 border border-cyan-400/40 text-[9px] font-mono text-cyan-300 shadow-xl pointer-events-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>RAINVIEWER LIVE GLOBAL RADAR · 0 API KEYS REQUIRED</span>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');

        @keyframes nexus-pulse {
          0% { transform: scale(0.6); opacity: 0.85; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        #nexusintel-map .leaflet-container {
          background: #050C1A !important;
          font-family: 'Inter', sans-serif;
        }

        #nexusintel-map .leaflet-control-zoom {
          border: 1px solid rgba(0,212,255,0.25) !important;
          background: rgba(15,22,40,0.85) !important;
          border-radius: 6px !important;
          backdrop-filter: blur(8px);
        }
        #nexusintel-map .leaflet-control-zoom a {
          color: #00D4FF !important;
          background: transparent !important;
          border-color: rgba(0,212,255,0.2) !important;
          font-size: 16px !important;
        }
        #nexusintel-map .leaflet-control-zoom a:hover {
          background: rgba(0,212,255,0.15) !important;
        }

        #nexusintel-map .leaflet-control-attribution {
          background: rgba(11,15,25,0.7) !important;
          color: #475569 !important;
          font-size: 7px !important;
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
}
