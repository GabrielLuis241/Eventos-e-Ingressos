from sqlalchemy.orm import Session
import bcrypt
from app.models.user import User
from app.schemas.user import UserCreate
from fastapi import HTTPException

def get_password_hash(password: str) -> str:
    """Transforma a password em texto limpo num hash seguro."""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a password digitada corresponde ao hash guardado."""
    pwd_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

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
        hashed_password=hashed_pwd,
        user_type=user_data.user_type  # Agora inclui o tipo de usuário
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()