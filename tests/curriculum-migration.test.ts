/**
 * The curriculum v1 -> v2 migration.
 *
 * The thing worth protecting here is not that records move — it is that nothing
 * is lost and nothing is credited falsely. Each test below asserts one of those
 * two, and every one has been seen to fail by breaking the behaviour first.
 */

import { describe, expect, it } from 'vitest';
import {
  applyCurriculumMigration,
  hasAnyProgress,
  migrateNotesForCurriculum,
  planCurriculumMigration,
} from '@/lib/progress/curriculum-migration';
import { CURRICULUM_VERSION } from '@/lib/curriculum/version';
import { getAllLessons, getModules } from '@/lib/curriculum/queries';
import { createLessonRecord, createProjectRecord } from '@/lib/progress/records';
import type { ProgressState } from '@/types/progress';
import type { Note, NotesState } from '@/types/notes';

const AT = '2026-01-01T00:00:00.000Z';

/** A real id from the current curriculum, so "resolves" means something. */
const CURRENT_LESSON_ID = getAllLessons()[0]!.lesson.id;
const CURRENT_PROJECT_ID = getModules()[0]!.project.id;

function emptyProgress(overrides: Partial<ProgressState> = {}): ProgressState {
  return {
    lessons: {},
    projects: {},
    lastVisitedLessonId: null,
    curriculumVersion: 0,
    legacy: null,
    ...overrides,
  };
}

function legacyLesson(id: string, reflection = '', exerciseNotes = '') {
  return {
    ...createLessonRecord(id),
    reachedEndAt: AT,
    exerciseCompletedAt: AT,
    reflectionAnswer: reflection,
    reflectionAnsweredAt: reflection === '' ? null : AT,
    exerciseNotes,
  };
}

const noNotes: NotesState = { notes: {} };

/* -------------------------------------------------------------------------- */

describe('planning the migration', () => {
  it('does not fire for a learner with no stored progress', () => {
    const plan = planCurriculumMigration(emptyProgress(), noNotes);
    expect(plan.needsUpgrade).toBe(false);
  });

  it('does not fire once the version is current', () => {
    const progress = emptyProgress({
      curriculumVersion: CURRICULUM_VERSION,
      lessons: { 'lesson-01-01': legacyLesson('lesson-01-01') },
    });

    expect(planCurriculumMigration(progress, noNotes).needsUpgrade).toBe(false);
  });

  it('fires when stored records refer to lessons that no longer exist', () => {
    const progress = emptyProgress({
      lessons: { 'lesson-01-01': legacyLesson('lesson-01-01') },
    });

    const plan = planCurriculumMigration(progress, noNotes);

    expect(plan.needsUpgrade).toBe(true);
    expect(plan.fromVersion).toBe(1);
    expect(plan.toVersion).toBe(CURRICULUM_VERSION);
    expect(plan.archivedLessonIds).toEqual(['lesson-01-01']);
    expect(plan.keptLessonIds).toEqual([]);
  });

  it('keeps records whose ids still resolve', () => {
    const progress = emptyProgress({
      lessons: {
        'lesson-01-01': legacyLesson('lesson-01-01'),
        [CURRENT_LESSON_ID]: legacyLesson(CURRENT_LESSON_ID),
      },
      projects: {
        'project-01': createProjectRecord('project-01', 'module-01'),
        [CURRENT_PROJECT_ID]: createProjectRecord(CURRENT_PROJECT_ID, 'module-01'),
      },
    });

    const plan = planCurriculumMigration(progress, noNotes);

    expect(plan.keptLessonIds).toEqual([CURRENT_LESSON_ID]);
    expect(plan.archivedLessonIds).toEqual(['lesson-01-01']);
    expect(plan.keptProjectIds).toEqual([CURRENT_PROJECT_ID]);
    expect(plan.archivedProjectIds).toEqual(['project-01']);
  });

  it('counts the writing inside archived records, because that is what would be missed', () => {
    const progress = emptyProgress({
      lessons: {
        'lesson-01-01': legacyLesson('lesson-01-01', 'A reflection I wrote.', 'Some notes.'),
        'lesson-01-02': legacyLesson('lesson-01-02', 'Another reflection.'),
        'lesson-01-03': legacyLesson('lesson-01-03'),
      },
      projects: {
        'project-01': {
          ...createProjectRecord('project-01', 'module-01'),
          links: {
            figma: 'https://figma.com/file/x',
            github: 'https://github.com/me/x',
            live: '',
            caseStudy: '',
          },
        },
      },
    });

    const plan = planCurriculumMigration(progress, noNotes);

    expect(plan.archivedReflections).toBe(2);
    expect(plan.archivedExerciseNotes).toBe(1);
    expect(plan.archivedProjectLinks).toBe(2);
  });

  it('flags a note attached to a module whose subject changed', () => {
    /* module-09 was Design Systems in v1 and is Accessibility in v2, so the id
     * still resolves — to the wrong thing. That is the silent case. */
    const note: Note = {
      id: 'note-1',
      title: 'Token naming',
      body: 'Semantic over primitive.',
      scope: { kind: 'module', moduleId: 'module-09' },
      tags: [],
      createdAt: AT,
      updatedAt: AT,
    };

    const plan = planCurriculumMigration(emptyProgress(), { notes: { 'note-1': note } });

    expect(plan.reattributedNoteIds).toEqual(['note-1']);
    expect(plan.orphanedNoteIds).toEqual([]);
    expect(plan.needsUpgrade).toBe(true);
  });

  it('flags a note attached to a lesson that no longer exists', () => {
    const note: Note = {
      id: 'note-2',
      title: 'Flexbox',
      body: 'justify vs align.',
      scope: { kind: 'lesson', lessonId: 'lesson-04-02', moduleId: 'module-04' },
      tags: [],
      createdAt: AT,
      updatedAt: AT,
    };

    const plan = planCurriculumMigration(emptyProgress(), { notes: { 'note-2': note } });

    expect(plan.orphanedNoteIds).toEqual(['note-2']);
  });
});

/* -------------------------------------------------------------------------- */

describe('applying the migration', () => {
  it('archives rather than deletes', () => {
    const record = legacyLesson('lesson-01-01', 'Worth keeping.');
    const progress = emptyProgress({ lessons: { 'lesson-01-01': record } });

    const migrated = applyCurriculumMigration(progress);

    expect(migrated.lessons['lesson-01-01']).toBeUndefined();
    expect(migrated.legacy?.lessons['lesson-01-01']?.reflectionAnswer).toBe('Worth keeping.');
    expect(migrated.legacy?.fromCurriculumVersion).toBe(1);
  });

  it('stamps the current version so the notice does not reappear', () => {
    const migrated = applyCurriculumMigration(
      emptyProgress({ lessons: { 'lesson-01-01': legacyLesson('lesson-01-01') } }),
    );

    expect(migrated.curriculumVersion).toBe(CURRICULUM_VERSION);
    expect(planCurriculumMigration(migrated, noNotes).needsUpgrade).toBe(false);
  });

  it('leaves resolvable records exactly as they were', () => {
    const kept = legacyLesson(CURRENT_LESSON_ID, 'Still mine.');
    const migrated = applyCurriculumMigration(
      emptyProgress({ lessons: { [CURRENT_LESSON_ID]: kept } }),
    );

    expect(migrated.lessons[CURRENT_LESSON_ID]).toEqual(kept);
    expect(migrated.legacy).toBeNull();
  });

  it('clears a last-visited pointer that no longer resolves', () => {
    const migrated = applyCurriculumMigration(
      emptyProgress({ lastVisitedLessonId: 'lesson-01-01' }),
    );

    expect(migrated.lastVisitedLessonId).toBeNull();
  });

  it('keeps a last-visited pointer that does resolve', () => {
    const migrated = applyCurriculumMigration(
      emptyProgress({ lastVisitedLessonId: CURRENT_LESSON_ID }),
    );

    expect(migrated.lastVisitedLessonId).toBe(CURRENT_LESSON_ID);
  });

  it('is idempotent, and a second run cannot discard the first archive', () => {
    const once = applyCurriculumMigration(
      emptyProgress({ lessons: { 'lesson-01-01': legacyLesson('lesson-01-01', 'Kept.') } }),
    );
    const twice = applyCurriculumMigration(once);

    expect(twice.legacy?.lessons['lesson-01-01']?.reflectionAnswer).toBe('Kept.');
    expect(twice.legacy?.archivedAt).toBe(once.legacy?.archivedAt);
    expect(twice.lessons).toEqual(once.lessons);
  });

  it('merges a new archive into an existing one', () => {
    const first = applyCurriculumMigration(
      emptyProgress({ lessons: { 'lesson-01-01': legacyLesson('lesson-01-01') } }),
    );

    /* A second legacy record arrives later, e.g. synced from another device. */
    const withMore: ProgressState = {
      ...first,
      lessons: { 'lesson-02-01': legacyLesson('lesson-02-01') },
      curriculumVersion: 0,
    };

    const merged = applyCurriculumMigration(withMore);

    expect(Object.keys(merged.legacy?.lessons ?? {}).sort()).toEqual([
      'lesson-01-01',
      'lesson-02-01',
    ]);
  });
});

/* -------------------------------------------------------------------------- */

describe('migrating notes', () => {
  function noteWith(scope: Note['scope'], body = 'Original body.'): NotesState {
    return {
      notes: {
        'note-1': {
          id: 'note-1',
          title: 'A note',
          body,
          scope,
          tags: [],
          createdAt: AT,
          updatedAt: AT,
        },
      },
    };
  }

  it('unpins a note from a module whose subject changed, keeping the writing', () => {
    const migrated = migrateNotesForCurriculum(
      noteWith({ kind: 'module', moduleId: 'module-09' }),
    );

    const note = migrated.notes['note-1'];
    expect(note?.scope.kind).toBe('free');
    expect(note?.title).toBe('A note');
    expect(note?.body).toContain('Original body.');
    expect(note?.body).toContain('module-09');
  });

  it('records what an orphaned note used to point at', () => {
    const migrated = migrateNotesForCurriculum(
      noteWith({ kind: 'lesson', lessonId: 'lesson-04-02', moduleId: 'module-04' }),
    );

    expect(migrated.notes['note-1']?.body).toContain('lesson-04-02');
  });

  it('leaves a note alone when its scope still means the same thing', () => {
    const state = noteWith({ kind: 'module', moduleId: 'module-01' });
    expect(migrateNotesForCurriculum(state)).toEqual(state);
  });

  it('leaves free notes alone', () => {
    const state = noteWith({ kind: 'free' });
    expect(migrateNotesForCurriculum(state)).toEqual(state);
  });
});

/* -------------------------------------------------------------------------- */

describe('hasAnyProgress', () => {
  it('is false for an untouched document', () => {
    expect(hasAnyProgress(emptyProgress())).toBe(false);
  });

  it('is true once anything is recorded', () => {
    expect(
      hasAnyProgress(emptyProgress({ lessons: { x: legacyLesson('x') } })),
    ).toBe(true);
  });
});
