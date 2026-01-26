from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session, joinedload
from jose import jwt, JWTError
from app.database import SessionLocal
from app.schemas.purchase import PurchaseCreate
from app.services.purchase_service import create_purchase, confirm_payment
from app.models.purchase import Purchase
from app.models.event import Event
from app.models.ticket import Ticket

# Importamos as mesmas chaves que usamos no auth.py para validar o token
SECRET_KEY = "sua_chave_secreta_super_segura"
ALGORITHM = "HS256"

router = APIRouter(prefix="/compras", tags=["Compras"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Função auxiliar para pegar o usuário logado via Token
def get_current_user_id(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não fornecido")
    try:
        # O token vem como "Bearer <token>", então removemos a palavra "Bearer "
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return user_id
    except (JWTError, IndexError):
        raise HTTPException(status_code=401, detail="Token inválido ou malformado")

@router.post("/")
def iniciar_compra(
    data: PurchaseCreate, 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id) # Agora o user_id vem do token!
):
    return create_purchase(db, data, user_id)

@router.post("/{purchase_id}/confirmar")
def confirmar_compra(purchase_id: int, db: Session = Depends(get_db)):
    """
    Simula a confirmação de pagamento (US04/US05)
    """
    return confirm_payment(db, purchase_id)

@router.get("/minhas")
def listar_minhas_compras(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """
    Lista todas as compras do usuário logado com detalhes do evento
    """
    from app.models.event import Event
    
    compras = db.query(Purchase).options(
        joinedload(Purchase.event),
        joinedload(Purchase.tickets)
    ).filter(
        Purchase.user_id == user_id,
        Purchase.status == "pago"  # Apenas compras confirmadas
    ).order_by(Purchase.created_at.desc()).all()
    
    resultado = []
    for compra in compras:
        # Busca o evento diretamente se não veio pelo joinedload
        evento = compra.event
        if not evento and compra.event_id:
            evento = db.query(Event).filter(Event.id == compra.event_id).first()
        
        tickets = compra.tickets or []
        
        evento_data = None
        if evento:
            evento_data = {
                "id": evento.id,
                "nome": evento.name or "",
                "data": evento.date or "",
                "horario": evento.time or "",
                "local": evento.location or "",
                "imagem": evento.image or ""
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
                for t in tickets
            ]
        })
    
    return resultado