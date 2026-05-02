from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

router = APIRouter()

@router.post("/invoices/{invoice_id}/payments")
async def record_payment(invoice_id: str, db: AsyncSession = Depends(get_db)):
    return {"message": "Record payment endpoint"}
