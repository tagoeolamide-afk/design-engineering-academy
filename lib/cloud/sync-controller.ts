'use client';

/**
 * The cloud sync controller.
 *
 * One object per signed-in session. It owns the three things that must not be
 * spread across components: when the learning document is loaded, when it is
 * written back, and what happens when either fails.
 *
 * Shape of the contract:
 *
 *   load()      once per session. One request for one row — never one per
 *               lesson. The cloud wins; local contents are replaced.
 *   schedule()  called on every store change. Debounced and coalesced, so a
 *               burst of keystrokes is a single write.
 *   flush()     forces the pending write out, e.g. when the tab is hidden.
 *
 * Writes are guarded by the row's updated_at. A write that would flatten a
 * newer version from another device is refused and surfaced rather than
 * applied, which is the whole of the conflict strategy — this is one person's
 * learning log, not a collaborative document.
 */

import type { LearningStateClient } from './learning-state-repository';
import {
  createLearningState,
  getLearningState,
  saveLearningState,
  saveLearningStateIfUnchanged,
} from './learning-state-repository';
import {
  applyLearningState,
  hasMeaningfulProgress,
  readLocalLearningStateForUpload,
  summarizeLocalProgress,
} from './local-snapshot';
import { EMPTY_LEARNING_STATE_DATA, type LearningStateData } from './learning-state';
import { useSyncStore } from '@/stores/sync-store';

/** Long enough to coalesce typing, short enough to survive a closed tab. */
export const SAVE_DEBOUNCE_MS = 1200;

/** How long "Saved" stays on screen before the indicator goes quiet again. */
export const SAVED_VISIBLE_MS = 2000;

function describe(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/fetch failed|network|ENOTFOUND|ECONNREFUSED|timeout/i.test(message)) {
    return 'No connection to the cloud. Your work is safe on this device and will be saved when the connection returns.';
  }
  return message;
}

export class SyncController {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private inFlight = false;
  /** A change arrived while a save was running; write again when it lands. */
  private dirty = false;
  private savedTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  constructor(
    private readonly client: LearningStateClient,
    private readonly userId: string,
  ) {}

  private get store() {
    return useSyncStore.getState();
  }

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                 */
  /* ---------------------------------------------------------------------- */

  async load(): Promise<void> {
    const store = this.store;
    store.setPhase('loading');
    store.setLoadError(null);

    try {
      const existing = await getLearningState(this.client);

      if (existing !== null) {
        /* The cloud is the source of truth. Whatever this device held is
         * replaced — that is the point of the stage. */
        applyLearningState(existing.data);
        store.setBaseline(existing.updatedAt);
        store.setPhase('ready');
        return;
      }

      /* No row yet. If the device holds real work this is the one moment it
       * could be lost, so ask instead of deciding. */
      const local = readLocalLearningStateForUpload();
      if (hasMeaningfulProgress(local)) {
        store.setLocalSummary(summarizeLocalProgress(local));
        store.setPhase('choosing');
        return;
      }

      const created = await createLearningState(
        this.client,
        this.userId,
        EMPTY_LEARNING_STATE_DATA,
      );
      applyLearningState(created.data);
      store.setBaseline(created.updatedAt);
      store.setPhase('ready');
    } catch (error) {
      /* Never a blank screen: fall through to whatever the device holds and
       * say that it may be stale. */
      store.setLoadError(describe(error));
      store.setPhase('error');
    }
  }

  /** Re-runs the load after a failure. */
  async retry(): Promise<void> {
    await this.load();
  }

  /* ---------------------------------------------------------------------- */
  /* The first-session choice                                                */
  /* ---------------------------------------------------------------------- */

  /** Uploads this device's work, verifies it landed, then hydrates from it. */
  async importLocalProgress(): Promise<void> {
    const store = this.store;
    store.setSaveState('saving');

    try {
      const local = readLocalLearningStateForUpload();
      await saveLearningState(this.client, this.userId, local);

      /* Read back rather than trusting the write: "verify successful save"
       * means the cloud actually holds it, not that the request returned. */
      const confirmed = await getLearningState(this.client);
      if (confirmed === null) {
        throw new Error('The imported progress could not be read back.');
      }

      applyLearningState(confirmed.data);
      store.setBaseline(confirmed.updatedAt);
      store.markSaved(confirmed.updatedAt);
      store.setPhase('ready');
      this.scheduleSavedReset();
    } catch (error) {
      store.setSaveState('error', describe(error));
      /* Stay in `choosing`: the offer is still open and nothing was lost. */
    }
  }

  /** Starts an empty cloud record, discarding what this device held. */
  async startFresh(): Promise<void> {
    const store = this.store;
    store.setSaveState('saving');

    try {
      const created = await createLearningState(
        this.client,
        this.userId,
        EMPTY_LEARNING_STATE_DATA,
      );
      applyLearningState(created.data);
      store.setBaseline(created.updatedAt);
      store.setSaveState('idle');
      store.setPhase('ready');
    } catch (error) {
      store.setSaveState('error', describe(error));
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Saving                                                                  */
  /* ---------------------------------------------------------------------- */

  schedule(): void {
    if (this.disposed) return;
    if (this.store.phase !== 'ready') return;

    if (this.inFlight) {
      this.dirty = true;
      return;
    }

    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      void this.write();
    }, SAVE_DEBOUNCE_MS);
  }

  /** Writes any pending change immediately. */
  async flush(): Promise<void> {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.store.phase !== 'ready') return;
    await this.write();
  }

  /** Overwrites the cloud with this device's state, conflict or not. */
  async forceOverwrite(): Promise<void> {
    const store = this.store;
    store.setSaveState('saving');
    try {
      const saved = await saveLearningState(
        this.client,
        this.userId,
        readLocalLearningStateForUpload(),
      );
      store.markSaved(saved.updatedAt);
      this.scheduleSavedReset();
    } catch (error) {
      store.setSaveState('error', describe(error));
    }
  }

  /** Discards local changes and re-reads the cloud. */
  async reloadFromCloud(): Promise<void> {
    this.dirty = false;
    await this.load();
    this.store.setSaveState('idle');
  }

  private async write(): Promise<void> {
    if (this.disposed) return;

    const store = this.store;
    const baseline = store.baseline;
    if (baseline === null) return;

    this.timer = null;
    this.inFlight = true;
    this.dirty = false;
    store.setSaveState('saving');

    try {
      const payload: LearningStateData = readLocalLearningStateForUpload();
      const result = await saveLearningStateIfUnchanged(
        this.client,
        this.userId,
        payload,
        baseline,
      );

      if (result.ok) {
        store.markSaved(result.state.updatedAt);
        this.scheduleSavedReset();
      } else {
        /* Somebody else wrote first. Do not retry the write — that is exactly
         * the silent overwrite this guard exists to prevent. */
        store.setSaveState(
          'conflict',
          'A newer version of your progress was saved from another device. Reload it, or overwrite it with this device.',
        );
        this.dirty = false;
      }
    } catch (error) {
      store.setSaveState('error', describe(error));
    } finally {
      this.inFlight = false;
      /* A change landed mid-flight, so the write that just finished is already
       * out of date. */
      if (this.dirty && this.store.saveState !== 'conflict') this.schedule();
    }
  }

  private scheduleSavedReset(): void {
    if (this.savedTimer !== null) clearTimeout(this.savedTimer);
    this.savedTimer = setTimeout(() => {
      if (useSyncStore.getState().saveState === 'saved') {
        useSyncStore.getState().setSaveState('idle');
      }
    }, SAVED_VISIBLE_MS);
  }

  dispose(): void {
    this.disposed = true;
    if (this.timer !== null) clearTimeout(this.timer);
    if (this.savedTimer !== null) clearTimeout(this.savedTimer);
  }
}

/* -------------------------------------------------------------------------- */
/* The active controller                                                       */
/* -------------------------------------------------------------------------- */

/**
 * There is exactly one sync session per signed-in tab, so the controller is
 * held here rather than threaded through props. The status indicator and the
 * error strip sit in different parts of the tree and both need to act on it.
 */
let active: SyncController | null = null;

export function setActiveController(controller: SyncController | null): void {
  active = controller;
}

export function getActiveController(): SyncController | null {
  return active;
}
