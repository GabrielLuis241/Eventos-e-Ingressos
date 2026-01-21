from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.ticket import Ticket
from app.models.event import Event
from app.models.purchase import Purchase
from app.models.user import User

router = APIRouter(prefix="/tickets", tags=["Ingressos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.patch("/validar/{unique_code}")
def validar_ingresso(unique_code: str, db: Session = Depends(get_db)):
    """
    US14: Valida um ingresso na portaria.
    """
    # 1. Busca o ingresso e já traz o evento e o usuário (comprador) junto
    ticket = db.query(Ticket).filter(Ticket.unique_code == unique_code).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Ingresso inválido ou não encontrado."
        )

    # 2. Verifica se já foi usado
    if ticket.used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="ALERTA: Este ingresso já foi utilizado anteriormente!"
        )

    # 3. Busca informações complementares para o Staff
    event = db.query(Event).filter(Event.id == ticket.event_id).first()
    # Busca o dono do ingresso através da compra
    purchase = db.query(Purchase).filter(Purchase.id == ticket.purchase_id).first()
    user = db.query(User).filter(User.id == purchase.user_id).first() if purchase else None

    # 4. Marca como usado e salva
    ticket.used = True
    db.commit()

    return {
        "status": "sucesso",
        "message": "Entrada liberada!",
        "detalhes": {
            "evento": event.name if event else "N/A",
            "comprador": user.username if user else "N/A",
            "email": user.email if user else "N/A",
            "ingresso_id": ticket.id
        }
    }

@router.get("/meus-ingressos/{user_id}")
def listar_meus_ingressos(user_id: int, db: Session = Depends(get_db)):
    """
    US12: Permite ao usuário visualizar seus ingressos adquiridos.
    """
    ingressos = db.query(Ticket).join(Purchase).filter(Purchase.user_id == user_id).all()
    
    # Formatação para o frontend
    return [
        {
            "id": t.id,
            "unique_code": t.unique_code,
            "qr_code_url": t.qr_code_path,
            "used": t.used,
            "event_id": t.event_id
        } for t in ingressos
    ]