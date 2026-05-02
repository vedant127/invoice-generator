from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter()

@router.get("/summary")
async def revenue_summary(db: AsyncSession = Depends(get_db)):
    return {"message": "Revenue summary endpoint"}
