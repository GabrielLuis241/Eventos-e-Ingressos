from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from app.database import Base
from sqlalchemy.orm import relationship
import datetime

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer)
    total_value = Column(Float)
    payment_type = Column(String)
    status = Column(String, default="pendente") # pendente, pago, cancelado
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relacionamentos
    user = relationship("User", back_populates="purchases")
    event = relationship("Event", back_populates="purchases")
    
    # CORREÇÃO: Esta linha permite que o Ticket aponte para cá via back_populates
    tickets = relationship("Ticket", back_populates="purchase", cascade="all, delete-orphan")