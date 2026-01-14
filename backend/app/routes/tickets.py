from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.ticket import Ticket
from app.models.event import Event

router = APIRouter(prefix="/tickets", tags=["Ingressos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.put("/validar/{unique_code}")
def validar_ingresso(unique_code: str, db: Session = Depends(get_db)):
    # 1. Busca o ingresso pelo código único do QR Code
    ticket = db.query(Ticket).filter(Ticket.unique_code == unique_code).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ingresso inválido ou não encontrado.")

    # 2. Verifica se já foi usado (US14)
    if ticket.used:
        raise HTTPException(status_code=400, detail="Este ingresso já foi utilizado!")

    # 3. Marca como usado e salva
    ticket.used = True
    db.commit()
    db.refresh(ticket)

    # 4. Busca info do evento para confirmar na tela do staff
    event = db.query(Event).filter(Event.id == ticket.event_id).first()

    return {
        "status": "sucesso",
        "message": "Entrada liberada!",
        "evento": event.name,
        "ingresso_id": ticket.id
    }

@router.get("/meus-ingressos/{user_id}")
def listar_meus_ingressos(user_id: int, db: Session = Depends(get_db)):
    """
    Útil para a US12 (Usuário ver suas compras)
    """
    # Aqui poderíamos fazer um join entre Ticket e Purchase para filtrar por user_id
    from app.models.purchase import Purchase
    ingressos = db.query(Ticket).join(Purchase).filter(Purchase.user_id == user_id).all()
    return ingressos