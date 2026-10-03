"use client";
import React from "react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
  subtitle?: string;
  color?: string;
}

export default function SectionHeader({ title, href, icon, subtitle, color = "#38BDF8" }: SectionHeaderProps) {
  return (
    <div className="flex flex-col mb-3 pt-6 first:pt-2 group cursor-pointer">
      <Link href={href}>
        <div className="flex items-center justify-between group-hover:opacity-90 transition-opacity">
          <div className="flex items-center gap-2.5">
            {icon && <div style={{ color }}>{icon}</div>}
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-100 group-hover:text-sky-300 transition-colors">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10.5px] text-slate-400 mt-0.5 font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-200 transition-colors">
            <span className="text-[10px] font-medium tracking-wide uppercase">
              Deep Dive Analysis
            </span>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </Link>
      <div className="h-[1px] w-full mt-2.5 bg-slate-800" />
    </div>
  );
}
