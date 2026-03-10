import { NextResponse } from 'next/server';

const FALLBACK_DEFENSE = [
  {
    id: "def-1",
    date: new Date(Date.now() - 2 * 60000).toISOString(),
    country1: "United States",
    country2: "Ukraine",
    title: "$400M Security Assistance Package Air Defense",
    details: "The package includes additional munitions for NASAMS and HIMARS, 155mm and 105mm artillery rounds, Stinger anti-aircraft missiles, and AT-4 anti-armor systems to bolster frontline defenses against ongoing airstrikes.",
    value: "$400M",
    category: "Munitions & Air Defense",
    tags: ["NATO", "Active Theater", "Critical Transfer"],
    link: "https://www.defense.gov/News/Releases/"
  },
  {
    id: "def-2",
    date: new Date(Date.now() - 45 * 60000).toISOString(),
    country1: "France",
    country2: "India",
    title: "Procurement of 26 Rafale Marine Jets Signed",
    details: "India has finalized the deal to acquire 26 Dassault Rafale Marine fighter jets for the Indian Navy's new indigenous aircraft carrier INS Vikrant. The deal includes advanced weapons packages and performance-based logistics.",
    value: "€5.5B",
    category: "Aviation/Naval",
    tags: ["Strategic Partnership", "Naval Modernization"],
    link: "https://www.reuters.com/business/aerospace-defense/"
  },
  {
    id: "def-3",
    date: new Date(Date.now() - 150 * 60000).toISOString(),
    country1: "Germany",
    country2: "Israel",
    title: "Arrow 3 Hypersonic Missile Defense System Approved",
    details: "The United States has approved Israel's sale of the Arrow 3 hypersonic missile defense system to Germany. The system will provide high-altitude exo-atmospheric interception capabilities for the European Sky Shield Initiative.",
    value: "€3.2B",
    category: "Air Defense",
    tags: ["European Sky Shield", "Hypersonic"],
    link: "https://www.defensenews.com/global/europe/"
  },
  {
    id: "def-4",
    date: new Date(Date.now() - 320 * 60000).toISOString(),
    country1: "United Kingdom",
    country2: "Japan",
    title: "GCAP Next-Gen Fighter Joint Development Phase",
    details: "UK, Italy, and Japan have officially launched the collaborative design phase for the Global Combat Air Programme (GCAP) sixth-generation stealth fighter, advancing sensor fusion technologies.",
    value: "Undisclosed",
    category: "R&D/Aviation",
    tags: ["6th Gen", "Strategic Alliance"],
    link: "https://www.gov.uk/government/organisations/ministry-of-defence"
  },
  {
    id: "def-5",
    date: new Date(Date.now() - 1440 * 60000).toISOString(),
    country1: "South Korea",
    country2: "Poland",
    title: "K2 Black Panther Tanks Delivery Phase 2",
    details: "South Korea's Hanwha Aerospace has begun the second phase of delivery of K2 Black Panther main battle tanks to Poland, accelerating NATO's eastern flank armor modernization amid regional tensions.",
    value: "$2.6B",
    category: "Heavy Armor",
    tags: ["NATO Flank", "Tech Transfer"],
    link: "https://www.defensenews.com/global/asia-pacific/"
  },
  {
    id: "def-6",
    date: new Date(Date.now() - 2100 * 60000).toISOString(),
    country1: "United States",
    country2: "Taiwan",
    title: "F-16V Block 70 Upgrades and Harpoon Missiles",
    details: "New Foreign Military Sale (FMS) approved for F-16 Block 70 upgrade kits and shore-based Harpoon anti-ship missile defense systems aiming to enhance asymmetric warfare capabilities.",
    value: "$1.9B",
    category: "Aviation & Coastal Defense",
    tags: ["Asymmetric", "FMS"],
    link: "https://www.dsca.mil/press-media/major-arms-sales"
  },
  {
    id: "def-7",
    date: new Date(Date.now() - 2800 * 60000).toISOString(),
    country1: "Sweden",
    country2: "Brazil",
    title: "Gripen E/F Tech Transfer Milestone Reached",
    details: "Saab has successfully completed the latest technology transfer milestone corresponding to local manufacturing of Gripen E/F fighter aerostructures at the Embraer facility in Brazil.",
    value: "$210M",
    category: "Aviation",
    tags: ["Tech Transfer", "Domestic Production"],
    link: "https://www.saab.com/newsroom"
  },
  {
    id: "def-8",
    date: new Date(Date.now() - 3600 * 60000).toISOString(),
    country1: "Turkey",
    country2: "Saudi Arabia",
    title: "Akinci UCAV Historic Export Agreement",
    details: "Baykar Technologies signed the largest defense export contract in Turkish history to supply the Saudi Arabian Armed Forces with Akinci high-altitude long-endurance combat drones.",
    value: "$3.1B",
    category: "UAV Systems",
    tags: ["Historic Deal", "Drones"],
    link: "https://www.reuters.com/business/aerospace-defense/"
  },
  {
    id: "def-9",
    date: new Date(Date.now() - 4100 * 60000).toISOString(),
    country1: "United States",
    country2: "Australia",
    title: "AUKUS Virginia-Class Submarine Sustainment",
    details: "Under the AUKUS pact, Australia will invest heavily in US submarine industrial bases to guarantee the future delivery and sustainment of nuclear-powered Virginia-class attack submarines.",
    value: "$3.0B",
    category: "Naval/Nuclear",
    tags: ["AUKUS", "Submarines"],
    link: "https://www.defense.gov/News/Releases/"
  },
  {
    id: "def-10",
    date: new Date(Date.now() - 4300 * 60000).toISOString(),
    country1: "Israel",
    country2: "Finland",
    title: "David's Sling Air Defense System Acquisition",
    details: "Following its NATO accession, Finland has signed an agreement to procure the David's Sling air defense system from Rafael Advanced Defense Systems to establish a high-altitude interceptor shield.",
    value: "€316M",
    category: "Air Defense",
    tags: ["NATO Flank", "Interceptors"],
    link: "https://www.defensenews.com/global/europe/"
  }
];

export async function GET() {
  // In a real scenario, this would fetch from a specialized defense intelligence API
  // or scrape defense portals. For now, we return our high-fidelity mock data.
  return NextResponse.json(FALLBACK_DEFENSE);
}
