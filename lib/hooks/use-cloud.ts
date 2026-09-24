'use client';

import { isCloudSettled, useSyncStore } from '@/stores/sync-store';

/**
 * Whether the stores hold the progress that should actually be shown.
 *
 * Local rehydration is no longer enough. With an account, the localStorage
 * copy is a cache that the cloud document is about to replace, so rendering it
 * first would flash last session's figures — or a confident 0% — before the
 * real numbers arrive.
 *
 * A failed load still counts as settled: falling back to the device's copy with
 * a visible warning is far better than an indefinite loading message.
 */
export function useCloudSettled(): boolean {
  return useSyncStore((state) => isCloudSettled(state.phase));
}
