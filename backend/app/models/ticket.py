from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)
    purchase_id = Column(Integer)
    event_id = Column(Integer)
    qr_code = Column(String)
    used = Column(Boolean, default=False)
