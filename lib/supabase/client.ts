'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv, requireSupabaseEnv } from './env';
import type { Database } from './database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * The browser client.
 *
 * Only ever holds the publishable key, which is safe to ship: every table it
 * can reach is protected by row level security, so the key grants nothing on
 * its own. The service-role key must never appear in this file or anything it
 * imports.
 *
 * Cached per tab. Creating a second client would mean two independent auth
 * listeners racing over the same cookie.
 */
let cached: TypedSupabaseClient | null = null;

export function getBrowserSupabaseClient(): TypedSupabaseClient {
  if (cached !== null) return cached;

  const { url, publishableKey } = requireSupabaseEnv();
  cached = createBrowserClient<Database>(url, publishableKey);
  return cached;
}

/** Null rather than a throw, for components that render before sign-in exists. */
export function tryGetBrowserSupabaseClient(): TypedSupabaseClient | null {
  return getSupabaseEnv() === null ? null : getBrowserSupabaseClient();
}
