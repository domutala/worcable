from pydantic import BaseModel, EmailStr
from typing import List, Optional


class CVParseResponse(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    skills: List[str] = []
    experience: List[str] = []
    education: List[str] = []
