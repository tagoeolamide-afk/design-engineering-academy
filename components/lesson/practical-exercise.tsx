'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { Textarea } from '@/components/ui/textarea';
import { useLessonProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatMinutes } from '@/lib/utils/format';
import { useProgressStore } from '@/stores/progress-store';
import type { PracticalExercise as Exercise } from '@/types/curriculum';

interface PracticalExerciseProps {
  readonly lessonId: string;
  readonly exercise: Exercise;
}

/**
 * The practical exercise: the brief, the steps, what counts as done, and the
 * checkbox that is one of the three completion requirements.
 *
 * Notes are optional and never affect completion — they are the learner's
 * scratch space, saved so the work survives a reload.
 */
export function PracticalExercise({ lessonId, exercise }: PracticalExerciseProps) {
  const progress = useLessonProgress(lessonId);
  const hydrated = useProgressHydrated();
  const setExerciseCompleted = useProgressStore((state) => state.setExerciseCompleted);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-heading text-text-primary">{exercise.title}</h3>
        <span className="text-caption uppercase text-text-muted" data-numeric>
          {formatMinutes(exercise.estimatedMinutes)}
        </span>
      </div>

      <p className="mt-3 text-body text-text-secondary">{exercise.prompt}</p>

      {exercise.steps.length > 0 && (
        <>
          <h4 className="mt-6 text-caption uppercase text-text-muted">Steps</h4>
          <ol className="mt-3 space-y-2 text-body text-text-secondary">
            {exercise.steps.map((step, index) => (
              <li key={step} className="grid grid-cols-[1.25rem_1fr] gap-x-2">
                <span className="pt-0.5 text-caption text-text-muted" data-numeric>
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {exercise.successCriteria.length > 0 && (
        <>
          <h4 className="mt-6 text-caption uppercase text-text-muted">
            You are done when
          </h4>
          <ul className="mt-3 space-y-2">
            {exercise.successCriteria.map((criterion) => (
              <li key={criterion}>
                <StatusIndicator
                  status="not-started"
                  label={criterion}
                  className="items-start text-body text-text-secondary [&>svg]:mt-1"
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {exercise.hint !== undefined && (
        <p className="mt-6 border-l-2 border-border py-1 pl-4 text-small text-text-muted">
          {exercise.hint}
        </p>
      )}

      <div className="mt-8 rounded-large border border-border bg-surface p-4">
        {hydrated ? (
          <>
            <Checkbox
              checked={progress.requirements.exerciseCompleted}
              onCheckedChange={(checked) => setExerciseCompleted(lessonId, checked)}
              label="I have completed this exercise"
              description="One of the three requirements for completing this lesson."
            />

            <ExerciseNotes key={lessonId} lessonId={lessonId} initial={progress.exerciseNotes} />
          </>
        ) : (
          <p className="text-small text-text-muted">Loading your progress…</p>
        )}
      </div>
    </div>
  );
}

/**
 * Notes are held as a local draft and written on an explicit save, rather than
 * on every keystroke. Typing is not a decision; saving is.
 *
 * Keyed on lessonId by the parent so the initial value is read once the store
 * has hydrated, which avoids syncing state inside an effect.
 */
function ExerciseNotes({ lessonId, initial }: { lessonId: string; initial: string }) {
  const setExerciseNotes = useProgressStore((state) => state.setExerciseNotes);
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);

  const isDirty = draft !== saved;

  function save() {
    setExerciseNotes(lessonId, draft);
    setSaved(draft);
  }

  return (
    <div className="mt-5 border-t border-border pt-5">
      <Textarea
        label="Working notes (optional)"
        placeholder="Anything you want to keep from doing the exercise."
        rows={4}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />

      <div className="mt-3 flex items-center gap-3">
        <Button onClick={save} disabled={!isDirty}>
          Save notes
        </Button>
        <span className="text-small text-text-muted" role="status">
          {isDirty
            ? 'Unsaved changes'
            : saved.trim().length === 0
              ? 'Nothing saved yet'
              : 'Saved'}
        </span>
      </div>
    </div>
  );
}
