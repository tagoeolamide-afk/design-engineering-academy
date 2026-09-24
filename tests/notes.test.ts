import { describe, expect, it } from 'vitest';
import {
  displayTitle,
  EMPTY_NOTE_FILTER,
  filterNotes,
  isFilterActive,
  lessonIdOf,
  moduleIdOf,
  sortByRecentlyEdited,
} from '@/lib/notes/filter';
import type { Note, NoteScope } from '@/types/notes';

function makeNote(overrides: Partial<Note> & { id: string }): Note {
  return {
    title: '',
    body: '',
    scope: { kind: 'free' },
    tags: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const LESSON_SCOPE: NoteScope = {
  kind: 'lesson',
  lessonId: 'lesson-01-01',
  moduleId: 'module-01',
};
const MODULE_SCOPE: NoteScope = { kind: 'module', moduleId: 'module-01' };
const OTHER_MODULE_SCOPE: NoteScope = { kind: 'module', moduleId: 'module-02' };
const PROJECT_SCOPE: NoteScope = {
  kind: 'project',
  projectId: 'project-01',
  moduleId: 'module-01',
};

const NOTES: readonly Note[] = [
  makeNote({ id: 'global', title: 'Reading list', body: 'Statecharts paper' }),
  makeNote({ id: 'lesson', title: 'State map', body: 'Five states', scope: LESSON_SCOPE }),
  makeNote({ id: 'module', title: 'Module plan', body: 'Build order', scope: MODULE_SCOPE }),
  makeNote({ id: 'project', title: 'Submission', body: 'Repo link', scope: PROJECT_SCOPE }),
  makeNote({ id: 'other', title: 'Elsewhere', body: 'Nothing', scope: OTHER_MODULE_SCOPE }),
];

describe('scope readers', () => {
  it('report the owning module for every attached scope', () => {
    expect(moduleIdOf(LESSON_SCOPE)).toBe('module-01');
    expect(moduleIdOf(MODULE_SCOPE)).toBe('module-01');
    expect(moduleIdOf(PROJECT_SCOPE)).toBe('module-01');
    expect(moduleIdOf({ kind: 'free' })).toBeNull();
  });

  it('report a lesson only for lesson scopes', () => {
    expect(lessonIdOf(LESSON_SCOPE)).toBe('lesson-01-01');
    expect(lessonIdOf(MODULE_SCOPE)).toBeNull();
  });
});

describe('search', () => {
  it('returns everything when the query is empty', () => {
    expect(filterNotes(NOTES, EMPTY_NOTE_FILTER)).toHaveLength(NOTES.length);
  });

  it('matches title and body, ignoring case', () => {
    expect(
      filterNotes(NOTES, { ...EMPTY_NOTE_FILTER, query: 'STATE MAP' }).map((n) => n.id),
    ).toEqual(['lesson']);

    expect(
      filterNotes(NOTES, { ...EMPTY_NOTE_FILTER, query: 'repo' }).map((n) => n.id),
    ).toEqual(['project']);
  });

  it('matches tags', () => {
    const tagged = [makeNote({ id: 'tagged', tags: ['accessibility'] })];

    expect(
      filterNotes(tagged, { ...EMPTY_NOTE_FILTER, query: 'accessib' }),
    ).toHaveLength(1);
  });

  it('ignores surrounding whitespace in the query', () => {
    expect(
      filterNotes(NOTES, { ...EMPTY_NOTE_FILTER, query: '   ' }),
    ).toHaveLength(NOTES.length);
  });
});

describe('filters', () => {
  it('narrows to a module, including its lesson and project notes', () => {
    const result = filterNotes(NOTES, { ...EMPTY_NOTE_FILTER, moduleId: 'module-01' });

    expect(result.map((n) => n.id).sort()).toEqual(['lesson', 'module', 'project']);
  });

  it('narrows to a single lesson', () => {
    const result = filterNotes(NOTES, {
      ...EMPTY_NOTE_FILTER,
      lessonId: 'lesson-01-01',
    });

    expect(result.map((n) => n.id)).toEqual(['lesson']);
  });

  it('narrows by scope kind', () => {
    expect(
      filterNotes(NOTES, { ...EMPTY_NOTE_FILTER, scopeKind: 'free' }).map((n) => n.id),
    ).toEqual(['global']);
  });

  it('combines filters with AND rather than restarting', () => {
    const result = filterNotes(NOTES, {
      ...EMPTY_NOTE_FILTER,
      moduleId: 'module-01',
      query: 'plan',
    });

    expect(result.map((n) => n.id)).toEqual(['module']);
  });

  it('can return nothing without throwing', () => {
    expect(
      filterNotes(NOTES, { ...EMPTY_NOTE_FILTER, moduleId: 'module-99' }),
    ).toEqual([]);
  });

  it('knows whether a filter is doing anything', () => {
    expect(isFilterActive(EMPTY_NOTE_FILTER)).toBe(false);
    expect(isFilterActive({ ...EMPTY_NOTE_FILTER, query: '  ' })).toBe(false);
    expect(isFilterActive({ ...EMPTY_NOTE_FILTER, query: 'x' })).toBe(true);
    expect(isFilterActive({ ...EMPTY_NOTE_FILTER, moduleId: 'm' })).toBe(true);
  });
});

describe('recently edited', () => {
  it('sorts by last edit, newest first', () => {
    const notes = [
      makeNote({ id: 'old', updatedAt: '2026-01-01T00:00:00.000Z' }),
      makeNote({ id: 'new', updatedAt: '2026-03-01T00:00:00.000Z' }),
      makeNote({ id: 'mid', updatedAt: '2026-02-01T00:00:00.000Z' }),
    ];

    expect(sortByRecentlyEdited(notes).map((n) => n.id)).toEqual(['new', 'mid', 'old']);
  });

  it('does not mutate the input', () => {
    const notes = [
      makeNote({ id: 'a', updatedAt: '2026-01-01T00:00:00.000Z' }),
      makeNote({ id: 'b', updatedAt: '2026-02-01T00:00:00.000Z' }),
    ];

    sortByRecentlyEdited(notes);
    expect(notes.map((n) => n.id)).toEqual(['a', 'b']);
  });
});

describe('display title', () => {
  it('prefers the title', () => {
    expect(displayTitle(makeNote({ id: 'a', title: 'Named', body: 'Body' }))).toBe(
      'Named',
    );
  });

  it('falls back to the first line of the body', () => {
    expect(
      displayTitle(makeNote({ id: 'a', body: 'First line\nSecond line' })),
    ).toBe('First line');
  });

  it('truncates a very long first line', () => {
    const long = 'x'.repeat(200);
    const result = displayTitle(makeNote({ id: 'a', body: long }));

    expect(result.length).toBeLessThanOrEqual(61);
    expect(result.endsWith('…')).toBe(true);
  });

  it('names a genuinely empty note rather than showing a blank row', () => {
    expect(displayTitle(makeNote({ id: 'a' }))).toBe('Untitled note');
    expect(displayTitle(makeNote({ id: 'a', title: '   ', body: '  \n ' }))).toBe(
      'Untitled note',
    );
  });
});
