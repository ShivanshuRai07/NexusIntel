"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // Subtle occasional emphasis effect — editorial, not cyberpunk
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 100);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        background: "var(--panel)",
        borderBottom: "3px solid var(--border-dark)",
      }}
    >
      <div
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6"
      >
        {/* ── Logo / Masthead ── */}
        <Link
          href="/"
          className="flex items-center gap-4"
          aria-label="NexusIntel — Home"
          style={{ textDecoration: "none" }}
        >
          {/* Editorial N mark */}
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: "44px",
              height: "44px",
              background: "var(--border-dark)",
              borderRadius: "2px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-editorial)",
                fontSize: "24px",
                fontWeight: "900",
                color: "var(--text-on-dark)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              N
            </span>
          </div>

          {/* Wordmark + subtitle */}
          <div>
            <h1
              className={`text-masthead tracking-widest leading-none transition-opacity duration-75 ${
                glitching ? "opacity-80" : "opacity-100"
              }`}
              style={{
                fontFamily: "var(--font-editorial)",
                fontSize: "clamp(20px, 2.5vw, 30px)",
                fontWeight: "900",
                letterSpacing: "6px",
                color: "var(--text)",
              }}
            >
              NEXUSINTEL
            </h1>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "9px",
                fontWeight: "600",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginTop: "3px",
                lineHeight: 1,
              }}
            >
              Global Intelligence Platform
            </p>
          </div>
        </Link>

        {/* ── Center — edition info ── */}
        <div
          className="hidden md:flex flex-col items-center gap-1 text-center"
          style={{ flex: "1 1 auto" }}
        >
          <div
            style={{
              width: "1px",
              height: "32px",
              background: "var(--border-strong)",
              display: "none",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "9px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            REAL-TIME · AI-POWERED · MULTI-SOURCE INTELLIGENCE
          </div>
          <div
            style={{
              height: "1px",
              width: "240px",
              background: "linear-gradient(90deg, transparent, var(--border-strong), transparent)",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "9px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            GEOPOLITICS · DEFENSE · ECONOMICS · TECHNOLOGY · CLIMATE · CYBER
          </div>
        </div>

        {/* ── Right — edition label ── */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div
            className="flex items-center gap-2 px-3 py-1"
            style={{
              background: "var(--accent-red)",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "white",
                animation: "live-pulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "2px",
                color: "white",
              }}
            >
              LIVE INTELLIGENCE
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "9px",
              color: "var(--text-muted)",
              letterSpacing: "1px",
            }}
          >
            CONTINUOUSLY UPDATED
          </span>
        </div>
      </div>

      {/* ── Thick bottom decorative rule ── */}
      <div
        style={{
          height: "2px",
          background:
            "linear-gradient(90deg, var(--accent-red) 0%, var(--border-dark) 30%, var(--border-dark) 100%)",
        }}
      />
    </header>
  );
}
