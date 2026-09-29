"use client";
import { useEffect, useRef, useState } from "react";

// TILE LAYERS
const TILE_LAYERS = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri",
    label: "🛰 Satellite",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap & CARTO",
    label: "🌐 Intel Dark",
  },
  hybrid: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: "Labels &copy; Esri",
    label: "🔭 Hybrid",
  },
};

// Map color codes to hex for leaflet
const COLOR_MAP: Record<string, string> = {
  "red": "#FF2244",           // Wars, attacks
  "green": "#00FF88",         // Positive global news
  "orange": "#FF8C00",        // India domestic (terror/riot/disaster)
  "yellow-orange": "#FFD700", // Upcoming issues/floods
  "light-blue": "#00D4FF"     // Good news nationwide/economy
};

const filterOptions = ["All News Nodes", "Critical (Red)", "Warnings (Orange)", "Positive (Green)", "Economy (Blue)"];
const mapModes = ["Standard", "Satellite Clouds 🛰️", "Live Precip 🌧️", "Live Ships 🚢", "Sea Temp 🌡️"];

interface MapCenterProps {
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export default function MapCenter({ isMaximized = false, onToggleMaximize }: MapCenterProps) {
  const mapRef = useRef<any>(null);
  
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
  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_LAYERS>("satellite");
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newsMarkers, setNewsMarkers] = useState<any[]>([]);
  const [conflictMarkers, setConflictMarkers] = useState<any[]>([]);
  const [liveShips, setLiveShips] = useState<any[]>([]);
  const conflictGroupRef = useRef<any>(null);
  const shipsGroupRef = useRef<any>(null);

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
        zoomControl: false,
        attributionControl: true,
        minZoom: 2,
        maxZoom: 18,
        preferCanvas: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      map.getContainer().style.background = "#050C1A";

      const tile = L.tileLayer(TILE_LAYERS[activeLayer].url, {
        attribution: TILE_LAYERS[activeLayer].attribution,
        maxZoom: 18,
      }).addTo(map);
      tileLayerRef.current = tile;

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

        const color = COLOR_MAP[news.colorNode] || "#00D4FF";
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center; cursor:pointer;">
              <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:transparent;border:2px solid ${color};animation:nexus-pulse 2s ease-out infinite;opacity:0.7;"></div>
              <div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color};z-index:10;"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([news.lat, news.lng], { icon });
        const sourceBranding = news.logo ? `<img src="${news.logo}" style="height:12px;width:auto;object-fit:contain;margin-right:6px;" />` : `<div style="width:8px;height:8px;border-radius:50%;background:${color};margin-right:6px;"></div>`;

        const slug =
          news.colorNode === "red"
            ? "defense"
            : news.colorNode === "orange"
            ? "domestic"
            : news.colorNode === "light-blue"
            ? "economy"
            : "global";

        marker.bindPopup(`
          <div style="background:#FAF7F0;border:2px solid #1C1917;border-radius:3px;padding:14px;min-width:280px;max-width:320px;color:#1C1917;font-family:Inter,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,0.35);">
            <div style="display:flex;align-items:center;justify-content:between;margin-bottom:8px;border-bottom:1px solid #E2DBD0;padding-bottom:6px;">
              <div style="display:flex;align-items:center;">
                ${sourceBranding}
                <strong style="font-size:9.5px;color:#1C1917;letter-spacing:1px;text-transform:uppercase;">${news.source}</strong>
              </div>
              <span style="font-size:8.5px;font-weight:bold;color:#C41E3A;background:rgba(196,30,58,0.1);padding:2px 6px;border-radius:2px;margin-left:auto;">
                ${(news.colorNode === 'red' ? 'CRITICAL' : news.colorNode === 'orange' ? 'WARNING' : 'INTEL')}
              </span>
            </div>
            <h4 style="font-family:'Playfair Display',serif;font-size:13px;font-weight:900;color:#1C1917;margin-bottom:6px;line-height:1.35;">${news.title}</h4>
            <p style="font-size:11px;color:#44403C;line-height:1.45;margin-bottom:10px;">${news.description || ''}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:9.5px;color:#78716C;margin-bottom:10px;border-top:1px solid #E2DBD0;padding-top:6px;">
              <span style="font-weight:600;color:#1C1917;">📍 ${news.country || 'Global'}</span>
              <span>${new Date(news.publishedAt || Date.now()).toLocaleTimeString()}</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              ${news.url ? `<a href="${news.url}" target="_blank" rel="noreferrer" style="font-size:10px;color:#78716C;text-decoration:underline;font-weight:bold;">Source Wire [↗]</a>` : '<span></span>'}
              <a href="/intelligence/${slug}" style="display:inline-flex;align-items:center;gap:4px;background:#C41E3A;color:#FFFFFF;padding:6px 12px;font-size:10px;font-weight:bold;text-transform:uppercase;text-decoration:none;border-radius:2px;letter-spacing:0.5px;">
                <span>View Full Analysis</span> &rarr;
              </a>
            </div>
          </div>
        `, { className: "nexusintel-popup" });
        nexusGroup.addLayer(marker);
      });

      // 2. Conflict Markers (ACLED Pattern)
      conflictMarkers.forEach((event) => {
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;inset:0;border:1px dashed #FF2244;border-radius:50%;animation:rotate-ring 4s linear infinite;"></div>
              <div style="width:2px;height:14px;background:#FF2244;position:absolute;"></div>
              <div style="width:14px;height:2px;background:#FF2244;position:absolute;"></div>
              <div style="width:4px;height:4px;background:#FF2244;border-radius:50%;box-shadow:0 0 8px #FF2244;"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([event.lat, event.lng], { icon });
        marker.bindPopup(`
          <div style="background:#FAF7F0;border:2px solid #C41E3A;border-radius:3px;padding:12px;min-width:260px;color:#1C1917;font-family:Inter,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,0.35);">
            <div style="font-size:9px;font-weight:bold;color:#C41E3A;text-transform:uppercase;margin-bottom:6px;letter-spacing:1px;display:flex;align-items:center;gap:4px;">
              <span>⚠️</span> <span>ACTIVE CONFLICT: ${event.type || 'COMBAT THEATER'}</span>
            </div>
            <div style="font-family:'Playfair Display',serif;font-size:12px;font-weight:bold;margin-bottom:8px;line-height:1.3;color:#1C1917;">${event.description || 'Active kinetic engagement documented'}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:9px;color:#44403C;border-top:1px solid #E2DBD0;padding-top:6px;margin-bottom:8px;">
              <div>ACTOR: <strong style="color:#1C1917;">${event.actor1 || 'Unknown'}</strong></div>
              <div>FATALITIES: <strong style="color:#C41E3A;">${event.fatalities || 'N/A'}</strong></div>
              <div>LOC: <strong style="color:#1C1917;">${event.location || 'Active Zone'}</strong></div>
              <div>SRC: <strong style="color:#1C1917;">${event.source || 'ACLED'}</strong></div>
            </div>
            <div style="display:flex;justify-content:flex-end;">
              <a href="/intelligence/defense" style="display:inline-flex;align-items:center;gap:4px;background:#C41E3A;color:#FFFFFF;padding:5px 10px;font-size:9.5px;font-weight:bold;text-transform:uppercase;text-decoration:none;border-radius:2px;">
                Open Defense Dossier &rarr;
              </a>
            </div>
          </div>
        `, { className: "nexusintel-popup" });
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
        const color = ship.color || "#00FFCC";
        
        const icon = L.divIcon({
          className: "",
          html: `
            <div style="transform: rotate(${ship.heading}deg); width: 14px; height: 18px; position: relative; filter: drop-shadow(0 0 2px ${color});">
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
          <strong style="color:${color};font-family:Orbitron;font-size:11px">${ship.name}</strong><br/>
          <span style="font-size:9px;color:#94A3B8">Type: ${ship.type} | SPD: ${ship.speed}</span><br/>
          <span style="font-size:8px;color:#64748B">HDG: ${ship.heading}°</span>
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

      const newTile = L.tileLayer(TILE_LAYERS[key].url, {
        attribution: TILE_LAYERS[key].attribution,
        maxZoom: 18,
      }).addTo(mapRef.current);
      tileLayerRef.current = newTile;

      if (key === "satellite") {
        const labelTile = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          { opacity: 0.7 }
        ).addTo(mapRef.current);
        satLabelLayerRef.current = labelTile;
      }
    });
  };

  return (
    <div className="map-frame flex flex-col overflow-hidden h-full relative">
      {/* Controls row top */}
      <div className="flex flex-col border-b border-[#E2DBD0] shrink-0 z-10 relative bg-[#F3EFE6]">
        {/* Top Header & Base Maps */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2DBD0]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="live-indicator" />
              <span className="font-playfair text-xs font-black uppercase tracking-wider text-[#1C1917]">
                Geospatial Intelligence Telemetry Grid
              </span>
              {currentMode !== "Standard" && (
                <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-[#C41E3A]/10 border border-[#C41E3A]/30 text-[8px] text-[#C41E3A] uppercase font-bold tracking-widest animate-pulse">
                  {currentMode} ACTIVE
                </span>
              )}
            </div>

            {onToggleMaximize && (
              <div className="flex gap-1.5">
                <button
                  onClick={() => setRefreshKey((prev) => prev + 1)}
                  className="bg-white hover:bg-[#E2DBD0] text-[#1C1917] text-[8px] font-bold px-2 py-0.5 rounded-sm border border-[#C8BFB0] flex items-center gap-1 transition-all uppercase tracking-wider shadow-sm"
                  title="Force Reload Map Nodes & Layers"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
                  </svg>
                  RELOAD
                </button>
                <button
                  onClick={onToggleMaximize}
                  className="bg-[#1C1917] hover:bg-[#333] text-white text-[8px] font-bold px-2 py-0.5 rounded-sm border border-[#1C1917] flex items-center gap-1 transition-all uppercase tracking-wider shadow-sm"
                  title={isMaximized ? "Restore Default View" : "Maximize Map"}
                >
                  {isMaximized ? (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                      </svg>
                      RESTORE
                    </>
                  ) : (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                      MAXIMIZE
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="flex rounded-sm overflow-hidden border border-[#C8BFB0] shadow-sm">
            {(Object.entries(TILE_LAYERS) as [keyof typeof TILE_LAYERS, (typeof TILE_LAYERS)[keyof typeof TILE_LAYERS]][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  onClick={() => switchLayer(key)}
                  className={`text-[8px] px-2.5 py-1 font-bold uppercase tracking-wider transition-all border-r border-[#E2DBD0] last:border-r-0 ${
                    activeLayer === key
                      ? "bg-[#1C1917] text-white"
                      : "bg-white text-[#78716C] hover:bg-[#F3EFE6] hover:text-[#1C1917]"
                  }`}
                >
                  {val.label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Filters & Modes */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#FAF7F0]">
          {/* News Markers Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-[#78716C] font-bold uppercase tracking-wider">News Node Filter:</span>
            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none bg-white text-[#1C1917] text-[8.5px] font-bold uppercase tracking-wider border border-[#C8BFB0] rounded-sm px-2.5 py-1 pr-7 cursor-pointer outline-none hover:border-[#1C1917] focus:border-[#C41E3A] transition-all shadow-sm"
              >
                {filterOptions.map((f) => (
                  <option key={f} value={f} className="bg-white text-[#1C1917] py-1">
                    {f}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#1C1917]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Map Modes */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-[#78716C] font-bold uppercase tracking-wider">Telemetry Layer:</span>
            <div className="relative">
              <select
                value={currentMode}
                onChange={(e) => setCurrentMode(e.target.value)}
                className="appearance-none bg-white text-[#C41E3A] text-[8.5px] font-bold uppercase tracking-wider border border-[#C8BFB0] rounded-sm px-2.5 py-1 pr-7 cursor-pointer outline-none hover:border-[#C41E3A] focus:border-[#C41E3A] transition-all shadow-sm"
              >
                {mapModes.map((m) => (
                  <option key={m} value={m} className="bg-white text-[#1C1917] py-1">
                    {m}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-[#C41E3A]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative overflow-hidden">
        <div id="nexusintel-map" style={{ width: "100%", height: "100%", background: "#050C1A" }} />

        {/* Legend */}
        <div className="absolute bottom-4 left-3 z-20 bg-white/95 border border-[#C8BFB0] rounded-sm shadow-md p-2.5 text-[8.5px] space-y-1.5 pointer-events-none">
          <div className="text-[#1C1917] font-playfair font-black uppercase tracking-wider text-[9px] border-b border-[#E2DBD0] pb-0.5">
            Node Intel Legend
          </div>
          {[
            { dot: "#FF2244", label: "War / Assault / Critical" },
            { dot: "#FF8C00", label: "Domestic Riots / Terror" },
            { dot: "#FFD700", label: "Upcoming Floods / Risk" },
            { dot: "#00FF88", label: "Global Peace / Treaties" },
            { dot: "#00D4FF", label: "National Biz / Infrastructure" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.dot }} />
              <span className="text-[#44403C] font-medium">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Temperature Legend */}
        {currentMode === "Sea Temp 🌡️" && (
          <div className="absolute bottom-4 right-4 z-20 flex rounded-sm overflow-hidden text-[9px] font-bold text-white shadow-lg pointer-events-none border border-[#1C1917]">
            <div className="px-1.5 py-0.5" style={{ background: "#71255e" }}>-30°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#5d1c81" }}>-20°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#383296" }}>-10°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#458bdc" }}>0°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#74bfb4" }}>10°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#b1d164" }}>20°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#f5c64f" }}>25°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#eb6c2f" }}>30°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#c81c1c" }}>40°</div>
            <div className="px-1.5 py-0.5" style={{ background: "#64041e" }}>50°</div>
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
          border: 1px solid #C8BFB0 !important;
          background: #FAF7F0 !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        #nexusintel-map .leaflet-control-zoom a {
          color: #1C1917 !important;
          background: transparent !important;
          border-color: #E2DBD0 !important;
          font-size: 15px !important;
          font-weight: bold !important;
        }
        #nexusintel-map .leaflet-control-zoom a:hover {
          background: #F3EFE6 !important;
          color: #C41E3A !important;
        }

        #nexusintel-map .leaflet-control-attribution {
          background: rgba(250,247,240,0.85) !important;
          color: #78716C !important;
          font-size: 8px !important;
          border-radius: 2px;
        }
        #nexusintel-map .leaflet-control-attribution a {
          color: #1C1917 !important;
        }

        .nexusintel-popup .leaflet-popup-content-wrapper {
          background: #FAF7F0 !important;
          border: 1px solid #1C1917 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          padding: 0 !important;
          border-radius: 4px !important;
          color: #1C1917 !important;
        }
        .nexusintel-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .nexusintel-popup .leaflet-popup-tip-container {
          display: none !important;
        }
        .nexusintel-popup .leaflet-popup-close-button {
          color: #C41E3A !important;
          top: 6px !important;
          right: 10px !important;
          font-size: 16px !important;
          font-weight: bold !important;
        }
      `}</style>
    </div>
  );
}
