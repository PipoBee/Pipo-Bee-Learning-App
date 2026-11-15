import { createClient } from '@supabase/supabase-js';

/**
 * Single shared Supabase browser client for the whole SPA.
 * Import this everywhere — do not call createClient again.
 *
 * PKCE + default localStorage: the code_verifier stays in the same origin storage
 * so /auth/callback can finish the OAuth handshake.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
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
