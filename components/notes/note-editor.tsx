'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { SaveStatusLabel } from '@/components/ui/save-status';
import { Textarea } from '@/components/ui/textarea';
import { useAutosave } from '@/lib/hooks/use-autosave';
import { getAllLessons, getModules } from '@/lib/curriculum/queries';
import { useNotesStore } from '@/stores/notes-store';
import type { Note, NoteScope } from '@/types/notes';
import { ScopeLink } from './scope-link';

/* -------------------------------------------------------------------------- */
/* Scope encoding                                                              */
/* -------------------------------------------------------------------------- */

function encodeScope(scope: NoteScope): string {
  switch (scope.kind) {
    case 'free':
      return 'free';
    case 'lesson':
      return `lesson:${scope.lessonId}`;
    case 'module':
      return `module:${scope.moduleId}`;
    case 'project':
      return `project:${scope.projectId}`;
  }
}

/**
 * Turns the select's value back into a scope, resolving the owning module from
 * the curriculum so the stored scope is complete rather than half-filled.
 */
function decodeScope(value: string): NoteScope {
  const [kind, id] = value.split(':');
  if (id === undefined) return { kind: 'free' };

  if (kind === 'lesson') {
    const location = getAllLessons().find((entry) => entry.lesson.id === id);
    if (location === undefined) return { kind: 'free' };
    return { kind: 'lesson', lessonId: id, moduleId: location.courseModule.id };
  }

  if (kind === 'module') {
    return { kind: 'module', moduleId: id };
  }

  if (kind === 'project') {
    const courseModule = getModules().find((entry) => entry.project.id === id);
    if (courseModule === undefined) return { kind: 'free' };
    return { kind: 'project', projectId: id, moduleId: courseModule.id };
  }

  return { kind: 'free' };
}

/* -------------------------------------------------------------------------- */
/* Editor                                                                      */
/* -------------------------------------------------------------------------- */

interface NoteEditorProps {
  readonly note: Note;
  readonly onDeleted: () => void;
}

/**
 * Autosaving note editor.
 *
 * Writes after a short pause in typing rather than on every keystroke, and
 * again on blur so leaving the field never loses the last few characters. The
 * status is reported quietly next to the field — a note that saves itself
 * should not announce it.
 *
 * Keyed on note id by the parent, so switching notes remounts with fresh state
 * instead of syncing props into state inside an effect.
 */
export function NoteEditor({ note, onDeleted }: NoteEditorProps) {
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [scopeValue, setScopeValue] = useState(encodeScope(note.scope));
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { status, markEdited, flush } = useAutosave(() => {
    updateNote(note.id, { title, body, scope: decodeScope(scopeValue) });
  });

  const lessons = getAllLessons();
  const modules = getModules();

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-start justify-between gap-4">
        <TextField
          label="Title"
          hideLabel
          placeholder="Untitled note"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            markEdited();
          }}
          onBlur={flush}
          className="max-w-md"
        />

        <div className="flex shrink-0 items-center gap-2">
          <SaveStatusLabel status={status} />
          {confirmingDelete ? (
            <span className="inline-flex items-center gap-1.5">
              <Button
                variant="danger"
                size="small"
                onClick={() => {
                  deleteNote(note.id);
                  onDeleted();
                }}
              >
                Delete note
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setConfirmingDelete(false)}
              >
                Cancel
              </Button>
            </span>
          ) : (
            <Button
              variant="ghost"
              size="small"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 aria-hidden size={13} strokeWidth={1.75} />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <SelectField
          label="Attached to"
          value={scopeValue}
          onChange={(event) => {
            setScopeValue(event.target.value);
            markEdited();
          }}
          onBlur={flush}
          className="max-w-xs"
        >
          <option value="free">Global note</option>

          {lessons.length > 0 && (
            <optgroup label="Lessons">
              {lessons.map(({ lesson, courseModule }) => (
                <option key={lesson.id} value={`lesson:${lesson.id}`}>
                  {courseModule.title} · {lesson.title}
                </option>
              ))}
            </optgroup>
          )}

          {modules.length > 0 && (
            <optgroup label="Modules">
              {modules.map((courseModule) => (
                <option key={courseModule.id} value={`module:${courseModule.id}`}>
                  {courseModule.title}
                </option>
              ))}
            </optgroup>
          )}

          {modules.length > 0 && (
            <optgroup label="Projects">
              {modules.map((courseModule) => (
                <option
                  key={courseModule.project.id}
                  value={`project:${courseModule.project.id}`}
                >
                  {courseModule.project.title}
                </option>
              ))}
            </optgroup>
          )}
        </SelectField>

        <ScopeLink scope={decodeScope(scopeValue)} />
      </div>

      <Textarea
        label="Note"
        hideLabel
        className="mt-4"
        rows={16}
        placeholder="Write here. Saved automatically."
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
          markEdited();
        }}
        onBlur={flush}
      />
    </div>
  );
}
