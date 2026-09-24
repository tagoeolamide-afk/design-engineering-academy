'use server';

import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { AuthFormState } from '@/lib/auth/form-state';

/**
 * Authentication, as server actions.
 *
 * Credentials are posted to the server and never held in client state, and the
 * session cookie is written by the server client on the way back. The forms
 * work the same way with or without JavaScript.
 */

const NOT_CONFIGURED: AuthFormState = {
  error:
    'Supabase is not configured yet, so accounts are unavailable. The application still works locally on this device.',
  message: null,
};

/**
 * Turns a thrown or returned Supabase failure into something worth reading.
 *
 * A wrong project URL surfaces as the browser's own "fetch failed", which tells
 * the learner nothing and looks like their password was rejected. Network
 * faults are named as such so the cause is obvious.
 */
function describeAuthFailure(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (/fetch failed|ENOTFOUND|ECONNREFUSED|network|timeout/i.test(message)) {
    return 'Could not reach the authentication service. Check your connection and that NEXT_PUBLIC_SUPABASE_URL is correct.';
  }
  return message;
}

/** Runs a Supabase auth call, converting a thrown network fault into state. */
async function attempt(
  run: () => Promise<{ error: { message: string } | null }>,
): Promise<AuthFormState | null> {
  try {
    const { error } = await run();
    if (error !== null) return { error: describeAuthFailure(error), message: null };
    return null;
  } catch (thrown) {
    return { error: describeAuthFailure(thrown), message: null };
  }
}

function readCredentials(formData: FormData): { email: string; password: string } {
  return {
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('password') ?? ''),
  };
}

/**
 * Where an internal redirect is allowed to point.
 *
 * Only same-site paths. Without this an attacker could send someone to
 * `/sign-in?next=https://example.com` and have the application forward them
 * somewhere hostile after a genuine sign-in.
 */
function safeNext(value: FormDataEntryValue | null): Route {
  const next = typeof value === 'string' ? value : '';
  if (!next.startsWith('/') || next.startsWith('//')) return '/';
  /* Validated above as a same-site path; the cast asserts what the check
   * already guarantees, since a runtime string cannot be proved to the
   * typedRoutes map. */
  return next as Route;
}

/** The deployed origin, for links inside Supabase emails. */
async function siteOrigin(): Promise<string> {
  const headerList = await headers();
  const origin = headerList.get('origin');
  if (origin !== null && origin !== '') return origin;

  const host = headerList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export async function signIn(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const { email, password } = readCredentials(formData);
  if (email === '' || password === '') {
    return { error: 'Enter your email address and password.', message: null };
  }

  const supabase = await createSupabaseServerClient();

  /* Supabase returns a deliberately vague message for bad credentials, which is
   * correct: saying which half was wrong tells an attacker whether the address
   * has an account. */
  const failure = await attempt(() =>
    supabase.auth.signInWithPassword({ email, password }),
  );
  if (failure !== null) return failure;

  revalidatePath('/', 'layout');
  redirect(safeNext(formData.get('next')));
}

export async function signUp(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const { email, password } = readCredentials(formData);
  if (email === '' || password === '') {
    return { error: 'Enter an email address and a password.', message: null };
  }
  if (password.length < 8) {
    return { error: 'Use at least 8 characters for the password.', message: null };
  }

  const supabase = await createSupabaseServerClient();
  const origin = await siteOrigin();

  let data;
  try {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    if (result.error !== null) {
      return { error: describeAuthFailure(result.error), message: null };
    }
    data = result.data;
  } catch (thrown) {
    return { error: describeAuthFailure(thrown), message: null };
  }

  /* With email confirmation switched on, Supabase returns a user but no
   * session — there is nothing to redirect into yet. */
  if (data.session === null) {
    return {
      error: null,
      message: `Account created. Check ${email} for a confirmation link, then sign in.`,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function requestPasswordReset(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const email = String(formData.get('email') ?? '').trim();
  if (email === '') return { error: 'Enter your email address.', message: null };

  const supabase = await createSupabaseServerClient();
  const origin = await siteOrigin();

  const failure = await attempt(() =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    }),
  );
  if (failure !== null) return failure;

  /* Deliberately the same answer whether or not the address has an account:
   * a different one would confirm which addresses are registered. */
  return {
    error: null,
    message: `If ${email} has an account, a reset link is on its way.`,
  };
}

export async function updatePassword(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED;

  const password = String(formData.get('password') ?? '');
  const confirmation = String(formData.get('confirmPassword') ?? '');

  if (password.length < 8) {
    return { error: 'Use at least 8 characters for the password.', message: null };
  }
  if (password !== confirmation) {
    return { error: 'The two passwords do not match.', message: null };
  }

  const supabase = await createSupabaseServerClient();

  /* The recovery link signed them in already, so this runs as that user. */
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError !== null || userData.user === null) {
    return {
      error: 'This reset link is no longer valid. Request a new one.',
      message: null,
    };
  }

  const failure = await attempt(() => supabase.auth.updateUser({ password }));
  if (failure !== null) return failure;

  revalidatePath('/', 'layout');
  redirect('/');
}
