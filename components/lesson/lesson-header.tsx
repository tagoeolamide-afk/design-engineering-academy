import Link from 'next/link';
import { formatMinutes } from '@/lib/utils/format';
import type { CurriculumModule, Lesson, Phase } from '@/types/curriculum';

interface LessonHeaderProps {
  readonly lesson: Lesson;
  readonly courseModule: CurriculumModule;
  readonly phase: Phase;
  readonly courseIndex: number | null;
  readonly totalLessons: number;
}

export function LessonHeader({
  lesson,
  courseModule,
  phase,
  courseIndex,
  totalLessons,
}: LessonHeaderProps) {
  return (
    <header className="mb-8">
      <p className="text-caption uppercase text-text-muted">
        <Link
          href={`/curriculum/${courseModule.slug}`}
          className="underline decoration-border underline-offset-4 hover:text-text-secondary"
        >
          {courseModule.title}
        </Link>
        <span aria-hidden> · </span>
        Phase {phase.phaseNumber}
      </p>

      <div className="mt-3 flex items-baseline gap-3">
        <span
          aria-hidden
          className="text-display leading-none text-text-muted/50"
          data-numeric
        >
          {lesson.lessonNumber}
        </span>
        <h1 className="text-display text-balance text-text-primary">{lesson.title}</h1>
      </div>

      <p className="mt-4 max-w-measure-narrow text-body text-text-secondary">{lesson.summary}</p>

      <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption uppercase text-text-muted">
        <div className="flex gap-1.5">
          <dt>Lesson</dt>
          <dd className="text-text-secondary" data-numeric>
            {lesson.lessonNumber} of 5
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt>Reading</dt>
          <dd className="text-text-secondary" data-numeric>
            {formatMinutes(lesson.estimatedMinutes)}
          </dd>
        </div>
        {courseIndex !== null && (
          <div className="flex gap-1.5">
            <dt>Course</dt>
            <dd className="text-text-secondary" data-numeric>
              {courseIndex} of {totalLessons}
            </dd>
          </div>
        )}
      </dl>
    </header>
  );
}
