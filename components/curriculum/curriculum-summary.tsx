'use client';

import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { useCourseProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatRatio, PENDING_FIGURE } from '@/lib/utils/format';
import { TOTAL_LESSONS, TOTAL_MODULES } from '@/types/curriculum';

interface CurriculumSummaryProps {
  readonly authoredModules: number;
  readonly authoredLessons: number;
}

/**
 * Completion against the course as designed: seventy-five lessons, fifteen
 * modules, five phases.
 *
 * This is deliberately a different measure from the dashboard's course strip,
 * which counts against authored content so that day-to-day progress moves
 * visibly. Here the question is "how far through the course am I?", and the
 * answer has to be measured against the whole course — otherwise finishing the
 * single authored lesson would report the course as complete.
 *
 * How much exists is shown alongside, so the two numbers never have to be
 * reconciled by guesswork.
 */
export function CurriculumSummary({
  authoredModules,
  authoredLessons,
}: CurriculumSummaryProps) {
  const progress = useCourseProgress();
  const hydrated = useProgressHydrated();

  const lessonsCompleted = hydrated ? progress.lessonsCompleted : 0;
  const ratio = lessonsCompleted / TOTAL_LESSONS;

  return (
    <Card asChild padding="none">
      <section aria-labelledby="curriculum-summary-heading">
        <div className="flex items-baseline justify-between gap-4 px-5 pt-4">
          <h2 id="curriculum-summary-heading" className="text-small font-medium">
            Course completion
          </h2>
          <span className="text-small text-text-secondary" data-numeric>
            {hydrated ? formatRatio(ratio) : PENDING_FIGURE}
          </span>
        </div>

        <div className="px-5 pt-3">
          <ProgressBar
            value={ratio}
            label="Course completion"
            complete={lessonsCompleted === TOTAL_LESSONS}
          />
        </div>

        <dl className="mt-4 grid grid-cols-2 divide-border border-t border-border sm:grid-cols-4 sm:divide-x">
          <Figure
            label="Lessons done"
            value={hydrated ? lessonsCompleted : PENDING_FIGURE}
            total={TOTAL_LESSONS}
          />
          <Figure
            label="Modules done"
            value={hydrated ? progress.modulesCompleted : PENDING_FIGURE}
            total={TOTAL_MODULES}
          />
          <Figure label="Lessons written" value={authoredLessons} total={TOTAL_LESSONS} />
          <Figure label="Modules written" value={authoredModules} total={TOTAL_MODULES} />
        </dl>
      </section>
    </Card>
  );
}

function Figure({ label, value, total }: { label: string; value: number | string; total: number }) {
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
