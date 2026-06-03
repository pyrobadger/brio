# Implementation Plan - Production Deployment (DigitalOcean VM + PM2 & Vercel)

We will configure and prepare the codebase for production deployment. The backend will be run on your existing DigitalOcean VM (Droplet) using **PM2** for process management. The frontend will be deployed on **Vercel** (React/Vite SPA).

## Proposed Changes

### 1. Backend Build & PM2 Configurations
We will update scripts and add a PM2 configuration file for easy process management on your VM.

#### [NEW] [ecosystem.config.js](file:///e:/Programing/crm-assignment/server/ecosystem.config.js)
* Create a standard PM2 configuration file in the `server` directory to define the process name, script entry point, port, and environmental variable mapping:
  ```javascript
  module.exports = {
    apps: [
      {
        name: 'brio-backend',
        script: 'dist/server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env_production: {
          NODE_ENV: 'production',
          PORT: 3001
        }
      }
    ]
  };
  ```

#### [MODIFY] [package.json](file:///e:/Programing/crm-assignment/server/package.json)
* Update the `"build"` script from `"tsc"` to `"prisma generate && tsc"` to ensure the Prisma client is built.
* Add a deploy helper: `"db:deploy": "prisma db push"`.

### 2. Frontend API Configuration
Allows the frontend to connect to the backend running on your VM's IP or custom domain.

#### [MODIFY] [leadService.ts](file:///e:/Programing/crm-assignment/client/src/services/leadService.ts)
* Bind the base URL to:
  ```typescript
  baseURL: import.meta.env.VITE_API_URL || '/api',
  ```

### 3. Vercel SPA Routing Configuration
#### [NEW] [vercel.json](file:///e:/Programing/crm-assignment/client/vercel.json)
* Setup index redirection to prevent React Router 404 errors on refreshes.

---

## Deployment Steps & Setup

### 🚀 Part 1: Deploy Backend on DigitalOcean VM (Droplet) using PM2

1. **Upload Code**:
   * Clone/pull your repository onto the VM.
2. **Build Server**:
   * Navigate into `server` and install dependencies:
     ```bash
     cd server
     npm install
     npm run build
     ```
3. **Set Environment Variables**:
   * Create a `server/.env` file on your VM containing:
     ```env
     DATABASE_URL="postgresql://..."
     CORS_ORIGIN="https://your-vercel-app.vercel.app"
     NODE_ENV="production"
     PORT=3001
     ```
4. **Deploy Database Schema**:
   * Run the push schema script to ensure your database is updated:
     ```bash
     npx prisma db push
     ```
5. **Start App with PM2**:
   * Launch the app using the new ecosystem config:
     ```bash
     pm2 start ecosystem.config.js --env production
     ```
   * Save PM2 process list:
     ```bash
     pm2 save
     ```
6. **Reverse Proxy Setup (Nginx)**:
   * Point Nginx to forward requests to `http://localhost:3001` (your backend port):
     ```nginx
     location /api {
         proxy_pass http://127.0.0.1:3001;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection 'upgrade';
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;
     }
     ```

### ⚡ Part 2: Deploy Frontend on Vercel

1. **Import Project**:
   * Import repository on Vercel Console.
2. **Configure Settings**:
   * Framework Preset: `Vite`, Root Directory: `client`.
3. **Environment Variables**:
   * **VITE_API_URL**: `https://<your-vm-domain-or-ip>/api` (or just target port 3001 directly: `http://<vm-ip>:3001/api`)
4. **Deploy**:
   * Trigger build.

---

## Verification Plan

### Automated Verification
* Run client/server compilation checks locally to verify they build cleanly.
