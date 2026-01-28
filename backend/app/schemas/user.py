from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime # Adicionado para suportar datas

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    user_type: Optional[str] = "cliente"

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    user_type: str
    # Adicionamos created_at como opcional para evitar o erro de validação
    created_at: Optional[datetime] = None 

    class Config:
        from_attributes = True