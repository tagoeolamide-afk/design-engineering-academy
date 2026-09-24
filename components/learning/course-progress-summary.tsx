'use client';

import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useCourseProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatRatio, PENDING_FIGURE } from '@/lib/utils/format';

/**
 * The end-to-end proof of the progress architecture: persisted facts, derived
 * in lib/progress, read through a hook, rendered here.
 *
 * Presented as one dense strip rather than four separate cards — the numbers
 * are related, so they belong in one object the eye reads across.
 */
export function CourseProgressSummary() {
  const progress = useCourseProgress();
  const hydrated = useProgressHydrated();

  return (
    <Card asChild padding="none">
      <section aria-labelledby="course-progress-heading">
        <div className="flex items-baseline justify-between gap-4 px-5 pt-4">
          <h2 id="course-progress-heading" className="text-small font-medium">
            Course progress
          </h2>
          <span className="text-small text-text-secondary" data-numeric>
            {hydrated ? formatRatio(progress.completionRatio) : '—'}
          </span>
        </div>

        <div className="px-5 pt-3">
          <ProgressBar
            value={hydrated ? progress.completionRatio : 0}
            label="Course completion"
            complete={hydrated && progress.completionRatio === 1}
          />
        </div>

        <dl className="mt-4 grid grid-cols-2 divide-border border-t border-border sm:grid-cols-4 sm:divide-x">
          <Stat
            label="Lessons"
            value={hydrated ? progress.lessonsCompleted : PENDING_FIGURE}
            total={progress.lessonsTotal}
          />
          <Stat
            label="Modules"
            value={hydrated ? progress.modulesCompleted : PENDING_FIGURE}
            total={progress.modulesTotal}
          />
          <Stat
            label="Phases"
            value={hydrated ? progress.phasesCompleted : PENDING_FIGURE}
            total={progress.phasesTotal}
          />
          <Stat
            label="Projects"
            value={hydrated ? progress.projectsCompleted : PENDING_FIGURE}
            total={progress.modulesTotal}
          />
        </dl>
      </section>
    </Card>
  );
}

function Stat({
  label,
  value,
  total,
}: {
  label: string;
  /** A string when the figure is not known yet. */
  value: number | string;
  total: number;
}) {
  return (
    <div className="border-border px-5 py-3 [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0">
      <dt className="text-caption uppercase text-text-muted">{label}</dt>
      <dd className="mt-1 text-small text-text-primary" data-numeric>
        {value}
        <span className="text-text-muted"> / {total}</span>
      </dd>
    </div>
  );
}
