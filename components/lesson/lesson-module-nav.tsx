'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { StatusIndicator, type StatusKind } from '@/components/ui/status-indicator';
import { useLessonProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { cn } from '@/lib/utils/cn';
import { LESSONS_PER_MODULE, type CurriculumModule, type Lesson } from '@/types/curriculum';

interface LessonModuleNavProps {
  readonly courseModule: CurriculumModule;
  readonly currentLessonId: string;
}

/**
 * The module's lessons, as a rail beside the reading column.
 *
 * Keeps the learner oriented inside the module without leaving the lesson. Not
 * a second copy of the global navigation — it is scoped to exactly the five
 * lessons that matter while reading this one.
 */
export function LessonModuleNav({ courseModule, currentLessonId }: LessonModuleNavProps) {
  const pending = Math.max(0, LESSONS_PER_MODULE - courseModule.lessons.length);

  return (
    <nav aria-label="Module lessons">
      <Link
        href={`/curriculum/${courseModule.slug}`}
        className="group flex items-center gap-1.5 text-caption uppercase text-text-muted hover:text-text-secondary"
      >
        <ArrowLeft aria-hidden size={13} strokeWidth={2} className="shrink-0" />
        Module
      </Link>

      <p className="mt-1.5 text-small font-medium text-text-primary">
        {courseModule.title}
      </p>

      <ol className="mt-4 space-y-0.5">
        {courseModule.lessons.map((lesson) => (
          <NavRow
            key={lesson.id}
            lesson={lesson}
            moduleSlug={courseModule.slug}
            isCurrent={lesson.id === currentLessonId}
          />
        ))}

        {Array.from({ length: pending }, (_, offset) => (
          <li
            key={`pending-${offset}`}
            className="flex items-center gap-2 py-1 pl-3 text-small text-text-muted/70"
          >
            <span data-numeric>{courseModule.lessons.length + offset + 1}</span>
            <span className="truncate">Not yet authored</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function NavRow({
  lesson,
  moduleSlug,
  isCurrent,
}: {
  lesson: Lesson;
  moduleSlug: string;
  isCurrent: boolean;
}) {
  const progress = useLessonProgress(lesson.id);
  const hydrated = useProgressHydrated();

  const status: StatusKind = !hydrated
    ? 'not-started'
    : progress.status === 'completed'
      ? 'complete'
      : progress.status === 'in-progress'
        ? 'in-progress'
        : 'not-started';

  return (
    <li>
      <Link
        href={`/curriculum/${moduleSlug}/${lesson.slug}`}
        aria-current={isCurrent ? 'page' : undefined}
        className={cn(
          'flex items-start gap-2 border-l py-1.5 pl-3 text-small transition-colors duration-100',
          isCurrent
            ? 'border-accent font-medium text-text-primary'
            : 'border-border text-text-muted hover:border-border-strong hover:text-text-secondary',
        )}
      >
        <StatusIndicator
          status={status}
          label={
            status === 'complete'
              ? 'Completed'
              : status === 'in-progress'
                ? 'In progress'
                : 'Not started'
          }
          iconOnly
          className="mt-0.5 shrink-0"
        />
        <span className="min-w-0">{lesson.title}</span>
      </Link>
    </li>
  );
}
