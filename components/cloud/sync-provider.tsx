'use client';

import { useEffect } from 'react';
import { SyncController, setActiveController } from '@/lib/cloud/sync-controller';
import { tryGetBrowserSupabaseClient } from '@/lib/supabase/client';
import { useNotesStore } from '@/stores/notes-store';
import { useProgressStore } from '@/stores/progress-store';
import { useResourceStore } from '@/stores/resource-store';
import { useSyncStore } from '@/stores/sync-store';
import { CloudMigrationDialog } from './migration-dialog';

/**
 * Connects the three learning stores to the single cloud document.
 *
 * Mounted once, inside the application frame. It renders nothing of its own
 * except the two states that need the learner's attention — the first-session
 * import offer and a failed load — so no existing screen changes.
 *
 * The controller is registered as the session's active instance rather than
 * passed down: the save indicator and the error strip sit in different parts
 * of the frame and both need to act on it.
 */
export function SyncProvider() {
  useEffect(() => {
    const store = useSyncStore.getState();
    const client = tryGetBrowserSupabaseClient();

    /* No Supabase project: the application stays exactly as it was before
     * cloud sync — local-first, nothing gated. */
    if (client === null) {
      store.setPhase('disabled');
      return;
    }

    let cancelled = false;
    let controller: SyncController | null = null;

    /* Read from the session cookie rather than calling the auth endpoint: the
     * proxy has already refreshed and verified it on this very request, so a
     * second network round trip before the first paint buys nothing.
     *
     * Trusting it here is safe because it is not what protects the data. Every
     * read and write is authorised by Postgres against the JWT, so a tampered
     * id in the browser still cannot reach another user's row. */
    void client.auth.getSession().then(({ data }) => {
      const userId = data.session?.user.id ?? null;
      if (cancelled) return;

      store.setUserId(userId);
      if (userId === null) {
        store.setPhase('disabled');
        return;
      }

      controller = new SyncController(client, userId);
      setActiveController(controller);
      void controller.load();
    });

    /* Every learning change funnels through these three stores, so one
     * subscription each covers lesson progress, exercises, reflections,
     * projects, notes and resource marks without touching any component. */
    const schedule = () => controller?.schedule();
    const unsubscribers = [
      useProgressStore.subscribe(schedule),
      useNotesStore.subscribe(schedule),
      useResourceStore.subscribe(schedule),
    ];

    /* A closing or backgrounded tab should not take an unsaved change with it.
     * `visibilitychange` fires reliably on mobile, where `beforeunload` does
     * not. */
    const flushIfHidden = () => {
      if (document.visibilityState === 'hidden') void controller?.flush();
    };
    document.addEventListener('visibilitychange', flushIfHidden);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', flushIfHidden);
      for (const unsubscribe of unsubscribers) unsubscribe();
      void controller?.flush();
      controller?.dispose();
      setActiveController(null);
    };
  }, []);

  return <CloudMigrationDialog />;
}
