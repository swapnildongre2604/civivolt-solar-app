# CIVIVOLT ERP + CRM + GST Billing Suite

Production-ready full-stack starter for **CIVIVOLT Infrastructure Pvt Ltd** with CRM, ERP, GST billing, accounts, and analytics.

## Tech stack
- Frontend: React + Tailwind (Vite)
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT + role-based access (Admin, Manager, Staff)
- Deployment: Docker + docker-compose

## Folder structure
```
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   └── utils
│   ├── sql
│   │   ├── schema.sql
│   │   └── seed.sql
│   └── Dockerfile
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   └── pages
│   └── Dockerfile
└── docker-compose.yml
```

## Core modules implemented
### CRM
- Lead management CRUD
- Customer database CRUD
- Follow-up field support (`follow_up_date`)
- Sales pipeline signal via lead status and dashboard stats

### ERP
- Project management (civil/electrical/solar)
- Task assignment (`tasks.assigned_to`)
- Inventory/material tracking
- Vendor management

### GST Billing
- Create invoices (B2B/B2C)
- Auto tax split (CGST/SGST for intra-state, IGST for inter-state)
- Invoice PDF download endpoint
- HSN/SAC line item support
- GST report summary endpoint (monthly)
- Excel export for summary
- Customer GSTIN support
- Email invoice trigger endpoint

### Accounts
- Payment tracking
- Expense management
- Profit/Loss via dashboard aggregation

### Dashboard
- Won deals KPI
- Project status chart
- Revenue/expense/profit cards

## API routes
- `POST /api/auth/login`
- CRUD: `/api/leads`, `/api/customers`, `/api/projects`, `/api/tasks`, `/api/inventory`, `/api/vendors`, `/api/payments`, `/api/expenses`
- Billing: 
  - `POST /api/invoices`
  - `GET /api/invoices/:id/pdf`
  - `GET /api/invoices/summary`
  - `GET /api/invoices/export/excel`
  - `POST /api/invoices/email`
- Dashboard: `GET /api/dashboard`

## Quick start (Docker)
```bash
docker compose up --build
```
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`
- DB: `localhost:5432`

## Quick start (without Docker)
### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Sample login
A seeded admin user is included:
- Email: `admin@civivolt.com`
- Password hash in seed file corresponds to `admin123`

## Notes
- This is a strong scaffold and can be extended with stricter validation, audit logs, queue-based emailing, reminder jobs, and advanced AI modules (lead scoring/chat assistant/predictive analytics).
