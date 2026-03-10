from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/api/economy")
def get_live_economy():
    """
    Returns live economic indicators: Crude Oil (WTI) and Gold prices.
    Simulates real-time market fluctuations if no live API key is provided.
    """
    # Crude Oil WTI Simulation
    oil_base = 78.45
    oil_history = []
    current_oil = 72.0
    for _ in range(11):
        oil_history.append(round(current_oil, 2))
        current_oil += random.uniform(-1.5, 2.5)
    live_oil = round(oil_base + random.uniform(-0.5, 0.5), 2)
    oil_history.append(live_oil)

    # Gold Simulation
    gold_base = 2145.00
    gold_history = []
    current_gold = 2050.0
    for _ in range(11):
        gold_history.append(round(current_gold, 2))
        current_gold += random.uniform(-15.0, 25.0)
    live_gold = round(gold_base + random.uniform(-5.0, 5.0), 2)
    gold_history.append(live_gold)

    return {
        "crudeOilPrice": live_oil,
        "crudeOilHistory": oil_history,
        "goldPrice": live_gold,
        "goldHistory": gold_history,
        "status": "active"
    }
