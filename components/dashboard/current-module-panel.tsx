'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusIndicator, type StatusKind } from '@/components/ui/status-indicator';
import {
  useCurrentPosition,
  useLessonProgress,
  useModuleProgress,
  useProgressHydrated,
} from '@/lib/hooks/use-progress';
import { formatMinutes, formatRatio } from '@/lib/utils/format';
import { LESSONS_PER_MODULE, type CurriculumModule, type Lesson } from '@/types/curriculum';
import { presentProjectStatus } from '@/lib/progress/project-status';

/**
 * Answers "what project am I working toward?" alongside the five lessons that
 * stand between the learner and it.
 */
export function CurrentModulePanel() {
  const { courseModule } = useCurrentPosition();

  if (courseModule === null) {
    return (
      <EmptyState
        title="No module in progress"
        description="Once a module is authored it will appear here with its five lessons and its project."
      />
    );
  }

  return <ModuleDetail courseModule={courseModule} />;
}

function ModuleDetail({ courseModule }: { courseModule: CurriculumModule }) {
  const progress = useModuleProgress(courseModule);
  const hydrated = useProgressHydrated();
  const project = presentProjectStatus(progress.projectStatus);

  /* The curriculum defines five lessons per module. Showing only what exists
   * would quietly misrepresent the module as shorter than it is. */
  const unauthored = LESSONS_PER_MODULE - courseModule.lessons.length;

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <Link
          href={`/curriculum/${courseModule.slug}`}
          className="truncate text-small font-medium text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-muted"
        >
          {courseModule.title}
        </Link>
        <span className="shrink-0 text-small text-text-secondary" data-numeric>
          {hydrated ? formatRatio(progress.lessonCompletionRatio) : '—'}
        </span>
      </div>

      <ProgressBar
        value={hydrated ? progress.lessonCompletionRatio : 0}
        label={`${courseModule.title} lesson completion`}
        complete={hydrated && progress.requirements.allLessonsCompleted}
      />

      <ol className="mt-4 border-t border-border">
        {courseModule.lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} moduleSlug={courseModule.slug} />
        ))}

        {unauthored > 0 && (
          <li className="flex items-center justify-between gap-4 border-b border-border py-2.5">
            <span className="text-small text-text-muted">
              {unauthored} further {unauthored === 1 ? 'lesson' : 'lessons'} not yet
              authored
            </span>
            <span className="text-caption uppercase text-text-muted">Pending</span>
          </li>
        )}
      </ol>

      <div className="mt-4 flex items-center justify-between gap-4 rounded-medium bg-surface px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-caption uppercase text-text-muted">Module project</p>
          <Link
            href={`/projects/${courseModule.slug}`}
            className="mt-0.5 block truncate text-small text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-muted"
          >
            {courseModule.project.title}
          </Link>
        </div>
        <StatusIndicator
          status={hydrated ? project.indicator : 'not-started'}
          label={hydrated ? project.label : 'Not started'}
          className="shrink-0 text-caption"
        />
      </div>
    </div>
  );
}

function LessonRow({ lesson, moduleSlug }: { lesson: Lesson; moduleSlug: string }) {
  const progress = useLessonProgress(lesson.id);
  const hydrated = useProgressHydrated();

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
      ? 'Complete'
      : progress.status === 'in-progress'
        ? `${progress.requirementsMet} of ${progress.requirementsTotal} done`
        : 'Not started';

  return (
    <li>
      <Link
        href={`/curriculum/${moduleSlug}/${lesson.slug}`}
        className="grid grid-cols-[1.25rem_1fr_auto] items-center gap-x-3 border-b border-border py-2.5 transition-colors duration-100 hover:bg-surface-hover active:bg-surface-active"
      >
        <span className="text-caption uppercase text-text-muted" data-numeric>
          {lesson.lessonNumber}
        </span>
        <span className="min-w-0 truncate text-small text-text-primary">{lesson.title}</span>
        <span className="flex items-center gap-3">
          <span className="hidden text-caption uppercase text-text-muted sm:inline" data-numeric>
            {formatMinutes(lesson.estimatedMinutes)}
          </span>
          <StatusIndicator status={status} label={label} className="text-caption" />
          <ChevronRight aria-hidden size={13} strokeWidth={2} className="text-text-muted" />
        </span>
      </Link>
    </li>
  );
}
