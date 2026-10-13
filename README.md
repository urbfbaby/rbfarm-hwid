# GK FARM HWID Verification Server

Cloudflare Workers + D1 backend for HWID license management.

## Features
- **API**: `GET /api/checkhwid/cekemu/?hw=<HWID>` — HWID verification
- **Admin Panel**: Full CRUD dashboard with login, add/edit/delete HWIDs, request logs
- **Zero Dependencies**: No npm runtime deps — uses native Workers APIs
- **Persistent**: Cloudflare D1 (serverless SQLite)

---

## 🚀 Deploy Tutorial (Step by Step)

### Prerequisites
- Node.js 18+ installed
- Cloudflare account (free tier works)
- Domain `yaelahky.com` on Cloudflare DNS

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare
```bash
wrangler login
```
This opens a browser window — authorize Wrangler.

### Step 3: Create D1 Database
```bash
wrangler d1 create gkfarm-hwid
```
This outputs something like:
```
✅ Successfully created DB 'gkfarm-hwid'

[[d1_databases]]
binding = "DB"
database_name = "gkfarm-hwid"
database_id = "xxxx-xxxx-xxxx-xxxx"
```
**Copy the `database_id`** and paste it into `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "gkfarm-hwid"
database_id = "xxxx-xxxx-xxxx-xxxx"   ← paste here
```

### Step 4: Run Database Migration
```bash
wrangler d1 execute gkfarm-hwid --file=src/schema.sql
```
This creates the `hwid_licenses` and `request_logs` tables.

### Step 5: Set Secret (AUTH_SECRET)
```bash
wrangler secret put AUTH_SECRET
```
Enter a random secret string (e.g. `my-super-secret-key-2026`).
This is used to sign auth cookies — **never commit this to git**.

### Step 6: Update Admin Credentials (Optional)
Edit `wrangler.toml` to change default admin credentials:
```toml
[vars]
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "your-strong-password-here"
```
Or use secrets for passwords too:
```bash
wrangler secret put ADMIN_PASSWORD
```

### Step 7: Deploy
```bash
wrangler deploy
```
Output:
```
✅ Deployed gkfarm-hwid-worker
   https://gkfarm-hwid-worker.<your-subdomain>.workers.dev
```

### Step 8: Add Workers Routes (yaelahky.com)

Go to **Cloudflare Dashboard** → your domain `yaelahky.com`:

1. **Workers Routes** (sidebar → Workers Routes)
2. Add routes:

| Route | Worker |
|-------|--------|
| `yaelahky.com/api/*` | `gkfarm-hwid-worker` |
| `yaelahky.com/admin/*` | `gkfarm-hwid-worker` |
| `yaelahky.com/health` | `gkfarm-hwid-worker` |

Now:
- `https://yaelahky.com/api/checkhwid/cekemu/?hw=TEST` → Worker handles it
- `https://yaelahky.com/admin` → Worker handles it
- `https://yaelahky.com/` → Your existing Pages site (unchanged)

### Step 9: Test
```bash
# Health check
curl https://yaelahky.com/health

# API test (no HWID registered yet)
curl "https://yaelahky.com/api/checkhwid/cekemu/?hw=TEST123"

# Open admin panel in browser
# https://yaelahky.com/admin/login
# Login with admin / admin123
# Add a HWID, then test API again
```

### Step 10: Verify with GK FARM
Run the patched GK FARM app (with `app_yaelahky.asar` swapped in).
The app will call `https://yaelahky.com/api/checkhwid/cekemu/?hw=<device-hwid>`.

---

## 🔧 Local Development

```bash
cd hwid-worker
npm install
npx wrangler dev
```
This starts a local server at `http://localhost:8787` with a local D1 database.

Create tables locally:
```bash
npx wrangler d1 execute gkfarm-hwid --local --file=src/schema.sql
```

Local secrets go in `.dev.vars` (already created, not committed to git).

---

## 📁 File Structure

```
hwid-worker/
├── src/
│   ├── index.js          ← Workers entry point (fetch router)
│   ├── api.js            ← HWID check API handler
│   ├── admin.js          ← Admin panel routes (CRUD)
│   ├── auth.js           ← Cookie-based auth (HMAC-SHA256)
│   ├── db.js             ← D1 query helpers
│   ├── views.js          ← Login page HTML
│   ├── admin-view.js     ← Dashboard page HTML builder
│   ├── admin-modals.js   ← Add/Edit modal HTML + client JS
│   ├── helpers.js        ← escapeHtml, escapeAttr, CSS
│   └── schema.sql        ← D1 database migration
├── wrangler.toml         ← Workers + D1 config
├── .dev.vars             ← Local dev secrets (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 🔗 GitHub Auto-Deploy (Optional)

1. Push this folder to a GitHub repo (e.g. `gkfarm-hwid`)
2. Go to Cloudflare Dashboard → Workers & Pages → Create
3. Connect GitHub repo
4. Set build command: (leave empty — no build needed)
5. Set deploy command: `wrangler deploy`
6. Add environment variables in Cloudflare dashboard
7. Every push to `main` auto-deploys ✨

---

## API Response Format

**Active HWID:**
```json
{
  "success": true,
  "status": "active",
  "message": "HWID is active",
  "data": {
    "hwid": "ABC-123",
    "package": "Lifetime",
    "expired": null,
    "is_active": true,
    "user": { "name": "Rizky", "email": "rizky@test.com" }
  }
}
```

**Not found:**
```json
{ "success": false, "status": "not_found", "message": "HWID not registered" }
```

**Banned:**
```json
{ "success": false, "status": "banned", "message": "License is banned" }
```

**Expired:**
```json
{ "success": false, "status": "expired", "message": "License is expired" }
```
