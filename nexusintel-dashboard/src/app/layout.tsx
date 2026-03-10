import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusIntel | Global Intelligence Dashboard",
  description: "AI-powered Global Ontology Engine for real-time strategic intelligence across geopolitics, economics, defense, technology, and climate.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-inter">{children}</body>
    </html>
  );
}
