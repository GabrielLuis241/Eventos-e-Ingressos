"""
Script para criar usuário administrador padrão
Execute: python create_default_admin.py
"""
import sys
import io

# Forçar UTF-8 para Windows (evitar erro de encoding com emojis)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.purchase import Purchase  # Importar para resolver relacionamento
from app.models.event import Event  # Importar para resolver relacionamento
from app.services.user_service import get_password_hash
from sqlalchemy.orm import Session

# Credenciais do admin padrão
DEFAULT_ADMIN = {
    "username": "admin",
    "email": "admin@eventos.com",
    "password": "Admin@123",
    "user_type": "organizador"
}

def create_admin(db: Session):
    """Cria ou atualiza o usuário admin padrão"""
    
    # Verifica se já existe
    existing_admin = db.query(User).filter(User.username == DEFAULT_ADMIN["username"]).first()
    
    if existing_admin:
        print(f"⚠️  Admin '{DEFAULT_ADMIN['username']}' já existe!")
        print(f"📧 Email: {existing_admin.email}")
        print(f"👤 Tipo: {existing_admin.user_type}")
        
        # Atualizar senha se necessário
        resposta = input("\n🔄 Deseja resetar a senha? (s/n): ")
        if resposta.lower() == 's':
            existing_admin.hashed_password = get_password_hash(DEFAULT_ADMIN["password"])
            db.commit()
            print("✅ Senha resetada com sucesso!")
        return existing_admin
    
    # Criar novo admin
    hashed_pwd = get_password_hash(DEFAULT_ADMIN["password"])
    
    new_admin = User(
        username=DEFAULT_ADMIN["username"],
        email=DEFAULT_ADMIN["email"],
        hashed_password=hashed_pwd,
        user_type=DEFAULT_ADMIN["user_type"]
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    print("\n" + "="*50)
    print("✅ ADMIN PADRÃO CRIADO COM SUCESSO!")
    print("="*50)
    print(f"👤 Usuário: {DEFAULT_ADMIN['username']}")
    print(f"📧 Email: {DEFAULT_ADMIN['email']}")
    print(f"🔑 Senha: {DEFAULT_ADMIN['password']}")
    print(f"🎭 Tipo: {DEFAULT_ADMIN['user_type']}")
    print("="*50)
    print("\n⚠️  IMPORTANTE: Compartilhe essas credenciais com sua equipe!")
    print("💡 Recomendação: Após o primeiro login, altere a senha.\n")
    
    return new_admin

def main():
    print("\n🚀 Iniciando criação do administrador padrão...\n")
    
    # Criar todas as tabelas
    Base.metadata.create_all(bind=engine)
    
    # Criar sessão
    db = SessionLocal()
    
    try:
        admin = create_admin(db)
        print(f"✅ Processo concluído! ID do admin: {admin.id}\n")
    except Exception as e:
        print(f"❌ Erro ao criar admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
