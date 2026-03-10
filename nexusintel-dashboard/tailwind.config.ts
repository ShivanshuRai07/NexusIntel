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
        background: "#0B0F19",
        panel: "#0F1628",
        "panel-border": "#1a2a4a",
        "neon-blue": "#00D4FF",
        "neon-blue-dark": "#0099CC",
        "neon-red": "#FF2244",
        "neon-green": "#00FF88",
        "neon-purple": "#8B5CF6",
        "neon-orange": "#FF8C00",
        "neon-cyan": "#00FFCC",
        "text-primary": "#E2E8F0",
        "text-secondary": "#94A3B8",
        "text-muted": "#475569",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink: "blink 1s step-start infinite",
        scroll: "scroll 30s linear infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        blink: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        scroll: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 5px #00D4FF, 0 0 10px #00D4FF" },
          "50%": { boxShadow: "0 0 20px #00D4FF, 0 0 40px #00D4FF, 0 0 60px #00D4FF" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        "neon-blue": "0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)",
        "neon-red": "0 0 10px rgba(255, 34, 68, 0.5), 0 0 20px rgba(255, 34, 68, 0.3)",
        "neon-green": "0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)",
        "panel": "0 4px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 212, 255, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
