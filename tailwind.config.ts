import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Background system
        bg:            "#F5F0E8",
        "bg-warm":     "#FAF7F0",
        "bg-secondary":"#EDE8DC",
        "bg-dark":     "#2C2416",
        "bg-darker":   "#1A1208",

        // ─── Panels & Borders
        panel:         "#FFFFFF",
        "panel-warm":  "#FDFAF5",
        border: {
          DEFAULT:     "#E2D9C8",
          strong:      "#C8BAA0",
          dark:        "#1A1208",
        },

        // ─── Text
        text: {
          DEFAULT:     "#1A1208",
          secondary:   "#5A4E3A",
          muted:       "#9A8E7A",
          "on-dark":   "#F5F0E8",
        },

        // ─── Accent
        "accent-red": {
          DEFAULT:     "#C41E3A",
          light:       "#FBEAEA",
        },
        "accent-gold": {
          DEFAULT:     "#B8860B",
          light:       "#FDF6DC",
        },
        "accent-blue": {
          DEFAULT:     "#1D4E89",
          light:       "#EEF3FA",
        },

        // ─── Category colors
        "cat-defense":    "#C41E3A",
        "cat-economy":    "#2E5A1C",
        "cat-tech":       "#1D4E89",
        "cat-climate":    "#1A6B5A",
        "cat-cyber":      "#5B2D8E",
        "cat-science":    "#B8600B",
        "cat-agri":       "#3D6B21",
        "cat-global":     "#C41E3A",
        "cat-domestic":   "#8B4513",
        "cat-investment": "#B8860B",

        // ─── Legacy neon colors (kept for chart compatibility)
        "neon-blue":      "#00D4FF",
        "neon-red":       "#FF2244",
        "neon-green":     "#00FF88",
        "neon-purple":    "#8B5CF6",
        "neon-orange":    "#FF8C00",
        "neon-cyan":      "#00FFCC",

        // ─── Legacy panel names (kept for backward compat)
        background:    "#F5F0E8",
        "panel-border":"#E2D9C8",
        "text-primary":"#1A1208",
        "text-secondary":"#5A4E3A",
        "text-muted":  "#9A8E7A",
      },

      fontFamily: {
        playfair: ["Playfair Display", "Georgia", "serif"],
        inter:    ["Inter", "system-ui", "sans-serif"],
        orbitron: ["Orbitron", "monospace"],
        // backward compat
        editorial:["Playfair Display", "Georgia", "serif"],
        ui:       ["Inter", "system-ui", "sans-serif"],
        data:     ["Orbitron", "monospace"],
      },

      fontSize: {
        "2xs": ["9px", { lineHeight: "1.3" }],
        "3xs": ["8px", { lineHeight: "1.3" }],
      },

      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
      },

      boxShadow: {
        card:    "0 1px 4px rgba(100,80,50,0.10), 0 2px 12px rgba(100,80,50,0.06)",
        hover:   "0 4px 20px rgba(100,80,50,0.16), 0 1px 4px rgba(100,80,50,0.10)",
        modal:   "0 8px 40px rgba(26,18,8,0.28)",
        header:  "0 2px 8px rgba(100,80,50,0.08)",
        // legacy
        "neon-blue":  "0 0 10px rgba(0,212,255,0.3)",
        "neon-red":   "0 0 10px rgba(255,34,68,0.3)",
        "neon-green": "0 0 10px rgba(0,255,136,0.3)",
        panel:        "0 1px 4px rgba(100,80,50,0.10), 0 2px 12px rgba(100,80,50,0.06)",
      },

      animation: {
        "fade-up":    "fade-up 0.4s ease-out both",
        "fade-in":    "fade-in 0.3s ease-out both",
        ticker:       "ticker-scroll 55s linear infinite",
        "live-pulse": "live-pulse 2s ease-in-out infinite",
        counter:      "counter-up 0.6s ease-out",
        shimmer:      "shimmer 1.6s infinite linear",
        float:        "float 5s ease-in-out infinite",
        // legacy
        pulse:        "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink:        "live-pulse 2s ease-in-out infinite",
        "glow-pulse": "live-pulse 2s ease-in-out infinite",
        "spin-slow":  "spin 8s linear infinite",
        scroll:       "ticker-scroll 55s linear infinite",
      },

      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "ticker-scroll": {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "live-pulse": {
          "0%, 100%": { opacity: "1",   transform: "scale(1)" },
          "50%":      { opacity: "0.45",transform: "scale(0.8)" },
        },
        "counter-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-600px 0" },
          "100%": { backgroundPosition: "600px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        // legacy
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
        scroll: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
      },

      backdropBlur: { xs: "2px" },

      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
