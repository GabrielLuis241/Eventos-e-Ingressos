from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session, joinedload
from jose import jwt, JWTError
import os
from typing import List
from dotenv import load_dotenv

from app.database import SessionLocal
from app.schemas.purchase import PurchaseCreate
from app.services.purchase_service import create_purchase, confirm_payment
from app.models.purchase import Purchase
from app.models.event import Event
from app.models.ticket import Ticket

# Carrega variáveis de ambiente
load_dotenv()

# Deve ser a mesma do seu arquivo de auth.py para evitar erro 401
SECRET_KEY = os.getenv("SECRET_KEY", "sua_chave_secreta_super_segura")
ALGORITHM = "HS256"

router = APIRouter(prefix="/compras", tags=["Compras"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user_id(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não fornecido")
    try:
        # Suporta "Bearer <token>" ou apenas o token direto
        token = authorization.split(" ")[1] if " " in authorization else authorization
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido: ID ausente")
        return user_id
    except (JWTError, IndexError):
        raise HTTPException(status_code=401, detail="Token inválido ou malformado")

@router.get("/minhas")
def listar_minhas_compras(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Lista compras do usuário com inteligência para não duplicar o caminho da imagem
    """
    compras = db.query(Purchase).options(
        joinedload(Purchase.event),
        joinedload(Purchase.tickets)
    ).filter(
        Purchase.user_id == user_id,
        Purchase.status == "pago"
    ).order_by(Purchase.created_at.desc()).all()
    
    resultado = []
    for compra in compras:
        evento = compra.event
        if not evento and compra.event_id:
            evento = db.query(Event).filter(Event.id == compra.event_id).first()
        
        evento_data = None
        if evento:
            # 1. Pega o valor bruto do banco (pode ser 'imagem.jpg' ou 'static/uploads/imagem.jpg')
            path_banco = getattr(evento, 'image_url', None) or getattr(evento, 'image', "")
            
            # 2. Lógica de limpeza para evitar duplicação (ERRO 404 corrigido aqui)
            if path_banco:
                if path_banco.startswith('http'):
                    url_final = path_banco
                elif "static/" in path_banco:
                    # Se já tem 'static' no banco, removemos barras extras e montamos a URL
                    clean_path = path_banco.lstrip('/')
                    url_final = f"http://localhost:8000/{clean_path}"
                else:
                    # Se for só o nome do arquivo, montamos o caminho completo
                    clean_path = path_banco.lstrip('/')
                    url_final = f"http://localhost:8000/static/uploads/{clean_path}"
            else:
                url_final = ""

            # 3. Garante que não existam barras duplas como '8000//static'
            url_final = url_final.replace("localhost:8000//", "localhost:8000/")

            evento_data = {
                "id": evento.id,
                "nome": evento.name or "",
                "data": evento.date or "",
                "horario": evento.time or "",
                "local": evento.location or "",
                "image_url": url_final,
                "imagem": url_final
            }
        
        resultado.append({
            "id": compra.id,
            "quantidade": compra.quantity,
            "valor_total": compra.total_value,
            "data_compra": compra.created_at.isoformat() if compra.created_at else None,
            "status": compra.status,
            "evento": evento_data,
            "qr_codes": [
                {"id": t.id, "codigo": t.unique_code, "usado": t.used}
                for t in (compra.tickets or [])
            ]
        })
    
    return resultado

# --- Mantendo as outras rotas padrão ---
@router.post("/")
def iniciar_compra(data: PurchaseCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return create_purchase(db, data, user_id)

@router.post("/{purchase_id}/confirmar")
def confirmar_compra(purchase_id: int, db: Session = Depends(get_db)):
    return confirm_payment(db, purchase_id)