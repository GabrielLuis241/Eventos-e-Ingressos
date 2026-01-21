from fastapi import APIRouter, Depends, HTTPException, Response, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import Optional, List
import io
import csv
from fpdf import FPDF
from app.database import SessionLocal
from app.models.purchase import Purchase
from app.models.ticket import Ticket
from app.models.event import Event
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["Relatórios Avançados"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Classe PDF Customizada ---
class PDFReport(FPDF):
    def header(self):
        self.set_font("Arial", "B", 16)
        self.cell(0, 10, "Relatorio de Performance de Eventos", border=False, ln=True, align="C")
        self.set_font("Arial", "I", 8)
        self.cell(0, 5, f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M')}", ln=True, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Pagina {self.page_no()}", align="C")

# --- Utilitário para Filtro de Tempo ---
def filtrar_por_periodo(query, model_attr, periodo: str):
    hoje = datetime.utcnow()
    if periodo == "7d":
        return query.filter(model_attr >= hoje - timedelta(days=7))
    elif periodo == "30d":
        return query.filter(model_attr >= hoje - timedelta(days=30))
    return query

# --- 1. DASHBOARD E GRÁFICOS (US15) ---

@router.get("/performance-graficos")
def obter_dados_graficos(
    event_id: Optional[int] = None, 
    periodo: str = Query("30d", enum=["7d", "30d", "all"]),
    db: Session = Depends(get_db)
):
    """ Retorna rendimento diário e volume para gráficos de linha/barra """
    query = db.query(
        func.date(Purchase.created_at).label("data"),
        func.sum(Purchase.total_value).label("ganhos"),
        func.count(Purchase.id).label("vendas_qtd")
    ).filter(Purchase.status == "pago")

    if event_id:
        query = query.filter(Purchase.event_id == event_id)
    
    query = filtrar_por_periodo(query, Purchase.created_at, periodo)
    resultados = query.group_by(func.date(Purchase.created_at)).order_by("data").all()

    return [{"data": str(r.data), "ganhos": float(r.ganhos), "vendas": r.vendas_qtd} for r in resultados]

@router.get("/analise-lucro-perda/{event_id}")
def analise_detalhada_evento(event_id: int, db: Session = Depends(get_db)):
    """ US11: Analisa ocupação e perda financeira por ingressos não vendidos """
    evento = db.query(Event).filter(Event.id == event_id).first()
    if not evento:
        raise HTTPException(404, "Evento não encontrado")

    vendidos = db.query(func.count(Ticket.id)).filter(Ticket.event_id == event_id).scalar() or 0
    arrecadado = db.query(func.sum(Purchase.total_value)).filter(
        Purchase.event_id == event_id, Purchase.status == "pago"
    ).scalar() or 0.0
    
    vagas_restantes = max(0, evento.capacidade - vendidos)
    perda_potencial = vagas_restantes * evento.preco

    return {
        "evento": evento.name,
        "taxa_ocupacao": f"{(vendidos / evento.capacidade) * 100:.2f}%",
        "ganho_real": float(arrecadado),
        "perda_vagas_vazias": float(perda_potencial),
        "ingressos_totais": evento.capacidade,
        "ingressos_vendidos": vendidos
    }

# --- 2. EXPORTAÇÃO DINÂMICA (PDF & CSV) ---

@router.get("/exportar-pdf-avancado")
def exportar_pdf_custom(
    event_id: Optional[int] = None,
    periodo: str = Query("all", enum=["7d", "30d", "all"]),
    db: Session = Depends(get_db)
):
    """ Gera PDF filtrado por tempo ou evento específico """
    query = db.query(Purchase).filter(Purchase.status == "pago")
    
    titulo_relatorio = "Relatorio Geral de Vendas"
    if event_id:
        evento = db.query(Event).filter(Event.id == event_id).first()
        query = query.filter(Purchase.event_id == event_id)
        titulo_relatorio = f"Vendas: {evento.name}"
    
    query = filtrar_por_periodo(query, Purchase.created_at, periodo)
    vendas = query.order_by(Purchase.created_at.desc()).all()

    pdf = PDFReport()
    pdf.add_page()
    
    # Cabeçalho da Tabela
    pdf.set_font("Arial", "B", 10)
    pdf.set_fill_color(220, 230, 241)
    pdf.cell(35, 10, "Data", 1, 0, "C", True)
    pdf.cell(75, 10, "Comprador", 1, 0, "C", True)
    pdf.cell(30, 10, "Qtd", 1, 0, "C", True)
    pdf.cell(50, 10, "Valor Total", 1, 1, "C", True)

    pdf.set_font("Arial", "", 10)
    total_acumulado = 0
    for v in vendas:
        nome = v.user.username if v.user else "N/A"
        pdf.cell(35, 10, v.created_at.strftime("%d/%m/%Y"), 1)
        pdf.cell(75, 10, nome[:30], 1)
        pdf.cell(30, 10, str(v.quantity), 1, 0, "C")
        pdf.cell(50, 10, f"R$ {v.total_value:.2f}", 1, 1, "R")
        total_acumulado += v.total_value

    pdf.ln(5)
    pdf.set_font("Arial", "B", 12)
    pdf.cell(0, 10, f"RECEITA TOTAL DO PERIODO: R$ {total_acumulado:.2f}", align="R")

    return Response(
        content=pdf.output(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=relatorio_{periodo}.pdf"}
    )

@router.get("/dashboard-completo")
def obter_dashboard_completo(db: Session = Depends(get_db)):
    """ Mantido e otimizado para métricas rápidas """
    total_vendas = db.query(func.sum(Purchase.total_value)).filter(Purchase.status == "pago").scalar() or 0.0
    total_ingressos = db.query(func.count(Ticket.id)).scalar() or 0
    
    compras_recentes = db.query(Purchase).order_by(Purchase.created_at.desc()).limit(10).all()
    
    return {
        "total_receita": float(total_vendas),
        "total_tickets": total_ingressos,
        "recentes": [
            {"id": c.id, "usuario": c.user.username, "valor": c.total_value, "data": c.created_at} 
            for c in compras_recentes
        ]
    }