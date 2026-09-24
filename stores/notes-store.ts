'use client';

/**
 * The notes store.
 *
 * Separate from progress because notes have a different lifecycle: they are
 * documents the learner writes and edits, not facts the app records. Keeping
 * them in their own persisted key also means resetting progress never destroys
 * the learner's writing.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  LEGACY_STORAGE_KEYS,
  NOTES_SCHEMA_VERSION,
  STORAGE_KEYS,
} from '@/lib/persistence/keys';
import { migrateNotes } from '@/lib/persistence/migrations';
import { createVersionedStorage } from '@/lib/persistence/versioned-storage';
import { nowTimestamp } from '@/lib/progress/records';
import type { Note, NoteScope, NotesState } from '@/types/notes';

export interface NoteDraft {
  readonly title: string;
  readonly body: string;
  readonly scope: NoteScope;
  readonly tags?: readonly string[];
}

interface NotesActions {
  /** Returns the id of the created note so the caller can focus or link to it. */
  createNote: (draft: NoteDraft) => string;
  updateNote: (
    noteId: string,
    patch: Partial<Pick<Note, 'title' | 'body' | 'tags' | 'scope'>>,
  ) => void;
  deleteNote: (noteId: string) => void;
  deleteAllNotes: () => void;

  /**
   * Replaces everything with the cloud document.
   *
   * Used only by the sync layer on load and after an import. Kept as an action
   * rather than an external setState so the one place allowed to overwrite the
   * learner's work is named and greppable.
   */
  hydrateFromCloud: (notes: NotesState['notes']) => void;
}

interface NotesHydration {
  readonly hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export type NotesStore = NotesState & NotesActions & NotesHydration;

function createNoteId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      notes: {},
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      createNote: (draft) => {
        const id = createNoteId();
        const timestamp = nowTimestamp();
        const note: Note = {
          id,
          title: draft.title,
          body: draft.body,
          scope: draft.scope,
          tags: draft.tags ?? [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({ notes: { ...state.notes, [id]: note } }));
        return id;
      },

      updateNote: (noteId, patch) =>
        set((state) => {
          const existing = state.notes[noteId];
          if (existing === undefined) return state;
          return {
            notes: {
              ...state.notes,
              [noteId]: { ...existing, ...patch, updatedAt: nowTimestamp() },
            },
          };
        }),

      deleteNote: (noteId) =>
        set((state) => {
          if (state.notes[noteId] === undefined) return state;
          const next = { ...state.notes };
          delete next[noteId];
          return { notes: next };
        }),

      deleteAllNotes: () => set({ notes: {} }),

      hydrateFromCloud: (notes) => set({ notes }),
    }),
    {
      name: STORAGE_KEYS.notes,
      version: NOTES_SCHEMA_VERSION,
      storage: createJSONStorage(() => createVersionedStorage(LEGACY_STORAGE_KEYS.notes)),
      migrate: (persisted, fromVersion) => migrateNotes(persisted, fromVersion),
      partialize: (state): NotesState => ({ notes: state.notes }),
      /* Marked hydrated even when rehydration failed. zustand calls this with
       * an undefined state on error, and a store that never reports hydration
       * leaves every dependent view pinned on its loading message. */
      onRehydrateStorage: () => (state, error) => {
        if (error !== undefined) {
          console.warn('[persistence] notes could not rehydrate; starting empty.', error);
        }
        (state ?? useNotesStore.getState()).setHasHydrated(true);
      },
    },
  ),
);
