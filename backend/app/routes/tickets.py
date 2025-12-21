from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.ticket_service import generate_tickets

router = APIRouter()

@router.post("/ingressos/{purchase_id}")
def emitir(purchase_id: int, db: Session = Depends(SessionLocal)):
    return generate_tickets(db, purchase_id)
