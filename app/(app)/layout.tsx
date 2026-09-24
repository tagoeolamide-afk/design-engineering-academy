import type { ReactNode } from 'react';
import { AppShell } from '@/components/shell/app-shell';
import { SyncProvider } from '@/components/cloud/sync-provider';

/**
 * The learning application's frame.
 *
 * A route group, so every URL is exactly what it was — `/curriculum/...` did
 * not become `/(app)/curriculum/...`. The only reason it exists is to give the
 * authentication pages a way to opt out of the sidebar: showing primary
 * navigation and a progress readout to someone who is not signed in offers
 * links that would only bounce them back here.
 *
 * Deliberately not async and deliberately not reading cookies. Doing so would
 * opt this whole segment out of static generation and turn all 75 lesson pages
 * into per-request renders, for no benefit: the pages contain no user-specific
 * server markup — every figure is rendered on the client from the stores — and
 * access is already enforced by the proxy before a request reaches them. The
 * sync layer resolves the signed-in user in the browser instead.
 */
export default function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AppShell>
      <SyncProvider />
      {children}
    </AppShell>
  );
}
