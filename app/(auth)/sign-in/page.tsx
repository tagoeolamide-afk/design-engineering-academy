import type { Metadata } from 'next';
import { TextField } from '@/components/ui/text-field';
import { AuthForm, AuthLink } from '@/components/auth/auth-form';
import { signIn } from '../actions';

export const metadata: Metadata = { title: 'Sign in' };

/* Authenticated pages must never be served from a cache: a response holding one
 * session's markup could otherwise be handed to the next visitor. */
export const dynamic = 'force-dynamic';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthForm
      title="Sign in"
      description="Your progress, notes and project work follow this account to any device."
      action={signIn}
      submitLabel="Sign in"
      pendingLabel="Signing in…"
      hidden={next === undefined ? undefined : { next }}
      footer={
        <div className="space-y-1.5">
          <p>
            No account yet? <AuthLink href="/sign-up">Create one</AuthLink>.
          </p>
          <p>
            <AuthLink href="/forgot-password">Forgotten your password?</AuthLink>
          </p>
        </div>
      }
    >
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
    </AuthForm>
  );
}
