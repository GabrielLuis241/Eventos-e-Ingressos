from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import SessionLocal
from app.services import event_service # Importação corrigida

router = APIRouter(tags=["Público - Eventos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/eventos")
def listar_eventos(
    search: Optional[str] = Query(None, description="Busca por nome ou descrição"),
    location: Optional[str] = Query(None, description="Filtrar por localização"),
    db: Session = Depends(get_db)
):
    """
    Retorna todos os eventos, com suporte opcional a filtros de busca e local.
    """
    return event_service.list_events(db, search=search, location=location)

@router.get("/eventos/{id}")
def obter_evento_por_id(id: int, db: Session = Depends(get_db)):
    """
    Retorna os detalhes de um único evento.
    """
    db_event = event_service.get_event(db, id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return db_event