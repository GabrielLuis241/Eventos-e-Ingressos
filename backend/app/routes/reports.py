from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.responses import StreamingResponse
import io
import csv
from app.database import SessionLocal
from app.models.purchase import Purchase
from app.models.ticket import Ticket
from app.models.event import Event
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["Relatórios"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- US11: Relatórios Básicos (O que você já tinha) ---

@router.get("/vendas-gerais")
def obter_relatorio_geral(db: Session = Depends(get_db)):
    total_arrecadado = db.query(func.sum(Purchase.total_value)).filter(Purchase.status == "pago").scalar() or 0.0
    total_ingressos_vendidos = db.query(func.count(Ticket.id)).scalar() or 0

    return {
        "total_arrecadado": total_arrecadado,
        "total_ingressos_vendidos": total_ingressos_vendidos
    }

@router.get("/dashboard-completo")
def obter_dashboard_completo(db: Session = Depends(get_db)):
    """
    Retorna todos os dados necessários para o dashboard de relatórios.
    Inclui: métricas gerais, vendas por evento e lista de clientes que compraram.
    """
    # 1. Métricas gerais
    total_vendas = db.query(func.sum(Purchase.total_value)).filter(Purchase.status == "pago").scalar() or 0.0
    total_ingressos = db.query(func.count(Ticket.id)).scalar() or 0
    total_eventos = db.query(func.count(Event.id)).scalar() or 0
    
    # 2. Vendas por evento (com JOIN para pegar nome do evento)
    vendas_por_evento = db.query(
        Event.id,
        Event.name,
        Event.date,
        func.count(Ticket.id).label("ingressos_vendidos"),
        func.sum(Purchase.total_value).label("valor_total")
    ).join(Ticket, Ticket.event_id == Event.id)\
     .join(Purchase, Purchase.event_id == Event.id)\
     .filter(Purchase.status == "pago")\
     .group_by(Event.id, Event.name, Event.date)\
     .all()
    
    vendas_formatadas = [
        {
            "id": row.id,
            "nomeEvento": row.name,
            "data": row.date,
            "ingressosVendidos": row.ingressos_vendidos or 0,
            "valorTotal": float(row.valor_total or 0)
        }
        for row in vendas_por_evento
    ]
    
    # 3. Lista de clientes que compraram ingressos
    # Contar quantos tickets cada compra tem
    compras = db.query(
        Purchase.id,
        User.username,
        User.email,
        Event.name.label("evento_nome"),
        func.count(Ticket.id).label("quantidade_tickets"),
        Purchase.total_value,
        Purchase.created_at
    ).join(User, Purchase.user_id == User.id)\
     .join(Event, Purchase.event_id == Event.id)\
     .outerjoin(Ticket, Ticket.purchase_id == Purchase.id)\
     .filter(Purchase.status == "pago")\
     .group_by(Purchase.id, User.username, User.email, Event.name, Purchase.total_value, Purchase.created_at)\
     .order_by(Purchase.created_at.desc())\
     .all()
    
    clientes_formatados = [
        {
            "id": row.id,
            "nome": row.username,
            "email": row.email,
            "evento": row.evento_nome,
            "quantidade": row.quantidade_tickets or 0,
            "valorTotal": float(row.total_value),
            "dataCompra": row.created_at.strftime("%Y-%m-%d") if row.created_at else ""
        }
        for row in compras
    ]
    
    return {
        "totalVendas": float(total_vendas),
        "totalIngressos": total_ingressos,
        "totalEventos": total_eventos,
        "vendasPorEvento": vendas_formatadas,
        "clientes": clientes_formatados
    }

@router.get("/vendas-por-evento/{event_id}")
def relatorio_por_evento(event_id: int, db: Session = Depends(get_db)):
    vendas_evento = db.query(func.sum(Purchase.total_value)).filter(
        Purchase.event_id == event_id, 
        Purchase.status == "pago"
    ).scalar() or 0.0
    
    ingressos_evento = db.query(func.count(Ticket.id)).filter(Ticket.event_id == event_id).scalar() or 0

    return {
        "event_id": event_id,
        "receita_total": vendas_evento,
        "ingressos_vendidos": ingressos_evento
    }

# --- US15: Painel Detalhado (Dados para Gráficos) ---

@router.get("/dashboard-graficos")
def dados_grafico_vendas(db: Session = Depends(get_db)):
    """
    Retorna vendas agrupadas por dia para plotar gráficos de linha/barra.
    """
    # Agrupa compras pagas por data
    vendas_diarias = db.query(
        func.date(Purchase.created_at).label("data"),
        func.sum(Purchase.total_value).label("total")
    ).filter(Purchase.status == "pago")\
     .group_by(func.date(Purchase.created_at))\
     .order_by(func.date(Purchase.created_at)).all()

    return [{"data": str(row.data), "total": row.total} for row in vendas_diarias]

# --- US13: Exportação de Relatórios ---

@router.get("/exportar-csv")
def exportar_vendas_csv(db: Session = Depends(get_db)):
    """
    Gera um arquivo CSV com todas as vendas confirmadas.
    """
    vendas = db.query(Purchase).filter(Purchase.status == "pago").all()
    
    # Criar um buffer na memória para o CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Cabeçalho
    writer.writerow(["ID_Pedido", "ID_Evento", "Quantidade", "Valor_Total", "Metodo_Pagamento", "Data"])
    
    # Dados
    for v in vendas:
        writer.writerow([v.id, v.event_id, v.quantity, v.total_value, v.payment_type, v.created_at])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=relatorio_vendas.csv"}
    )