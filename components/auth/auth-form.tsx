'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { Route } from 'next';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { EMPTY_AUTH_STATE, type AuthFormState } from '@/lib/auth/form-state';

/**
 * The shared shell for every authentication form.
 *
 * One component so the four pages cannot drift apart in spacing, error
 * placement or button wording. Built from the existing Button, TextField and
 * StatusIndicator — no new visual language.
 *
 * Errors are announced through `role="alert"` and the submit button reports
 * its own pending state, so a slow network is visible rather than silent.
 */
export interface AuthFormProps {
  readonly title: string;
  readonly description: string;
  readonly action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  readonly submitLabel: string;
  readonly pendingLabel: string;
  readonly children: ReactNode;
  /** Rendered under the button: the link to the other route. */
  readonly footer?: ReactNode | undefined;
  /** Hidden fields, e.g. the intended destination after sign-in. */
  readonly hidden?: Readonly<Record<string, string>> | undefined;
}

export function AuthForm({
  title,
  description,
  action,
  submitLabel,
  pendingLabel,
  children,
  footer,
  hidden,
}: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, EMPTY_AUTH_STATE);

  return (
    <div>
      <h1 className="text-heading text-text-primary">{title}</h1>
      <p className="mt-1.5 text-small text-text-muted">{description}</p>

      <form action={formAction} className="mt-6 space-y-4">
        {hidden !== undefined &&
          Object.entries(hidden).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}

        {children}

        {state.error !== null && (
          <p role="alert" className="text-small text-danger">
            {state.error}
          </p>
        )}

        {state.message !== null && (
          <StatusIndicator
            status="complete"
            label={state.message}
            className="items-start text-small"
          />
        )}

        <Button type="submit" variant="primary" disabled={pending} className="w-full">
          {pending ? pendingLabel : submitLabel}
        </Button>
      </form>

      {footer !== undefined && <div className="mt-5 text-small text-text-muted">{footer}</div>}
    </div>
  );
}

/** A quiet inline link, matching the underline treatment used elsewhere. */
export function AuthLink({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary hover:decoration-text-muted"
    >
      {children}
    </Link>
  );
}
