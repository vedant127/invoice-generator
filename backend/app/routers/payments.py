from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import datetime
import stripe
from ..database import get_db
from ..models.payment import Payment
from ..models.invoice import Invoice
from ..schemas.payment import PaymentCreate, PaymentOut
from ..services.invoice_service import recalculate_invoice_payment_status
from ..dependencies import get_current_user
from ..models.user import User
from ..config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

@router.post("/invoices/{invoice_id}/payments", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
async def record_payment(
    invoice_id: str, 
    payment_in: PaymentCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify invoice exists and belongs to user
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id, Invoice.user_id == current_user.id))
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    new_payment = Payment(
        invoice_id=invoice.id,
        amount_paid=payment_in.amount_paid,
        payment_date=payment_in.payment_date or datetime.date.today(),
        payment_method=payment_in.payment_method,
        transaction_ref=payment_in.transaction_ref,
        notes=payment_in.notes
    )
    db.add(new_payment)
    await db.commit()
    await db.refresh(new_payment)

    await recalculate_invoice_payment_status(invoice_id, db)

    return new_payment

@router.get("/invoices/{invoice_id}/payments", response_model=List[PaymentOut])
async def list_payments(
    invoice_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify invoice exists and belongs to user
    result = await db.execute(select(Invoice).where(Invoice.id == invoice_id, Invoice.user_id == current_user.id))
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    result = await db.execute(
        select(Payment).where(Payment.invoice_id == invoice_id).order_by(Payment.payment_date.desc(), Payment.created_at.desc())
    )
    return result.scalars().all()

@router.post("/invoices/{invoice_id}/payment-link")
async def create_payment_link(
    invoice_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.payments))
        .where(Invoice.id == invoice_id, Invoice.user_id == current_user.id)
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if invoice.balance_due <= 0:
        raise HTTPException(status_code=400, detail="Invoice is already fully paid")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': invoice.currency.lower() if invoice.currency else 'inr',
                    'product_data': {
                        'name': f'Invoice #{invoice.invoice_number}',
                    },
                    # Stripe requires a minimum of ~40 INR ($0.50 USD equivalent)
                    'unit_amount': max(int(invoice.balance_due * 100), 4000),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{settings.FRONTEND_URL}/invoices/{invoice_id}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/invoices/{invoice_id}",
            client_reference_id=str(invoice.id),
            metadata={'invoice_id': str(invoice.id)}
        )
        invoice.payment_link_url = session.url
        invoice.stripe_payment_link_id = session.id
        await db.commit()
        
        # Return the custom LuxePay checkout URL instead of the Stripe URL
        custom_pay_url = f"{settings.FRONTEND_URL}/pay/{invoice.id}"
        return {"url": custom_pay_url}
    except stripe.error.StripeError as e:
        import traceback
        print("\n" + "="*50)
        print("STRIPE ERROR:")
        print(str(e))
        print("="*50 + "\n")
        raise HTTPException(status_code=400, detail=f"Stripe Error: {str(e)}")
    except Exception as e:
        import traceback
        print("\n" + "="*50)
        print("GENERAL ERROR:")
        print(str(e))
        print("="*50 + "\n")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        invoice_id = session.get('client_reference_id')
        if not invoice_id:
            invoice_id = session.get('metadata', {}).get('invoice_id')
            
        if invoice_id:
            result = await db.execute(select(Invoice).where(Invoice.id == invoice_id))
            invoice = result.scalar_one_or_none()
            if invoice:
                # Add a payment record
                amount_paid = session.get('amount_total', 0) / 100.0
                new_payment = Payment(
                    invoice_id=invoice.id,
                    amount_paid=amount_paid,
                    payment_date=datetime.date.today(),
                    payment_method="Stripe",
                    transaction_ref=session.get('payment_intent') or session.get('id'),
                    notes="Paid via Stripe Checkout"
                )
                db.add(new_payment)
                await db.commit()
                await recalculate_invoice_payment_status(str(invoice.id), db)

    return {"status": "success"}

@router.get("/invoices/{invoice_id}/payment-status")
async def get_payment_status(
    invoice_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.payments))
        .where(Invoice.id == invoice_id, Invoice.user_id == current_user.id)
    )
    invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    return {"status": invoice.status.value, "balance_due": invoice.balance_due}
