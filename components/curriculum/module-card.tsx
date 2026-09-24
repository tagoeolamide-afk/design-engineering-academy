'use client';

import { ArrowRight, FolderGit2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusIndicator, type StatusKind } from '@/components/ui/status-indicator';
import { useModuleProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatMinutes, formatRatio, PENDING_FIGURE } from '@/lib/utils/format';
import { LESSONS_PER_MODULE, type CurriculumModule } from '@/types/curriculum';
import type { ModuleProgress } from '@/types/progress';

/**
 * The three states a module can be in, as the learner understands them. Derived
 * from progress rather than stored, and deliberately coarser than the internal
 * lesson-level detail.
 */
type ModuleStatus = 'not-started' | 'in-progress' | 'completed';

function moduleStatus(progress: ModuleProgress): ModuleStatus {
  if (progress.isComplete) return 'completed';
  if (
    progress.lessonsCompleted > 0 ||
    progress.lessonsInProgress > 0 ||
    progress.projectStatus !== 'not-started'
  ) {
    return 'in-progress';
  }
  return 'not-started';
}

const STATUS_PRESENTATION: Record<ModuleStatus, { status: StatusKind; label: string }> = {
  'not-started': { status: 'not-started', label: 'Not started' },
  'in-progress': { status: 'in-progress', label: 'In progress' },
  completed: { status: 'complete', label: 'Completed' },
};

/**
 * A module card.
 *
 * Nothing here is ever disabled or locked. A module the learner has not reached
 * yet looks exactly as reachable as the current one — the ordering is a
 * recommendation, expressed through prerequisites and position, not a gate.
 */
export function ModuleCard({ courseModule }: { courseModule: CurriculumModule }) {
  const progress = useModuleProgress(courseModule);
  const hydrated = useProgressHydrated();

  const status = hydrated ? moduleStatus(progress) : 'not-started';
  const presentation = STATUS_PRESENTATION[status];

  const totalMinutes = courseModule.lessons.reduce(
    (total, lesson) => total + lesson.estimatedMinutes,
    0,
  );

  /* Measured against the five lessons a module is defined to have, not against
   * however many are written. Otherwise finishing the only authored lesson of a
   * part-written module would read as 100 per cent complete. */
  const completionRatio = (hydrated ? progress.lessonsCompleted : 0) / LESSONS_PER_MODULE;

  return (
    <Card asChild padding="compact" interactive>
      <Link
        href={`/curriculum/${courseModule.slug}`}
        className="block focus-visible:outline-offset-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-baseline gap-2.5">
            <span className="text-caption uppercase text-text-muted" data-numeric>
              {courseModule.moduleNumber.toString().padStart(2, '0')}
            </span>
            <h3 className="min-w-0 text-small font-medium text-text-primary">
              {courseModule.title}
            </h3>
          </div>
          <StatusIndicator
            status={presentation.status}
            label={presentation.label}
            className="shrink-0 text-caption"
          />
        </div>

        <p className="mt-2 text-small text-text-muted">{courseModule.description}</p>

        <dl className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5 text-caption uppercase text-text-muted">
          <div className="flex gap-1.5">
            <dt>Lessons</dt>
            <dd className="text-text-secondary" data-numeric>
              {courseModule.lessons.length} of {LESSONS_PER_MODULE}
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Time</dt>
            <dd className="text-text-secondary" data-numeric>
              {totalMinutes === 0 ? '—' : formatMinutes(totalMinutes)}
            </dd>
          </div>
        </dl>

        <div className="mt-3.5 flex items-center gap-3">
          <ProgressBar
            size="thin"
            className="flex-1"
            value={completionRatio}
            label={`${courseModule.title} lesson completion`}
            complete={hydrated && progress.requirements.allLessonsCompleted}
          />
          <span className="shrink-0 text-caption uppercase text-text-muted" data-numeric>
            {hydrated ? formatRatio(completionRatio) : PENDING_FIGURE}
          </span>
        </div>

        <div className="mt-3.5 flex items-center gap-2 border-t border-border pt-3">
          <FolderGit2
            aria-hidden
            size={13}
            strokeWidth={1.75}
            className="shrink-0 text-text-muted"
          />
          <span className="min-w-0 truncate text-caption uppercase text-text-muted">
            Project
          </span>
          <span className="min-w-0 flex-1 truncate text-small text-text-secondary">
            {courseModule.project.title}
          </span>
          <ArrowRight
            aria-hidden
            size={13}
            strokeWidth={2}
            className="shrink-0 text-text-muted"
          />
        </div>
      </Link>
    </Card>
  );
}

/**
 * A module the curriculum defines but which has no content yet.
 *
 * Rendered rather than omitted so the shape of the journey — fifteen modules,
 * three per phase — is visible from the first day, and so an empty phase does
 * not read as a shorter course than it is.
 */
export function ModuleSlot({ moduleNumber }: { moduleNumber: number }) {
  return (
    <div className="rounded-large border border-dashed border-border p-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-caption uppercase text-text-muted" data-numeric>
            {moduleNumber.toString().padStart(2, '0')}
          </span>
          <p className="text-small text-text-muted">Not yet authored</p>
        </div>
        <span className="shrink-0 text-caption uppercase text-text-muted">
          {LESSONS_PER_MODULE} lessons
        </span>
      </div>
    </div>
  );
}
