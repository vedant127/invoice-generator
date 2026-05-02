import uuid
from datetime import datetime, date
from sqlalchemy import String, TEXT, ForeignKey, TIMESTAMP, DATE, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from ..database import Base

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=False)
    amount_paid: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    payment_date: Mapped[date] = mapped_column(DATE, default=date.today, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(100), nullable=True)
    transaction_ref: Mapped[str] = mapped_column(String(255), nullable=True)
    notes: Mapped[str] = mapped_column(TEXT, nullable=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.utcnow)

    invoice = relationship("Invoice", back_populates="payments")
