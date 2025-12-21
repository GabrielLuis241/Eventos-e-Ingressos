from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.purchase import PurchaseCreate
from app.services.purchase_service import create_purchase

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/compras")
def comprar(data: PurchaseCreate, db: Session = Depends(get_db)):
    return create_purchase(db, data)
