'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useModuleProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatRatio, PENDING_FIGURE } from '@/lib/utils/format';
import { LESSONS_PER_MODULE, type CurriculumModule } from '@/types/curriculum';
import { presentProjectStatus } from '@/lib/progress/project-status';

/**
 * Module progress, stated as the two things that actually complete it: every
 * lesson finished, and the project finished. Shown as requirements rather than
 * one blended percentage, because they are separate pieces of work.
 */
export function ModuleProgressPanel({ courseModule }: { courseModule: CurriculumModule }) {
  const progress = useModuleProgress(courseModule);
  const hydrated = useProgressHydrated();
  const project = presentProjectStatus(progress.projectStatus);

  /* Against the five lessons the module is defined to have — see the note in
   * ModuleCard for why the authored count is the wrong denominator here. */
  const completed = progress.lessonsCompleted;
  /* The bar may sit at zero while loading — an empty bar reads as "not known".
   * The figure beside it may not, because a number is read as a fact. */
  const completionRatio = (hydrated ? completed : 0) / LESSONS_PER_MODULE;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-caption uppercase text-text-muted">Lessons completed</span>
        <span className="text-small text-text-secondary" data-numeric>
          {hydrated ? completed : PENDING_FIGURE} / {LESSONS_PER_MODULE}
          {hydrated && (
            <span className="text-text-muted"> · {formatRatio(completionRatio)}</span>
          )}
        </span>
      </div>

      <ProgressBar
        className="mt-2"
        value={completionRatio}
        label={`${courseModule.title} lesson completion`}
        complete={hydrated && progress.requirements.allLessonsCompleted}
      />

      <ul className="mt-4 space-y-2">
        <li>
          <StatusIndicator
            status={
              hydrated && progress.requirements.allLessonsCompleted
                ? 'complete'
                : 'not-started'
            }
            label="All lessons completed"
            className="text-small"
          />
        </li>
        <li>
          <StatusIndicator
            status={hydrated ? project.indicator : 'not-started'}
            label={`Project ${hydrated ? project.label.toLowerCase() : 'not started'}`}
            className="text-small"
          />
        </li>
      </ul>
    </div>
  );
}
