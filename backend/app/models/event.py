from sqlalchemy import Column, Integer, String, Text, Float # Adicionado Float
from sqlalchemy.orm import relationship
from app.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(Text)
    date = Column(String)
    time = Column(String)
    location = Column(String)
    image = Column(String)
    total_tickets = Column(Integer)
    available_tickets = Column(Integer)
    price = Column(Float, default=0.0)
    category = Column(String, default="outros")  # Categoria do evento
    
    # Relacionamento com compras
    purchases = relationship("Purchase", back_populates="event")