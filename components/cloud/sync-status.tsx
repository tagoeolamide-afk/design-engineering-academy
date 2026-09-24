'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSyncStore } from '@/stores/sync-store';
import { getActiveController } from '@/lib/cloud/sync-controller';

/**
 * The save indicator.
 *
 * Silent when there is nothing to say. "Saving…" and "Saved" are a single
 * muted line, because a working save is not news; only a failure earns the
 * learner's attention, and only a conflict earns a decision.
 */
export function SyncStatus() {
  const phase = useSyncStore((state) => state.phase);
  const saveState = useSyncStore((state) => state.saveState);
  const saveError = useSyncStore((state) => state.saveError);
  const [busy, setBusy] = useState(false);

  if (phase === 'disabled' || saveState === 'idle') return null;

  if (saveState === 'saving' || saveState === 'saved') {
    return (
      <p className="px-2.5 py-1 text-caption uppercase text-text-muted" role="status" aria-live="polite">
        {saveState === 'saving' ? 'Saving…' : 'Saved'}
      </p>
    );
  }

  const run = async (action: 'reload' | 'overwrite') => {
    setBusy(true);
    if (action === 'reload') await getActiveController()?.reloadFromCloud();
    else await getActiveController()?.forceOverwrite();
    setBusy(false);
  };

  return (
    <div className="px-2.5 py-1.5" role="alert">
      <p className="text-caption uppercase text-danger">
        {saveState === 'conflict' ? 'Newer version in cloud' : 'Could not save'}
      </p>
      <p className="mt-1 text-small text-text-muted">{saveError}</p>

      {saveState === 'conflict' && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Button size="small" variant="secondary" onClick={() => void run('reload')} disabled={busy}>
            Reload
          </Button>
          <Button size="small" variant="ghost" onClick={() => void run('overwrite')} disabled={busy}>
            Use this device
          </Button>
        </div>
      )}
    </div>
  );
}
