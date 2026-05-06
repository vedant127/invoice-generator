from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from uuid import UUID
from typing import List, Optional
from ..models.invoice import InvoiceStatus, DiscountType
from .client import ClientOut

class InvoiceItemBase(BaseModel):
    description: str
    quantity: float
    unit_price: float
    unit: Optional[str] = None
    sort_order: int = 0

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemOut(InvoiceItemBase):
    id: UUID
    amount: float

    model_config = ConfigDict(from_attributes=True)

class InvoiceBase(BaseModel):
    client_id: UUID
    issue_date: date
    due_date: date
    currency: str = "INR"
    discount_type: Optional[DiscountType] = None
    discount_value: float = 0.0
    tax_rate: float = 0.0
    notes: Optional[str] = None
    footer_text: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceUpdate(BaseModel):
    status: Optional[InvoiceStatus] = None
    issue_date: Optional[date] = None
    due_date: Optional[date] = None
    notes: Optional[str] = None
    footer_text: Optional[str] = None

class InvoiceOut(InvoiceBase):
    id: UUID
    invoice_number: str
    status: InvoiceStatus
    subtotal: float
    discount_amount: float
    tax_amount: float
    total_amount: float
    amount_paid: float = 0.0
    balance_due: float = 0.0
    pdf_url: Optional[str] = None
    payment_link_url: Optional[str] = None
    created_at: datetime
    items: List[InvoiceItemOut]
    client: Optional[ClientOut] = None

    model_config = ConfigDict(from_attributes=True)
