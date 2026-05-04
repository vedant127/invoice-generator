import asyncio
from app.database import engine
from sqlalchemy import text

async def migrate():
    print("Connecting to database to add 'selected_template' column...")
    async with engine.begin() as conn:
        try:
            # Check if column exists first to avoid errors
            check_sql = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='selected_template';
            """)
            result = await conn.execute(check_sql)
            exists = result.fetchone()
            
            if not exists:
                print("Adding column 'selected_template' to 'users' table...")
                await conn.execute(text("ALTER TABLE users ADD COLUMN selected_template VARCHAR(50) DEFAULT 'minimalist' NOT NULL;"))
                print("Migration successful!")
            else:
                print("Column 'selected_template' already exists. No changes needed.")
                
        except Exception as e:
            print(f"Migration failed: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
