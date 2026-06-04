# Brio CRM

Brio is a production-quality, high-fidelity full-stack Lead Management CRM designed for small businesses. It features a modern, clean dashboard inspired by premium tech interfaces, built on top of a highly secure and scalable React + Express framework with Prisma and PostgreSQL.

> [!TIP]
> **Brio is LIVE!** 🚀    
>  Check it out here: **[[https://brio-gilt.vercel.app/](https://brio-gilt.vercel.app/)]**


![Brio CRM](https://img.shields.io/badge/Brio-CRM-0F5CF5?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Tailwind v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Express 5](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql)

---

## ✨ Features

- **📊 Modern KPI Dashboard**: Real-time stats cards summarizing total, new, qualified, and converted leads with interactive indicators.
- **📈 Interactive Timescale Analytics**: High-fidelity charts showing lead growth and acquisition trends across multiple timescales (`1 D`, `1 W`, `1 M`, `6 M`, `1 Y`, `ALL`).
- **📋 Lead Management Control Center**: Rich desktop table and responsive mobile card lists with sorting (by name, company, status, createdAt, email), inline status filtering, and custom page sizes.
- **🔍 Global Lead Search**: Instantly filter database leads across name, email, and company fields.
- **⚡ Production Ready**: Configured for rapid deployment with PM2 on VM/Droplets and built-in SPA routing rules for Vercel.
- **🛡️ Secure by Design**: Helmet security headers, CORS protection, custom rate limiters, strict schema-level input validation using Zod, and data sanitization.

---

## ✨ Visuals
**Dashboard Page**:
<img width="1915" height="942" alt="Screenshot 2026-06-04 105713" src="https://github.com/user-attachments/assets/4e0a3554-686d-4e62-8af3-e75a87941ad3" />

**CRM Database Page**:
<img width="1917" height="947" alt="Screenshot 2026-06-04 105730" src="https://github.com/user-attachments/assets/819fa8bf-f10a-45c0-b2c7-24770a037789" />

**Add Leads Page**:
<img width="1915" height="938" alt="Screenshot 2026-06-04 105740" src="https://github.com/user-attachments/assets/cf3318e0-626b-43b6-ad73-ad02c201721f" />

---
## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                   Frontend                    │
│         React 19 + Vite 8 + TypeScript        │
│      Tailwind CSS v4 + Framer Motion          │
│    React Query + React Hook Form + Zod        │
│                 Port: 5173                    │
└────────────────────┬─────────────────────────┘
                     │  /api proxy (dev) / VITE_API_URL (prod)
┌────────────────────▼─────────────────────────┐
│                   Backend                     │
│         Express 5 + TypeScript                │
│    Controller → Service → Repository          │
│    Zod Validation + Helmet + Rate Limiting    │
│                 Port: 3001                    │
└────────────────────┬─────────────────────────┘
                     │  Prisma ORM
┌────────────────────▼─────────────────────────┐
│                  Database                     │
│            PostgreSQL (Supabase)              │
│       Lead table with performance indexes     │
└──────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- A PostgreSQL database (e.g., Supabase, local PG instance)

### 1. Clone the Project

```bash
git clone https://github.com/pyrobadger/brio.git
cd brio
```

### 2. Backend Setup

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Set up environment variables. Copy the example file and update it with your database connection details:
   ```bash
   cp .env.example .env
   ```
3. Push the database schema to your database instance:
   ```bash
   npx prisma db push
   ```
4. Seed the database with realistic sample leads (staggered creation dates and realistic distribution):
   ```bash
   npm run db:seed
   ```
5. Start the development server (runs on port `3001`):
   ```bash
   npm run dev
   ```

*Optional:* Launch Prisma Studio to visually inspect and manage your data:
```bash
npm run db:studio
```

### 3. Frontend Setup

1. Navigate to the client folder and install dependencies:
   ```bash
   cd ../client
   npm install
   ```
2. Start the Vite development server (runs on port `5173`, automatically proxies `/api` requests to the local backend):
   ```bash
   npm run dev
   ```

---

## 📋 Environment Variables

### Backend Server (`server/.env`)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `DATABASE_URL` | PostgreSQL connection string | *required* |
| `PORT` | Backend server port | `3001` |
| `CORS_ORIGIN` | Allowed CORS origin (production frontend URL) | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend Client (`client/.env` - Production Only)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `VITE_API_URL` | Production server API base URL | `https://your-backend-domain.com/api` |

---

## 📡 API Documentation

### Base URL: `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check backend service health and response latency |
| `GET` | `/leads` | List leads (paginated, sortable, filterable) |
| `POST` | `/leads` | Create a new lead |
| `GET` | `/leads/search` | Search leads by name, email, and company |
| `GET` | `/leads/stats` | Retrieve KPI lead stats and breakdown metrics |
| `GET` | `/leads/companies` | Retrieve unique list of company names currently in DB |
| `GET` | `/leads/:id` | Retrieve a single lead's details |
| `PUT` | `/leads/:id` | Update a lead's properties |
| `DELETE` | `/leads/:id` | Delete a lead |

### Query Parameters (GET `/leads`)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page (maximum 100) |
| `sortBy` | string | `createdAt` | Sort field: `name`, `company`, `status`, `createdAt`, `email` |
| `sortOrder` | string | `desc` | Sort direction: `asc`, `desc` |
| `status` | string | — | Filter by status: `New`, `Contacted`, `Qualified`, `Converted`, `Lost` |
| `company` | string | — | Filter by company name |

### Query Parameters (GET `/leads/search`)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Search query string (searches name, email, company) |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page |

### Request Example (POST `/leads`)

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@acme.com",
  "phone": "(555) 123-4567",
  "company": "Acme Corp",
  "status": "New",
  "notes": "Met at SaaS Connect. Interested in custom plan."
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
    "total": 35,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🎨 Design System

Brio utilizes a premium slate and cobalt blue color palette with custom typography and subtle micro-animations:

| Color | Hex | Usage |
|-------|-----|-------|
| Cobalt Blue (Brand) | `#0F5CF5` | Primary actions, branding, key accents |
| Brand Light (Lilac) | `#E7F1FF` | Highlights, active navigation states, selected card background |
| Surface Blue | `#F8FAFC` | Primary light page background |
| Surface Light Slate | `#F1F5F9` | Secondary backgrounds, dividers, filters panel |
| Obsidian Dark | `#0F172A` | Core text, active tabs, buttons, layout headers |
| Muted Gray | `#64748B` | Secondary details, captions, placeholder text |

- **Typography**: `Inter` (body) + `Plus Jakarta Sans` (headings)
- **Interface Effects**: Subtle shadows (`shadow-soft`, `shadow-card`), custom scrolling styles, hover transitions, and Framer Motion spring animations.

---

## 📂 Project Structure

```
crm-assignment/
├── client/                    # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/     # StatCard, StatusChart, RecentActivity
│   │   │   ├── layout/        # AppLayout (navigation layout, toasts)
│   │   │   ├── leads/         # LeadTable, LeadCardList, LeadForm, LeadFilters
│   │   │   └── ui/            # Buttons, Modals, Badges, Inputs, Spinners, etc.
│   │   ├── hooks/             # useLeads, useDebounce (caching & debounce wrapper)
│   │   ├── lib/               # App constants
│   │   ├── pages/             # Dashboard, CreateLead, EditLead
│   │   ├── schemas/           # Zod validation schemas (form validation)
│   │   ├── services/          # Axios client API service layer
│   │   ├── types/             # Common TypeScript interfaces
│   │   └── index.css          # Design token configurations (Tailwind @theme v4)
│   └── vercel.json            # Vercel SPA routing redirects
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/       # HTTP Request Handlers
│   │   ├── middlewares/       # Error handling, rate limiting rules
│   │   ├── repositories/      # Prisma DB query isolation
│   │   ├── routes/            # Express router bindings
│   │   ├── services/          # Core Business logic
│   │   ├── types/             # Server TypeScript types
│   │   ├── utils/             # Prisma clients & response helper engines
│   │   └── validators/        # Zod validation schemas
│   ├── prisma/
│   │   ├── schema.prisma      # DB Schema structure with indexing
│   │   └── seed.ts            # High fidelity dummy data generator
│   └── ecosystem.config.js    # PM2 Process Manager VM config
└── README.md
```

---

## 🛡️ Security & Performance

- **Helmet Security Headers**: Hardens Express response headers.
- **Flexible CORS Policies**: Locks backend request reception to permitted origins.
- **Strict Rate Limiting**:
  - General API requests: Max 100 requests per 15 minutes.
  - Write operations (`POST /leads`): Max 30 requests per 15 minutes.
- **Database Optimizations**: Leverages combined and isolated indexes on database levels (e.g. status, company, search fields) for high-efficiency querying.
- **Input Sanitization**: Client & Server Zod schema validation auto-trims whitespace and enforces strict format criteria (valid emails, text lengths, etc.).

---

## 🚢 Production Deployment

### Backend VM Deployment (DigitalOcean + PM2)

The server contains a pre-configured `ecosystem.config.js` for **PM2** process management.

1. Clone or pull the repository on the target VM.
2. Build the project (automatically triggers Prisma client generation first):
   ```bash
   cd server
   npm install
   npm run build
   ```
3. Set environment variables on the server inside `server/.env`.
4. Push/deploy DB schema changes:
   ```bash
   npx prisma db push
   ```
5. Launch backend with PM2:
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   ```

### Frontend Deployment (Vercel)

The client directory is pre-configured with a custom `vercel.json` rewrite fallback which prevents React Router 404 errors during direct browser updates/refreshes.

1. Import the project on the Vercel console.
2. Set the **Root Directory** to `client`.
3. Configure the **Build Command** as `npm run build` and **Output Directory** as `dist`.
4. Set the **Environment Variable**: `VITE_API_URL` -> `http://<your-vm-ip-or-domain>:3001/api`.
5. Click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License.

