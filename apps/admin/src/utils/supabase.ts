import { createClient } from '@supabase/supabase-js';

/**
 * Single shared Supabase browser client for the whole SPA.
 * Import this everywhere — do not call createClient again.
 *
 * PKCE + default localStorage: the code_verifier stays in the same origin storage
 * so /auth/callback can finish the OAuth handshake.
 *
 * Vite inlines VITE_* at build time — set them in Vercel and redeploy after changes.
 * Prefer the full publishable key (sb_publishable_…) or legacy anon JWT (eyJ…).
 */
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  || import.meta.env.VITE_SUPABASE_ANON_KEY
  || ''
).trim();

export const supabaseConfigError: string | null = (() => {
  if (!supabaseUrl || !supabaseKey) {
    return 'Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy.';
  }
  if (supabaseKey.startsWith('sb_secret_') || supabaseKey.includes('service_role')) {
    return 'VITE_SUPABASE_PUBLISHABLE_KEY must be the publishable/anon key, not the secret/service-role key.';
  }
  // Truncated publishable keys return "Invalid API key" (401) from Supabase Auth.
  if (supabaseKey.startsWith('sb_publishable_') && supabaseKey.length < 40) {
    return 'VITE_SUPABASE_PUBLISHABLE_KEY looks truncated. Paste the full publishable key and redeploy.';
  }
  return null;
})();

if (supabaseConfigError) {
  console.error(supabaseConfigError);
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder', {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    // Default browser storage (localStorage). Do not override with a custom
    // storage backend unless it is shared across the whole app.
  },
});

/** Always build redirect URLs from the current origin (never hardcode host). */
export function authRedirectTo(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${window.location.origin}${normalized}`;
}
