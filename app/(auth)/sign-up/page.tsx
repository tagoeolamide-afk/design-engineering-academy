import type { Metadata } from 'next';
import { TextField } from '@/components/ui/text-field';
import { AuthForm, AuthLink } from '@/components/auth/auth-form';
import { signUp } from '../actions';

export const metadata: Metadata = { title: 'Create account' };

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <AuthForm
      title="Create account"
      description="One account for one learner. There are no teams, profiles or billing."
      action={signUp}
      submitLabel="Create account"
      pendingLabel="Creating account…"
      footer={
        <p>
          Already have one? <AuthLink href="/sign-in">Sign in</AuthLink>.
        </p>
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
        autoComplete="new-password"
        required
        minLength={8}
        description="At least 8 characters."
      />
    </AuthForm>
  );
}
