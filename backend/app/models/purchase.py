from sqlalchemy import Column, Integer, String
from app.database import Base

class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer)
    quantity = Column(Integer)
    payment_type = Column(String)
    status = Column(String)
