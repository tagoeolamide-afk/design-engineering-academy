'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLessonProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { useProgressStore } from '@/stores/progress-store';

interface ReflectionProps {
  readonly lessonId: string;
  readonly question: string;
  readonly hint: string;
}

/**
 * The reflection: the question, an answer the learner writes and can revise,
 * and a hint that stays hidden until it is asked for.
 *
 * The hint is never revealed automatically. The value of a reflection is the
 * struggle before the answer, and a hint shown by default removes exactly that.
 */
export function Reflection({ lessonId, question, hint }: ReflectionProps) {
  const progress = useLessonProgress(lessonId);
  const hydrated = useProgressHydrated();

  return (
    <div>
      <p className="max-w-measure-narrow text-body text-text-primary">{question}</p>

      <div className="mt-6">
        {hydrated ? (
          <ReflectionEditor
            key={lessonId}
            lessonId={lessonId}
            initial={progress.reflectionAnswer}
          />
        ) : (
          <p className="text-small text-text-muted">Loading your answer…</p>
        )}
      </div>

      <HintDisclosure hint={hint} />
    </div>
  );
}

function ReflectionEditor({ lessonId, initial }: { lessonId: string; initial: string }) {
  const setReflectionAnswer = useProgressStore((state) => state.setReflectionAnswer);
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);

  const isDirty = draft !== saved;
  const hasSavedAnswer = saved.trim().length > 0;

  function save() {
    setReflectionAnswer(lessonId, draft);
    setSaved(draft);
  }

  return (
    <div>
      <Textarea
        label="Your answer"
        placeholder="There is no correct answer. Write what is actually true for you."
        rows={6}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        description="Saved on this device only. You can come back and revise it at any time."
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={save} disabled={!isDirty}>
          {hasSavedAnswer ? 'Save changes' : 'Save answer'}
        </Button>

        <span className="text-small text-text-muted" role="status">
          {isDirty
            ? 'Unsaved changes'
            : hasSavedAnswer
              ? 'Answer saved — this requirement is met'
              : 'No answer saved yet'}
        </span>
      </div>

      {/* Clearing the answer un-meets the requirement, so say so rather than
          letting the lesson quietly become incomplete. */}
      {!isDirty && !hasSavedAnswer && initial.trim().length > 0 && (
        <p className="mt-2 text-small text-warning">
          The saved answer is empty, so this lesson no longer counts as complete.
        </p>
      )}
    </div>
  );
}

function HintDisclosure({ hint }: { hint: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="mt-6 border-t border-border pt-4">
      <Button
        variant="ghost"
        onClick={() => setRevealed((current) => !current)}
        aria-expanded={revealed}
        aria-controls="reflection-hint"
      >
        {revealed ? (
          <EyeOff aria-hidden size={15} strokeWidth={1.75} />
        ) : (
          <Eye aria-hidden size={15} strokeWidth={1.75} />
        )}
        {revealed ? 'Hide hint' : 'Show hint'}
      </Button>

      {/* Kept in the DOM and hidden, so the control has something to point at
          and the state is announced rather than the content simply appearing. */}
      <p
        id="reflection-hint"
        hidden={!revealed}
        className="mt-3 max-w-measure-narrow border-l-2 border-accent py-1 pl-4 text-body text-text-secondary"
      >
        {hint}
      </p>
    </div>
  );
}
