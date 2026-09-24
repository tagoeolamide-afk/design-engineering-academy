/**
 * The cloud sync engine.
 *
 * These cover the behaviour the learner actually depends on: the cloud wins on
 * load, work is never destroyed without being asked about, writes coalesce,
 * and every failure leaves the application usable with the device's own copy.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SyncController, SAVE_DEBOUNCE_MS } from '@/lib/cloud/sync-controller';
import {
  EMPTY_LEARNING_STATE_DATA,
  normalizeLearningStateData,
  type LearningStateData,
} from '@/lib/cloud/learning-state';
import { hasMeaningfulProgress, summarizeLocalProgress } from '@/lib/cloud/local-snapshot';
import { useProgressStore } from '@/stores/progress-store';
import { useNotesStore } from '@/stores/notes-store';
import { useResourceStore } from '@/stores/resource-store';
import { useSyncStore } from '@/stores/sync-store';
import { createFakeSupabase, makeRow } from './fixtures/fake-supabase';
import { completedLesson } from './fixtures/progress';

const USER = 'user-1';

function resetStores(): void {
  useProgressStore.getState().hydrateFromCloud({
    lessons: {},
    projects: {},
    lastVisitedLessonId: null,
  });
  useNotesStore.getState().hydrateFromCloud({});
  useResourceStore.getState().hydrateFromCloud({});
  useSyncStore.setState({
    phase: 'disabled',
    saveState: 'idle',
    baseline: null,
    loadError: null,
    saveError: null,
    localSummary: null,
  });
}

function stateWith(lessonId: string): LearningStateData {
  return normalizeLearningStateData({
    ...EMPTY_LEARNING_STATE_DATA,
    progress: {
      lessons: { [lessonId]: completedLesson(lessonId) },
      projects: {},
      lastVisitedLessonId: lessonId,
    },
  });
}

beforeEach(() => {
  resetStores();
});

afterEach(() => {
  vi.useRealTimers();
});

/* -------------------------------------------------------------------------- */
/* Loading                                                                     */
/* -------------------------------------------------------------------------- */

describe('loading the learning document', () => {
  it('hydrates from the cloud and replaces whatever the device held', async () => {
    /* The device believes lesson 1 is done; the cloud says lesson 2 is. */
    useProgressStore.getState().hydrateFromCloud(stateWith('lesson-01-01').progress);

    const fake = createFakeSupabase(makeRow(stateWith('lesson-02-01'), USER));
    await new SyncController(fake.client, USER).load();

    const lessons = useProgressStore.getState().lessons;
    expect(Object.keys(lessons)).toEqual(['lesson-02-01']);
    expect(useSyncStore.getState().phase).toBe('ready');
  });

  it('reads the whole document in a single request', async () => {
    const fake = createFakeSupabase(makeRow(stateWith('lesson-01-01'), USER));
    await new SyncController(fake.client, USER).load();

    /* One row, one request — never one per lesson. */
    expect(fake.counts.select).toBe(1);
  });

  it('creates an empty record for a fresh account with a clean device', async () => {
    const fake = createFakeSupabase(null);
    await new SyncController(fake.client, USER).load();

    expect(fake.counts.insert).toBe(1);
    expect(useSyncStore.getState().phase).toBe('ready');
    expect(useProgressStore.getState().lessons).toEqual({});
  });

  it('asks before touching anything when the device holds work and the cloud is empty', async () => {
    useProgressStore.getState().hydrateFromCloud(stateWith('lesson-01-01').progress);

    const fake = createFakeSupabase(null);
    await new SyncController(fake.client, USER).load();

    expect(useSyncStore.getState().phase).toBe('choosing');
    /* Crucially: nothing written, and the local work still intact. */
    expect(fake.counts.insert).toBe(0);
    expect(fake.counts.upsert).toBe(0);
    expect(Object.keys(useProgressStore.getState().lessons)).toEqual(['lesson-01-01']);
  });

  it('falls back to the device copy when the load fails, rather than blanking', async () => {
    useProgressStore.getState().hydrateFromCloud(stateWith('lesson-01-01').progress);

    const fake = createFakeSupabase(null);
    fake.failWith = new Error('fetch failed');
    await new SyncController(fake.client, USER).load();

    const sync = useSyncStore.getState();
    expect(sync.phase).toBe('error');
    expect(sync.loadError).toMatch(/No connection/i);
    /* The learner still sees their work. */
    expect(Object.keys(useProgressStore.getState().lessons)).toEqual(['lesson-01-01']);
  });
});

/* -------------------------------------------------------------------------- */
/* The first-session choice                                                    */
/* -------------------------------------------------------------------------- */

describe('importing existing device progress', () => {
  it('uploads, verifies by reading back, then hydrates from the cloud', async () => {
    useProgressStore.getState().hydrateFromCloud(stateWith('lesson-01-01').progress);
    useNotesStore.getState().hydrateFromCloud({
      'note-1': {
        id: 'note-1',
        title: 'Kept',
        body: 'Body',
        scope: { kind: 'free' },
        tags: [],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    });

    const fake = createFakeSupabase(null);
    const controller = new SyncController(fake.client, USER);
    await controller.load();
    expect(useSyncStore.getState().phase).toBe('choosing');

    await controller.importLocalProgress();

    expect(useSyncStore.getState().phase).toBe('ready');
    expect(fake.row?.data.progress.lessons['lesson-01-01']).toBeDefined();
    expect(fake.row?.data.notes['note-1']?.title).toBe('Kept');
    /* Read back after writing, not trusted blindly. */
    expect(fake.counts.select).toBeGreaterThanOrEqual(2);
  });

  it('keeps the offer open and loses nothing when the import fails', async () => {
    useProgressStore.getState().hydrateFromCloud(stateWith('lesson-01-01').progress);

    const fake = createFakeSupabase(null);
    const controller = new SyncController(fake.client, USER);
    await controller.load();

    fake.failWith = new Error('fetch failed');
    await controller.importLocalProgress();

    expect(useSyncStore.getState().phase).toBe('choosing');
    expect(useSyncStore.getState().saveState).toBe('error');
    expect(Object.keys(useProgressStore.getState().lessons)).toEqual(['lesson-01-01']);
  });

  it('starts fresh with an empty record when that is chosen', async () => {
    useProgressStore.getState().hydrateFromCloud(stateWith('lesson-01-01').progress);

    const fake = createFakeSupabase(null);
    const controller = new SyncController(fake.client, USER);
    await controller.load();
    await controller.startFresh();

    expect(useSyncStore.getState().phase).toBe('ready');
    expect(useProgressStore.getState().lessons).toEqual({});
    expect(fake.row?.data.progress.lessons).toEqual({});
  });
});

/* -------------------------------------------------------------------------- */
/* Saving                                                                      */
/* -------------------------------------------------------------------------- */

describe('saving changes', () => {
  it('coalesces a burst of changes into one write', async () => {
    vi.useFakeTimers();

    const fake = createFakeSupabase(makeRow(EMPTY_LEARNING_STATE_DATA, USER));
    const controller = new SyncController(fake.client, USER);
    await controller.load();

    const before = fake.counts.update;
    for (let i = 0; i < 10; i++) {
      useProgressStore.getState().setReflectionAnswer('lesson-01-01', `draft ${i}`);
      controller.schedule();
      vi.advanceTimersByTime(100);
    }

    /* Still nothing written: the debounce keeps re-arming. */
    expect(fake.counts.update).toBe(before);

    await vi.advanceTimersByTimeAsync(SAVE_DEBOUNCE_MS + 50);

    expect(fake.counts.update).toBe(before + 1);
    expect(fake.row?.data.progress.lessons['lesson-01-01']?.reflectionAnswer).toBe('draft 9');
  });

  it('reports saved and records the new baseline', async () => {
    const fake = createFakeSupabase(makeRow(EMPTY_LEARNING_STATE_DATA, USER));
    const controller = new SyncController(fake.client, USER);
    await controller.load();

    const baselineBefore = useSyncStore.getState().baseline;
    useProgressStore.getState().setExerciseCompleted('lesson-01-01', true);
    await controller.flush();

    const sync = useSyncStore.getState();
    expect(sync.saveState).toBe('saved');
    expect(sync.baseline).not.toBe(baselineBefore);
    expect(sync.baseline).toBe(fake.row?.updated_at);
  });

  it('keeps the work and explains itself when a save fails', async () => {
    const fake = createFakeSupabase(makeRow(EMPTY_LEARNING_STATE_DATA, USER));
    const controller = new SyncController(fake.client, USER);
    await controller.load();

    fake.failWith = new Error('fetch failed');
    useProgressStore.getState().setExerciseCompleted('lesson-01-01', true);
    await controller.flush();

    expect(useSyncStore.getState().saveState).toBe('error');
    expect(useSyncStore.getState().saveError).toMatch(/safe on this device/i);
    /* The change is still in the store, so a retry or reload keeps it. */
    expect(
      useProgressStore.getState().lessons['lesson-01-01']?.exerciseCompletedAt,
    ).not.toBeNull();
  });
});

/* -------------------------------------------------------------------------- */
/* Two devices                                                                 */
/* -------------------------------------------------------------------------- */

describe('conflicting devices', () => {
  it('refuses to flatten a newer version written elsewhere', async () => {
    const fake = createFakeSupabase(makeRow(EMPTY_LEARNING_STATE_DATA, USER));
    const controller = new SyncController(fake.client, USER);
    await controller.load();

    /* Another device saves after this one read. */
    fake.touchFromAnotherDevice(stateWith('lesson-09-01'));
    const theirUpdatedAt = fake.row?.updated_at;

    useProgressStore.getState().setExerciseCompleted('lesson-01-01', true);
    await controller.flush();

    expect(useSyncStore.getState().saveState).toBe('conflict');
    /* Their version is still the one in the cloud. */
    expect(fake.row?.updated_at).toBe(theirUpdatedAt);
    expect(fake.row?.data.progress.lessons['lesson-01-01']).toBeUndefined();
  });

  it('can take the cloud version, discarding this device’s change', async () => {
    const fake = createFakeSupabase(makeRow(EMPTY_LEARNING_STATE_DATA, USER));
    const controller = new SyncController(fake.client, USER);
    await controller.load();

    fake.touchFromAnotherDevice(stateWith('lesson-09-01'));
    useProgressStore.getState().setExerciseCompleted('lesson-01-01', true);
    await controller.flush();

    await controller.reloadFromCloud();

    expect(useSyncStore.getState().phase).toBe('ready');
    expect(Object.keys(useProgressStore.getState().lessons)).toEqual(['lesson-09-01']);
  });

  it('can overwrite the cloud when the learner explicitly chooses to', async () => {
    const fake = createFakeSupabase(makeRow(EMPTY_LEARNING_STATE_DATA, USER));
    const controller = new SyncController(fake.client, USER);
    await controller.load();

    fake.touchFromAnotherDevice(stateWith('lesson-09-01'));
    useProgressStore.getState().setExerciseCompleted('lesson-01-01', true);
    await controller.flush();
    expect(useSyncStore.getState().saveState).toBe('conflict');

    await controller.forceOverwrite();

    expect(useSyncStore.getState().saveState).toBe('saved');
    expect(fake.row?.data.progress.lessons['lesson-01-01']).toBeDefined();
  });
});

/* -------------------------------------------------------------------------- */
/* Payload safety                                                              */
/* -------------------------------------------------------------------------- */

describe('reading back damaged or partial documents', () => {
  it('survives an empty object', () => {
    const data = normalizeLearningStateData({});
    expect(data.progress.lessons).toEqual({});
    expect(data.preferences.theme).toBe('system');
  });

  it.each([null, undefined, 42, 'text', []])('survives %p', (value) => {
    expect(() => normalizeLearningStateData(value)).not.toThrow();
    expect(normalizeLearningStateData(value).progress.lastVisitedLessonId).toBeNull();
  });

  it('drops a nonsense theme rather than applying it', () => {
    expect(
      normalizeLearningStateData({ preferences: { theme: 'neon' } }).preferences.theme,
    ).toBe('system');
  });

  it('keeps sections that are present when others are missing', () => {
    const data = normalizeLearningStateData({
      progress: { lastVisitedLessonId: 'lesson-03-02' },
    });
    expect(data.progress.lastVisitedLessonId).toBe('lesson-03-02');
    expect(data.notes).toEqual({});
  });
});

/* -------------------------------------------------------------------------- */
/* What counts as work worth keeping                                           */
/* -------------------------------------------------------------------------- */

describe('detecting device progress', () => {
  it('does not treat an untouched store as progress', () => {
    expect(hasMeaningfulProgress(EMPTY_LEARNING_STATE_DATA)).toBe(false);
  });

  it('counts a started lesson', () => {
    expect(hasMeaningfulProgress(stateWith('lesson-01-01'))).toBe(true);
  });

  it('counts notes and resource marks on their own', () => {
    expect(
      hasMeaningfulProgress({
        ...EMPTY_LEARNING_STATE_DATA,
        resources: {
          'r-1': { resourceId: 'r-1', status: 'saved', markedAt: '2026-01-01T00:00:00.000Z' },
        },
      }),
    ).toBe(true);
  });

  it('summarises what would be imported', () => {
    const summary = summarizeLocalProgress(stateWith('lesson-01-01'));
    expect(summary.lessonsTouched).toBe(1);
    expect(summary.reflections).toBe(1);
    expect(summary.notes).toBe(0);
  });
});
