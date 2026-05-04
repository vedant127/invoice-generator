from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..dependencies import get_current_user
from ..models.user import User
from ..schemas.user import UserOut, UserUpdate
from ..services.auth_service import hash_password

router = APIRouter()

@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserOut)
async def update_me(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_data = user_in.model_dump(exclude_unset=True)
    
    if "password" in user_data:
        user_data["hashed_password"] = hash_password(user_data.pop("password"))
        
    for field, value in user_data.items():
        setattr(current_user, field, value)
        
    await db.commit()
    await db.refresh(current_user)
    return current_user

