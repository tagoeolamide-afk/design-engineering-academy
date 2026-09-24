'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SaveStatusLabel } from '@/components/ui/save-status';
import { Textarea } from '@/components/ui/textarea';
import { useAutosave } from '@/lib/hooks/use-autosave';
import { useProgressHydrated, useProjectRecord } from '@/lib/hooks/use-progress';
import { useProgressStore } from '@/stores/progress-store';

/**
 * Working notes for the build.
 *
 * Autosaved like the notes surface, because this is scratch space kept while
 * working rather than an answer being committed to.
 */
export function ProjectNotes({
  projectId,
  moduleId,
}: {
  projectId: string;
  moduleId: string;
}) {
  const record = useProjectRecord(projectId);
  const hydrated = useProgressHydrated();

  if (!hydrated) {
    return (
      <p className="text-small text-text-muted" role="status">
        Loading notes…
      </p>
    );
  }

  return (
    <NotesEditor
      key={projectId}
      projectId={projectId}
      moduleId={moduleId}
      initial={record?.notes ?? ''}
    />
  );
}

function NotesEditor({
  projectId,
  moduleId,
  initial,
}: {
  projectId: string;
  moduleId: string;
  initial: string;
}) {
  const setProjectNotes = useProgressStore((state) => state.setProjectNotes);
  const [draft, setDraft] = useState(initial);

  const { status, markEdited, flush } = useAutosave(() => {
    setProjectNotes(projectId, moduleId, draft);
  });

  return (
    <div>
      <Textarea
        label="Working notes"
        hideLabel
        rows={6}
        placeholder="Decisions, blockers, things to come back to. Saved automatically."
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          markEdited();
        }}
        onBlur={flush}
      />
      <SaveStatusLabel status={status} className="mt-2 block text-caption text-text-muted" />
    </div>
  );
}

/**
 * The project reflection.
 *
 * Explicit save rather than autosave, matching the lesson reflection: this is
 * an answer the learner commits to, not scratch space. The hint pattern is the
 * same too — nothing is revealed until it is asked for.
 */
export function ProjectReflection({
  projectId,
  moduleId,
  question,
}: {
  projectId: string;
  moduleId: string;
  question: string;
}) {
  const record = useProjectRecord(projectId);
  const hydrated = useProgressHydrated();

  return (
    <div>
      <p className="max-w-measure-narrow text-body text-text-primary">{question}</p>

      <div className="mt-4">
        {hydrated ? (
          <ReflectionEditor
            key={projectId}
            projectId={projectId}
            moduleId={moduleId}
            initial={record?.reflectionAnswer ?? ''}
          />
        ) : (
          <p className="text-small text-text-muted">Loading your answer…</p>
        )}
      </div>
    </div>
  );
}

function ReflectionEditor({
  projectId,
  moduleId,
  initial,
}: {
  projectId: string;
  moduleId: string;
  initial: string;
}) {
  const setProjectReflection = useProgressStore((state) => state.setProjectReflection);
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);

  const isDirty = draft !== saved;
  const hasAnswer = saved.trim().length > 0;

  return (
    <div>
      <Textarea
        label="Your answer"
        rows={6}
        placeholder="Written after the build, while it is still fresh."
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          disabled={!isDirty}
          onClick={() => {
            setProjectReflection(projectId, moduleId, draft);
            setSaved(draft);
          }}
        >
          {hasAnswer ? 'Save changes' : 'Save answer'}
        </Button>
        <span className="text-small text-text-muted" role="status">
          {isDirty ? 'Unsaved changes' : hasAnswer ? 'Answer saved' : 'No answer saved yet'}
        </span>
      </div>
    </div>
  );
}

/**
 * What a finished build demonstrates.
 *
 * Listed before the work starts as well as after it, so the learner knows what
 * they are building toward. It only reads as *evidence* once the project is
 * completed — before that it is a target, and the wording says so.
 */
export function PortfolioEvidence({
  projectId,
  evidence,
  title,
}: {
  projectId: string;
  evidence: readonly string[];
  title: string;
}) {
  const record = useProjectRecord(projectId);
  const hydrated = useProgressHydrated();
  const [showBeforeCompletion, setShowBeforeCompletion] = useState(false);

  const isComplete = hydrated && record?.status === 'completed';

  if (evidence.length === 0) return null;

  /* One persistent toggle that owns the list, rather than swapping one button
   * for another: replacing the trigger destroys focus the moment it is pressed,
   * and leaves the "hide" control with no expanded state to report. The list
   * stays in the DOM and is hidden, so the control always has something to
   * point at — the same pattern as the reflection hint. */
  const listId = `portfolio-evidence-${projectId}`;
  const revealed = isComplete || showBeforeCompletion;

  return (
    <div>
      <p className="max-w-measure text-small text-text-muted">
        {isComplete
          ? 'Completed. This build demonstrates the following, and can be described that way in a portfolio.'
          : 'Finishing this project will demonstrate the following. It becomes portfolio evidence once the status is Completed.'}
      </p>

      {/* Before completion the list is a target; it is available but not
          asserted, so an unfinished project never reads as proof. */}
      <ul
        id={listId}
        hidden={!revealed}
        aria-label={`Portfolio evidence for ${title}`}
        className="mt-4 flex flex-wrap gap-1.5"
      >
        {evidence.map((item) => (
          <li
            key={item}
            className={
              isComplete
                ? 'rounded-small border border-transparent bg-success-subtle px-2 py-1 text-caption uppercase text-success'
                : 'rounded-small border border-border px-2 py-1 text-caption uppercase text-text-muted'
            }
          >
            {item}
          </li>
        ))}
      </ul>

      {!isComplete && (
        <Button
          variant="ghost"
          size="small"
          className="mt-3"
          onClick={() => setShowBeforeCompletion((current) => !current)}
          aria-expanded={showBeforeCompletion}
          aria-controls={listId}
        >
          {showBeforeCompletion ? (
            <EyeOff aria-hidden size={13} strokeWidth={1.75} />
          ) : (
            <Eye aria-hidden size={13} strokeWidth={1.75} />
          )}
          {showBeforeCompletion ? 'Hide' : 'Show what this will demonstrate'}
        </Button>
      )}
    </div>
  );
}
