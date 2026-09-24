import { describe, expect, it } from 'vitest';
import {
  assertCurriculumIntegrity,
  checkCurriculumIntegrity,
} from '@/lib/curriculum/integrity';
import {
  clearStorageRecoveries,
  createVersionedStorage,
  getStorageRecoveries,
} from '@/lib/persistence/versioned-storage';
import { resolvePersistenceAdapter } from '@/lib/persistence/adapter';
import { migrateNotes, migrateProgress } from '@/lib/persistence/migrations';
import { migrateResourceLibrary } from '@/lib/persistence/migrations';
import { makeIndex, makeLesson, makeModule } from './fixtures/curriculum';
import type { CompetencyId } from '@/types/competency';

/* -------------------------------------------------------------------------- */
/* Malformed curriculum                                                        */
/* -------------------------------------------------------------------------- */

describe('curriculum validation tells a developer where to look', () => {
  it('names the file and the remedy for an unknown competency tag', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [
          makeLesson(1, 1, { competencyTags: ['not-a-competency' as CompetencyId] }),
        ],
      }),
    ]);

    const issue = checkCurriculumIntegrity(index).issues.find((i) =>
      i.message.includes('Unknown competency tag'),
    );

    expect(issue).toBeDefined();
    expect(issue?.severity).toBe('error');
    expect(issue?.file).toContain('content/modules/module-01-');
    expect(issue?.fix).toContain('COMPETENCY_IDS');
  });

  it('names the remedy for a prerequisite that does not resolve', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [makeLesson(1, 1, { prerequisiteLessonIds: ['lesson-does-not-exist'] })],
      }),
    ]);

    const issue = checkCurriculumIntegrity(index).issues.find((i) =>
      i.message.includes('does not resolve'),
    );

    expect(issue?.severity).toBe('error');
    expect(issue?.fix).toContain('prerequisiteLessonIds');
  });

  it('catches a prerequisite that can never be met in order', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [
          makeLesson(1, 1, { prerequisiteLessonIds: ['lesson-1-2'] }),
          makeLesson(1, 2),
        ],
      }),
    ]);

    const issue = checkCurriculumIntegrity(index).issues.find((i) =>
      i.message.includes('comes later in the course'),
    );

    expect(issue?.severity).toBe('error');
    expect(issue?.fix).toContain('earlier lesson');
  });

  it('catches a lesson whose moduleId contradicts its owner', () => {
    const index = makeIndex([
      makeModule(1, { lessons: [makeLesson(1, 1, { moduleId: 'module-9' })] }),
    ]);

    const issue = checkCurriculumIntegrity(index).issues.find((i) =>
      i.message.includes('does not match owning module'),
    );

    expect(issue?.severity).toBe('error');
    expect(issue?.fix).toContain('module-1');
  });

  it('throws a message carrying the file and the fix, not just the fault', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [makeLesson(1, 1, { competencyTags: ['nonsense' as CompetencyId] })],
      }),
    ]);

    expect(() => assertCurriculumIntegrity(index)).toThrowError(/Unknown competency tag/);

    try {
      assertCurriculumIntegrity(index);
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('file: content/modules/module-01-');
      expect(message).toContain('fix:');
    }
  });

  it('treats unwritten content as information, never as a failure', () => {
    const report = checkCurriculumIntegrity(makeIndex([makeModule(1, { lessonCount: 2 })]));

    expect(report.isValid).toBe(true);
    expect(report.issues.some((i) => i.severity === 'info')).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/* Persistence recovery                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Tests run in a node environment, so the persistence layer resolves to its
 * memory adapter. Seeding through that adapter exercises exactly the same
 * recovery path as a browser would, without mocking globals.
 */
function seed(entries: Record<string, string>) {
  const adapter = resolvePersistenceAdapter();
  for (const key of ['dea:progress', 'dea:notes', 'dea:progress:v1']) {
    adapter.removeItem(key);
  }
  for (const [key, value] of Object.entries(entries)) adapter.setItem(key, value);
  clearStorageRecoveries();
}

describe('persistence recovery', () => {
  it('treats unparseable JSON as absent rather than handing it to the store', () => {
    seed({ 'dea:progress': '{not valid json' });

    const storage = createVersionedStorage();
    expect(storage.getItem('dea:progress')).toBeNull();
    expect(getStorageRecoveries()).toContain('dea:progress');
  });

  it('treats a bare JSON scalar as damage, since envelopes are objects', () => {
    seed({ 'dea:notes': '"just a string"' });

    expect(createVersionedStorage().getItem('dea:notes')).toBeNull();
    expect(getStorageRecoveries()).toContain('dea:notes');
  });

  it('returns readable data untouched and records no recovery', () => {
    clearStorageRecoveries();
    const value = JSON.stringify({ state: { lessons: {} }, version: 2 });
    seed({ 'dea:progress': value });

    expect(createVersionedStorage().getItem('dea:progress')).toBe(value);
    expect(getStorageRecoveries()).toHaveLength(0);
  });

  it('falls through to a legacy key when the current one is damaged', () => {
    clearStorageRecoveries();
    const legacy = JSON.stringify({ state: { lessons: {} }, version: 1 });
    seed({ 'dea:progress': 'corrupt', 'dea:progress:v1': legacy });

    expect(createVersionedStorage(['dea:progress:v1']).getItem('dea:progress')).toBe(legacy);
  });

  it('reports nothing when a damaged legacy key is simply unused', () => {
    clearStorageRecoveries();
    const current = JSON.stringify({ state: { lessons: {} }, version: 2 });
    seed({ 'dea:progress': current, 'dea:progress:v1': 'corrupt' });

    expect(createVersionedStorage(['dea:progress:v1']).getItem('dea:progress')).toBe(current);
    expect(getStorageRecoveries()).toHaveLength(0);
  });

  it('recovers to a valid empty state from every shape of damage', () => {
    for (const damaged of [null, undefined, 0, '', 'text', [], { lessons: 'no' }]) {
      expect(() => migrateProgress(damaged, 1)).not.toThrow();
      expect(() => migrateNotes(damaged, 1)).not.toThrow();
      expect(() => migrateResourceLibrary(damaged, 1)).not.toThrow();
    }

    expect(migrateProgress('text', 1).lessons).toEqual({});
    expect(migrateNotes([], 1).notes).toEqual({});
    expect(migrateResourceLibrary(0, 1).marks).toEqual({});
  });
});
