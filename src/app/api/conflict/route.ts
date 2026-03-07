import { NextResponse } from 'next/server';

// ACLED-style real-time conflict data simulation
const ACLED_EVENTS = [
  {
    id: "acled-1",
    type: "Battle",
    subtype: "Armed clash",
    actor1: "Military Forces of Ukraine",
    actor2: "Military Forces of Russia",
    location: "Bakhmut Front",
    country: "Ukraine",
    lat: 48.59,
    lng: 37.99,
    fatalities: 12,
    timestamp: new Date().toISOString(),
    source: "ACLED Intel Feed",
    description: "Intense tactical skirmish reported near high-ground positions."
  },
  {
    id: "acled-2",
    type: "Explosions/Remote violence",
    subtype: "Drone strike",
    actor1: "Military Forces of Israel",
    actor2: "Hezbollah",
    location: "Tyre District",
    country: "Lebanon",
    lat: 33.27,
    lng: 35.20,
    fatalities: 4,
    timestamp: new Date().toISOString(),
    source: "GTD / ACLED",
    description: "Precision drone strike targeted tactical assets in coastal sector."
  },
  {
    id: "acled-3",
    type: "Strategic developments",
    subtype: "Troop mobilization",
    actor1: "Military Forces of China",
    actor2: "N/A",
    location: "Kinmen Islands Vicinity",
    country: "Taiwan Strait",
    lat: 24.38,
    lng: 118.27,
    fatalities: 0,
    timestamp: new Date().toISOString(),
    source: "ACLED / Satellite Recon",
    description: "Significant increase in naval presence and simulated beach landing drills."
  },
  {
    id: "acled-4",
    type: "Riots",
    subtype: "Violent demonstration",
    actor1: "Protesters (Sudan)",
    actor2: "Military Forces of Sudan",
    location: "Khartoum",
    country: "Sudan",
    lat: 15.50,
    lng: 32.55,
    fatalities: 1,
    timestamp: new Date().toISOString(),
    source: "ACLED",
    description: "Anti-government protests encountered heavy security response."
  }
];

export async function GET() {
  return NextResponse.json(ACLED_EVENTS);
}
