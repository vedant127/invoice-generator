# 📄 PRD — Invoice Generator (Backend API)

> **Project:** Invoice Generator  
> **Type:** Backend API Only  
> **Framework:** Python + FastAPI  
> **Version:** v1.0.0  
> **Status:** In Progress  

---

## 1. Project Overview

**Invoice Generator** is a production-grade RESTful backend API built with **Python + FastAPI**. It provides a complete invoicing infrastructure for businesses and freelancers. The API is designed to be consumed by any frontend (React, Vue, mobile, etc.) in the future.

The system covers the full invoice lifecycle — from user registration, client management, invoice creation, PDF generation, payment tracking, to reports.

---

## 2. Goals

- Build a complete API-first invoicing backend with no frontend dependency
- Enable full invoice lifecycle management via REST endpoints
- Support multi-user environments with proper JWT-based auth
- Generate professional PDF invoices programmatically (async)
- Make future frontend integration effortless with consistent, documented APIs
- Be deployable via Docker in any cloud or on-premises environment

---

## 3. Out of Scope (v1)

- No frontend / UI (pure backend service)
- No payment gateway (Stripe/Razorpay) in v1
- No mobile SDK
- No multi-currency conversion (single currency per invoice)

---

## 4. Target Users

| Persona | Description | Needs |
|---|---|---|
| Freelancer | Solo developer, designer, or consultant | Quick invoice creation, PDF download, payment tracking |
| Business Owner | Small/medium business with multiple clients | Multi-user, recurring invoices, tax management |
| Developer / Integrator | Frontend dev consuming this API | Clear docs, consistent responses, sandbox/test env |

---

## 5. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Language | Python 3.11+ | Core runtime |
| Framework | FastAPI | ASGI, auto OpenAPI docs, async routes |
| ORM | SQLAlchemy 2.0 | Async ORM for PostgreSQL |
| Migrations | Alembic | Database schema versioning |
| Database | PostgreSQL 15+ | Primary data store |
| Cache / Queue | Redis 7+ | Token blacklist, rate limiting, task queue |
| Task Queue | Celery + Redis | Async PDF generation, email sending |
| Auth | python-jose + passlib | JWT signing, bcrypt password hashing |
| PDF Engine | WeasyPrint | HTML-to-PDF invoice generation |
| Validation | Pydantic v2 | Request/response schema validation |
| Testing | pytest + httpx | Unit, integration, async endpoint tests |
| Containers | Docker + Docker Compose | Dev and production environment |
| API Docs | Swagger UI (built-in) | Auto-generated via FastAPI |
| Logging | structlog | Structured JSON logging |
| Settings | pydantic-settings | Environment variable management |

---

## 6. Project Folder Structure

```
invoice-generator/
├── app/
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Settings via pydantic-settings
│   ├── database.py              # Async SQLAlchemy engine & session
│   ├── dependencies.py          # Shared DI (auth, db session)
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── invoice.py
│   │   ├── client.py
│   │   ├── item.py
│   │   └── payment.py
│   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── user.py
│   │   ├── invoice.py
│   │   ├── client.py
│   │   └── payment.py
│   ├── routers/                 # FastAPI APIRouter modules
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── invoices.py
│   │   ├── clients.py
│   │   ├── items.py
│   │   ├── payments.py
│   │   └── reports.py
│   ├── services/                # Business logic layer
│   │   ├── auth_service.py
│   │   ├── invoice_service.py
│   │   ├── pdf_service.py
│   │   ├── email_service.py
│   │   └── tax_service.py
│   ├── tasks/                   # Celery async tasks
│   │   ├── celery_app.py
│   │   └── pdf_tasks.py
│   └── utils/                   # Helpers & utilities
│       ├── pagination.py
│       ├── exceptions.py
│       └── logger.py
├── alembic/                     # Database migrations
├── tests/                       # pytest test suite
│   ├── test_auth.py
│   ├── test_invoices.py
│   ├── test_clients.py
│   └── test_payments.py
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
├── pyproject.toml
├── requirements.txt
└── README.md
```

---

## 7. Database Schema

### 7.1 users

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Primary key, auto-generated |
| email | VARCHAR(255) | Yes | Unique, used for login |
| hashed_password | TEXT | Yes | bcrypt hashed — never plain |
| full_name | VARCHAR(255) | Yes | Display name |
| business_name | VARCHAR(255) | No | Company name for invoices |
| role | ENUM | Yes | admin / owner / member |
| is_active | BOOLEAN | Yes | Soft enable/disable |
| is_verified | BOOLEAN | Yes | Email verification status |
| created_at | TIMESTAMP | Yes | Auto UTC |
| updated_at | TIMESTAMP | Yes | Auto-updated |

### 7.2 clients

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Primary key |
| user_id | UUID (FK) | Yes | FK → users.id |
| name | VARCHAR(255) | Yes | Client / company name |
| email | VARCHAR(255) | Yes | Billing email |
| phone | VARCHAR(50) | No | Contact number |
| address | TEXT | No | Full billing address |
| city | VARCHAR(100) | No | City |
| state | VARCHAR(100) | No | State / Province |
| country | VARCHAR(100) | No | Country (ISO code) |
| postal_code | VARCHAR(20) | No | ZIP / Postal code |
| gstin | VARCHAR(50) | No | GST Identification Number |
| notes | TEXT | No | Internal notes |
| created_at | TIMESTAMP | Yes | Auto UTC |

### 7.3 invoices

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Primary key |
| invoice_number | VARCHAR(50) | Yes | Unique per user — e.g. INV-2025-001 |
| user_id | UUID (FK) | Yes | FK → users.id |
| client_id | UUID (FK) | Yes | FK → clients.id |
| status | ENUM | Yes | draft / sent / viewed / paid / overdue / cancelled |
| issue_date | DATE | Yes | Invoice issue date |
| due_date | DATE | Yes | Payment due date |
| currency | VARCHAR(10) | Yes | e.g. INR, USD, EUR |
| subtotal | NUMERIC(12,2) | Yes | Sum of all line items |
| discount_type | ENUM | No | flat / percentage |
| discount_value | NUMERIC(10,2) | No | Discount amount or % |
| discount_amount | NUMERIC(12,2) | No | Calculated discount |
| tax_rate | NUMERIC(5,2) | No | Tax % — e.g. 18.00 for GST |
| tax_amount | NUMERIC(12,2) | No | Calculated tax |
| total_amount | NUMERIC(12,2) | Yes | subtotal - discount + tax |
| notes | TEXT | No | Payment terms, visible on PDF |
| footer_text | TEXT | No | e.g. "Thank you for your business!" |
| pdf_url | TEXT | No | Path or cloud URL of generated PDF |
| viewed_at | TIMESTAMP | No | When client first viewed invoice |
| created_at | TIMESTAMP | Yes | Auto UTC |
| updated_at | TIMESTAMP | Yes | Auto-updated |

### 7.4 invoice_items

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Primary key |
| invoice_id | UUID (FK) | Yes | FK → invoices.id |
| description | TEXT | Yes | Product / service description |
| quantity | NUMERIC(10,2) | Yes | Quantity of units |
| unit | VARCHAR(50) | No | e.g. hrs, days, pcs |
| unit_price | NUMERIC(12,2) | Yes | Price per unit |
| amount | NUMERIC(12,2) | Yes | Computed: quantity × unit_price |
| sort_order | INTEGER | No | Display order on invoice |

### 7.5 payments

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID | Yes | Primary key |
| invoice_id | UUID (FK) | Yes | FK → invoices.id |
| amount_paid | NUMERIC(12,2) | Yes | Amount received |
| payment_date | DATE | Yes | Date payment received |
| payment_method | VARCHAR(100) | No | Bank Transfer, UPI, Cash, Cheque |
| transaction_ref | VARCHAR(255) | No | Transaction ID / reference |
| notes | TEXT | No | Internal notes |
| created_at | TIMESTAMP | Yes | Auto UTC |

---

## 8. API Endpoints

### 8.1 Auth — `/api/v1/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/v1/auth/register | Register new user account | No |
| POST | /api/v1/auth/login | Login, receive access + refresh tokens | No |
| POST | /api/v1/auth/refresh | Exchange refresh token for new access token | No |
| POST | /api/v1/auth/logout | Invalidate JWT (Redis blacklist) | Yes |
| POST | /api/v1/auth/verify-email | Verify email with token from link | No |
| POST | /api/v1/auth/forgot-password | Request password reset email | No |
| POST | /api/v1/auth/reset-password | Reset password using secure token | No |

### 8.2 Users — `/api/v1/users`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/v1/users/me | Get current user profile | Yes |
| PUT | /api/v1/users/me | Update profile & business info | Yes |
| PUT | /api/v1/users/me/password | Change password (requires current password) | Yes |
| DELETE | /api/v1/users/me | Soft-delete / deactivate account | Yes |
| GET | /api/v1/users/me/stats | Invoice summary and earnings stats | Yes |

### 8.3 Clients — `/api/v1/clients`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/v1/clients | List clients (paginated, filterable, searchable) | Yes |
| POST | /api/v1/clients | Create a new client | Yes |
| GET | /api/v1/clients/{client_id} | Get client by ID | Yes |
| PUT | /api/v1/clients/{client_id} | Update client details | Yes |
| DELETE | /api/v1/clients/{client_id} | Delete client (blocked if has invoices) | Yes |
| GET | /api/v1/clients/{client_id}/invoices | List all invoices for a client | Yes |

### 8.4 Invoices — `/api/v1/invoices`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/v1/invoices | List invoices (paginated, filters, sorting) | Yes |
| POST | /api/v1/invoices | Create invoice with line items | Yes |
| GET | /api/v1/invoices/{invoice_id} | Get full invoice with items + payments | Yes |
| PUT | /api/v1/invoices/{invoice_id} | Update invoice (draft only) | Yes |
| DELETE | /api/v1/invoices/{invoice_id} | Delete invoice (draft only) | Yes |
| PATCH | /api/v1/invoices/{invoice_id}/status | Update invoice status | Yes |
| POST | /api/v1/invoices/{invoice_id}/send | Mark as sent + email to client | Yes |
| POST | /api/v1/invoices/{invoice_id}/duplicate | Duplicate as new draft | Yes |
| GET | /api/v1/invoices/{invoice_id}/pdf | Download generated PDF | Yes |
| POST | /api/v1/invoices/{invoice_id}/pdf/regenerate | Force regenerate PDF (async) | Yes |

### 8.5 Invoice Items — `/api/v1/invoices/{id}/items`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/v1/invoices/{invoice_id}/items | List all line items | Yes |
| POST | /api/v1/invoices/{invoice_id}/items | Add a line item | Yes |
| PUT | /api/v1/invoices/{invoice_id}/items/{item_id} | Update a line item | Yes |
| DELETE | /api/v1/invoices/{invoice_id}/items/{item_id} | Remove a line item | Yes |

### 8.6 Payments — `/api/v1/invoices/{id}/payments`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/v1/invoices/{invoice_id}/payments | List all payments for invoice | Yes |
| POST | /api/v1/invoices/{invoice_id}/payments | Record a new payment | Yes |
| GET | /api/v1/invoices/{invoice_id}/payments/{payment_id} | Get payment details | Yes |
| DELETE | /api/v1/invoices/{invoice_id}/payments/{payment_id} | Delete a payment record | Yes |

### 8.7 Reports — `/api/v1/reports`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/v1/reports/summary | Revenue: total, paid, unpaid, overdue | Yes |
| GET | /api/v1/reports/by-client | Revenue breakdown by client | Yes |
| GET | /api/v1/reports/by-month | Monthly revenue trend over date range | Yes |
| GET | /api/v1/reports/overdue | List overdue invoices with days overdue | Yes |
| GET | /api/v1/reports/export | Export data as CSV (async task) | Yes |

---

## 9. Request / Response Examples

### Create Invoice — POST /api/v1/invoices

**Request Body:**
```json
{
  "client_id": "uuid-of-client",
  "issue_date": "2025-01-15",
  "due_date": "2025-02-15",
  "currency": "INR",
  "discount_type": "percentage",
  "discount_value": 10.0,
  "tax_rate": 18.0,
  "notes": "Payment due within 30 days.",
  "footer_text": "Thank you for your business!",
  "items": [
    {
      "description": "Website Design & Development",
      "quantity": 1,
      "unit": "project",
      "unit_price": 50000.00
    },
    {
      "description": "SEO Optimization",
      "quantity": 3,
      "unit": "months",
      "unit_price": 8000.00
    }
  ]
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "inv-uuid-here",
    "invoice_number": "INV-2025-001",
    "status": "draft",
    "client": {
      "id": "client-uuid",
      "name": "Ravi Sharma",
      "email": "ravi@example.com"
    },
    "issue_date": "2025-01-15",
    "due_date": "2025-02-15",
    "currency": "INR",
    "subtotal": 74000.00,
    "discount_amount": 7400.00,
    "tax_amount": 11988.00,
    "total_amount": 78588.00,
    "items": [],
    "pdf_url": null,
    "created_at": "2025-01-15T10:30:00Z"
  },
  "message": "Invoice created successfully"
}
```

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "due_date", "message": "due_date must be after issue_date" },
      { "field": "items", "message": "At least one line item is required" }
    ]
  }
}
```

---

## 10. Invoice Status — State Machine

```
draft → sent → viewed → paid
  ↓                       ↑
cancelled            (partial payments)
  
overdue (auto-set when due_date passed and status != paid)
```

- Only **draft** invoices can be edited or deleted
- System auto-sets **overdue** when due_date passes and invoice is unpaid
- Invoice auto-sets to **paid** when total_payments >= total_amount

---

## 11. Authentication Flow

1. User calls `POST /api/v1/auth/login` with email + password
2. Server validates credentials → returns `access_token` (30 min) + `refresh_token` (7 days)
3. Client sends `Authorization: Bearer <access_token>` on every protected request
4. When access token expires → call `POST /api/v1/auth/refresh` with refresh token
5. On logout → access token added to Redis blacklist until natural expiry

---

## 12. Security Controls

| Control | Implementation |
|---|---|
| Password Storage | bcrypt cost factor 12 — never plain or MD5 |
| Transport | HTTPS only in production + HSTS header |
| Rate Limiting | slowapi — 100 req/min auth, 300 req/min general |
| CORS | Strict allowlist — only whitelisted origins |
| SQL Injection | SQLAlchemy ORM parameterized queries only |
| Input Validation | Pydantic v2 strict mode on all request bodies |
| Token Blacklist | Redis TTL-based blacklist for invalidated JWTs |
| Secrets | All via environment variables — never hardcoded |
| Audit Logging | All write ops logged with user_id, IP, timestamp |
| Data Ownership | Row-level — users access only their own data |

---

## 13. Non-Functional Requirements

| Category | Target | Notes |
|---|---|---|
| Response Time | < 200ms avg | Async SQLAlchemy + Redis caching |
| PDF Generation | < 5 seconds | Celery async task |
| Scalability | 10,000+ users | Stateless API — horizontal scaling |
| Availability | 99.9% uptime | Docker with health checks + auto-restart |
| Test Coverage | > 80% | pytest unit + integration + E2E |
| Documentation | 100% endpoints | Swagger UI auto-generated by FastAPI |
| Logging | Structured JSON | structlog + request ID per call |

---

## 14. Python Dependencies

```txt
# requirements.txt

# Web Framework
fastapi==0.111.0
uvicorn[standard]==0.30.1

# Database
sqlalchemy==2.0.30
asyncpg==0.29.0
alembic==1.13.1

# Validation & Settings
pydantic==2.7.1
pydantic-settings==2.2.1
python-dotenv==1.0.1

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9

# Cache & Queue
redis==5.0.4
celery==5.4.0

# PDF Generation
weasyprint==61.2

# Email
fastapi-mail==1.4.1

# Rate Limiting
slowapi==0.1.9

# HTTP & Utils
httpx==0.27.0
python-dateutil==2.9.0

# Logging
structlog==24.1.0

# Testing
pytest==8.2.0
pytest-asyncio==0.23.6
pytest-cov==5.0.0
```

---

## 15. Environment Variables

```env
# .env.example

# App
APP_NAME=InvoiceGenerator
APP_ENV=development
SECRET_KEY=your-very-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/invoicedb

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your-email-password
MAIL_FROM=noreply@invoicegenerator.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com

# File Storage
STORAGE_BACKEND=local
PDF_STORAGE_PATH=./storage/pdfs

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

---

## 16. Development Milestones

| Phase | Timeline | Deliverables |
|---|---|---|
| Phase 1 | Week 1–2 | Project scaffold, DB models, Alembic migrations, Docker Compose |
| Phase 2 | Week 2–3 | Auth module: register, login, JWT, refresh, logout, email verify |
| Phase 3 | Week 3–4 | Client CRUD with pagination, search, filters |
| Phase 4 | Week 4–6 | Invoice CRUD, line items, auto-calculation, status state machine |
| Phase 5 | Week 6–7 | PDF generation (WeasyPrint), Celery async tasks, file storage |
| Phase 6 | Week 7–8 | Payment tracking, auto-status update logic |
| Phase 7 | Week 8–9 | Reports & analytics, CSV export |
| Phase 8 | Week 9–10 | Full test suite (>80% coverage), API docs review |
| Phase 9 | Week 10–11 | Security hardening: rate limiting, CORS, audit logging |
| Phase 10 | Week 11–12 | Production Docker image + CI/CD pipeline (GitHub Actions) |

---

## 17. Future Roadmap (v2+)

| Feature | Description |
|---|---|
| Payment Gateway | Stripe / Razorpay for direct online payments |
| Multi-Currency | Real-time currency conversion |
| Recurring Invoices | Scheduled auto-generation of repeat invoices |
| Team & Roles | Invite members with viewer / editor / admin roles |
| Client Portal | Shareable link for client to view/download invoice |
| Webhook Events | HTTP webhooks on invoice status changes |
| Tax Profiles | Pre-saved GST/VAT rate configurations |
| Expense Tracking | Link expenses to projects for P&L reports |

---

> **Invoice Generator Backend API — PRD v1.0.0**  
> Built with Python + FastAPI  
> This document is the single source of truth for backend development.
