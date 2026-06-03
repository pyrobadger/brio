# Walkthrough - CRM Production Deployment & GitHub Push

We have configured the project for production, committed the files, and successfully pushed the codebase to your GitHub repository at [pyrobadger/brio](https://github.com/pyrobadger/brio).

---

## 🎨 Production Configuration Files Added

### 1. PM2 Process Manager Configuration (Droplet VM)
* **File created**: [ecosystem.config.js](file:///e:/Programing/crm-assignment/server/ecosystem.config.js)
* **Details**:
  * Configured a PM2 ecosystem file defining the app name (`brio-backend`), target entrypoint (`dist/server.js`), and default production environment port (`3001`).
  * On your VM, run the server using: `pm2 start ecosystem.config.js --env production`.

### 2. Automated Prisma Generation on Build
* **File modified**: [package.json](file:///e:/Programing/crm-assignment/server/package.json)
* **Details**:
  * Modified the build script: `"build": "prisma generate && tsc"`. This guarantees the Prisma client builds automatically during your VM deploy process.
  * Added a database schema deployment script: `"db:deploy": "prisma db push"`.

### 3. SPA Routing Configuration (Vercel)
* **File created**: [vercel.json](file:///e:/Programing/crm-assignment/client/vercel.json)
* **Details**:
  * Added a routing rewrite fallback redirection to route all page requests back to `/index.html`. This prevents 404 errors when reloading inner paths (like `/leads/new`).

### 4. Dynamic API Connection
* **File modified**: [leadService.ts](file:///e:/Programing/crm-assignment/client/src/services/leadService.ts)
* **Details**:
  * Changed the Axios instance base URL to fetch `import.meta.env.VITE_API_URL || '/api'`. This lets you dynamically point your Vercel deployment to your droplet VM IP/domain.

---

## 🚀 Steps to Deploy on Your DigitalOcean VM

1. **Clone/Pull repository**:
   ```bash
   git clone https://github.com/pyrobadger/brio.git
   cd brio/server
   ```
2. **Install and Build**:
   ```bash
   npm install
   npm run build
   ```
3. **Environment Setup**:
   Create a `.env` file in the `server` directory on your VM:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<dbname>?sslmode=require"
   CORS_ORIGIN="https://<your-vercel-app-name>.vercel.app"
   NODE_ENV="production"
   PORT=3001
   ```
4. **Push database schema changes**:
   ```bash
   npx prisma db push
   ```
5. **Start with PM2**:
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   ```

---

## ⚡ Steps to Deploy on Vercel

1. **Import Repository**:
   * Go to Vercel Console -> **Add New** -> **Project**.
   * Import `pyrobadger/brio`.
2. **Project Configuration**:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `client`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. **Environment Variables**:
   * Add a new environment variable:
     * **Name**: `VITE_API_URL`
     * **Value**: `http://<your-droplet-ip-or-domain>:3001/api`
4. **Deploy**:
   * Click **Deploy**.
