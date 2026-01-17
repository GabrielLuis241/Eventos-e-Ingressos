from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String) # Nunca guardamos a password em texto limpo!
    user_type = Column(String, default="cliente") # "cliente" ou "organizador"

    # Relacionamento: Um utilizador tem várias compras
    purchases = relationship("Purchase", back_populates="user")