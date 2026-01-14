from sqlalchemy.orm import Session
from app.models.purchase import Purchase
from app.models.event import Event
from fastapi import HTTPException
from app.services.ticket_service import generate_tickets # IMPORTANTE

def create_purchase(db: Session, data, user_id: int):
    # 1. Busca o evento
    event = db.query(Event).filter(Event.id == data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado")

    # 2. Valida stock (US03)
    if event.available_tickets < data.quantity:
        raise HTTPException(status_code=400, detail="Ingressos insuficientes para este evento")

    # 3. Calcula o valor total (US03)
    total = event.price * data.quantity

    # 4. Cria a compra com status PENDENTE
    new_purchase = Purchase(
        event_id=data.event_id,
        user_id=user_id,
        quantity=data.quantity,
        total_value=total,
        payment_type=data.payment_type,
        status="pendente" 
    )

    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    
    return new_purchase

def confirm_payment(db: Session, purchase_id: int):
    """
    Função para ser usada na US04/US05 quando o pagamento for aprovado.
    """
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    
    if not purchase:
        raise HTTPException(status_code=404, detail="Compra não encontrada")
    
    if purchase.status == "pago":
        return purchase 

    event = db.query(Event).filter(Event.id == purchase.event_id).first()

    # Re-validação de segurança antes de baixar o stock
    if event.available_tickets < purchase.quantity:
        purchase.status = "cancelado"
        db.commit()
        raise HTTPException(status_code=400, detail="Stock esgotado durante o processamento")

    # 1. Baixa o stock
    event.available_tickets -= purchase.quantity
    
    # 2. Confirma a compra
    purchase.status = "pago"
    
    # 3. GERA OS INGRESSOS E QR CODES (US06)
    # Como o commit ainda não foi feito, usamos o flush para garantir que 
    # o ID da compra esteja disponível se necessário, ou apenas chamamos o serviço.
    generate_tickets(db, purchase)
    
    db.commit()
    db.refresh(purchase)
    return purchase