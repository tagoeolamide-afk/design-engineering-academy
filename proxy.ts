import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  /**
   * Everything except static assets and image files.
   *
   * The auth routes are deliberately still matched: the proxy has to
   * refresh the session cookie on those requests too, and it decides for itself
   * which paths are public.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
};
