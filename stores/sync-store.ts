'use client';

/**
 * The state of cloud synchronisation.
 *
 * Deliberately not persisted: it describes this tab's relationship with the
 * server right now, and restoring "saving…" from a previous session would be
 * a lie. The learning data itself lives in the three existing stores; this one
 * only says whether they can be trusted yet and whether writes are landing.
 */

import { create } from 'zustand';
import type { LocalProgressSummary } from '@/lib/cloud/local-snapshot';

export type CloudPhase =
  /** No Supabase project, or nobody signed in: the application is local-only. */
  | 'disabled'
  /** Fetching the learning document. Progress must not render yet. */
  | 'loading'
  /** Cloud is empty but this device holds work. Waiting for the learner. */
  | 'choosing'
  /** Hydrated from the cloud. Saves are active. */
  | 'ready'
  /** The load failed. Local data is shown, with a retry. */
  | 'error';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'conflict';

interface SyncState {
  readonly phase: CloudPhase;
  readonly saveState: SaveState;
  readonly userId: string | null;
  /** The row's updated_at as this tab last saw it — the conflict guard. */
  readonly baseline: string | null;
  readonly lastSavedAt: string | null;
  readonly loadError: string | null;
  readonly saveError: string | null;
  /** What an import would bring across, for the prompt. */
  readonly localSummary: LocalProgressSummary | null;

  setPhase: (phase: CloudPhase) => void;
  setSaveState: (saveState: SaveState, error?: string | null) => void;
  setBaseline: (updatedAt: string | null) => void;
  setUserId: (userId: string | null) => void;
  setLoadError: (message: string | null) => void;
  setLocalSummary: (summary: LocalProgressSummary | null) => void;
  markSaved: (updatedAt: string) => void;
}

export const useSyncStore = create<SyncState>()((set) => ({
  phase: 'disabled',
  saveState: 'idle',
  userId: null,
  baseline: null,
  lastSavedAt: null,
  loadError: null,
  saveError: null,
  localSummary: null,

  setPhase: (phase) => set({ phase }),
  setSaveState: (saveState, error = null) => set({ saveState, saveError: error }),
  setBaseline: (baseline) => set({ baseline }),
  setUserId: (userId) => set({ userId }),
  setLoadError: (loadError) => set({ loadError }),
  setLocalSummary: (localSummary) => set({ localSummary }),
  markSaved: (updatedAt) =>
    set({
      saveState: 'saved',
      saveError: null,
      baseline: updatedAt,
      lastSavedAt: updatedAt,
    }),
}));

/**
 * Whether the stores can be trusted to show real progress.
 *
 * `error` counts as settled on purpose: a failed cloud load must fall back to
 * whatever the device holds rather than leave the learner on a loading message
 * for ever. The retry banner says the data may be stale.
 */
export function isCloudSettled(phase: CloudPhase): boolean {
  return phase === 'disabled' || phase === 'ready' || phase === 'error';
}
