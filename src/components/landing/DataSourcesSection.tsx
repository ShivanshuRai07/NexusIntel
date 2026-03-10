"use client";

import { motion } from "framer-motion";

export default function DataSourcesSection() {
  const sources = [
    "NASA", "NOAA", "World Bank", "NewsAPI", 
    "GDELT", "OpenWeather", "TradingEconomics", "FAOSTAT"
  ];

  return (
    <section className="py-20 px-6 bg-[#0B0F19] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <motion.p 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-gray-400 text-center max-w-2xl mb-12 text-lg"
        >
          NexusIntel integrates global data streams from trusted scientific, economic, and geopolitical data providers.
        </motion.p>
        
        {/* Infinite CSS Marquee */}
        <div className="relative w-full flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-[#0B0F19] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-[#0B0F19] after:to-transparent">
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
            className="flex flex-nowrap gap-12 items-center"
            style={{ width: "max-content" }}
          >
            {[...sources, ...sources].map((source, index) => (
              <div 
                key={`${source}-${index}`} 
                className="flex items-center justify-center min-w-[150px] opacity-50 hover:opacity-100 transition-opacity"
              >
                <div className="text-xl font-orbitron font-bold text-gray-400 tracking-wider">
                  {source}
                </div>
              </div>
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
