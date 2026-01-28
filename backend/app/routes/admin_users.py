from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import SessionLocal
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin Usuários"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schema para resposta de usuário corrigido
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    user_type: str
    # Usando Optional para permitir que o valor seja None (vazio)
    created_at: Optional[str] = None 

    class Config:
        from_attributes = True

@router.get("/usuarios", response_model=List[UserResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    """Lista todos os usuários cadastrados"""
    usuarios = db.query(User).all()
    
    # Formatar resposta garantindo que o esquema valide
    resultado = []
    for user in usuarios:
        resultado.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "user_type": user.user_type,
            "created_at": None  # Definido como None explicitamente
        })
    
    return resultado

@router.get("/usuarios/{user_id}", response_model=UserResponse)
def buscar_usuario(user_id: int, db: Session = Depends(get_db)):
    """Busca um usuário pelo ID"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "user_type": user.user_type,
        "created_at": None
    }

@router.delete("/usuarios/{user_id}")
def deletar_usuario(user_id: int, db: Session = Depends(get_db)):
    """Remove um usuário pelo ID"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "Usuário removido com sucesso", "id": user_id}