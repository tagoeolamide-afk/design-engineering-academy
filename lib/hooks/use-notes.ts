'use client';

/** The read side of notes, filtered and sorted for the places that show them. */

import { useMemo } from 'react';
import { useMounted } from './use-mounted';
import { useCloudSettled } from './use-cloud';
import { useNotesStore } from '@/stores/notes-store';
import type { Note } from '@/types/notes';

/** Most recently edited first, which is the order every notes surface wants. */
export function useNotes(): readonly Note[] {
  const notes = useNotesStore((state) => state.notes);
  return useMemo(
    () => Object.values(notes).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes],
  );
}

export function useNotesHydrated(): boolean {
  const mounted = useMounted();
  const hasHydrated = useNotesStore((state) => state.hasHydrated);
  const cloudSettled = useCloudSettled();
  return mounted && hasHydrated && cloudSettled;
}

export function useNotesForLesson(lessonId: string): readonly Note[] {
  const notes = useNotes();
  return useMemo(
    () =>
      notes.filter((note) => note.scope.kind === 'lesson' && note.scope.lessonId === lessonId),
    [notes, lessonId],
  );
}

export function useNotesForModule(moduleId: string): readonly Note[] {
  const notes = useNotes();
  return useMemo(
    () =>
      notes.filter(
        (note) =>
          (note.scope.kind === 'module' && note.scope.moduleId === moduleId) ||
          (note.scope.kind === 'lesson' && note.scope.moduleId === moduleId) ||
          (note.scope.kind === 'project' && note.scope.moduleId === moduleId),
      ),
    [notes, moduleId],
  );
}
