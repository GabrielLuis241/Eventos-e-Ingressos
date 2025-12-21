from pydantic import BaseModel

class TicketResponse(BaseModel):
    id: int
    qr_code: str
    used: bool
