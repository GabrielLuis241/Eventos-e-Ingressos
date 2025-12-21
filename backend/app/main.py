from fastapi import FastAPI
from app.database import Base, engine
from app.routes import public_events, purchases, tickets, admin_events, reports

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MVP Eventos")

app.include_router(public_events.router)
app.include_router(purchases.router)
app.include_router(tickets.router)
app.include_router(admin_events.router)
app.include_router(reports.router)
