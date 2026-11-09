# PhonicsQuest — Production Go-Live Deployment Checklist

This guide outlines the production migration steps to transition from local development to a live cloud environment.

---

## 1. Cloud Infrastructure & Hosting

| Component | Local Development | Production Target |
| :--- | :--- | :--- |
| **Backend API** | NestJS on `http://localhost:3000` | Railway / Render / AWS ECS / Google Cloud Run |
| **Database** | Local PostgreSQL (`phonicsquest`) | AWS RDS / Supabase / Neon managed PostgreSQL with SSL |
| **Admin Panel** | React (Vite) on `http://localhost:5173` | Vercel / Cloudflare Pages / AWS S3 + CloudFront |
| **Mobile App** | Expo Go / Web (`localhost:8081`) | Google Play Store (AAB) & Apple App Store (IPA) via EAS Build |
| **Audio/Assets** | Local `/uploads` directory | AWS S3 or Cloudflare R2 bucket via CDN |

---

## 2. Environment Variables Migration

### Backend API (`apps/api/.env`)
```bash
# Production Database URL (with SSL and connection pool)
DATABASE_URL="postgresql://db_user:StrongPassword@db-host.provider.com:5432/phonicsquest?sslmode=require&pgBouncer=true"

# JWT Authentication
JWT_SECRET="generate-a-strong-random-64-char-secret-key"
JWT_EXPIRES_IN="7d"

# CORS Allowed Origins
CORS_ORIGINS="https://admin.phonicsquest.app,https://phonicsquest.app"

# Storage Service Configuration (Switch from 'local' to 's3' or 'r2')
STORAGE_DRIVER="s3" # "local" | "s3" | "r2"
S3_BUCKET_NAME="phonicsquest-assets-prod"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="AKIA..."
S3_SECRET_ACCESS_KEY="..."
S3_PUBLIC_CDN_URL="https://cdn.phonicsquest.app"

# Azure Speech Pronunciation Assessment (Turn ON in production)
AZURE_SPEECH_ENABLED=true
AZURE_SPEECH_KEY="your-azure-cognitive-services-key"
AZURE_SPEECH_REGION="eastus"

# Port
PORT=3000
```

### Admin Web Panel (`apps/admin/.env.production`)
```bash
VITE_API_BASE_URL="https://api.phonicsquest.app/api/v1"
```

### Mobile App (`apps/mobile/.env`)
```bash
EXPO_PUBLIC_API_BASE_URL="https://api.phonicsquest.app/api/v1"
EXPO_PUBLIC_ENVIRONMENT="production"
```

---

## 3. StorageService S3 / R2 Implementation
The `StorageService` interface (`IStorageService`) is already decoupled. When transitioning to live:
1. Provide the S3/R2 client class (`S3StorageService implements IStorageService`).
2. Point asset URLs to Cloudflare CDN or AWS CloudFront distribution with HTTPS.

---

## 4. Mobile App Production Build (Expo Application Services - EAS)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. **Configure `eas.json`:**
   ```json
   {
     "build": {
       "production": {
         "env": {
           "EXPO_PUBLIC_API_BASE_URL": "https://api.phonicsquest.app/api/v1"
         },
         "android": { "buildType": "app-bundle" },
         "ios": { "simulator": false }
       }
     }
   }
   ```
3. **Trigger Builds:**
   ```bash
   eas build --platform android --profile production
   eas build --platform ios --profile production
   ```

---

## 5. Security & Domain Verification
- **Enforce HTTPS:** Require TLS 1.3 across all domains.
- **Database Backup:** Enable automated daily snapshots and Point-in-Time Recovery (PITR).
- **Rate Limiting:** Enable `@nestjs/throttler` (e.g., 60 requests/minute per IP).
- **CORS:** Restrict API calls strictly to approved web domains and mobile user agents.
