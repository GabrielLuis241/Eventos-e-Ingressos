from pydantic import BaseModel
from typing import Optional

class EventBase(BaseModel):
    name: str
    description: str
    date: str
    time: str
    location: str
    image: Optional[str] = None
    total_tickets: int
    price: float # Adicionado aqui

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    available_tickets: int

    class Config:
        from_attributes = True