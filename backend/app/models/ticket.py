from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    qr_code_path = Column(String) 
    unique_code = Column(String, unique=True, index=True)
    used = Column(Boolean, default=False)

    # Relacionamentos sincronizados
    event = relationship("Event")
    purchase = relationship("Purchase", back_populates="tickets")