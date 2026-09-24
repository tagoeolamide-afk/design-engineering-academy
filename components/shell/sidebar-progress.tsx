'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { useCourseProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatRatio, PENDING_FIGURE } from '@/lib/utils/format';

/**
 * The persistent progress readout in the sidebar footer. Compact by design:
 * a number, a hairline bar, and a count — no ring charts, no streaks.
 */
export function SidebarProgress() {
  const progress = useCourseProgress();
  const hydrated = useProgressHydrated();

  return (
    <div className="px-2.5 py-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-caption uppercase text-text-muted">Course progress</span>
        <span className="text-small font-medium text-text-primary" data-numeric>
          {hydrated ? formatRatio(progress.completionRatio) : '—'}
        </span>
      </div>

      <ProgressBar
        className="mt-2"
        size="thin"
        value={hydrated ? progress.completionRatio : 0}
        label="Course completion"
      />

      <p className="mt-2 text-caption uppercase text-text-muted" data-numeric>
        {hydrated ? progress.lessonsCompleted : PENDING_FIGURE} / {progress.lessonsTotal} lessons
      </p>
    </div>
  );
}
