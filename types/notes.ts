/**
 * Notes are the learner's own writing, kept separate from progress because they
 * are authored content with a different lifecycle: progress records are small
 * facts the app writes, notes are documents the learner owns and edits.
 *
 * Reflection answers deliberately live in progress, not here — a reflection is a
 * completion requirement, a note is optional thinking.
 */

import type { Timestamp } from './progress';

/** What a note is attached to. Free notes belong to no particular place. */
export type NoteScope =
  | { readonly kind: 'lesson'; readonly lessonId: string; readonly moduleId: string }
  | { readonly kind: 'module'; readonly moduleId: string }
  | { readonly kind: 'project'; readonly projectId: string; readonly moduleId: string }
  | { readonly kind: 'free' };

export interface Note {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly scope: NoteScope;
  readonly tags: readonly string[];
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface NotesState {
  readonly notes: Readonly<Record<string, Note>>;
}
