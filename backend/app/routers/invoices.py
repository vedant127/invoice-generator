from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from typing import List
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..models.invoice import Invoice, InvoiceStatus
from ..models.item import InvoiceItem
from ..schemas.invoice import InvoiceCreate, InvoiceOut, InvoiceUpdate
from ..services.invoice_service import generate_invoice_number, calculate_invoice_totals

router = APIRouter()

@router.post("/", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice_in: InvoiceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Calculate totals
    items_data = [item.model_dump() for item in invoice_in.items]
    totals = calculate_invoice_totals(invoice_in.model_dump(), items_data)
    
    # 2. Generate invoice number
    invoice_number = await generate_invoice_number(db, current_user.id)
    
    # 3. Create invoice
    new_invoice = Invoice(
        **invoice_in.model_dump(exclude={"items"}),
        invoice_number=invoice_number,
        user_id=current_user.id,
        **totals
    )
    db.add(new_invoice)
    await db.flush() # Get invoice ID
    
    # 4. Create items
    for item_data in items_data:
        amount = item_data['quantity'] * item_data['unit_price']
        new_item = InvoiceItem(
            **item_data,
            invoice_id=new_invoice.id,
            amount=amount
        )
        db.add(new_item)
    
    await db.commit()
    
    # Reload with items and client and payments
    result = await db.execute(
        select(Invoice).options(
            selectinload(Invoice.items),
            selectinload(Invoice.client),
            selectinload(Invoice.payments)
        ).where(Invoice.id == new_invoice.id)
    )
    return result.scalar_one()

@router.get("/", response_model=List[InvoiceOut])
async def list_invoices(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Invoice).options(
            selectinload(Invoice.items),
            selectinload(Invoice.client),
            selectinload(Invoice.payments)
        ).where(Invoice.user_id == current_user.id)
    )
    return result.scalars().all()

@router.get("/{invoice_id}", response_model=InvoiceOut)
async def get_invoice(
    invoice_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Invoice).options(
            selectinload(Invoice.items),
            selectinload(Invoice.client),
            selectinload(Invoice.payments)
        ).where(
            and_(Invoice.id == invoice_id, Invoice.user_id == current_user.id)
        )
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.patch("/{invoice_id}/status", response_model=InvoiceOut)
async def update_invoice_status(
    invoice_id: str,
    status_in: InvoiceStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Invoice).where(and_(Invoice.id == invoice_id, Invoice.user_id == current_user.id))
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice.status = status_in
    await db.commit()
    
    # Reload with items and client
    result = await db.execute(
        select(Invoice).options(
            selectinload(Invoice.items),
            selectinload(Invoice.client),
            selectinload(Invoice.payments)
        ).where(Invoice.id == invoice_id)
    )
    return result.scalar_one()
