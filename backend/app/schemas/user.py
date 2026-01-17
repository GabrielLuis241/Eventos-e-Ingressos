from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    user_type: Optional[str] = "cliente"  # "cliente" ou "organizador"

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    user_type: str

    class Config:
        from_attributes = True