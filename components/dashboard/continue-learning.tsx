'use client';

import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusIndicator } from '@/components/ui/status-indicator';
import {
  useLessonProgress,
  useProgressHydrated,
  useRecommendedAction,
} from '@/lib/hooks/use-progress';
import { getLessonCount } from '@/lib/curriculum/queries';
import type { RecommendedAction } from '@/lib/progress/next-action';
import { formatMinutes } from '@/lib/utils/format';
import type { CurriculumModule, Lesson } from '@/types/curriculum';
import { TOTAL_LESSONS, TOTAL_MODULES } from '@/types/curriculum';

/**
 * Answers "what should I study next?".
 *
 * There is exactly one recommendation, and it comes from the same function the
 * rest of the app uses, so this panel can never disagree with the module page
 * about what is next.
 */
export function ContinueLearning() {
  const action = useRecommendedAction();
  const hydrated = useProgressHydrated();

  if (!hydrated) {
    return (
      <Card padding="comfortable">
        <p className="text-small text-text-muted" role="status">
          Loading your progress…
        </p>
      </Card>
    );
  }

  return <Recommendation action={action} />;
}

function Recommendation({ action }: { action: RecommendedAction }) {
  switch (action.kind) {
    case 'no-content':
      return (
        <EmptyState
          icon={BookOpen}
          title="No lessons authored yet"
          description="The curriculum structure, progress engine, and interface are ready. The first lesson will appear here as soon as it exists."
        />
      );

    case 'course-complete': {
      /* Two different situations wear the same status. Telling someone who has
       * finished the whole course that "new modules will appear" is wrong —
       * there are none — and telling someone who has caught up with a partly
       * authored curriculum that they are finished is also wrong. */
      const fullyAuthored = getLessonCount() === TOTAL_LESSONS;

      return (
        <Card padding="comfortable">
          <StatusIndicator
            status="complete"
            label={fullyAuthored ? 'Course complete' : 'Everything authored is complete'}
          />
          <p className="mt-2 max-w-measure-narrow text-small text-text-muted">
            {fullyAuthored ? (
              <>
                All {TOTAL_LESSONS} lessons and {TOTAL_MODULES} module projects are
                finished. Nothing here is outstanding — Skills shows which competencies
                the completed projects actually demonstrate.
              </>
            ) : (
              <>
                Every authored lesson and module project is finished. More will appear
                here as the remaining modules are written.
              </>
            )}
          </p>
          {fullyAuthored && (
            <p className="mt-3">
              <Link
                href="/skills"
                className="text-small text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary"
              >
                Review the evidence in Skills
              </Link>
            </p>
          )}
        </Card>
      );
    }

    case 'finish-project':
      return (
        <Card padding="comfortable">
          <p className="text-caption uppercase text-text-muted">
            {action.courseModule.title} · Module project
          </p>
          <h3 className="mt-2 text-heading text-text-primary">{action.project.title}</h3>
          <p className="mt-2 max-w-measure-narrow text-small text-text-secondary">
            {action.project.brief}
          </p>
          <p className="mt-3 text-small text-text-muted">
            Every lesson in this module is complete. The project is the last requirement.
          </p>
          <div className="mt-5">
            <Button asChild variant="primary">
              <Link href={`/projects/${action.courseModule.slug}`}>
                Open project
                <ArrowRight aria-hidden size={15} strokeWidth={2} />
              </Link>
            </Button>
          </div>
        </Card>
      );

    case 'resume-lesson':
      return (
        <LessonPanel
          lesson={action.lesson}
          courseModule={action.courseModule}
          verb="Continue lesson"
        />
      );

    case 'start-lesson':
      return (
        <LessonPanel
          lesson={action.lesson}
          courseModule={action.courseModule}
          verb="Start lesson"
        />
      );
  }
}

function LessonPanel({
  lesson,
  courseModule,
  verb,
}: {
  lesson: Lesson;
  courseModule: CurriculumModule;
  verb: string;
}) {
  const progress = useLessonProgress(lesson.id);
  return (
    <Card padding="comfortable">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-caption uppercase text-text-muted">
          {courseModule.title} · Lesson {lesson.lessonNumber}
        </p>
        <p className="text-caption uppercase text-text-muted" data-numeric>
          {formatMinutes(lesson.estimatedMinutes)}
        </p>
      </div>

      <h3 className="mt-2 text-heading text-text-primary">{lesson.title}</h3>
      <p className="mt-2 max-w-measure-narrow text-small text-text-secondary">{lesson.summary}</p>

      <div className="mt-5 flex items-center gap-3">
        <ProgressBar
          className="flex-1"
          value={progress.requirementsMet / progress.requirementsTotal}
          label={`${lesson.title} completion`}
          complete={progress.status === 'completed'}
        />
        <span className="shrink-0 text-caption uppercase text-text-muted" data-numeric>
          {progress.requirementsMet} / {progress.requirementsTotal}
        </span>
      </div>

      {/* What is actually outstanding, rather than a bare percentage. */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        <li>
          <StatusIndicator
            status={progress.requirements.reachedEnd ? 'complete' : 'not-started'}
            label="Read to the end"
            className="text-caption"
          />
        </li>
        <li>
          <StatusIndicator
            status={progress.requirements.exerciseCompleted ? 'complete' : 'not-started'}
            label="Practical exercise"
            className="text-caption"
          />
        </li>
        <li>
          <StatusIndicator
            status={progress.requirements.reflectionAnswered ? 'complete' : 'not-started'}
            label="Reflection"
            className="text-caption"
          />
        </li>
      </ul>

      <div className="mt-5">
        <Button asChild variant="primary">
          <Link href={`/curriculum/${courseModule.slug}/${lesson.slug}`}>
            {verb}
            <ArrowRight aria-hidden size={15} strokeWidth={2} />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
