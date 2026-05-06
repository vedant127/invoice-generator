from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserOut, Token, SocialLoginRequest
from ..services.auth_service import hash_password, verify_password, create_access_token, create_refresh_token
import uuid

router = APIRouter()

@router.get("/health")
async def auth_health():
    return {"status": "auth service is up"}

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Check if user exists
        result = await db.execute(select(User).where(User.email == user_in.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        new_user = User(
            email=user_in.email,
            hashed_password=hash_password(user_in.password),
            full_name=user_in.full_name,
            business_name=user_in.business_name,
            role=user_in.role
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except Exception as e:
        await db.rollback()
        # Detailed error for debugging
        raise HTTPException(status_code=500, detail=f"Registration Error: {str(e)}")

@router.post("/social-login", response_model=Token)
async def social_login(social_in: SocialLoginRequest, db: AsyncSession = Depends(get_db)):
    # Check if user exists by email
    result = await db.execute(select(User).where(User.email == social_in.email))
    user = result.scalar_one_or_none()
    
    if not user:
        # Create new user for social login
        # We use a random password for social users since they'll login via OAuth
        random_password = str(uuid.uuid4())
        user = User(
            email=social_in.email,
            full_name=social_in.full_name,
            hashed_password=hash_password(random_password),
            is_verified=True # Social logins are typically pre-verified
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
        "token_type": "bearer",
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
        "token_type": "bearer",
    }
