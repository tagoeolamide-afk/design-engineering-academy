import type { Metadata } from 'next';
import { TextField } from '@/components/ui/text-field';
import { AuthForm, AuthLink } from '@/components/auth/auth-form';
import { requestPasswordReset } from '../actions';

export const metadata: Metadata = { title: 'Reset password' };

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Reset password"
      description="We will email a link that signs you in and lets you set a new password."
      action={requestPasswordReset}
      submitLabel="Send reset link"
      pendingLabel="Sending…"
      footer={
        <p>
          Remembered it? <AuthLink href="/sign-in">Back to sign in</AuthLink>.
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
    </AuthForm>
  );
}
