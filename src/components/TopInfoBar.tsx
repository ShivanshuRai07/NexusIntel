"use client";
import { useEffect, useState } from "react";

export default function TopInfoBar() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tensionIndex] = useState(8.4);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const tensionLevel =
    tensionIndex >= 8 ? "CRITICAL" : tensionIndex >= 6 ? "ELEVATED" : "STABLE";
  const tensionColor =
    tensionIndex >= 8 ? "var(--accent-red)" : tensionIndex >= 6 ? "var(--accent-gold)" : "var(--cat-economy)";

  return (
    <div
      className="w-full border-b"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-strong)",
      }}
    >
      <div
        className="max-w-[1440px] mx-auto px-4 py-1.5 flex items-center justify-between gap-4"
        style={{ fontSize: "11px", fontFamily: "var(--font-ui)" }}
      >
        {/* Left — date */}
        <span style={{ color: "var(--text-secondary)" }}>{date} · GMT+5:30</span>

        {/* Center — threat level */}
        <div className="flex items-center gap-4 hide-mobile">
          <div className="flex items-center gap-2">
            <span
              className="font-bold tracking-widest"
              style={{ color: "var(--text-muted)", fontSize: "9px", letterSpacing: "2px" }}
            >
              GLOBAL THREAT LEVEL
            </span>
            <span
              className="font-bold tracking-wide"
              style={{ color: tensionColor, fontSize: "11px", fontFamily: "var(--font-data)" }}
            >
              {tensionIndex} / 10
            </span>
            <span
              className="font-bold"
              style={{
                color: tensionColor,
                fontSize: "9px",
                letterSpacing: "1.5px",
                background: `${tensionColor}18`,
                border: `1px solid ${tensionColor}30`,
                padding: "1px 6px",
                borderRadius: "2px",
              }}
            >
              {tensionLevel}
            </span>
          </div>
          <span style={{ color: "var(--border-strong)" }}>|</span>
          <div className="flex items-center gap-3">
            {[
              { label: "CONFLICTS", value: "23", color: "var(--accent-red)" },
              { label: "ZONES", value: "147", color: "var(--accent-blue)" },
              { label: "ALERTS", value: "58", color: "var(--accent-gold)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="font-bold"
                  style={{ color: item.color, fontFamily: "var(--font-data)", fontSize: "11px" }}
                >
                  {item.value}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "9px", letterSpacing: "1px" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — live + time */}
        <div className="flex items-center gap-3">
          <div className="live-indicator">
            <div className="live-dot" />
            LIVE
          </div>
          <span
            className="font-bold tracking-wider"
            style={{ color: "var(--text)", fontFamily: "var(--font-data)", fontSize: "12px" }}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}
