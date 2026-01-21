from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # NOVO: Necessário para servir imagens
import os

from app.database import Base, engine
from app import models 
from app.routes import public_events, purchases, tickets, admin_events, reports, auth

# Cria as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MVP Eventos")

# --- CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS ---
# Cria a pasta static/uploads se ela não existir para evitar erros
if not os.path.exists("static/uploads"):
    os.makedirs("static/uploads")

# Monta a pasta para que as imagens sejam acessíveis via URL (ex: http://localhost:8000/static/uploads/foto.jpg)
app.mount("/static", StaticFiles(directory="static"), name="static")
# ------------------------------------------

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro das rotas
app.include_router(auth.router)
app.include_router(public_events.router)
app.include_router(purchases.router)
app.include_router(tickets.router)
app.include_router(admin_events.router)
app.include_router(reports.router)