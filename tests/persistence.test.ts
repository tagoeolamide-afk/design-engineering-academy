import { describe, expect, it } from 'vitest';
import {
  EMPTY_NOTES_STATE,
  EMPTY_PROGRESS_STATE,
  migrateNotes,
  migrateProgress,
} from '@/lib/persistence/migrations';
import {
  LEGACY_STORAGE_KEYS,
  RESETTABLE_NOTES_KEYS,
  RESETTABLE_PROGRESS_KEYS,
  STORAGE_KEYS,
} from '@/lib/persistence/keys';

/** A realistic v1 progress payload, as written by the previous build. */
const V1_PROGRESS = {
  lessons: {
    'lesson-01-01': {
      lessonId: 'lesson-01-01',
      startedAt: '2026-01-01T09:00:00.000Z',
      lastVisitedAt: '2026-01-01T10:00:00.000Z',
      reachedEndAt: '2026-01-01T09:40:00.000Z',
      exerciseCompletedAt: '2026-01-01T09:50:00.000Z',
      reflectionAnswer: 'Constraints are what I neglect.',
      reflectionAnsweredAt: '2026-01-01T09:55:00.000Z',
    },
  },
  projects: {
    'project-01': {
      projectId: 'project-01',
      moduleId: 'module-01',
      status: 'submitted',
      startedAt: '2026-01-02T09:00:00.000Z',
      submittedAt: '2026-01-03T09:00:00.000Z',
      completedAt: null,
      submissionUrl: 'https://example.com/build',
      notes: 'Shipped the state map.',
    },
  },
};

describe('keys', () => {
  it('carry no version, so raising a version cannot orphan stored data', () => {
    for (const key of Object.values(STORAGE_KEYS)) {
      expect(key).not.toMatch(/:v\d+$/);
    }
  });

  it('list the legacy keys a reset has to clear as well', () => {
    /* Missing these would let the next page load re-adopt the copy the learner
     * just asked to delete. */
    for (const legacy of LEGACY_STORAGE_KEYS.progress) {
      expect(RESETTABLE_PROGRESS_KEYS).toContain(legacy);
    }
    for (const legacy of LEGACY_STORAGE_KEYS.notes) {
      expect(RESETTABLE_NOTES_KEYS).toContain(legacy);
    }
    expect(RESETTABLE_PROGRESS_KEYS).toContain(STORAGE_KEYS.progress);
    expect(RESETTABLE_NOTES_KEYS).toContain(STORAGE_KEYS.notes);
  });
});

describe('progress migration', () => {
  it('carries every v1 field forward without loss', () => {
    const migrated = migrateProgress(V1_PROGRESS, 1);
    const lesson = migrated.lessons['lesson-01-01'];
    const project = migrated.projects['project-01'];

    expect(lesson?.startedAt).toBe('2026-01-01T09:00:00.000Z');
    expect(lesson?.reachedEndAt).toBe('2026-01-01T09:40:00.000Z');
    expect(lesson?.exerciseCompletedAt).toBe('2026-01-01T09:50:00.000Z');
    expect(lesson?.reflectionAnswer).toBe('Constraints are what I neglect.');
    expect(lesson?.reflectionAnsweredAt).toBe('2026-01-01T09:55:00.000Z');

    /* 'submitted' was retired; it must land on its nearest surviving meaning
     * rather than resetting the learner's project to untouched. */
    expect(project?.status).toBe('reviewing');
    expect(project?.links.live).toBe('https://example.com/build');
    expect(project?.notes).toBe('Shipped the state map.');
  });

  it('defaults fields added after v1', () => {
    const migrated = migrateProgress(V1_PROGRESS, 1);

    expect(migrated.lessons['lesson-01-01']?.exerciseNotes).toBe('');
    expect(migrated.lastVisitedLessonId).toBeNull();
  });

  it('converts the original boolean reachedEnd into a timestamp', () => {
    /* The very first shape stored a flag. Dropping it would silently un-complete
     * lessons the learner had finished. */
    const ancient = {
      lessons: {
        'lesson-01-01': {
          lessonId: 'lesson-01-01',
          startedAt: '2026-01-01T09:00:00.000Z',
          lastVisitedAt: '2026-01-01T10:00:00.000Z',
          reachedEnd: true,
          exerciseCompletedAt: null,
          reflectionAnswer: '',
          reflectionAnsweredAt: null,
        },
      },
      projects: {},
    };

    expect(migrateProgress(ancient, 1).lessons['lesson-01-01']?.reachedEndAt).toBe(
      '2026-01-01T10:00:00.000Z',
    );
  });

  it('keys every record by its map key, even when the inner id disagrees', () => {
    const mismatched = {
      lessons: { 'lesson-a': { lessonId: 'something-else', startedAt: null } },
      projects: {},
    };

    const migrated = migrateProgress(mismatched, 1);
    expect(migrated.lessons['lesson-a']?.lessonId).toBe('lesson-a');
  });

  it('survives corrupt input rather than taking the app down', () => {
    expect(migrateProgress(null, 1)).toEqual(EMPTY_PROGRESS_STATE);
    expect(migrateProgress('nonsense', 1)).toEqual(EMPTY_PROGRESS_STATE);
    expect(migrateProgress([], 1)).toEqual(EMPTY_PROGRESS_STATE);
    expect(migrateProgress({ lessons: 'not an object' }, 1)).toEqual(
      EMPTY_PROGRESS_STATE,
    );
  });

  it('replaces a nonsense project status with a safe one', () => {
    const bad = {
      lessons: {},
      projects: { 'project-01': { moduleId: 'module-01', status: 'exploded' } },
    };

    expect(migrateProgress(bad, 1).projects['project-01']?.status).toBe('not-started');
  });

  it('drops half-written records to a valid empty record', () => {
    const partial = { lessons: { 'lesson-01-01': null }, projects: {} };
    const lesson = migrateProgress(partial, 1).lessons['lesson-01-01'];

    expect(lesson?.lessonId).toBe('lesson-01-01');
    expect(lesson?.startedAt).toBeNull();
    expect(lesson?.reflectionAnswer).toBe('');
  });

  it('is idempotent, so a re-run never degrades data', () => {
    const once = migrateProgress(V1_PROGRESS, 1);
    const twice = migrateProgress(once, 2);

    expect(twice).toEqual(once);
  });
});

describe('notes migration', () => {
  const V1_NOTES = {
    notes: {
      'note-1': {
        id: 'note-1',
        title: 'State map',
        body: 'Five states, two undesigned.',
        scope: { kind: 'lesson', lessonId: 'lesson-01-01', moduleId: 'module-01' },
        tags: ['states'],
        createdAt: '2026-01-01T09:00:00.000Z',
        updatedAt: '2026-01-02T09:00:00.000Z',
      },
    },
  };

  it('carries notes forward intact', () => {
    const note = migrateNotes(V1_NOTES, 1).notes['note-1'];

    expect(note?.title).toBe('State map');
    expect(note?.body).toBe('Five states, two undesigned.');
    expect(note?.scope).toEqual({
      kind: 'lesson',
      lessonId: 'lesson-01-01',
      moduleId: 'module-01',
    });
    expect(note?.tags).toEqual(['states']);
  });

  it('falls back to a global scope when the scope is unreadable', () => {
    const broken = {
      notes: { 'note-1': { title: 'x', body: 'y', scope: { kind: 'wat' } } },
    };

    expect(migrateNotes(broken, 1).notes['note-1']?.scope).toEqual({ kind: 'free' });
  });

  it('keeps a note that lost its timestamps rather than discarding the writing', () => {
    const undated = { notes: { 'note-1': { title: 'Kept', body: 'Still mine.' } } };
    const note = migrateNotes(undated, 1).notes['note-1'];

    expect(note?.title).toBe('Kept');
    expect(note?.updatedAt).toBe(new Date(0).toISOString());
  });

  it('survives corrupt input', () => {
    expect(migrateNotes(undefined, 1)).toEqual(EMPTY_NOTES_STATE);
    expect(migrateNotes({ notes: 42 }, 1)).toEqual(EMPTY_NOTES_STATE);
  });

  it('is idempotent', () => {
    const once = migrateNotes(V1_NOTES, 1);
    expect(migrateNotes(once, 2)).toEqual(once);
  });
});
