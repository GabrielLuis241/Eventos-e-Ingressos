import os
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form
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

@router.post("/eventos")
async def criar_evento(
    nome: str = Form(...),
    descricao: str = Form(...),
    data: str = Form(...),
    local: str = Form(...),
    preco: float = Form(...),
    capacidade: int = Form(...),
    imagem_url: Optional[str] = Form(None),  # Opção 1: Link direto
    file: Optional[UploadFile] = File(None), # Opção 2: Upload de arquivo
    db: Session = Depends(get_db)
):
    final_image_path = imagem_url

    # Se um arquivo foi enviado, ele ganha prioridade e é salvo localmente
    if file:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        # O caminho que será guardado no banco para o frontend acessar
        final_image_path = f"/static/uploads/{file.filename}"

    # Montamos o dicionário para enviar ao service
    event_data = {
        "nome": nome,
        "descricao": descricao,
        "data": data,
        "local": local,
        "preco": preco,
        "capacidade": capacidade,
        "imagem": final_image_path
    }
    
    return create_event(db, event_data)

@router.put("/eventos/{event_id}")
def editar_evento(event_id: int, nome: Optional[str] = Form(None), db: Session = Depends(get_db)):
    # Lógica de update simplificada para exemplo, pode manter a sua lógica de dict
    # mas lembre-se que se for usar upload no PUT, precisa usar Form também.
    pass

@router.delete("/eventos/{event_id}")
def deletar_evento(event_id: int, db: Session = Depends(get_db)):
    return delete_event(db, event_id)