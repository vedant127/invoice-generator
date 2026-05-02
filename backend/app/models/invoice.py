import uuid
import enum
from datetime import datetime, date
from sqlalchemy import String, TEXT, ForeignKey, TIMESTAMP, DATE, Numeric, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from ..database import Base

class InvoiceStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SENT = "SENT"
    VIEWED = "VIEWED"
    PAID = "PAID"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"

class DiscountType(str, enum.Enum):
    FLAT = "FLAT"
    PERCENTAGE = "PERCENTAGE"

class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_number: Mapped[str] = mapped_column(String(50), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    client_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(SQLEnum(InvoiceStatus), default=InvoiceStatus.DRAFT, nullable=False)
    issue_date: Mapped[date] = mapped_column(DATE, nullable=False)
    due_date: Mapped[date] = mapped_column(DATE, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    subtotal: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    discount_type: Mapped[DiscountType] = mapped_column(SQLEnum(DiscountType), nullable=True)
    discount_value: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=True)
    discount_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=True)
    tax_rate: Mapped[float] = mapped_column(Numeric(5, 2), default=0.00, nullable=True)
    tax_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=True)
    total_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0.00, nullable=False)
    notes: Mapped[str] = mapped_column(TEXT, nullable=True)
    footer_text: Mapped[str] = mapped_column(TEXT, nullable=True)
    pdf_url: Mapped[str] = mapped_column(TEXT, nullable=True)
    viewed_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="invoices")
    client = relationship("Client", back_populates="invoices")
    items = relationship("InvoiceItem", back_populates="invoice", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")
