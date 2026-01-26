import os
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.event_service import create_event, update_event, delete_event

router = APIRouter(prefix="/admin", tags=["Admin Eventos"])

# Pasta onde as imagens serão salvas
UPLOAD_DIR = "static/uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schema para criar evento via JSON
class EventCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    date: str
    time: Optional[str] = ""
    location: str
    image: Optional[str] = ""
    total_tickets: int
    price: float
    category: Optional[str] = "outros"

@router.post("/eventos")
def criar_evento(evento: EventCreate, db: Session = Depends(get_db)):
    """Cria evento via JSON"""
    event_data = {
        "name": evento.name,
        "description": evento.description,
        "date": evento.date,
        "time": evento.time or "",
        "location": evento.location,
        "price": evento.price,
        "total_tickets": evento.total_tickets,
        "image": evento.image or "",
        "category": evento.category or "outros"
    }
    return create_event(db, event_data)

class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None
    image: Optional[str] = None
    total_tickets: Optional[int] = None
    price: Optional[float] = None
    category: Optional[str] = None

@router.put("/eventos/{event_id}")
def editar_evento(event_id: int, evento: EventUpdate, db: Session = Depends(get_db)):
    """Atualiza evento via JSON"""
    event_data = {}
    if evento.name is not None:
        event_data["name"] = evento.name
    if evento.description is not None:
        event_data["description"] = evento.description
    if evento.date is not None:
        event_data["date"] = evento.date
    if evento.time is not None:
        event_data["time"] = evento.time
    if evento.location is not None:
        event_data["location"] = evento.location
    if evento.price is not None:
        event_data["price"] = evento.price
    if evento.total_tickets is not None:
        event_data["total_tickets"] = evento.total_tickets
    if evento.image is not None:
        event_data["image"] = evento.image
    if evento.category is not None:
        event_data["category"] = evento.category
    
    return update_event(db, event_id, event_data)

@router.post("/eventos/upload")
async def criar_evento_com_upload(
    nome: str = Form(...),
    descricao: str = Form(""),
    data: str = Form(...),
    horario: str = Form(""),
    local: str = Form(...),
    preco: float = Form(...),
    capacidade: int = Form(...),
    categoria: str = Form("outros"),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Cria evento com upload de imagem"""
    image_path = ""
    
    if file and file.filename:
        # Gera nome único para o arquivo
        import uuid
        ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_name = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        image_path = f"/static/uploads/{unique_name}"
    
    event_data = {
        "name": nome,
        "description": descricao,
        "date": data,
        "time": horario,
        "location": local,
        "price": preco,
        "total_tickets": capacidade,
        "image": image_path,
        "category": categoria
    }
    
    return create_event(db, event_data)

@router.put("/eventos/{event_id}/upload")
async def editar_evento_com_upload(
    event_id: int,
    nome: str = Form(...),
    descricao: str = Form(""),
    data: str = Form(...),
    horario: str = Form(""),
    local: str = Form(...),
    preco: float = Form(...),
    capacidade: int = Form(...),
    categoria: str = Form("outros"),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Atualiza evento com upload de nova imagem"""
    event_data = {
        "name": nome,
        "description": descricao,
        "date": data,
        "time": horario,
        "location": local,
        "price": preco,
        "total_tickets": capacidade,
        "category": categoria
    }
    
    if file and file.filename:
        import uuid
        ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        unique_name = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        event_data["image"] = f"/static/uploads/{unique_name}"
    
    return update_event(db, event_id, event_data)

@router.delete("/eventos/{event_id}")
def deletar_evento(event_id: int, db: Session = Depends(get_db)):
    return delete_event(db, event_id)