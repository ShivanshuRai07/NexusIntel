"use client";
import { useEffect, useRef, useState } from "react";

// ─── Canvas Line Chart (preserved exactly, colors updated) ───────────────────
function LineChart({
  data,
  color,
  secondaryData,
  secondaryColor,
}: {
  data: number[];
  color: string;
  secondaryData?: number[];
  secondaryColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const allData = secondaryData ? [...data, ...secondaryData] : data;
    const max = Math.max(...allData);
    const min = Math.min(...allData);
    const range = max - min || 1;
    const pad = 4;

    const drawLine = (pts: number[], c: string) => {
      const xStep = (W - pad * 2) / (pts.length - 1);
      const coords = pts.map((v, i) => ({
        x: pad + i * xStep,
        y: H - pad - ((v - min) / range) * (H - pad * 2),
      }));

      const hex = c.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Area fill
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.moveTo(coords[0].x, H);
      coords.forEach(({ x, y }) => ctx.lineTo(x, y));
      ctx.lineTo(coords[coords.length - 1].x, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(coords[0].x, coords[0].y);
      coords.forEach(({ x, y }) => ctx.lineTo(x, y));
      ctx.strokeStyle = c;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.stroke();

      // Dots
      coords.forEach(({ x, y }) => {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
      });
    };

    drawLine(data, color);
    if (secondaryData && secondaryColor) drawLine(secondaryData, secondaryColor);
  }, [data, color, secondaryData, secondaryColor]);

  return <canvas ref={canvasRef} width={300} height={60} className="w-full h-full" />;
}

// ─── Canvas Bar Chart (preserved, colors updated) ────────────────────────────
function BarChart({
  data,
  color,
}: {
  data: { label: string; value: number }[];
  color: string | ((v: number) => string);
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-0.5 h-full w-full">
      {data.map((d, i) => {
        const barColor = typeof color === "function" ? color(d.value) : color;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
            <span style={{ fontSize: "6px", fontWeight: "700", color: barColor }}>{d.value}</span>
            <div
              className="w-full rounded-t transition-all duration-1000"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: `linear-gradient(to top, ${barColor}55, ${barColor})`,
                minHeight: "2px",
              }}
            />
            <span style={{ fontSize: "5.5px", color: "var(--text-muted)", textAlign: "center", lineHeight: 1 }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const crudeOilData = [68.5, 70.2, 72.1, 71.5, 74.0, 73.8, 76.2, 75.9, 78.1, 77.5, 79.2, 78.45];
const goldData = [2050, 2065, 2080, 2075, 2100, 2090, 2120, 2115, 2130, 2125, 2140, 2145];

const precipData = [
  { label: "01", value: 2.1 }, { label: "02", value: 1.4 }, { label: "03", value: 0.8 },
  { label: "04", value: 3.2 }, { label: "05", value: 5.6 }, { label: "06", value: 4.1 },
  { label: "07", value: 2.9 }, { label: "08", value: 1.3 }, { label: "09", value: 0.5 },
  { label: "10", value: 6.8 }, { label: "11", value: 8.2 }, { label: "12", value: 5.4 },
];
const tempData = [14.2, 15.8, 16.1, 14.7, 13.9, 15.2, 17.3, 18.6, 19.1, 18.4, 20.2, 21.0];

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({
  label,
  value,
  unit,
  change,
  changePositive,
  source,
  accentColor,
  children,
  href,
  liveLabel,
}: {
  label: string;
  value: string;
  unit?: string;
  change?: string;
  changePositive?: boolean;
  source?: string;
  accentColor: string;
  children?: React.ReactNode;
  href?: string;
  liveLabel?: string;
}) {
  const handleClick = () => href && (window.location.href = href);

  return (
    <div
      className="metric-card flex flex-col gap-2 min-w-[180px] cursor-pointer group"
      style={{ borderTop: `3px solid ${accentColor}` }}
      onClick={handleClick}
      role={href ? "link" : undefined}
      tabIndex={href ? 0 : undefined}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="metric-label">{label}</span>
        {liveLabel && (
          <span
            className="live-indicator"
            style={{ fontSize: "9px" }}
          >
            <div className="live-dot" style={{ width: "5px", height: "5px" }} />
            {liveLabel}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span
          className="metric-value"
          style={{ color: accentColor, fontSize: "20px" }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              color: "var(--text-muted)",
            }}
          >
            {unit}
          </span>
        )}
        {change && (
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              fontWeight: "600",
              color: changePositive ? "var(--cat-economy)" : "var(--accent-red)",
            }}
          >
            {change}
          </span>
        )}
      </div>

      {/* Chart area */}
      {children && (
        <div style={{ height: "56px", flex: "1 1 auto" }}>{children}</div>
      )}

      {/* Source */}
      {source && (
        <div>
          <span className="source-badge">{source}</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TopAnalytics() {
  const [oilPrice, setOilPrice] = useState<number>(78.45);
  const [oilData, setOilData] = useState<number[]>(crudeOilData);
  const [goldPrice, setGoldPrice] = useState<number>(2145.0);
  const [goldHistory, setGoldHistory] = useState<number[]>(goldData);
  const [precipHistory, setPrecipHistory] = useState(precipData);
  const [currentPrecip, setCurrentPrecip] = useState<number>(5.4);
  const [currentTemp, setCurrentTemp] = useState<number>(21.0);
  const [tempHistory, setTempHistory] = useState<number[]>(tempData);

  // Fetch real economy data (preserved)
  useEffect(() => {
    fetch("/api/economy")
      .then((res) => res.json())
      .then((data) => {
        if (data?.crudeOilPrice) {
          setOilPrice(data.crudeOilPrice);
          setOilData(data.crudeOilHistory);
        }
        if (data?.goldPrice) {
          setGoldPrice(data.goldPrice);
          setGoldHistory(data.goldHistory);
        }
      })
      .catch(console.error);
  }, []);

  // Real-time simulated precip & temp updates (preserved)
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrecip = parseFloat((Math.random() * 9 + 0.5).toFixed(1));
      setCurrentPrecip(newPrecip);
      setPrecipHistory((prev) => {
        const updated = [
          ...prev.slice(1),
          { label: prev[prev.length - 1].label, value: newPrecip },
        ];
        return updated;
      });
      const newTemp = parseFloat((Math.random() * 8 + 16).toFixed(1));
      setCurrentTemp(newTemp);
      setTempHistory((prev) => [...prev.slice(1), newTemp]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full py-3 px-4"
      style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="cat-label">
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-red)", display: "inline-block" }} />
            LIVE INTELLIGENCE METRICS
          </div>
          <span
            style={{ fontFamily: "var(--font-ui)", fontSize: "10px", color: "var(--text-muted)" }}
          >
            UPDATED CONTINUOUSLY
          </span>
        </div>

        {/* Cards row — horizontal scroll on mobile */}
        <div
          className="flex gap-3 overflow-x-auto thin-scroll pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Global Tension */}
          <MetricCard
            label="GLOBAL TENSION"
            value="8.4"
            unit="/ 10"
            change="↑ HIGH"
            changePositive={false}
            accentColor="var(--accent-red)"
            source="STRATEGIC ASSESSMENT"
          />

          {/* Active Conflicts */}
          <MetricCard
            label="ACTIVE CONFLICTS"
            value="23"
            change="+3 this week"
            changePositive={false}
            accentColor="var(--cat-defense)"
            source="CONFLICT MONITOR"
            liveLabel="LIVE"
            href="/defense-intelligence"
          />

          {/* Gold */}
          <MetricCard
            label="PRECIOUS METALS · GOLD"
            value={`$${goldPrice.toFixed(0)}`}
            unit="/ oz"
            change="+2.4%"
            changePositive={true}
            accentColor="var(--accent-gold)"
            source="COMEX"
            href="/metals-intelligence"
          >
            <LineChart data={goldHistory} color="#B8860B" />
          </MetricCard>

          {/* Crude Oil */}
          <MetricCard
            label="CRUDE OIL · WTI"
            value={`$${oilPrice.toFixed(2)}`}
            unit="/ bbl"
            change="+1.2%"
            changePositive={true}
            accentColor="var(--cat-science)"
            source="EIA"
            href="/economic-intelligence"
          >
            <LineChart data={oilData} color="#B8600B" />
          </MetricCard>

          {/* Live Precipitation */}
          <MetricCard
            label="LIVE PRECIPITATION"
            value={`${currentPrecip}`}
            unit="mm/h"
            accentColor="var(--accent-blue)"
            source="OPENWEATHERMAP"
            liveLabel="LIVE"
          >
            <BarChart
              data={precipHistory}
              color={(v) =>
                v > 6 ? "var(--accent-red)" : v > 3 ? "var(--accent-gold)" : "var(--accent-blue)"
              }
            />
          </MetricCard>

          {/* Live Temp */}
          <MetricCard
            label="SEA / LAND TEMPERATURE"
            value={`${currentTemp}°`}
            unit="C"
            accentColor="var(--cat-climate)"
            source="NOAA / OPENWEATHER"
            liveLabel="LIVE"
          >
            <LineChart data={tempHistory} color="#1A6B5A" />
          </MetricCard>

          {/* Monitored Zones */}
          <MetricCard
            label="MONITORED ZONES"
            value="147"
            change="↑ 12 new"
            changePositive={false}
            accentColor="var(--cat-tech)"
            source="SATELLITE INTEL"
            liveLabel="LIVE"
          />
        </div>
      </div>
    </div>
  );
}
