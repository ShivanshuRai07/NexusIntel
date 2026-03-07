import { NextResponse } from 'next/server';

// Simulating live ships in high-interest intel zones with a predictable route
const BASE_SHIPS = [
  // Taiwan Strait & South China Sea
  { id: "vessel-1", name: "PLAN Liaoning", type: "Military", heading: 45, speed: "12 kts", startLat: 23.5, startLng: 120.9 },
  { id: "vessel-2", name: "USS Carl Vinson", type: "Military", heading: 220, speed: "15 kts", startLat: 22.8, startLng: 121.5 },
  { id: "vessel-3", name: "Ever Given II", type: "Cargo", heading: 10, speed: "18 kts", startLat: 24.0, startLng: 120.0 },
  { id: "vessel-11", name: "PLAN Type 055", type: "Military", heading: 190, speed: "22 kts", startLat: 20.5, startLng: 115.0 },
  { id: "vessel-12", name: "Philippine Coast Guard", type: "Military", heading: 320, speed: "14 kts", startLat: 15.2, startLng: 119.3 },
  
  // Red Sea / Bab-el-Mandeb
  { id: "vessel-4", name: "MSC Aries", type: "Cargo", heading: 320, speed: "14 kts", startLat: 13.5, startLng: 42.5 },
  { id: "vessel-5", name: "USS Eisenhower", type: "Military", heading: 90, speed: "10 kts", startLat: 14.2, startLng: 43.1 },
  { id: "vessel-6", name: "Maersk Ohio", type: "Cargo", heading: 150, speed: "20 kts", startLat: 15.0, startLng: 41.5 },
  { id: "vessel-13", name: "JS Akizuki", type: "Military", heading: 10, speed: "18 kts", startLat: 12.5, startLng: 44.0 },
  { id: "vessel-14", name: "COSCO Shipping", type: "Cargo", heading: 340, speed: "16 kts", startLat: 11.8, startLng: 45.2 },
  
  // Strait of Hormuz
  { id: "vessel-15", name: "IRINS Sahand", type: "Military", heading: 280, speed: "12 kts", startLat: 26.8, startLng: 56.5 },
  { id: "vessel-16", name: "Chevron Voyager", type: "Tanker", heading: 120, speed: "15 kts", startLat: 26.2, startLng: 55.8 },
  { id: "vessel-17", name: "British Explorer", type: "Tanker", heading: 310, speed: "14 kts", startLat: 25.5, startLng: 57.2 },
  
  // Black Sea
  { id: "vessel-7", name: "RFS Admiral Grigorovich", type: "Military", heading: 180, speed: "12 kts", startLat: 44.5, startLng: 33.5 },
  { id: "vessel-8", name: "Bulk Ocean", type: "Cargo", heading: 270, speed: "11 kts", startLat: 43.8, startLng: 35.0 },
  { id: "vessel-18", name: "Grain Star", type: "Cargo", heading: 45, speed: "9 kts", startLat: 42.5, startLng: 28.5 },
  
  // English Channel
  { id: "vessel-9", name: "HMS Queen Elizabeth", type: "Military", heading: 260, speed: "16 kts", startLat: 50.5, startLng: 0.5 },
  { id: "vessel-10", name: "OOCL Hong Kong", type: "Cargo", heading: 80, speed: "21 kts", startLat: 50.1, startLng: -2.0 },
  { id: "vessel-19", name: "Pride of Kent", type: "Passenger", heading: 330, speed: "25 kts", startLat: 51.1, startLng: 1.3 },
  
  // Panama Canal
  { id: "vessel-20", name: "CMA CGM Marco Polo", type: "Cargo", heading: 315, speed: "12 kts", startLat: 9.3, startLng: -79.9 },
  { id: "vessel-21", name: "Panama Transit", type: "Tug", heading: 135, speed: "8 kts", startLat: 8.9, startLng: -79.5 },
  
  // Mediterranean Chokepoints
  { id: "vessel-22", name: "FS Charles de Gaulle", type: "Military", heading: 270, speed: "18 kts", startLat: 35.0, startLng: 15.0 },
  { id: "vessel-23", name: "Algerian Coast Guard", type: "Military", heading: 90, speed: "20 kts", startLat: 37.5, startLng: 4.0 },
  
  // Arctic Routes
  { id: "vessel-24", name: "Arktika Icebreaker", type: "Icebreaker", heading: 45, speed: "10 kts", startLat: 72.0, startLng: 60.0 },
  { id: "vessel-25", name: "Yamal Spirit", type: "Tanker", heading: 225, speed: "12 kts", startLat: 75.0, startLng: 80.0 },
];

// Helper to move ships based on current time (so they loop slowly)
function getShipPositions() {
  const epoch = Math.floor(Date.now() / 1000);
  const cycle = 3600; // 1-hour cycle
  const progress = (epoch % cycle) / cycle; // 0.0 to 1.0

  return BASE_SHIPS.map(ship => {
    // Generate an offset based on heading and progress
    const distanceLat = Math.cos(ship.heading * (Math.PI / 180)) * progress * 2; // ~2 degrees max movement
    const distanceLng = Math.sin(ship.heading * (Math.PI / 180)) * progress * 2;
    
    // Add micro jitter to make it look extremely live (update every second)
    const jitter = Math.sin(epoch) * 0.005;

    return {
      ...ship,
      lat: ship.startLat + distanceLat + jitter,
      lng: ship.startLng + distanceLng + jitter,
      timestamp: new Date().toISOString()
    };
  });
}

export async function GET() {
  // Return the live mathematical position of the ships
  return NextResponse.json(getShipPositions());
}
