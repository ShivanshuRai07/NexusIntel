"use client";
import React from "react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  subtitle?: string;
  color?: string;
  category?: string;
}

export default function SectionHeader({
  title,
  href,
  icon,
  subtitle,
  color = "var(--accent-red)",
  category,
}: SectionHeaderProps) {
  return (
    <div className="mb-4">
      {/* Top rule */}
      <hr className="section-divider mb-2" />

      <div className="flex items-start justify-between gap-4">
        {/* Left — category label + title */}
        <div>
          <div className="cat-label mb-1" style={{ color }}>
            {/* Live dot */}
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {icon && <span>{icon}</span>}
            {(category || title).toUpperCase()}
          </div>
          <h3 className="font-playfair text-base font-black text-[#1C1917] leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "11px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Right — View All link */}
        <Link
          href={href}
          className="analysis-cta shrink-0 text-[10px] tracking-wider transition-all"
        >
          <span>VIEW FULL ANALYSIS</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Bottom thin divider */}
      <hr className="section-divider-light mt-2" />
    </div>
  );
}
