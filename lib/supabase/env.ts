/**
 * Supabase environment resolution.
 *
 * The application has to run without Supabase configured. It was local-first
 * before this layer existed and still is: if the keys are absent the cloud
 * features switch off and every existing screen keeps working against
 * localStorage. That is what makes this stage safe to land before a Supabase
 * project exists, and it is why nothing here throws at module load.
 *
 * Both key names are accepted. Supabase now issues "publishable" keys, but
 * projects created earlier expose an "anon" key that plays the same role.
 */

export interface SupabaseEnv {
  readonly url: string;
  readonly publishableKey: string;
}

/**
 * Resolved config, or null when Supabase is not set up.
 *
 * Read through `process.env.NEXT_PUBLIC_*` by their literal names rather than a
 * computed lookup, because Next.js inlines these at build time and only
 * recognises the static form.
 */
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url === undefined || url.trim() === '') return null;
  if (publishable === undefined || publishable.trim() === '') return null;

  return { url: url.trim(), publishableKey: publishable.trim() };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

/**
 * For the few places that genuinely cannot proceed without config — a sign-in
 * form submission, for instance. The message names the variables so the fix is
 * obvious rather than a stack trace about an undefined URL.
 */
export function requireSupabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnv();
  if (env === null) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local — see .env.example.',
    );
  }
  return env;
}
