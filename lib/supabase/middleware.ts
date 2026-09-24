import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseEnv } from './env';

/**
 * Routes reachable without a session.
 *
 * Everything else in the application is private learning state, so the list is
 * an allowlist rather than a blocklist — a new route is protected by default,
 * which is the direction that fails safe.
 */
const PUBLIC_PREFIXES: readonly string[] = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/auth'];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Refreshes the auth cookie and guards private routes.
 *
 * The two jobs are deliberately together: Supabase access tokens are short
 * lived, and the refreshed cookie has to be written onto the *same* response
 * that is ultimately returned. Splitting them is the usual way to end up
 * signing someone out at random.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const env = getSupabaseEnv();

  /* No Supabase configured: the application runs exactly as it did before this
   * stage — local-first, no accounts, nothing gated. */
  if (env === null) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  /* Must be getUser(), not getSession(): this call is what refreshes an expired
   * token, and it verifies the token with Supabase rather than trusting the
   * cookie's own claims.
   *
   * Wrapped because it is a network call. If Supabase is unreachable an
   * unhandled rejection here would turn every route into a 500, so the failure
   * is treated as "not signed in" — which fails closed, the only safe
   * direction for a check that guards private data. */
  let user: { id: string } | null = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  const { pathname } = request.nextUrl;

  if (user === null && !isPublicPath(pathname)) {
    const signIn = request.nextUrl.clone();
    signIn.pathname = '/sign-in';
    signIn.search = '';
    /* Remember where they were headed so sign-in can finish the journey
     * instead of dumping everyone on the dashboard. */
    if (pathname !== '/') {
      signIn.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    }
    return NextResponse.redirect(signIn);
  }

  /* Already signed in and looking at the sign-in page: send them on. The reset
   * page is excluded because arriving there with a session is normal — the
   * recovery link signs you in first. */
  if (
    user !== null &&
    (pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password')
  ) {
    const home = request.nextUrl.clone();
    home.pathname = '/';
    home.search = '';
    return NextResponse.redirect(home);
  }

  return response;
}
