import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusIntel | Global Intelligence Platform",
  description:
    "NexusIntel — Premium real-time global intelligence platform. Geopolitics, defense, economics, technology, climate, and cyber intelligence for analysts and decision-makers.",
  keywords:
    "intelligence, geopolitics, defense, economics, technology, climate, cyber, real-time, analysis",
  openGraph: {
    title: "NexusIntel | Global Intelligence Platform",
    description:
      "Premium real-time global intelligence — geopolitics, defense, economics, technology, climate.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Editorial font stack:
            Playfair Display — headlines, masthead, hero
            Inter — UI, nav, labels, meta
            Orbitron — numeric intelligence data ONLY */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-inter bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
