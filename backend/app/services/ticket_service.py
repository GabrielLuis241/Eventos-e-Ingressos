import qrcode
from sqlalchemy.orm import Session
from app.models.ticket import Ticket

def generate_tickets(db: Session, purchase):
    tickets = []

    for _ in range(purchase.quantity):
        qr_data = f"purchase:{purchase.id}"
        qr = qrcode.make(qr_data)
        qr_path = f"qr_{purchase.id}.png"
        qr.save(qr_path)

        ticket = Ticket(
            purchase_id=purchase.id,
            event_id=purchase.event_id,
            qr_code=qr_path
        )

        db.add(ticket)
        tickets.append(ticket)

    db.commit()
    return tickets
