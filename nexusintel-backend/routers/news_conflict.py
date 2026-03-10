from fastapi import APIRouter
from typing import List, Dict
import random
import os
import httpx
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/api/news")
async def get_live_news() -> List[Dict]:
    """
    Fetches real live news using NewsAPI if a key is provided in the environment.
    Falls back to structured realistic mock data if the API key is missing or the limit is reached.
    """
    api_key = os.getenv("NEWS_API_KEY", "")
    news_data = []

    if api_key:
        try:
            # Fetch real news related to global events, defense, economy
            url = f"https://newsapi.org/v2/top-headlines?category=general&language=en&apiKey={api_key}"
            async with httpx.AsyncClient() as client:
                response = await client.get(url, timeout=5.0)
                if response.status_code == 200:
                    articles = response.json().get("articles", [])
                    for i, article in enumerate(articles[:10]):
                        title_lower = article.get("title", "").lower()
                        color = "light-blue"
                        if any(w in title_lower for w in ["war", "attack", "dead", "crisis", "missile", "strike"]):
                            color = "red"
                        elif any(w in title_lower for w in ["protest", "riot", "warning", "police"]):
                            color = "orange"
                        elif any(w in title_lower for w in ["pact", "peace", "agreement", "growth"]):
                            color = "green"
                        elif any(w in title_lower for w in ["flood", "hurricane", "earthquake", "risk"]):
                            color = "yellow-orange"

                        news_data.append({
                            "id": f"live-news-{i}",
                            "title": article.get("title", "Unknown Request"),
                            "source": article.get("source", {}).get("name", "NewsAPI"),
                            "description": article.get("description", "No description available.") or "No description available.",
                            "country": "Global",
                            "lat": round(random.uniform(-50, 60), 4),
                            "lng": round(random.uniform(-120, 120), 4),
                            "colorNode": color,
                            "publishedAt": article.get("publishedAt", datetime.utcnow().isoformat() + "Z"),
                            "url": article.get("url", "#")
                        })
                    return news_data
        except Exception as e:
            print(f"Error fetching NewsAPI: {e}")

    # Fallback to REAL international RSS news (BBC World) since user requested live APIs
    try:
        import xml.etree.ElementTree as ET
        rss_url = "http://feeds.bbci.co.uk/news/world/rss.xml"
        async with httpx.AsyncClient() as client:
            response = await client.get(rss_url, timeout=5.0)
            if response.status_code == 200:
                root = ET.fromstring(response.content)
                items = root.findall(".//item")
                for i, item in enumerate(items[:10]): # Get top 10
                    title = item.findtext("title") or "International Intel"
                    desc = item.findtext("description") or "Details unavailable."
                    link = item.findtext("link") or "#"
                    pub_date = item.findtext("pubDate")

                    color = "light-blue"
                    title_lower = title.lower() + desc.lower()
                    if any(w in title_lower for w in ["war", "dead", "attack", "strike", "military", "fire"]):
                        color = "red"
                    elif any(w in title_lower for w in ["protest", "police", "warning"]):
                        color = "orange"
                    elif any(w in title_lower for w in ["deal", "peace", "growth", "pact"]):
                        color = "green"
                    elif any(w in title_lower for w in ["flood", "storm", "hurricane", "quake"]):
                        color = "yellow-orange"

                    news_data.append({
                        "id": f"rss-{i}",
                        "title": title,
                        "source": "BBC World News",
                        "description": desc,
                        "country": "Global",
                        "lat": round(random.uniform(-50, 60), 4),
                        "lng": round(random.uniform(-120, 120), 4),
                        "colorNode": color,
                        "publishedAt": datetime.utcnow().isoformat() + "Z", # Simplification instead of parsing RSS pubDate strings
                        "url": link
                    })
                return news_data
    except Exception as e:
        print(f"Error fetching RSS: {e}")

    # Absolute fallback if no internet
    now = datetime.utcnow()
    news_data = [
        {
            "id": "mock-fallback",
            "title": "Local Intel Relay Offline",
            "source": "System Monitor",
            "description": "Unable to reach global news APIs or RSS feeds. Re-establishing connection.",
            "country": "Unknown",
            "lat": 0,
            "lng": 0,
            "colorNode": "orange",
            "publishedAt": now.isoformat() + "Z",
            "url": "#"
        }
    ]
    return news_data

@router.get("/api/conflict")
def get_mock_conflict() -> List[Dict]:
    """Returns mock conflict data for the map."""
    return [
        {
            "id": "c1",
            "type": "Armed Clash",
            "description": "Border skirmish reported between military forces.",
            "actor1": "State Forces",
            "fatalities": 3,
            "location": "Border Region Alpha",
            "source": "Local Media",
            "lat": 33.9391,
            "lng": 67.7099
        },
        {
            "id": "c2",
            "type": "Explosion/Remote Violence",
            "description": "Drone strike on suspected militant compound.",
            "actor1": "Military Force",
            "fatalities": 5,
            "location": "Desert Province",
            "source": "Defense Ministry",
            "lat": 15.5527,
            "lng": 48.5164
        }
    ]
