from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import ships, news_conflict, economy

app = FastAPI(title="NexusIntel Global Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ships.router)
app.include_router(news_conflict.router)
app.include_router(economy.router)

@app.get("/")
def read_root():
    return {"message": "NexusIntel Global Intelligence API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
