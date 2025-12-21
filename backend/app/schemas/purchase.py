from pydantic import BaseModel

class PurchaseCreate(BaseModel):
    event_id: int
    quantity: int
    payment_type: str
