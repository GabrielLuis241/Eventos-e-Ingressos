from sqlalchemy import Column, Integer, String, Text
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
