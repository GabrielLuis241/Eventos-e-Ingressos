from pydantic import BaseModel

class EventCreate(BaseModel):
    name: str
    description: str
    date: str
    time: str
    location: str
    image: str
    total_tickets: int

class EventResponse(EventCreate):
    id: int
    available_tickets: int
