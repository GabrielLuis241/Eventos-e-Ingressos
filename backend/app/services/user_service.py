from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models.user import User
from app.schemas.user import UserCreate
from fastapi import HTTPException

# Configuração da criptografia
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    """Transforma a password em texto limpo num hash seguro."""
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    """Verifica se a password digitada corresponde ao hash guardado."""
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, user_data: UserCreate):
    # 1. Verificar se o email já está registado
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Este email já está registado.")
    
    # 2. Verificar se o username já existe
    db_username = db.query(User).filter(User.username == user_data.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail="Este nome de utilizador já está em uso.")

    # 3. Criar o hash da password
    hashed_pwd = get_password_hash(user_data.password)

    # 4. Salvar na base de dados
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pwd
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()