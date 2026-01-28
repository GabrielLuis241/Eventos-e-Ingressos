from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
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

# Schema para resposta de usuário
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    user_type: str
    created_at: str = None

    class Config:
        from_attributes = True

@router.get("/usuarios", response_model=List[UserResponse])
def listar_usuarios(db: Session = Depends(get_db)):
    """Lista todos os usuários cadastrados"""
    usuarios = db.query(User).all()
    
    # Formatar resposta
    resultado = []
    for user in usuarios:
        resultado.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "user_type": user.user_type,
            "created_at": None  # O modelo atual não tem campo de data de criação
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
    
    # Não permitir que o admin exclua a si mesmo (proteção básica)
    # Em produção, você verificaria o token JWT para isso
    
    db.delete(user)
    db.commit()
    
    return {"message": "Usuário removido com sucesso", "id": user_id}