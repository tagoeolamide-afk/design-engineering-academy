import { CloudOff, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getCurrentUser } from '@/lib/supabase/server';

/**
 * The account area.
 *
 * Deliberately small: an email address, the state of the connection, and a way
 * out. There is no profile to manage because there is one learner and nothing
 * about them to display.
 *
 * It also has to tell the truth in three different situations — no Supabase
 * project, signed in, and signed out — because saying "your progress is synced"
 * when it is not would be worse than saying nothing.
 */
export async function AccountPanel() {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;

  return (
    <section
      aria-labelledby="account-heading"
      className="mb-8 rounded-large border border-border bg-surface p-5"
    >
      <h2 id="account-heading" className="text-small font-medium text-text-primary">
        Account
      </h2>

      {!configured ? (
        <>
          <div className="mt-2.5 flex items-baseline gap-2">
            <CloudOff
              aria-hidden
              size={15}
              strokeWidth={1.75}
              className="shrink-0 translate-y-0.5 text-text-muted"
            />
            <p className="max-w-measure text-small text-text-secondary">
              No Supabase project is configured, so accounts and cloud sync are switched
              off. Everything you do is saved in this browser only.
            </p>
          </div>
          <p className="mt-2 text-small text-text-muted">
            Set <code className="font-mono text-code">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="font-mono text-code">
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            </code>{' '}
            to enable them — see <code className="font-mono text-code">.env.example</code>.
          </p>
        </>
      ) : user === null ? (
        <p className="mt-2.5 max-w-measure text-small text-text-secondary">
          You are not signed in.
        </p>
      ) : (
        <>
          <dl className="mt-4 border-t border-border">
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 border-b border-border py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <dt className="text-caption uppercase text-text-muted">Signed in as</dt>
              <dd className="min-w-0 break-words text-small text-text-primary">
                {user.email ?? 'Unknown address'}
              </dd>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <dt className="text-caption uppercase text-text-muted">Cloud state</dt>
              <dd className="min-w-0">
                <StatusIndicator status="complete" label="Connected" className="text-small" />
                <p className="mt-1 flex items-baseline gap-2 text-small text-text-muted">
                  <HardDrive
                    aria-hidden
                    size={13}
                    strokeWidth={2}
                    className="shrink-0 translate-y-0.5"
                  />
                  Lessons, exercises, reflections, notes, projects and resource marks
                  are saved to your account. This browser keeps a copy so the
                  application still works if the connection drops.
                </p>
              </dd>
            </div>
          </dl>

          <form action="/auth/sign-out" method="post" className="mt-4">
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </>
      )}
    </section>
  );
}
