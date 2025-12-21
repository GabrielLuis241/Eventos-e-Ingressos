from sqlalchemy.orm import Session
from app.models.event import Event

def create_event(db: Session, data):
    event = Event(**data, available_tickets=data["total_tickets"])
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

def list_events(db: Session):
    return db.query(Event).all()

def get_event(db: Session, event_id: int):
    return db.query(Event).filter(Event.id == event_id).first()
