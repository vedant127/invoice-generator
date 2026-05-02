from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from . import models
from .routers import auth, users, clients, invoices, payments, reports

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-grade Invoice Generator API",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(clients.router, prefix="/api/v1/clients", tags=["Clients"])
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["Invoices"])
app.include_router(payments.router, prefix="/api/v1", tags=["Payments"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Invoice Generator API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
