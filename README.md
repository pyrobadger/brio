# LeadFlow CRM

A production-quality full-stack Lead Management CRM for small businesses, built with React, Express, Prisma, and PostgreSQL (Supabase).

![LeadFlow CRM](https://img.shields.io/badge/LeadFlow-CRM-7C3AED?style=for-the-badge)

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                   Frontend                    │
│         React + Vite + TypeScript             │
│      Tailwind CSS v4 + Framer Motion          │
│    React Query + React Hook Form + Zod        │
│                 Port: 5173                    │
└────────────────────┬─────────────────────────┘
                     │  /api proxy
┌────────────────────▼─────────────────────────┐
│                   Backend                     │
│         Express + TypeScript                  │
│    Controller → Service → Repository          │
│    Zod Validation + Helmet + Rate Limiting    │
│                 Port: 3001                    │
└────────────────────┬─────────────────────────┘
                     │  Prisma ORM
┌────────────────────▼─────────────────────────┐
│                  Database                     │
│            PostgreSQL (Supabase)              │
│         Lead table with indexes               │
└──────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase project (or any PostgreSQL database)

### 1. Clone and Setup

```bash
git clone <repo-url>
cd crm-assignment
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file with your database URL
cp .env.example .env
# Edit .env with your Supabase password

# Push schema to database
npx prisma db push

# Seed the database with sample data
npm run db:seed

# Start the dev server
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install

# Start the dev server (proxies /api to backend)
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | *required* |
| `PORT` | Backend server port | `3001` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

## 📡 API Documentation

### Base URL: `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/leads` | Create a new lead |
| `GET` | `/leads` | List leads (paginated, sortable, filterable) |
| `GET` | `/leads/search?q=` | Search leads by name, email, company |
| `GET` | `/leads/stats` | Get KPI statistics |
| `GET` | `/leads/companies` | Get distinct company names |
| `GET` | `/leads/:id` | Get a single lead |
| `PUT` | `/leads/:id` | Update a lead |
| `DELETE` | `/leads/:id` | Delete a lead |

### Query Parameters (GET /leads)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page (max 100) |
| `sortBy` | string | `createdAt` | Sort field: name, company, status, createdAt |
| `sortOrder` | string | `desc` | Sort direction: asc, desc |
| `status` | string | — | Filter by status: New, Contacted, Qualified, Converted, Lost |
| `company` | string | — | Filter by company name |

### Request Example (POST /leads)

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "company": "Acme Inc",
  "status": "New",
  "notes": "Interested in demo"
}
```

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Lead created successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🎨 Design System

The UI is inspired by [jace.ai](https://jace.ai) with a soft-tech, pastel color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Lilac | `#D1C2F4` | Primary accents |
| Pink | `#EDC2E7` | Secondary highlights |
| Yellow | `#FFDC61` | Notifications, emphasis |
| Sazerac | `#FFF6E4` | Warm backgrounds |
| Dark | `#1B1B1B` | Text, headings |

**Typography**: Inter (body) + Outfit (headings)

## 📂 Project Structure

```
crm-assignment/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/     # StatCard, StatusChart, RecentActivity
│   │   │   ├── layout/        # AppLayout (sidebar + nav)
│   │   │   ├── leads/         # LeadTable, LeadCardList, LeadForm, LeadFilters
│   │   │   └── ui/            # Button, Input, Modal, Badge, Pagination, etc.
│   │   ├── hooks/             # useLeads, useLeadMutations, useDebounce
│   │   ├── lib/               # Constants, config
│   │   ├── pages/             # Dashboard, CreateLead, EditLead
│   │   ├── schemas/           # Zod validation schemas
│   │   ├── services/          # API service layer
│   │   └── types/             # TypeScript interfaces
│   └── ...
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middlewares/        # Error handler, rate limiter
│   │   ├── repositories/      # Prisma data access
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Prisma client, response formatter
│   │   └── validators/        # Zod schemas
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Sample data
│   └── ...
└── README.md
```

## 🔒 Security

- **Helmet** — HTTP security headers
- **CORS** — Configured for frontend origin
- **Rate Limiting** — 100 req/15min (general), 30 req/15min (writes)
- **Input Validation** — Zod schemas on both frontend and backend
- **Input Sanitization** — Zod trim/lowercase transforms

## 🚢 Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend → Digital Ocean

```bash
cd server
npm run build
# Set environment variables on the server
npm start
```

### Database → Supabase

Schema is managed via Prisma. Push changes with:

```bash
cd server
npx prisma db push
```

## 📄 License

MIT
