'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { PENDING_FIGURE } from '@/lib/utils/format';
import { getPhases } from '@/lib/curriculum/queries';
import { usePhaseProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import type { Phase } from '@/types/curriculum';

/**
 * Answers "how much progress have I made?" at the coarsest useful grain.
 *
 * Five rows, one per phase, each showing completed modules against total and a
 * hairline bar of lesson completion. Module counts and lesson ratio are
 * different measures, so both are shown rather than collapsing them into one
 * invented number.
 */
export function PhaseProgressList() {
  const phases = getPhases();

  return (
    <ol className="border-t border-border">
      {phases.map((phase) => (
        <PhaseRow key={phase.id} phase={phase} />
      ))}
    </ol>
  );
}

function PhaseRow({ phase }: { phase: Phase }) {
  const progress = usePhaseProgress(phase.id);
  const hydrated = useProgressHydrated();

  const isAuthored = progress.modulesTotal > 0;

  return (
    <li className="grid grid-cols-[1.75rem_1fr] items-center gap-x-3 border-b border-border py-3">
      <span className="text-caption uppercase text-text-muted" data-numeric>
        {phase.phaseNumber.toString().padStart(2, '0')}
      </span>

      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="truncate text-small text-text-primary">{phase.title}</h3>
          <span className="shrink-0 text-caption uppercase text-text-muted" data-numeric>
            {isAuthored ? (
              <>
                {hydrated ? progress.modulesCompleted : PENDING_FIGURE} / {progress.modulesTotal} modules
              </>
            ) : (
              'Not authored'
            )}
          </span>
        </div>

        {isAuthored && (
          <div className="mt-2 flex items-center gap-3">
            <ProgressBar
              size="thin"
              className="flex-1"
              value={hydrated ? progress.completionRatio : 0}
              label={`${phase.title} lesson completion`}
              complete={hydrated && progress.isComplete}
            />
            <span
              className="shrink-0 text-caption uppercase text-text-muted"
              data-numeric
            >
              {hydrated ? progress.lessonsCompleted : PENDING_FIGURE} / {progress.lessonsTotal}
            </span>
          </div>
        )}
      </div>
    </li>
  );
}
