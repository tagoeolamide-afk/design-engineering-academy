'use client';

import { FileText, Plus, Search, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { getAllLessons, getModules } from '@/lib/curriculum/queries';
import { useNotes, useNotesHydrated } from '@/lib/hooks/use-notes';
import { formatCountOf } from '@/lib/utils/format';
import {
  EMPTY_NOTE_FILTER,
  filterNotes,
  isFilterActive,
  sortByRecentlyEdited,
  type NoteFilter,
} from '@/lib/notes/filter';
import { useNotesStore } from '@/stores/notes-store';
import { NoteEditor } from './note-editor';
import { NoteList } from './note-list';

/**
 * The notes surface: a filtered list beside an autosaving editor.
 *
 * Two panes on wide viewports, and on narrow ones the editor replaces the list
 * once a note is opened — writing on a phone should not be squeezed into half a
 * screen.
 */
export function NotesWorkspace() {
  const notes = useNotes();
  const hydrated = useNotesHydrated();
  const createNote = useNotesStore((state) => state.createNote);

  const [filter, setFilter] = useState<NoteFilter>(EMPTY_NOTE_FILTER);

  /* Global search links straight to a note, so the id can arrive in the URL.
   * It seeds the selection; from then on the learner's choice wins, including
   * deselecting. The param is an entry point, not a source of truth. */
  const requestedId = useSearchParams().get('note');
  const [selectedId, setSelectedId] = useState<string | null>(requestedId);
  const [seededFrom, setSeededFrom] = useState<string | null>(requestedId);

  if (requestedId !== seededFrom) {
    /* A different id arrived while this view was already mounted — searching
     * for a second note without leaving the page. Adopted during render rather
     * than in an effect, which would show the previous note for a frame. */
    setSeededFrom(requestedId);
    setSelectedId(requestedId);
  }

  const visible = useMemo(
    () => sortByRecentlyEdited(filterNotes(notes, filter)),
    [notes, filter],
  );

  const selected = notes.find((note) => note.id === selectedId) ?? null;

  const modules = getModules();
  const lessons = getAllLessons();

  function startNewNote() {
    const id = createNote({ title: '', body: '', scope: { kind: 'free' } });
    setFilter(EMPTY_NOTE_FILTER);
    setSelectedId(id);
  }

  if (!hydrated) {
    return (
      <p className="text-small text-text-muted" role="status">
        Loading notes…
      </p>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[22rem_1fr] lg:gap-10">
      {/* List pane. Hidden on narrow screens while a note is open. */}
      <div className={selected === null ? 'block' : 'hidden lg:block'}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-caption uppercase text-text-muted">
            {isFilterActive(filter)
              ? `${visible.length} of ${formatCountOf(notes.length, 'note')}`
              : formatCountOf(notes.length, 'note')}
          </h2>
          <Button variant="primary" size="small" onClick={startNewNote}>
            <Plus aria-hidden size={13} strokeWidth={2} />
            New note
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          <TextField
            label="Search notes"
            hideLabel
            type="search"
            placeholder="Search titles and text"
            leading={<Search aria-hidden size={15} strokeWidth={1.75} />}
            value={filter.query}
            onChange={(event) =>
              setFilter((current) => ({ ...current, query: event.target.value }))
            }
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <SelectField
              label="Module"
              hideLabel
              value={filter.moduleId ?? ''}
              onChange={(event) =>
                setFilter((current) => ({
                  ...current,
                  moduleId: event.target.value === '' ? null : event.target.value,
                }))
              }
            >
              <option value="">All modules</option>
              {modules.map((courseModule) => (
                <option key={courseModule.id} value={courseModule.id}>
                  {courseModule.title}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Lesson"
              hideLabel
              value={filter.lessonId ?? ''}
              onChange={(event) =>
                setFilter((current) => ({
                  ...current,
                  lessonId: event.target.value === '' ? null : event.target.value,
                }))
              }
            >
              <option value="">All lessons</option>
              {lessons.map(({ lesson, courseModule }) => (
                <option key={lesson.id} value={lesson.id}>
                  {courseModule.title} · {lesson.title}
                </option>
              ))}
            </SelectField>
          </div>

          {isFilterActive(filter) && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => setFilter(EMPTY_NOTE_FILTER)}
            >
              <X aria-hidden size={13} strokeWidth={2} />
              Clear filters
            </Button>
          )}
        </div>

        <div className="mt-5">
          {visible.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={
                notes.length === 0 ? 'No notes yet' : 'No notes match these filters'
              }
              description={
                notes.length === 0
                  ? 'Notes can be global, or attached to a lesson, a module, or a project. Everything is saved on this device.'
                  : 'Try a different search, or clear the filters to see everything again.'
              }
            />
          ) : (
            <NoteList
              notes={visible}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </div>
      </div>

      {/* Editor pane. */}
      <div className={selected === null ? 'hidden lg:block' : 'block'}>
        {selected === null ? (
          <div className="hidden h-full items-center justify-center rounded-large border border-dashed border-border p-8 lg:flex">
            <p className="max-w-xs text-center text-small text-text-muted">
              Select a note to read or edit it, or start a new one.
            </p>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="small"
              className="mb-4 lg:hidden"
              onClick={() => setSelectedId(null)}
            >
              Back to all notes
            </Button>

            <NoteEditor
              key={selected.id}
              note={selected}
              onDeleted={() => setSelectedId(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}
