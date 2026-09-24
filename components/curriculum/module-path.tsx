'use client';

import Link from 'next/link';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useModuleProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { cn } from '@/lib/utils/cn';
import { TOTAL_MODULES, type CurriculumModule } from '@/types/curriculum';

/**
 * The recommended path through the course, as one wrapping chain.
 *
 * Deliberately not a node graph. Fifteen modules laid out as boxes and edges
 * would need panning, zooming, and a legend before it said anything — and the
 * underlying relationship is a sequence, so a sequence is what it should look
 * like. Each module points at the one it prepares you for; nothing branches.
 *
 * The chain is guidance, not gating. Every authored module in it is reachable
 * at any time.
 */
export function ModulePath({ modules }: { modules: readonly CurriculumModule[] }) {
  const byNumber = new Map(modules.map((m) => [m.moduleNumber, m]));
  const numbers = Array.from({ length: TOTAL_MODULES }, (_, i) => i + 1);

  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {numbers.map((moduleNumber, index) => {
        const courseModule = byNumber.get(moduleNumber);

        return (
          <li key={moduleNumber} className="flex items-center gap-1.5">
            {courseModule === undefined ? (
              <span
                className="rounded-medium border border-dashed border-border px-2 py-1 text-caption uppercase text-text-muted"
                data-numeric
              >
                {moduleNumber.toString().padStart(2, '0')}
              </span>
            ) : (
              <PathLink courseModule={courseModule} />
            )}

            {index < numbers.length - 1 && (
              <span aria-hidden className="text-text-muted">
                →
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function PathLink({ courseModule }: { courseModule: CurriculumModule }) {
  const progress = useModuleProgress(courseModule);
  const hydrated = useProgressHydrated();

  const started =
    hydrated &&
    (progress.lessonsCompleted > 0 ||
      progress.lessonsInProgress > 0 ||
      progress.projectStatus !== 'not-started');

  return (
    <Link
      href={`/curriculum/${courseModule.slug}`}
      className={cn(
        'flex items-center gap-2 rounded-medium border px-2 py-1 text-caption uppercase transition-colors duration-100',
        'border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-hover active:bg-surface-active hover:text-text-primary',
      )}
    >
      <span data-numeric>{courseModule.moduleNumber.toString().padStart(2, '0')}</span>
      <span className="max-w-40 truncate normal-case">{courseModule.title}</span>
      {hydrated && (
        <StatusIndicator
          status={
            progress.isComplete ? 'complete' : started ? 'in-progress' : 'not-started'
          }
          label={
            progress.isComplete ? 'Completed' : started ? 'In progress' : 'Not started'
          }
          iconOnly
        />
      )}
    </Link>
  );
}
