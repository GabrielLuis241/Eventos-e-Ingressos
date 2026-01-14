from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import public_events, purchases, tickets, admin_events, reports, auth # Importado auth

# Cria as tabelas no banco de dados (incluindo a nova tabela de usuários)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MVP Eventos")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro das rotas
app.include_router(auth.router) # Rota de Login e Registro adicionada
app.include_router(public_events.router)
app.include_router(purchases.router)
app.include_router(tickets.router)
app.include_router(admin_events.router)
app.include_router(reports.router)