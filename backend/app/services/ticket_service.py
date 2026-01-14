import qrcode
import uuid
import os
from sqlalchemy.orm import Session
from app.models.ticket import Ticket

def generate_tickets(db: Session, purchase):
    tickets = []
    
    # Criar pasta para salvar os QR Codes se não existir
    output_dir = "static/qrcodes"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for _ in range(purchase.quantity):
        # US06: Criar um código único para cada bilhete
        unique_token = str(uuid.uuid4())
        
        # O QR Code aponta para este código único
        qr = qrcode.make(unique_token)
        qr_filename = f"{unique_token}.png"
        qr_path = os.path.join(output_dir, qr_filename)
        qr.save(qr_path)

        ticket = Ticket(
            purchase_id=purchase.id,
            event_id=purchase.event_id,
            unique_code=unique_token,
            qr_code_path=qr_path,
            used=False
        )

        db.add(ticket)
        tickets.append(ticket)

    db.commit()
    return tickets