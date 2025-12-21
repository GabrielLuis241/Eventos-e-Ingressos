from fastapi import APIRouter
from sqlalchemy import func
from app.database import SessionLocal
from app.models.purchase import Purchase

router = APIRouter(prefix="/admin")

@router.get("/relatorios")
def relatorio():
    db = SessionLocal()
    total = db.query(func.count(Purchase.id)).scalar()
    return {"total_vendas": total}
