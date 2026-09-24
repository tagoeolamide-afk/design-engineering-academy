'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { usePhaseProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatCountOf, PENDING_FIGURE } from '@/lib/utils/format';
import {
  LESSONS_PER_MODULE,
  MODULES_PER_PHASE,
  moduleNumbersForPhase,
  type CurriculumModule,
  type Phase,
} from '@/types/curriculum';
import { ModuleCard, ModuleSlot } from './module-card';

interface PhaseSectionProps {
  readonly phase: Phase;
  readonly modules: readonly CurriculumModule[];
}

/**
 * One phase: its position in the arc, what it is for, how far through it the
 * learner is, and the three modules it owns.
 *
 * Every module slot in the phase is rendered — authored or not — so the learner
 * can see the whole journey rather than only the part that happens to exist.
 */
export function PhaseSection({ phase, modules }: PhaseSectionProps) {
  const progress = usePhaseProgress(phase.id);
  const hydrated = useProgressHydrated();

  const expected = moduleNumbersForPhase(phase.phaseNumber);

  /* Denominators come from the curriculum's design, not from how much of it
   * happens to be written. A phase owns three modules and fifteen lessons even
   * while two of those modules are unauthored, and a view whose job is to show
   * the whole journey must not shrink to fit the content that exists. */
  const designedLessons = MODULES_PER_PHASE * LESSONS_PER_MODULE;
  const byNumber = new Map(modules.map((m) => [m.moduleNumber, m]));

  const first = expected[0];
  const last = expected[expected.length - 1];
  const range = first === undefined || last === undefined ? '' : `Modules ${first}–${last}`;

  return (
    <section aria-labelledby={`phase-${phase.id}`}>
      <div className="mb-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-caption uppercase text-text-muted">
            Phase {phase.phaseNumber} · {range}
          </p>
          <p className="text-caption uppercase text-text-muted" data-numeric>
            {hydrated ? progress.modulesCompleted : PENDING_FIGURE} of{' '}
            {formatCountOf(MODULES_PER_PHASE, 'module')} complete
          </p>
        </div>

        <h2 id={`phase-${phase.id}`} className="mt-1.5 text-heading text-text-primary">
          {phase.title}
        </h2>
        <p className="mt-2 max-w-measure text-small text-text-secondary">
          {phase.description}
        </p>
        <p className="mt-2 max-w-measure text-small text-text-muted">
          <span className="text-text-secondary">Outcome:</span> {phase.outcome}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <ProgressBar
            size="thin"
            className="flex-1"
            value={(hydrated ? progress.lessonsCompleted : 0) / designedLessons}
            label={`${phase.title} lesson completion`}
            complete={hydrated && progress.isComplete}
          />
          <span className="shrink-0 text-caption uppercase text-text-muted" data-numeric>
            {hydrated ? progress.lessonsCompleted : PENDING_FIGURE} / {designedLessons} lessons
          </span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {expected.map((moduleNumber) => {
          const courseModule = byNumber.get(moduleNumber);

          return (
            <li key={moduleNumber}>
              {courseModule === undefined ? (
                <ModuleSlot moduleNumber={moduleNumber} />
              ) : (
                <ModuleCard courseModule={courseModule} />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
