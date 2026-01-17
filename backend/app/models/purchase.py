from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from app.database import Base
from sqlalchemy.orm import relationship
import datetime

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    quantity = Column(Integer) # Quantidade de ingressos comprados
    total_value = Column(Float) # US03: Preço do evento * quantidade
    payment_type = Column(String) # US04/05: 'cartao' ou 'pix'
    status = Column(String, default="pendente") # pendente, pago, cancelado
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Criar a relação inversa
    user = relationship("User", back_populates="purchases")
    event = relationship("Event")