from app.database import SessionLocal, engine
from app.models.user import User
from app.models.event import Event
from app.models.purchase import Purchase
from app.models.ticket import Ticket

def clear_tables():
    db = SessionLocal()
    try:
        print("🧹 Limpando tabelas...")
        # A ordem importa por causa das chaves estrangeiras (Foreign Keys)
        db.query(Ticket).delete()
        db.query(Purchase).delete()
        db.query(Event).delete()
        db.query(User).delete()
        
        db.commit()
        print("✅ Banco de dados limpo com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao limpar: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_tables()