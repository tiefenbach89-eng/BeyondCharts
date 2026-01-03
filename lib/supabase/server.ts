import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the Service Role key.
 * IMPORTANT: Never import this in client components.
 */
export function supabaseServer() {
  const url = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}
