# Pipo Bee Auth Setup (Google OAuth + Supabase)

These steps happen in dashboards, not in code. Do them once for local development and again for production.

## 1) Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. Go to **APIs & Services → Credentials**.
3. Click **Create credentials → OAuth client ID**.
4. If prompted, configure the OAuth consent screen (External is fine for testing).
5. Application type: **Web application**.
6. **Authorized JavaScript origins**
   - Local: `http://localhost:5173`
   - Production: `https://your-production-domain.com`
7. **Authorized redirect URIs**
   - Supabase callback (required):  
     `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`  
     Example: `https://rffocidkngjrvvrdkjuy.supabase.co/auth/v1/callback`
8. Create the client and copy the **Client ID** and **Client Secret**.

## 2) Supabase Dashboard → Google provider

1. Open your Supabase project.
2. Go to **Authentication → Providers → Google**.
3. Enable Google.
4. Paste the Google **Client ID** and **Client Secret**.
5. Save.

## 3) Supabase Dashboard → URL configuration

1. Go to **Authentication → URL Configuration**.
2. **Site URL**
   - Production: `https://your-production-domain.com`
   - For local-only testing you can temporarily use `http://localhost:5173`
3. **Redirect URLs** (add all that apply)
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/reset-password`
   - `https://your-production-domain.com/auth/callback`
   - `https://your-production-domain.com/reset-password`
4. Save.

## 4) Environment variables

Copy `apps/admin/.env.example` to `apps/admin/.env` and fill in:

```bash
VITE_SUPABASE_URL=https://<SUPABASE_PROJECT_REF>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
```

Never put the service role key in the admin app. Keep it in `apps/api/.env` only.

## 5) Email confirmation (optional but recommended)

1. **Authentication → Providers → Email**: enable Confirm email if you want the “check your inbox” flow.
2. **Authentication → Email Templates**: customize Confirm signup / Reset password if desired.

## 6) Quick test checklist

- [ ] Email sign up with country, city, phone, role
- [ ] Invalid phone for country shows an inline error
- [ ] Email confirmation screen + resend
- [ ] Email sign in / wrong password shows generic error
- [ ] Google sign-in (new user → `/complete-profile` → `/onboarding` → `/dashboard`)
- [ ] Returning Google user → `/dashboard`
- [ ] Forgot password email + reset page
- [ ] Signed-out visit to `/dashboard` redirects to `/login`
- [ ] Sign out clears the session
