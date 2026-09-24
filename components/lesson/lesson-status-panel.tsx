'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { PENDING_FIGURE } from '@/lib/utils/format';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useLessonProgress, useProgressHydrated } from '@/lib/hooks/use-progress';

/**
 * What still stands between the learner and a completed lesson.
 *
 * Three named requirements rather than a percentage, because "67%" does not
 * tell anyone what to do next and "reflection outstanding" does.
 */
export function LessonStatusPanel({ lessonId }: { lessonId: string }) {
  const progress = useLessonProgress(lessonId);
  const hydrated = useProgressHydrated();

  const met = hydrated ? progress.requirementsMet : 0;
  const metLabel = hydrated ? met : PENDING_FIGURE;
  const requirements = hydrated
    ? progress.requirements
    : { reachedEnd: false, exerciseCompleted: false, reflectionAnswered: false };

  const isComplete = hydrated && progress.status === 'completed';

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-caption uppercase text-text-muted">Lesson status</h2>
        <span className="text-caption uppercase text-text-muted" data-numeric>
          {metLabel} / {progress.requirementsTotal}
        </span>
      </div>

      <ProgressBar
        className="mt-2.5"
        size="thin"
        value={met / progress.requirementsTotal}
        label="Lesson completion"
        complete={isComplete}
      />

      <ul className="mt-4 space-y-2.5">
        <li>
          <StatusIndicator
            status={requirements.reachedEnd ? 'complete' : 'not-started'}
            label="Read to the end"
            className="text-small"
          />
        </li>
        <li>
          <StatusIndicator
            status={requirements.exerciseCompleted ? 'complete' : 'not-started'}
            label="Exercise completed"
            className="text-small"
          />
        </li>
        <li>
          <StatusIndicator
            status={requirements.reflectionAnswered ? 'complete' : 'not-started'}
            label="Reflection answered"
            className="text-small"
          />
        </li>
      </ul>

      <p className="mt-4 text-small text-text-muted">
        {isComplete
          ? 'This lesson is complete. Shift + Enter continues to the next one.'
          : 'All three are needed before the lesson counts as complete.'}
      </p>
    </div>
  );
}
