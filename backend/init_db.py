import asyncio
from app.database import engine, Base
from app.models.user import User
from app.models.client import Client
from app.models.invoice import Invoice
from app.models.item import InvoiceItem
from app.models.payment import Payment

async def init_db():
    async with engine.begin() as conn:
        # Import all models to ensure they are registered with Base.metadata
        print("Creating tables in PostgreSQL...")
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())
