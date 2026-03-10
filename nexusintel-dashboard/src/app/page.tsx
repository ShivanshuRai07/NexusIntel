"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";

// Dynamic imports for the landing page sections
const HeroSection = dynamic(() => import("@/components/landing/HeroSection"), { ssr: false });
const DomainsSection = dynamic(() => import("@/components/landing/DomainsSection"), { ssr: false });
const MapPreviewSection = dynamic(() => import("@/components/landing/MapPreviewSection"), { ssr: false });
const FeaturesSection = dynamic(() => import("@/components/landing/FeaturesSection"), { ssr: false });
const DataSourcesSection = dynamic(() => import("@/components/landing/DataSourcesSection"), { ssr: false });
const HowItWorksSection = dynamic(() => import("@/components/landing/HowItWorksSection"), { ssr: false });
const CallToActionSection = dynamic(() => import("@/components/landing/CallToActionSection"), { ssr: false });
const Footer = dynamic(() => import("@/components/landing/Footer"), { ssr: false });

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-inter selection:bg-neon-blue/30 overflow-x-hidden">
      <main className="flex flex-col">
        <HeroSection />
        <DomainsSection />
        <MapPreviewSection />
        <FeaturesSection />
        <DataSourcesSection />
        <HowItWorksSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}
