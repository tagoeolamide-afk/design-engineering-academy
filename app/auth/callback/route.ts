import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

/**
 * Where Supabase sends the browser back after an emailed link is followed —
 * account confirmation, or a password reset.
 *
 * The link carries a one-time `code`; exchanging it here is what sets the
 * session cookie. Doing it in a route handler rather than a page means the
 * cookie is written on a real response, which a Server Component cannot do.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');

  /* Only same-site paths, so the redirect cannot be aimed off the site. */
  const requested = searchParams.get('next') ?? '/';
  const next = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/';

  if (!isSupabaseConfigured() || code === null) {
    return NextResponse.redirect(`${origin}/sign-in?error=link`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error !== null) {
    return NextResponse.redirect(`${origin}/sign-in?error=link`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
