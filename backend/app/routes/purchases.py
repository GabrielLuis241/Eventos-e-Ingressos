from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from app.database import SessionLocal
from app.schemas.purchase import PurchaseCreate
from app.services.purchase_service import create_purchase, confirm_payment

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