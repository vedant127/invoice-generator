from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from uuid import UUID
from typing import Optional

class PaymentCreate(BaseModel):
    amount_paid: float
    payment_date: Optional[date] = None
    payment_method: Optional[str] = None
    transaction_ref: Optional[str] = None
    notes: Optional[str] = None

class PaymentOut(BaseModel):
    id: UUID
    invoice_id: UUID
    amount_paid: float
    payment_date: date
    payment_method: Optional[str]
    transaction_ref: Optional[str]
    notes: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
