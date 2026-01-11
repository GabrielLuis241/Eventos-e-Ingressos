from pydantic import BaseModel

class EventCreate(BaseModel):
    name: str
    description: str
    date: str
    time: str
    location: str
    image: str
    total_tickets: int

class EventUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    date: str | None = None
    time: str | None = None
    location: str | None = None
    image: str | None = None
    total_tickets: int | None = None

class EventResponse(EventCreate):
    id: int
    available_tickets: int
