from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginUserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    must_change_password: bool


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: LoginUserResponse
