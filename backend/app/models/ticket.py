from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id")) # FK Adicionada
    event_id = Column(Integer, ForeignKey("events.id"))       # FK Adicionada
    qr_code_path = Column(String) # Caminho da imagem
    unique_code = Column(String, unique=True) # O código que o QR Code carrega
    used = Column(Boolean, default=False)