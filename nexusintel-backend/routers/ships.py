from fastapi import APIRouter
import random
import math
from typing import List, Dict

router = APIRouter()

@router.get("/api/ships")
def get_live_ships() -> List[Dict]:
    """
    Returns simulated high-density global maritime traffic (AIS).
    Replicates the density and color-coding of professional tools like MarineTraffic.
    Green = Cargo, Red = Tanker, Blue = Passenger, Orange = Fishing/Other.
    """
    ships = []
    
    # Define major shipping corridors with (start_lat, start_lng, end_lat, end_lng, width, density)
    # Using straight lines or arcs for simplicity, but generating thousands of points along them.
    corridors = [
        # East Asia to Europe (via Malacca & Suez)
        {"p1": (35.0, 140.0), "p2": (22.0, 114.0), "width": 4.0, "density": 150}, # Japan/Korea to HK
        {"p1": (22.0, 114.0), "p2": (1.2, 103.8), "width": 3.0, "density": 200}, # HK to Singapore
        {"p1": (1.2, 103.8), "p2": (6.0, 80.0), "width": 3.0, "density": 175}, # Singapore to Sri Lanka
        {"p1": (6.0, 80.0), "p2": (12.0, 43.0), "width": 4.0, "density": 200}, # Sri Lanka to Gulf of Aden
        {"p1": (12.0, 43.0), "p2": (27.0, 34.0), "width": 1.5, "density": 125}, # Red Sea
        {"p1": (31.0, 32.0), "p2": (36.0, 14.0), "width": 2.0, "density": 150}, # Med (Suez to Malta)
        {"p1": (36.0, 14.0), "p2": (36.0, -5.0), "width": 2.0, "density": 150}, # Med to Gibraltar
        {"p1": (36.0, -5.0), "p2": (49.0, -4.0), "width": 5.0, "density": 225}, # Gibraltar to English Channel
        
        # Trans-Pacific (Asia to US West Coast)
        {"p1": (35.0, 140.0), "p2": (45.0, -170.0), "width": 10.0, "density": 100}, # Japan to Mid Pacific
        {"p1": (45.0, -170.0), "p2": (33.0, -120.0), "width": 12.0, "density": 125}, # Mid Pacific to LA
        {"p1": (22.0, 114.0), "p2": (10.0, -140.0), "width": 15.0, "density": 50}, # Southern route
        {"p1": (10.0, -140.0), "p2": (-10.0, -77.0), "width": 10.0, "density": 75}, # To South America (Callao)
        
        # Trans-Atlantic (Europe to US East Coast)
        {"p1": (49.0, -4.0), "p2": (40.0, -70.0), "width": 8.0, "density": 200}, # UK to NY
        {"p1": (36.0, -5.0), "p2": (25.0, -75.0), "width": 10.0, "density": 125}, # Gibraltar to Bahamas
        
        # Americas (Panama routes)
        {"p1": (40.0, -70.0), "p2": (25.0, -75.0), "width": 5.0, "density": 175}, # US East Coast down
        {"p1": (25.0, -75.0), "p2": (9.0, -79.0), "width": 3.0, "density": 150}, # To Panama (East)
        {"p1": (9.0, -80.0), "p2": (33.0, -120.0), "width": 4.0, "density": 150}, # Panama context to LA
        {"p1": (9.0, -80.0), "p2": (-33.0, -72.0), "width": 5.0, "density": 75}, # Panama to Valparaiso
        
        # Africa/Cape Route
        {"p1": (20.0, 60.0), "p2": (-35.0, 20.0), "width": 10.0, "density": 75}, # Arabian Sea to Cape (East)
        {"p1": (-35.0, 20.0), "p2": (5.0, -15.0), "width": 8.0, "density": 90}, # Cape to West Africa
        {"p1": (5.0, -15.0), "p2": (36.0, -5.0), "width": 6.0, "density": 100}, # West Africa to Gibraltar
        
        # Dense regional clusters (Coastal waters)
        {"p1": (53.0, 2.0), "p2": (58.0, 8.0), "width": 8.0, "density": 150}, # North Sea
        {"p1": (25.0, 52.0), "p2": (25.0, 56.0), "width": 1.5, "density": 125}, # Persian Gulf
        {"p1": (28.0, -90.0), "p2": (28.0, -82.0), "width": 7.0, "density": 125}, # Gulf of Mexico
    ]

    # Type probabilities distribution based on global fleet composition
    type_probs = [
        ("Cargo", 0.55),      # Bulk, Container, General
        ("Tanker", 0.25),     # Oil, Chemical, Gas
        ("Passenger", 0.05), # Cruise, Ferries
        ("Fishing", 0.10),   # Fishing vessels
        ("Other", 0.05)      # Tugs, Special craft, Military
    ]

    def get_random_type():
        r = random.random()
        cumulative = 0
        for t, prob in type_probs:
            cumulative += prob
            if r <= cumulative:
                return t
        return "Cargo"

    def get_color(ship_type: str) -> str:
        colors = {
            "Cargo": "#00FF88",     # Green
            "Tanker": "#FF2244",    # Red
            "Passenger": "#00D4FF", # Blue
            "Fishing": "#FF8C00",   # Orange
            "Other": "#94A3B8"      # Gray
        }
        return colors.get(ship_type, "#94A3B8")

    ship_id = 1
    for corridor in corridors:
        p1 = corridor["p1"]
        p2 = corridor["p2"]
        if isinstance(p1, tuple) and isinstance(p2, tuple):
            p1_lat, p1_lng = p1
            p2_lat, p2_lng = p2
        else:
            continue
            
        width = float(corridor["width"])
        
        # Calculate base heading for this corridor
        dlng = p2_lng - p1_lng
        dlat = p2_lat - p1_lat
        base_heading = (math.degrees(math.atan2(dlng, dlat)) + 360) % 360

        for _ in range(int(corridor["density"])):
            # Random position along the line
            t = random.random()
            
            # Add lateral scatter (perpendicular to the route roughly)
            scatter_x = float(random.uniform(-width, width))
            scatter_y = float(random.uniform(-width, width))
            
            lat = float(p1_lat + t * (p2_lat - p1_lat) + scatter_y)
            lng = float(p1_lng + t * (p2_lng - p1_lng) + scatter_x)
            
            # Some ships go the opposite direction
            is_reverse = random.random() > 0.5
            heading = float((base_heading + 180) % 360 if is_reverse else base_heading)
            # Add minor heading variation
            heading = float((heading + random.uniform(-15.0, 15.0)) % 360)

            ship_type = get_random_type()
            
            ships.append({
                "id": f"ship-{ship_id}",
                "name": f"Vessel-{ship_id:05d}",
                "type": ship_type,
                "color": get_color(ship_type),
                "lat": float(round(lat, 4)),
                "lng": float(round(lng, 4)),
                "speed": int(random.randint(5, 22)),
                "heading": float(round(heading, 1))
            })
            ship_id += 1
            
    # Add random ocean scatter (Fishing/Pleasure craft) everywhere
    for _ in range(800):
        lat = float(random.uniform(-60.0, 60.0))
        lng = float(random.uniform(-180.0, 180.0))
        ship_type = random.choice(["Fishing", "Other"])
        ships.append({
            "id": f"ship-scat-{ship_id}",
            "name": f"OcnVes-{ship_id}",
            "type": ship_type,
            "color": get_color(ship_type),
            "lat": float(round(lat, 4)),
            "lng": float(round(lng, 4)),
            "speed": int(random.randint(2, 12)),
            "heading": float(round(float(random.uniform(0.0, 360.0)), 1))
        })
        ship_id += 1

    return ships
