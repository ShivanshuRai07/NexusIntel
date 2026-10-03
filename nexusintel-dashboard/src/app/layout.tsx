import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusIntel | Global Intelligence & Strategic Monitor",
  description: "Enterprise strategic intelligence platform monitoring geopolitical, economic, defense, energy, and climate data streams in real time.",
};

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans bg-[var(--bg)] text-[var(--text-primary)] selection:bg-sky-500/20 selection:text-sky-200 transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
