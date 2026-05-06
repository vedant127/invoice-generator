from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from ..models.invoice import Invoice, DiscountType
from ..models.item import InvoiceItem
from datetime import datetime

async def generate_invoice_number(db: AsyncSession, user_id: str) -> str:
    # Basic logic: INV-YYYY-COUNT
    year = datetime.now().year
    prefix = f"INV-{year}-"
    
    result = await db.execute(
        select(func.count(Invoice.id)).where(Invoice.user_id == user_id)
    )
    count = result.scalar() or 0
    return f"{prefix}{str(count + 1).zfill(3)}"

def calculate_invoice_totals(invoice_data: dict, items: list) -> dict:
    subtotal = sum(item['quantity'] * item['unit_price'] for item in items)
    
    # Calculate discount
    discount_amount = 0.0
    if invoice_data.get('discount_type') == DiscountType.PERCENTAGE:
        discount_amount = subtotal * (invoice_data.get('discount_value', 0) / 100)
    elif invoice_data.get('discount_type') == DiscountType.FLAT:
        discount_amount = invoice_data.get('discount_value', 0)
    
    discounted_amount = subtotal - discount_amount
    
    # Calculate tax
    tax_amount = discounted_amount * (invoice_data.get('tax_rate', 0) / 100)
    
    total_amount = discounted_amount + tax_amount
    
    return {
        "subtotal": subtotal,
        "discount_amount": discount_amount,
        "tax_amount": tax_amount,
        "total_amount": total_amount
    }

async def recalculate_invoice_payment_status(invoice_id: str, db: AsyncSession):
    from ..models.payment import Payment # avoid circular import if necessary, but actually it's fine here, let's just import it at top or here.
    
    # Sum all payments for this invoice
    total_paid = await db.scalar(
        select(func.sum(Payment.amount_paid))
        .where(Payment.invoice_id == invoice_id)
    )
    total_paid = float(total_paid or 0.0)

    invoice = await db.get(Invoice, invoice_id)
    if not invoice:
        return

    if total_paid == 0:
        # No payment yet — keep current status, unless we should revert from paid
        if invoice.status in ["PAID", "PARTIALLY_PAID"]:
            invoice.status = "SENT"
    elif total_paid < float(invoice.total_amount):
        invoice.status = "PARTIALLY_PAID"
    elif total_paid >= float(invoice.total_amount):
        invoice.status = "PAID"

    await db.commit()
