"""
Script para resetar a senha do administrador
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from app.database import SessionLocal
from app.models.user import User
from app.models.purchase import Purchase
from app.models.event import Event
from app.services.user_service import get_password_hash

def resetar_senha():
    db = SessionLocal()
    
    try:
        # Buscar o admin
        admin = db.query(User).filter(User.username == "admin").first()
        
        if not admin:
            print("❌ Usuário 'admin' não encontrado!")
            return
        
        print("✅ Usuário 'admin' encontrado!")
        print(f"📧 Email: {admin.email}")
        print(f"🎭 Tipo: {admin.user_type}")
        
        # Nova senha
        nova_senha = "Admin@123"
        
        # Atualizar senha
        admin.hashed_password = get_password_hash(nova_senha)
        db.commit()
        
        print("\n" + "="*50)
        print("✅ SENHA ATUALIZADA COM SUCESSO!")
        print("="*50)
        print(f"👤 Usuário: admin")
        print(f"🔑 Nova Senha: {nova_senha}")
        print("="*50)
        print("\n💡 Agora você pode fazer login com essa senha!")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    resetar_senha()
