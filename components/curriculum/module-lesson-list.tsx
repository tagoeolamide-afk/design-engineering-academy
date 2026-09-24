'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { StatusIndicator, type StatusKind } from '@/components/ui/status-indicator';
import { getPrerequisiteLessons } from '@/lib/curriculum/queries';
import { useLessonProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatMinutes } from '@/lib/utils/format';
import { LESSONS_PER_MODULE, type CurriculumModule, type Lesson } from '@/types/curriculum';

/**
 * The five lessons of a module, each with its status.
 *
 * Unauthored lesson slots are shown rather than hidden, so a module always
 * reads as five lessons long even while it is being written.
 */
export function ModuleLessonList({ courseModule }: { courseModule: CurriculumModule }) {
  const authored = courseModule.lessons.length;
  const pending = Math.max(0, LESSONS_PER_MODULE - authored);

  return (
    <ol className="border-t border-border">
      {courseModule.lessons.map((lesson) => (
        <LessonRow key={lesson.id} lesson={lesson} moduleSlug={courseModule.slug} />
      ))}

      {Array.from({ length: pending }, (_, offset) => (
        <li
          key={`pending-${authored + offset + 1}`}
          className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-x-3 border-b border-border py-3"
        >
          <span className="text-caption uppercase text-text-muted" data-numeric>
            {authored + offset + 1}
          </span>
          <span className="text-small text-text-muted">Not yet authored</span>
          <span className="text-caption uppercase text-text-muted">Pending</span>
        </li>
      ))}
    </ol>
  );
}

function LessonRow({ lesson, moduleSlug }: { lesson: Lesson; moduleSlug: string }) {
  const progress = useLessonProgress(lesson.id);
  const hydrated = useProgressHydrated();

  /* Prerequisites are informational here. A lesson with unmet prerequisites is
   * still fully open — the note tells the learner what it assumes, and lets
   * them decide. */
  const prerequisites = getPrerequisiteLessons(lesson.id);

  const status: StatusKind = !hydrated
    ? 'not-started'
    : progress.status === 'completed'
      ? 'complete'
      : progress.status === 'in-progress'
        ? 'in-progress'
        : 'not-started';

  const label = !hydrated
    ? 'Not started'
    : progress.status === 'completed'
      ? 'Completed'
      : progress.status === 'in-progress'
        ? `${progress.requirementsMet} of ${progress.requirementsTotal} done`
        : 'Not started';

  return (
    <li>
      <Link
        href={`/curriculum/${moduleSlug}/${lesson.slug}`}
        className="grid grid-cols-[1.5rem_1fr_auto] items-start gap-x-3 border-b border-border py-3 transition-colors duration-100 hover:bg-surface-hover active:bg-surface-active"
      >
        <span className="pt-0.5 text-caption uppercase text-text-muted" data-numeric>
          {lesson.lessonNumber}
        </span>

        <span className="min-w-0">
          <span className="block text-small text-text-primary">{lesson.title}</span>
          <span className="mt-1 block text-small text-text-muted">{lesson.summary}</span>

          {prerequisites.length > 0 && (
            <span className="mt-1.5 block text-caption uppercase text-text-muted">
              Assumes{' '}
              {prerequisites.map((entry, index) => (
                <span key={entry.lesson.id}>
                  {index > 0 && ', '}
                  <span className="normal-case text-text-secondary">
                    {entry.lesson.title}
                  </span>
                </span>
              ))}
            </span>
          )}
        </span>

        <span className="flex items-center gap-3 pt-0.5">
          <span
            className="hidden text-caption uppercase text-text-muted sm:inline"
            data-numeric
          >
            {formatMinutes(lesson.estimatedMinutes)}
          </span>
          <StatusIndicator status={status} label={label} className="text-caption" />
          <ChevronRight
            aria-hidden
            size={13}
            strokeWidth={2}
            className="shrink-0 text-text-muted"
          />
        </span>
      </Link>
    </li>
  );
}
