from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.event_service import list_events, get_event

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/eventos")
def eventos(db: Session = Depends(get_db)):
    return list_events(db)

@router.get("/eventos/{id}")
def evento(id: int, db: Session = Depends(get_db)):
    return get_event(db, id)
