from sqlalchemy.orm import Session
from app.models.event import Event

def create_event(db: Session, data):
    event = Event(**data, available_tickets=data["total_tickets"])
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

def list_events(db: Session, search: str = None, location: str = None):
    query = db.query(Event)
    
    # Filtro de busca (Nome ou Descrição)
    if search:
        query = query.filter(
            (Event.name.ilike(f"%{search}%")) | 
            (Event.description.ilike(f"%{search}%"))
        )
    
    # Filtro de Localização
    if location:
        query = query.filter(Event.location.ilike(f"%{location}%"))
        
    return query.all()

def get_event(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()

def update_event(db: Session, event_id: int, data: dict):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise Exception("Evento não encontrado")
    
    for key, value in data.items():
        if hasattr(event, key):
            setattr(event, key, value)
    
    db.commit()
    db.refresh(event)
    return event

def delete_event(db: Session, event_id: int):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise Exception("Evento não encontrado")
    
    db.delete(event)
    db.commit()
    return {"message": "Evento deletado com sucesso"}