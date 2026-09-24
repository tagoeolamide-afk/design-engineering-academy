/**
 * Note searching and filtering.
 *
 * Pure functions over a note list so the behaviour can be tested without a
 * store, a router, or a rendered page.
 */

import type { Note, NoteScope } from '@/types/notes';

export type NoteScopeKind = NoteScope['kind'];

export interface NoteFilter {
  /** Free text, matched against title and body. */
  readonly query: string;
  readonly moduleId: string | null;
  readonly lessonId: string | null;
  readonly scopeKind: NoteScopeKind | null;
}

export const EMPTY_NOTE_FILTER: NoteFilter = {
  query: '',
  moduleId: null,
  lessonId: null,
  scopeKind: null,
};

/** The module a note belongs to, if any. Free notes belong to none. */
export function moduleIdOf(scope: NoteScope): string | null {
  switch (scope.kind) {
    case 'lesson':
    case 'project':
    case 'module':
      return scope.moduleId;
    case 'free':
      return null;
  }
}

export function lessonIdOf(scope: NoteScope): string | null {
  return scope.kind === 'lesson' ? scope.lessonId : null;
}

function matchesQuery(note: Note, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === '') return true;

  return (
    note.title.toLowerCase().includes(needle) ||
    note.body.toLowerCase().includes(needle) ||
    note.tags.some((tag) => tag.toLowerCase().includes(needle))
  );
}

/**
 * Filters are combined with AND: narrowing to a module and then typing a query
 * searches within that module rather than starting over.
 */
export function filterNotes(
  notes: readonly Note[],
  filter: NoteFilter,
): readonly Note[] {
  return notes.filter((note) => {
    if (!matchesQuery(note, filter.query)) return false;
    if (filter.scopeKind !== null && note.scope.kind !== filter.scopeKind) return false;
    if (filter.moduleId !== null && moduleIdOf(note.scope) !== filter.moduleId) {
      return false;
    }
    if (filter.lessonId !== null && lessonIdOf(note.scope) !== filter.lessonId) {
      return false;
    }
    return true;
  });
}

/** Most recently edited first. */
export function sortByRecentlyEdited(notes: readonly Note[]): readonly Note[] {
  return [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function isFilterActive(filter: NoteFilter): boolean {
  return (
    filter.query.trim() !== '' ||
    filter.moduleId !== null ||
    filter.lessonId !== null ||
    filter.scopeKind !== null
  );
}

/**
 * A note's display title.
 *
 * Titles are optional — a learner writing quickly should not have to name
 * something before they can write it — so an untitled note borrows its first
 * line rather than showing a blank row.
 */
export function displayTitle(note: Note): string {
  const title = note.title.trim();
  if (title !== '') return title;

  const firstLine = note.body.trim().split('\n')[0]?.trim() ?? '';
  if (firstLine === '') return 'Untitled note';

  return firstLine.length > 60 ? `${firstLine.slice(0, 60)}…` : firstLine;
}
