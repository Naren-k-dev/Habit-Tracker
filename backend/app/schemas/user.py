from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# ==========================================
# CHANGE PASSWORD
# ==========================================

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(
        min_length=1
    )

    new_password: str = Field(
        min_length=6
    )


class MessageResponse(BaseModel):
    message: str