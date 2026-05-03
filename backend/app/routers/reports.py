from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models.invoice import Invoice
import io
import csv

router = APIRouter()

@router.get("/summary")
async def revenue_summary(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Invoice))
    invoices = result.scalars().all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Invoice Number", "Client", "Amount", "Status", "Date"])
    
    for inv in invoices:
        writer.writerow([
            inv.id, 
            inv.invoice_number, 
            inv.client_name, 
            inv.total, 
            inv.status, 
            inv.created_at.strftime("%Y-%m-%d")
        ])
    
    content = output.getvalue()
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=revenue_summary.csv"}
    )
