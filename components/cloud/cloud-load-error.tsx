'use client';

import { CloudOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSyncStore } from '@/stores/sync-store';
import { getActiveController } from '@/lib/cloud/sync-controller';

/**
 * Shown when the learning document could not be loaded.
 *
 * The application keeps working on whatever this device holds — a failed
 * network request must never produce a blank screen — so this is a quiet strip
 * above the content saying the figures may be out of date, not a takeover.
 */
export function CloudLoadError() {
  const phase = useSyncStore((state) => state.phase);
  const loadError = useSyncStore((state) => state.loadError);
  const [retrying, setRetrying] = useState(false);

  if (phase !== 'error') return null;

  const retry = async () => {
    setRetrying(true);
    await getActiveController()?.retry();
    setRetrying(false);
  };

  return (
    <div
      role="status"
      className="border-b border-border bg-warning-subtle px-4 py-2.5 md:px-8"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <CloudOff aria-hidden size={15} strokeWidth={1.75} className="shrink-0 text-warning" />
        <p className="min-w-0 flex-1 text-small text-text-secondary">
          Showing progress saved on this device — the cloud copy could not be loaded.
          {loadError !== null && <span className="text-text-muted"> {loadError}</span>}
        </p>
        <Button variant="secondary" size="small" onClick={() => void retry()} disabled={retrying}>
          {retrying ? 'Retrying…' : 'Retry'}
        </Button>
      </div>
    </div>
  );
}
