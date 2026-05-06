import asyncio
from sqlalchemy import text
from app.database import engine

async def update_db():
    async with engine.begin() as conn:
        print("Adding Stripe columns to PostgreSQL...")
        try:
            await conn.execute(text("ALTER TABLE invoices ADD COLUMN payment_link_url TEXT;"))
            print("payment_link_url added.")
        except Exception as e:
            print("Notice:", e)
            
        try:
            await conn.execute(text("ALTER TABLE invoices ADD COLUMN stripe_payment_link_id VARCHAR(255);"))
            print("stripe_payment_link_id added.")
        except Exception as e:
            print("Notice:", e)
            
    print("Database updated successfully!")

if __name__ == "__main__":
    asyncio.run(update_db())
