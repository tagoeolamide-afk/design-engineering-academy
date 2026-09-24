import type { Metadata } from 'next';
import { TextField } from '@/components/ui/text-field';
import { AuthForm } from '@/components/auth/auth-form';
import { updatePassword } from '../actions';

export const metadata: Metadata = { title: 'Set a new password' };

export const dynamic = 'force-dynamic';

/**
 * Reached from the emailed recovery link, which signs the user in first — so
 * this page only has to set the new password.
 */
export default function ResetPasswordPage() {
  return (
    <AuthForm
      title="Set a new password"
      description="Choose a new password for your account. You are signed in from the emailed link."
      action={updatePassword}
      submitLabel="Save password"
      pendingLabel="Saving…"
    >
      <TextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        description="At least 8 characters."
      />
      <TextField
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
    </AuthForm>
  );
}
