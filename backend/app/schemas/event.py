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

class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    image: Optional[str] = None
    total_tickets: Optional[int] = None
    price: Optional[float] = None

class EventResponse(EventBase):
    id: int
    available_tickets: int

    class Config:
        from_attributes = True