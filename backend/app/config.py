from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import validator
from typing import List, Union, Optional

class Settings(BaseSettings):
    APP_NAME: str = "InvoiceGenerator"
    APP_ENV: str = "development"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str

    # Redis
    REDIS_URL: str

    # Email
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = "noreply@invoicegenerator.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = ""

    # File Storage
    STORAGE_BACKEND: str = "local"
    PDF_STORAGE_PATH: str = "./storage/pdfs"

    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]
    @validator("ALLOWED_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        return ["*"]

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
