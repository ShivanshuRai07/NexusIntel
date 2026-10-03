"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface TileConfig {
  url: string;
  labelsUrl?: string;
  attribution: string;
  label: string;
  maxZoom?: number;
}

// TILE LAYERS — High-reliability ESRI ArcGIS tiles (NO WATERMARK, NO API KEY REQUIRED)
const TILE_LAYERS: Record<string, TileConfig> = {
  dark: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    label: "🌙 Night Canvas",
    maxZoom: 16,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
    label: "🛰️ Satellite",
    maxZoom: 18,
  },
  light: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    label: "☀️ Day Canvas",
    maxZoom: 16,
  },
};

// Map color codes to hex for leaflet
const COLOR_MAP: Record<string, string> = {
  "red": "#EF4444",           // Flashpoints, attacks
  "green": "#10B981",         // Constructive news
  "orange": "#F59E0B",        // Domestic alerts
  "yellow-orange": "#EAB308", // Risk notices
  "light-blue": "#38BDF8"     // Economic / Infrastructure
};

const filterOptions = ["All News Nodes", "Critical (Red)", "Warnings (Orange)", "Positive (Green)", "Economy (Blue)"];
const mapModes = ["Standard", "Satellite Clouds 🛰️", "Live Precip 🌧️", "Live Ships 🚢", "Sea Temp 🌡️"];

interface MapCenterProps {
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export default function MapCenter({ isMaximized = false, onToggleMaximize }: MapCenterProps) {
  const { theme } = useTheme();
  const mapRef = useRef<any>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Base layers
  const tileLayerRef = useRef<any>(null);
  const satLabelLayerRef = useRef<any>(null);
  
  // Overlay mode layer (clouds/weather/ships)
  const modeOverlayLayerRef = useRef<any>(null);
  const modeRefLayerRef = useRef<any>(null); // Reference borders for satellite mode

  // Markers groups
  const markersGroupRef = useRef<any>(null);
  
  // State
  const [activeFilter, setActiveFilter] = useState("All News Nodes");
  const [currentMode, setCurrentMode] = useState("Standard");
  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_LAYERS>("dark");
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newsMarkers, setNewsMarkers] = useState<any[]>([]);
  const [conflictMarkers, setConflictMarkers] = useState<any[]>([]);
  const [liveShips, setLiveShips] = useState<any[]>([]);
  const conflictGroupRef = useRef<any>(null);
  const shipsGroupRef = useRef<any>(null);

  // Synchronize base layer with global theme if not explicitly set to satellite
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (activeLayer === "satellite") return; // Respect satellite selection
    const target = theme === "light" ? "light" : "dark";
    if (activeLayer !== target) {
      switchLayer(target);
    }
  }, [theme, isLoaded]);

  // Fetch live news from API
  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNewsMarkers(data))
      .catch(console.error);
  }, []);

  // Poll live ships if mode is active
  useEffect(() => {
    if (currentMode !== "Live Ships 🚢") {
      setLiveShips([]); // Clear ships if not in ship mode
      // Fetch news and conflict data once when mode changes away from "Live Ships" or on initial load
      fetch('/api/news').then(res => res.json()).then(setNewsMarkers).catch(console.error);
      fetch('/api/conflict').then(res => res.json()).then(setConflictMarkers).catch(console.error);
      return;
    }
    
    // If in "Live Ships" mode, poll for ships and conflict
    // User Request: Force map to Intel Dark mode when Ships layer is activated
    if (activeLayer !== 'dark') {
      setActiveLayer('dark');
      switchLayer('dark'); // Call the switch function to apply immediately
    }

    const fetchConflict = () => {
      fetch('/api/conflict').then(res => res.json()).then(setConflictMarkers).catch(console.error);
    };
    fetchConflict(); // Initial fetch

    const fetchShips = () => {
      fetch('/api/ships').then(res => res.json()).then(setLiveShips).catch(console.error);
    };
    fetchShips(); // Initial fetch

    const interval = setInterval(() => {
      fetchShips();
      fetchConflict();
    }, 5000); // 5-second live ping for ships and conflict
    return () => clearInterval(interval);
  }, [currentMode, refreshKey]);

  // Initialize Maps
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    let mapInstance: any = null;

    import("leaflet").then((L) => {
      const container = document.getElementById("nexusintel-map");
      if (!container) return;

      // Check if map is already initialized on this container
      // Leaflet attaches a _leaflet_id to the container
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

      map.getContainer().style.background = "var(--map-bg, #080C14)";

      const cfg = TILE_LAYERS[activeLayer];
      const tile = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom || 18,
      }).addTo(map);
      tileLayerRef.current = tile;

      if (cfg.labelsUrl) {
        const labels = L.tileLayer(cfg.labelsUrl, {
          opacity: 0.85,
          zIndex: 4,
          maxZoom: cfg.maxZoom || 18,
        }).addTo(map);
        satLabelLayerRef.current = labels;
      }

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

  // Build Intelligence Markers (News & Conflict)
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    import("leaflet").then((L) => {
      // Clear previous
      if (markersGroupRef.current) mapRef.current.removeLayer(markersGroupRef.current);
      if (conflictGroupRef.current) mapRef.current.removeLayer(conflictGroupRef.current);

      const nexusGroup = L.layerGroup();
      
      // 1. News Markers
      newsMarkers.forEach((news) => {
        // Filter logic
        if (activeFilter === "Critical (Red)" && news.colorNode !== "red") return;
        if (activeFilter === "Warnings (Orange)" && !["orange", "yellow-orange"].includes(news.colorNode)) return;
        if (activeFilter === "Positive (Green)" && news.colorNode !== "green") return;
        if (activeFilter === "Economy (Blue)" && news.colorNode !== "light-blue") return;

        const color = COLOR_MAP[news.colorNode] || "#38BDF8";
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <div style="position:absolute;width:24px;height:24px;border-radius:50%;background:${color}20;border:1px solid ${color}80;"></div>
              <div style="width:7px;height:7px;border-radius:50%;background:${color};z-index:10;"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([news.lat, news.lng], { icon });
        const sourceBranding = news.logo ? `<img src="${news.logo}" style="height:12px;width:auto;object-fit:contain;margin-right:6px;" />` : `<div style="width:6px;height:6px;border-radius:50%;background:${color};margin-right:6px;"></div>`;

        marker.bindPopup(`
          <div style="background:#0F1626;border:1px solid rgba(255,255,255,0.14);border-radius:8px;padding:12px;min-width:260px;color:#F1F5F9;font-family:Inter,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,0.6);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
              <div style="display:flex;align-items:center;">
                ${sourceBranding}
                <strong style="font-size:9.5px;color:${color};letter-spacing:0.5px;text-transform:uppercase;font-weight:600;">${news.source}</strong>
              </div>
              <span style="color:#94A3B8;font-size:8.5px;font-family:monospace;">${new Date(news.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h4 style="font-size:12px;font-weight:600;color:#F8FAFC;margin-bottom:6px;line-height:1.35;">${news.title}</h4>
            <p style="font-size:10px;color:#94A3B8;line-height:1.45;margin-bottom:10px;">${news.description || ""}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:9.5px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.06);">
              <span style="color:#38BDF8;font-weight:500;">📍 ${news.country || "Global"}</span>
              ${news.url && news.url !== '#' ? `<a href="${news.url}" target="_blank" rel="noopener noreferrer" style="color:#94A3B8;text-decoration:underline;">Source Article ↗</a>` : ''}
            </div>
          </div>
        `, { className: "nexusintel-popup" });

        marker.bindTooltip(`
          <div style="max-width:220px;white-space:normal;line-height:1.35;">
            <div style="font-size:10.5px;font-weight:600;color:#F8FAFC;">${news.title}</div>
            <div style="font-size:9px;color:${color};margin-top:3px;font-weight:600;text-transform:uppercase;">${news.source} • ${news.country || "Global"}</div>
          </div>
        `, { className: "nexusintel-tooltip", direction: "top", offset: [0, -10] });

        nexusGroup.addLayer(marker);
      });

      // 2. Conflict Markers
      conflictMarkers.forEach((event) => {
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;inset:0;border:1.5px solid #EF4444;border-radius:50%;opacity:0.6;"></div>
              <div style="width:5px;height:5px;background:#EF4444;border-radius:50%;"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([event.lat, event.lng], { icon });
        marker.bindPopup(`
          <div style="background:#0F1626;border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px;min-width:240px;color:#F1F5F9;font-family:Inter,sans-serif;">
            <div style="font-size:9.5px;font-weight:600;color:#F87171;text-transform:uppercase;margin-bottom:6px;letter-spacing:0.5px;">
              CRITICAL SECURITY INCIDENT: ${event.type}
            </div>
            <div style="font-size:11.5px;font-weight:600;margin-bottom:8px;color:#F1F5F9;line-height:1.35;">${event.description}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:9.5px;color:#94A3B8;border-top:1px solid rgba(255,255,255,0.08);padding-top:6px;">
              <div>Party: <span style="font-weight:600;color:#E2E8F0;">${event.actor1}</span></div>
              <div>Casualties: <span style="font-weight:600;color:#F87171;">${event.fatalities}</span></div>
              <div>Sector: <span style="font-weight:600;color:#E2E8F0;">${event.location}</span></div>
              <div>Source: <span style="font-weight:600;color:#E2E8F0;">${event.source}</span></div>
            </div>
          </div>
        `);

        marker.bindTooltip(`
          <div style="max-width:220px;white-space:normal;line-height:1.35;">
            <div style="font-size:10.5px;font-weight:700;color:#F87171;text-transform:uppercase;">INCIDENT: ${event.type}</div>
            <div style="font-size:9.5px;color:#F1F5F9;margin-top:2px;">${event.location || event.description}</div>
            <div style="font-size:8.5px;color:#94A3B8;margin-top:2px;">Fatalities: <span style="color:#F87171;font-weight:600;">${event.fatalities}</span></div>
          </div>
        `, { className: "nexusintel-tooltip", direction: "top", offset: [0, -10] });

        nexusGroup.addLayer(marker);
      });

      nexusGroup.addTo(mapRef.current);
      markersGroupRef.current = nexusGroup;
    });
  }, [isLoaded, newsMarkers, conflictMarkers, activeFilter, refreshKey]);

  // Build Ship Markers
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    import("leaflet").then((L) => {
      if (shipsGroupRef.current) mapRef.current.removeLayer(shipsGroupRef.current);
      if (liveShips.length === 0) return;

      const shipLayer = L.layerGroup();
      liveShips.forEach((ship) => {
        const color = ship.color || "#38BDF8";
        
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="transform: rotate(${ship.heading}deg); width: 14px; height: 18px; position: relative;">
              <svg viewBox="0 0 14 18" style="width: 100%; height: 100%; overflow: visible;">
                <path d="M7 0 L14 18 L7 14 L0 18 Z" fill="#0F1626" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
          `,
          iconSize: [14, 18],
          iconAnchor: [7, 9],
          popupAnchor: [0, -10],
        });

        const marker = L.marker([ship.lat, ship.lng], { icon });
        marker.bindTooltip(`
          <strong style="color:${color};font-size:10px;font-family:Inter,sans-serif;font-weight:600;">${ship.name}</strong><br/>
          <span style="font-size:8.5px;color:#94A3B8">Type: ${ship.type} | Speed: ${ship.speed}</span><br/>
          <span style="font-size:8.5px;color:#64748B">Course: ${ship.heading}°</span>
        `, { className: "nexusintel-tooltip" });

        shipLayer.addLayer(marker);
      });

      shipLayer.addTo(mapRef.current);
      shipsGroupRef.current = shipLayer;
    });
  }, [liveShips, isLoaded]);

  // Handle Mode Overlays (Clouds/Weather/Ships)
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    const getGibsDate = () => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - 1);
      return date.toISOString().split('T')[0];
    };

    import("leaflet").then((L) => {
      if (modeOverlayLayerRef.current) mapRef.current.removeLayer(modeOverlayLayerRef.current);
      if (modeRefLayerRef.current) mapRef.current.removeLayer(modeRefLayerRef.current);

      if (currentMode === "Standard") return;

      if (currentMode === "Live Ships 🚢") {
        modeOverlayLayerRef.current = L.tileLayer("https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png", {
          opacity: 0.8,
          zIndex: 10
        }).addTo(mapRef.current);
        return;
      }

      if (currentMode === "Sea Temp 🌡️") {
        // Fallback to open weather layers using openmeteo or similar free providers if available, or a public NOAA layer
        modeOverlayLayerRef.current = L.tileLayer('https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=93450e181d11b1fc8fe0d15e21fb5c57', { // Publicly available dev key for demo UI
          opacity: 0.6,
          zIndex: 10,
          subdomains: ['a', 'b', 'c']
        }).addTo(mapRef.current);
        return;
      }

      if (currentMode === "Satellite Clouds 🛰️") {
        // Using a 2-day-old date ensures the global mosaic is 100% complete with no processing gaps
        const getMosaicedDate = () => {
          const date = new Date();
          date.setUTCDate(date.getUTCDate() - 2);
          return date.toISOString().split('T')[0];
        };
        const mosaicDate = getMosaicedDate();

        // VIIRS SNPP has a broader swath (3000km) than MODIS, leaving almost no stripes
        const viirsUrl = `https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${mosaicDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
        
        // We create a group to overlay both VIIRS and a fallback to fill any tiny remaining gaps
        const cloudsLayer = L.tileLayer(viirsUrl, {
          subdomains: ['a', 'b', 'c'],
          attribution: "&copy; NASA GIBS / VIIRS",
          opacity: 1.0,
          zIndex: 5
        });

        // Add an additional layer for MODIS Aqua as a backfill for the equator if needed
        const aquaUrl = `https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_CorrectedReflectance_TrueColor/default/${mosaicDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
        const aquaLayer = L.tileLayer(aquaUrl, {
          subdomains: ['a', 'b', 'c'],
          opacity: 0.5, // Blend it in
          zIndex: 4
        });

        const layerGroup = L.layerGroup([aquaLayer, cloudsLayer]).addTo(mapRef.current);
        modeOverlayLayerRef.current = layerGroup;

        modeRefLayerRef.current = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
          opacity: 0.8,
          zIndex: 15
        }).addTo(mapRef.current);
        return;
      }

      if (currentMode === "Live Precip 🌧️") {
        // Use a public dev key for Rainviewer or OpenWeatherMap for demo UI
        modeOverlayLayerRef.current = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=93450e181d11b1fc8fe0d15e21fb5c57`, {
          opacity: 0.8,
          zIndex: 10
        }).addTo(mapRef.current);
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

      const cfg = TILE_LAYERS[key];
      const newTile = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom || 18,
      }).addTo(mapRef.current);
      tileLayerRef.current = newTile;

      if (cfg.labelsUrl) {
        const labelTile = L.tileLayer(cfg.labelsUrl, {
          opacity: 0.85,
          zIndex: 4,
          maxZoom: cfg.maxZoom || 18,
        }).addTo(mapRef.current);
        satLabelLayerRef.current = labelTile;
      }
    });
  };

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-lg flex flex-col overflow-hidden h-full relative shadow-sm transition-colors duration-200">
      {/* Controls row top */}
      <div className="flex flex-col border-b border-[var(--border)] shrink-0 z-10 relative bg-[var(--panel-card)] backdrop-blur-md">
        
        {/* Top Header & Base Maps */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
                Global Geospatial Monitor
              </span>
              {currentMode !== "Standard" && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-[8.5px] text-sky-400 uppercase font-medium">
                  {currentMode} Active
                </span>
              )}
            </div>
            
            {onToggleMaximize && (
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  className="bg-[var(--panel)] hover:bg-[var(--panel-hover)] text-[var(--text-secondary)] text-[9px] font-medium px-2 py-1 rounded border border-[var(--border)] flex items-center gap-1 transition-colors"
                  title="Reload Nodes & Layers"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                  Sync Nodes
                </button>
                <button
                  onClick={() => {
                    if (mapRef.current) mapRef.current.setView([25, 18], 3);
                  }}
                  className="bg-[var(--panel)] hover:bg-[var(--panel-hover)] text-[var(--text-secondary)] text-[9px] font-medium px-2 py-1 rounded border border-[var(--border)] flex items-center gap-1 transition-colors"
                  title="Reset Map View"
                >
                  Center View
                </button>
                <button
                  onClick={onToggleMaximize}
                  className="bg-[var(--panel)] hover:bg-[var(--panel-hover)] text-[var(--text-primary)] text-[9px] font-medium px-2 py-1 rounded border border-[var(--border)] flex items-center gap-1 transition-colors"
                  title={isMaximized ? "Restore Default View" : "Maximize Map"}
                >
                  {isMaximized ? "Restore" : "Fullscreen"}
                </button>
              </div>
            )}
          </div>

          {/* Base Layer Switcher */}
          <div className="flex rounded-md overflow-hidden bg-[var(--panel-card)] border border-[var(--border)] p-0.5">
            {(Object.entries(TILE_LAYERS) as [keyof typeof TILE_LAYERS, typeof TILE_LAYERS[keyof typeof TILE_LAYERS]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => switchLayer(key)}
                className={`text-[8.5px] px-2.5 py-1 rounded font-medium transition-all ${
                  activeLayer === key
                    ? "bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30 shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Modes */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--panel-card)]">
          {/* News Markers Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">Node Filter:</span>
            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none bg-[var(--panel)] text-[var(--text-primary)] text-[9.5px] font-medium border border-[var(--border)] rounded px-2.5 py-1 pr-6 cursor-pointer outline-none hover:border-sky-500/50 focus:border-sky-500 transition-colors"
              >
                {filterOptions.map((f) => (
                  <option key={f} value={f} className="bg-[var(--panel)] text-[var(--text-primary)] py-1">
                    {f}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[var(--text-secondary)]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Map Modes */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">Sensor Overlay:</span>
            <div className="relative">
              <select
                value={currentMode}
                onChange={(e) => setCurrentMode(e.target.value)}
                className="appearance-none bg-[var(--panel)] text-[var(--text-primary)] text-[9.5px] font-medium border border-[var(--border)] rounded px-2.5 py-1 pr-6 cursor-pointer outline-none hover:border-sky-500/50 focus:border-sky-500 transition-colors"
              >
                {mapModes.map((m) => (
                  <option key={m} value={m} className="bg-[var(--panel)] text-[var(--text-primary)] py-1">
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[var(--text-secondary)]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative overflow-hidden">
        <div id="nexusintel-map" style={{ width: "100%", height: "100%", background: "var(--map-bg)", pointerEvents: "auto" }} />
        
        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-20 bg-[var(--panel)] border border-[var(--border)] rounded-md p-2.5 text-[8.5px] space-y-1 pointer-events-none shadow-md backdrop-blur-sm transition-colors">
          <div className="text-[var(--text-secondary)] font-semibold uppercase tracking-wider mb-1">Signal Classification</div>
          {[
            { dot: "#EF4444", label: "Active Hostilities / Conflicts" },
            { dot: "#F59E0B", label: "Security & Civil Alerts" },
            { dot: "#EAB308", label: "Upcoming Risk Advisories" },
            { dot: "#10B981", label: "Bilateral Accords & Peace" },
            { dot: "#38BDF8", label: "Strategic & Commercial Infrastructure" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.dot }} />
              <span className="text-[var(--text-primary)]">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Temperature Legend */}
        {currentMode === "Sea Temp 🌡️" && (
          <div className="absolute bottom-4 right-4 z-20 flex rounded-md overflow-hidden text-[10px] font-bold text-white shadow-lg pointer-events-none" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="px-2 py-1" style={{ background: '#71255e' }}>-30</div>
            <div className="px-2 py-1" style={{ background: '#5d1c81' }}>-20</div>
            <div className="px-2 py-1" style={{ background: '#383296' }}>-10</div>
            <div className="px-2 py-1" style={{ background: '#458bdc' }}>0</div>
            <div className="px-2 py-1" style={{ background: '#74bfb4' }}>10</div>
            <div className="px-2 py-1" style={{ background: '#b1d164' }}>20</div>
            <div className="px-2 py-1" style={{ background: '#f5c64f' }}>25</div>
            <div className="px-2 py-1" style={{ background: '#eb6c2f' }}>30</div>
            <div className="px-2 py-1" style={{ background: '#c81c1c' }}>40</div>
            <div className="px-2 py-1" style={{ background: '#64041e' }}>50</div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');

        @keyframes nexus-pulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        #nexusintel-map .leaflet-container {
          background: #050C1A !important;
          font-family: 'Inter', sans-serif;
        }

        #nexusintel-map .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.12) !important;
          background: rgba(15,22,38,0.95) !important;
          border-radius: 6px !important;
          backdrop-filter: blur(8px);
          overflow: hidden;
        }
        #nexusintel-map .leaflet-control-zoom a {
          color: #94A3B8 !important;
          background: transparent !important;
          border-color: rgba(255,255,255,0.1) !important;
          font-size: 14px !important;
          transition: all 0.2s;
        }
        #nexusintel-map .leaflet-control-zoom a:hover {
          color: #F1F5F9 !important;
          background: rgba(255,255,255,0.08) !important;
        }

        #nexusintel-map .leaflet-control-attribution {
          background: rgba(8,12,20,0.85) !important;
          color: #64748B !important;
          font-size: 8px !important;
          backdrop-filter: blur(4px);
        }
        #nexusintel-map .leaflet-control-attribution a {
          color: #94A3B8 !important;
        }

        .nexusintel-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .nexusintel-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .nexusintel-popup .leaflet-popup-tip-container {
          display: none !important;
        }
        .nexusintel-popup .leaflet-popup-close-button {
          color: #94A3B8 !important;
          top: 8px !important;
          right: 10px !important;
          font-size: 15px !important;
        }
        .nexusintel-popup .leaflet-popup-close-button:hover {
          color: #F1F5F9 !important;
        }
        
        /* Custom select styling for map filters */
        select option {
          background: #0F1626;
          color: #F1F5F9;
          font-weight: 500;
          padding: 8px;
        }
      `}</style>
    </div>
  );
}
