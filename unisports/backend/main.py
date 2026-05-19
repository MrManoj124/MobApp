from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import events, registrations, users

app = FastAPI(
    title="UniSports API",
    description="University Sports Management System — Faculty, Inter University, Inter Faculty & Slug games.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to your domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(registrations.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {
        "message": "UniSports API is running 🏅",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {"status": "ok"}
