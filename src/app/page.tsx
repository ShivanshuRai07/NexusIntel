"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

// Components
import TopInfoBar from "@/components/TopInfoBar";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import IntelTicker from "@/components/IntelTicker";
import HeroSection from "@/components/HeroSection";
import TopAnalytics from "@/components/TopAnalytics";
import Footer from "@/components/Footer";

// Dynamic components
const LeftSidebar = dynamic(() => import("@/components/LeftSidebar"), { ssr: false });
const MapCenter = dynamic(() => import("@/components/MapCenter"), { ssr: false });
const RightSidebar = dynamic(() => import("@/components/RightSidebar"), { ssr: false });
const BottomAnalytics = dynamic(() => import("@/components/BottomAnalytics"), { ssr: false });

const TechSection = dynamic(() => import("@/components/sections/TechSection"), { ssr: false });
const AgriSection = dynamic(() => import("@/components/sections/AgriSection"), { ssr: false });
const ClimateSection = dynamic(() => import("@/components/sections/ClimateSection"), { ssr: false });
const EconomySection = dynamic(() => import("@/components/sections/EconomySection"), { ssr: false });
const CyberSection = dynamic(() => import("@/components/sections/CyberSection"), { ssr: false });
const ScienceSection = dynamic(() => import("@/components/sections/ScienceSection"), { ssr: false });

export default function Home() {
  const [isMapMaximized, setIsMapMaximized] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1C1917] flex flex-col font-sans selection:bg-[#C41E3A] selection:text-white">
      {/* 1. Thin top metadata & clock ticker */}
      <TopInfoBar />

      {/* 2. Newspaper Masthead */}
      <Header />

      {/* 3. Sticky Category Navigation Bar */}
      <CategoryNav />

      {/* 4. Breaking Wire Red Intel Ticker */}
      <IntelTicker />

      {/* Main page wrapper */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8">
        {/* 5. Editorial Featured Stories Carousel */}
        <HeroSection />

        {/* 6. Key Strategic Indicators Row (Canvas sparklines + Oil, Gold, Conflicts) */}
        <TopAnalytics />

        {/* 7. Content Grid: Main Editorial Column + Right Sidebar */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (8 cols on lg, 9 cols on xl) */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
            {/* Live Wire & Defense Procurement Split Row */}
            <LeftSidebar />

            {/* Geospatial Intel Map Section */}
            <div id="nexusintel-map" className="flex flex-col gap-2 scroll-mt-24">
              <div
                className={`transition-all duration-300 ${
                  isMapMaximized
                    ? "fixed inset-0 z-[1000] p-4 bg-black/85 backdrop-blur-md flex flex-col"
                    : "h-[580px] w-full"
                }`}
              >
                <MapCenter
                  isMaximized={isMapMaximized}
                  onToggleMaximize={() => setIsMapMaximized(!isMapMaximized)}
                />
              </div>
            </div>

            {/* Strategic Risk & Deployment Analytics */}
            <BottomAnalytics />

            {/* Domain Intelligence Desks */}
            <div className="flex flex-col gap-8">
              <TechSection />
              <EconomySection />
              <CyberSection />
              <ClimateSection />
              <AgriSection />
              <ScienceSection />
            </div>
          </div>

          {/* Right Sidebar Column (4 cols on lg, 3 cols on xl) */}
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 sticky top-20">
            <RightSidebar />
          </aside>
        </main>
      </div>

      {/* 8. Editorial Footer */}
      <Footer />
    </div>
  );
}
