from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.event import EventCreate, EventUpdate
from app.services.event_service import create_event, update_event, delete_event

router = APIRouter(prefix="/admin")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/eventos")
def criar_evento(data: EventCreate, db: Session = Depends(get_db)):
    return create_event(db, data.dict())

@router.put("/eventos/{event_id}")
def editar_evento(event_id: int, data: EventUpdate, db: Session = Depends(get_db)):
    # Remove campos None do dicionário antes de atualizar
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    return update_event(db, event_id, update_data)

@router.delete("/eventos/{event_id}")
def deletar_evento(event_id: int, db: Session = Depends(get_db)):
    return delete_event(db, event_id)
