"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#05080f] border-t border-white/5 py-8 px-6 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-gray-400 font-semibold uppercase tracking-wider font-orbitron">
          <span className="text-neon-cyan">NexusIntel</span> — Global Intelligence Platform
        </div>

        <div className="flex items-center gap-6 text-gray-500">
          <Link href="#" className="hover:text-neon-blue transition-colors">About</Link>
          <Link href="#" className="hover:text-neon-blue transition-colors">Data Sources</Link>
          <Link href="#" className="hover:text-neon-blue transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-neon-blue transition-colors">Contact</Link>
        </div>

        <div className="text-gray-600">
          © {new Date().getFullYear()} NexusIntel Intelligence Systems. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}
