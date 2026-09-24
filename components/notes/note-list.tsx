'use client';

import { useMounted } from '@/lib/hooks/use-mounted';
import { displayTitle } from '@/lib/notes/filter';
import { describeScope, SCOPE_KIND_LABELS } from '@/lib/notes/scope';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import type { Note } from '@/types/notes';

interface NoteListProps {
  readonly notes: readonly Note[];
  readonly selectedId: string | null;
  readonly onSelect: (noteId: string) => void;
}

/** Most recently edited first — the order someone returning to their notes wants. */
export function NoteList({ notes, selectedId, onSelect }: NoteListProps) {
  const mounted = useMounted();

  return (
    <ul className="border-t border-border">
      {notes.map((note) => {
        const described = describeScope(note.scope);
        const isSelected = note.id === selectedId;

        return (
          <li key={note.id}>
            <button
              type="button"
              onClick={() => onSelect(note.id)}
              aria-current={isSelected ? 'true' : undefined}
              className={cn(
                'block w-full border-b border-l-2 border-border px-3 py-3 text-left transition-colors duration-100',
                isSelected
                  ? 'border-l-accent bg-surface-hover'
                  : 'border-l-transparent hover:bg-surface-hover active:bg-surface-active',
              )}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-small font-medium text-text-primary">
                  {displayTitle(note)}
                </span>
                <span className="shrink-0 text-caption text-text-muted" data-numeric>
                  {mounted ? formatRelativeTime(note.updatedAt) : ''}
                </span>
              </span>

              <span className="mt-1 block truncate text-caption uppercase text-text-muted">
                {SCOPE_KIND_LABELS[described.kind]}
                {described.kind !== 'free' && <span> · {described.label}</span>}
              </span>

              {note.body.trim() !== '' && (
                <span className="mt-1.5 line-clamp-2 block text-small text-text-muted">
                  {note.body}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
