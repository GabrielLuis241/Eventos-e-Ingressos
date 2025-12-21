from sqlalchemy.orm import Session
from app.models.purchase import Purchase
from app.models.event import Event

def create_purchase(db: Session, data):
    event = db.query(Event).get(data.event_id)

    if event.available_tickets < data.quantity:
        raise Exception("Ingressos insuficientes")

    purchase = Purchase(
        event_id=data.event_id,
        quantity=data.quantity,
        payment_type=data.payment_type,
        status="pago"
    )

    event.available_tickets -= data.quantity
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    return purchase
