from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.event import EventCreate
from app.services.event_service import create_event

router = APIRouter(prefix="/admin")

@router.post("/eventos")
def criar_evento(data: EventCreate, db: Session = Depends(SessionLocal)):
    return create_event(db, data.dict())
