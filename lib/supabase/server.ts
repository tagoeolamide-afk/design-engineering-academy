import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { getSupabaseEnv, requireSupabaseEnv } from './env';
import type { Database } from './database.types';

export type TypedServerClient = SupabaseClient<Database>;

/**
 * The server client, bound to this request's cookies.
 *
 * `server-only` at the top is load-bearing: it makes importing this module from
 * a client component a build error rather than a runtime surprise, which is the
 * guardrail that keeps server credentials off the browser.
 *
 * A new client per request — never cached in a module variable. Caching one
 * would let a request read the cookies of whoever caused the module to load.
 */
export async function createSupabaseServerClient(): Promise<TypedServerClient> {
  const { url, publishableKey } = requireSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          /* Called from a Server Component, where cookies are read-only. The
           * middleware refreshes the session on every request, so the write
           * that failed here has already happened there. */
        }
      },
    },
  });
}

/**
 * The signed-in user, or null.
 *
 * Uses `getUser()`, which revalidates the token with Supabase, rather than
 * `getSession()`, which trusts whatever the cookie claims. On the server the
 * cookie is attacker-controllable input, so the round trip is the point.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (getSupabaseEnv() === null) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error !== null) return null;
  return data.user;
}
