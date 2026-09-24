import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

/**
 * Sign out.
 *
 * POST only. A GET would let any page sign the user out by embedding an image
 * or a prefetched link, which is a real nuisance rather than a real attack —
 * but the fix is one word, so there is no reason to accept it.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL('/sign-in', request.nextUrl.origin), {
    /* 303 so the browser follows with GET rather than repeating the POST. */
    status: 303,
  });
}
