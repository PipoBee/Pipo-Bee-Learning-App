# Environment variables — set before deployment

Copy from each app’s `.env.example`. Do **not** commit real `.env` files.

---

## 1. Admin / Web (`apps/admin`) — Vercel / Cloudflare / Netlify

| Variable | Required | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | **Yes** | `https://YOUR_PROJECT_REF.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | **Yes** | Publishable / anon key (browser-safe) |
| `VITE_API_BASE_URL` | Optional | Only if admin calls Nest by absolute URL |

**Never** put `SUPABASE_SECRET_KEY` or DB passwords in Vite env.

Also in Supabase Dashboard → Authentication → URL configuration:
- Site URL = your deployed admin origin
- Redirect URLs include `https://your-admin-domain/auth/callback`

---

## 2. API (`apps/api`) — Railway / Render / Fly / Cloud Run

| Variable | Required | Notes |
|---|---|---|
| `PORT` | Yes* | Host often injects this |
| `DATABASE_URL` | **Yes** | Prisma (prefer Supabase pooler + `?pgbouncer=true`) |
| `DIRECT_URL` | **Yes** | Prisma migrations (direct / non-pooler) |
| `JWT_SECRET` | **Yes** | Long random secret (not the local-dev default) |
| `SUPABASE_URL` | **Yes** | Same project URL as admin |
| `SUPABASE_PUBLISHABLE_KEY` | **Yes** | Publishable / anon key |
| `SUPABASE_SECRET_KEY` | **Yes** | Service role / secret — **server only** |
| `SUPABASE_JWKS_URL` | Recommended | `https://YOUR_PROJECT_REF.supabase.co/auth/v1/.well-known/jwks.json` |
| `API_PUBLIC_URL` | Recommended | Public API origin (upload URLs) |
| `UPLOADS_DIR` | Optional | Default `./uploads` |
| `STORAGE_DRIVER` | Optional | Currently `local` in code path |
| `AZURE_SPEECH_ENABLED` | Optional | `true` / `false` (default off) |
| `AZURE_SPEECH_KEY` | If Azure on | Azure Speech key |
| `AZURE_SPEECH_REGION` | If Azure on | e.g. `eastus` |
| `SUPABASE_DATABASE_URL` | Optional | Direct Postgres URI for tooling |
| `CORS_ORIGIN` | Optional | Present in local `.env`; API currently allows `*` in code |
| `JWT_EXPIRES_IN` | Optional | Present in local `.env`; sign options currently hardcode `7d` |

**Production storage (when you switch off local disk):**

| Variable | When |
|---|---|
| `S3_BUCKET_NAME` | `STORAGE_DRIVER=s3` / `r2` |
| `S3_REGION` | same |
| `S3_ACCESS_KEY_ID` | same |
| `S3_SECRET_ACCESS_KEY` | same |
| `S3_PUBLIC_CDN_URL` | CDN base for asset URLs |

---

## 3. Mobile (`apps/mobile`) — EAS Secrets / `eas.json` env

| Variable | Required | Notes |
|---|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | **Yes** (prod) | e.g. `https://api.your-domain.com/api/v1` |
| `EXPO_PUBLIC_AZURE_SPEECH_ENABLED` | Optional | `true` / `false` |
| `EXPO_PUBLIC_SUPABASE_URL` | If mobile Auth | Same as web |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | If mobile Auth | Publishable key only |

---

## Quick paste templates (placeholders only)

### Admin
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
```

### API
```bash
PORT=3000
API_PUBLIC_URL=https://api.your-domain.com
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:[PASSWORD]@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.YOUR_PROJECT_REF:[PASSWORD]@aws-0-REGION.pooler.supabase.com:5432/postgres
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-chars
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
SUPABASE_SECRET_KEY=your-supabase-service-role-or-secret-key
SUPABASE_JWKS_URL=https://YOUR_PROJECT_REF.supabase.co/auth/v1/.well-known/jwks.json
STORAGE_DRIVER=local
UPLOADS_DIR=./uploads
AZURE_SPEECH_ENABLED=false
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=eastus
```

### Mobile
```bash
EXPO_PUBLIC_API_BASE_URL=https://api.your-domain.com/api/v1
EXPO_PUBLIC_AZURE_SPEECH_ENABLED=false
```

---

## Checklist before go-live

1. Point `DATABASE_URL` / `DIRECT_URL` at Supabase (or managed Postgres), not localhost.
2. Rotate `JWT_SECRET` away from the local-dev default.
3. Confirm admin build has both `VITE_SUPABASE_*` values.
4. Confirm API has `SUPABASE_SECRET_KEY` (never in admin/mobile).
5. Set Supabase Auth redirect URLs to the production admin origin.
6. Set mobile `EXPO_PUBLIC_API_BASE_URL` to the public API.
7. Prefer durable object storage over local `./uploads` for multi-instance hosts.
