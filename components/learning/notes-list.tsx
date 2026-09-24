'use client';

import { FileText } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useNotes, useNotesHydrated } from '@/lib/hooks/use-notes';

/**
 * Reads from the notes store. Authoring is built in a later stage; the store,
 * scoping model, and persistence behind this list are already complete.
 */
export function NotesList() {
  const notes = useNotes();
  const hydrated = useNotesHydrated();

  if (!hydrated) {
    return (
      <p className="text-small text-text-muted" role="status">
        Loading notes…
      </p>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No notes yet"
        description="Notes can be attached to a lesson, a module, or a project, or kept free-standing. Writing and editing arrive with the lesson experience."
      />
    );
  }

  return (
    <ul className="border-t border-border">
      {notes.map((note) => (
        <li key={note.id} className="border-b border-border py-4">
          <h2 className="text-small font-medium text-text-primary">{note.title}</h2>
          <p className="mt-1.5 line-clamp-3 text-small text-text-muted">{note.body}</p>
        </li>
      ))}
    </ul>
  );
}
