'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { ArrowRight } from 'lucide-react';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useLessonProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { formatMinutes } from '@/lib/utils/format';

/**
 * What the lesson actually left behind, shown once it is finished.
 *
 * A lesson that ends at a "next" arrow tells the learner where to go but not
 * what they now hold. This states it in the curriculum's own words: the
 * objectives it was written to teach, the exercise that was done, the earlier
 * lessons it was built on, and the competency record it added to.
 *
 * Everything here is authored curriculum data joined to completed work. No
 * game mechanic appears anywhere in it: the evidence line is a statement of
 * record, not a score, because a score would describe nothing real.
 */

export interface ConnectedLessonRef {
  readonly lessonId: string;
  readonly title: string;
  readonly moduleTitle: string;
  readonly moduleSlug: string;
  readonly lessonSlug: string;
}

export interface CompetencyRef {
  /** Widened to string so the interpolated href matches the route pattern. */
  readonly id: string;
  readonly label: string;
}

export interface NextStepRef {
  readonly kind: 'lesson' | 'project';
  readonly title: string;
  /** Built from curriculum slugs, so the cast at the link asserts what the
   * route map already guarantees. */
  readonly href: string;
  /** Where that next step sits, e.g. the module it belongs to. */
  readonly context: string;
}

export interface LessonCompletionPanelProps {
  readonly lessonId: string;
  /** The lesson's authored objectives — what it set out to teach. */
  readonly objectives: readonly string[];
  readonly exerciseTitle: string;
  readonly exerciseMinutes: number;
  /** Lessons this one was declared to build on. */
  readonly connected: readonly ConnectedLessonRef[];
  readonly competencies: readonly CompetencyRef[];
  readonly next: NextStepRef | null;
}

export function LessonCompletionPanel({
  lessonId,
  objectives,
  exerciseTitle,
  exerciseMinutes,
  connected,
  competencies,
  next,
}: LessonCompletionPanelProps) {
  const progress = useLessonProgress(lessonId);
  const hydrated = useProgressHydrated();

  /* Before the lesson is finished this would be a summary of work that has not
   * happened. The aside already states what is outstanding. */
  if (!hydrated || progress.status !== 'completed') return null;

  return (
    <section
      aria-labelledby="lesson-complete-heading"
      className="mt-12 rounded-large border border-border bg-surface p-5"
    >
      <h2 id="lesson-complete-heading">
        <StatusIndicator
          status="complete"
          label="Lesson complete"
          className="text-small font-medium"
        />
      </h2>

      <dl className="mt-4 border-t border-border">
        <PanelRow term="You learned">
          <ul className="space-y-1.5">
            {objectives.map((objective) => (
              <li key={objective} className="text-small text-text-secondary">
                {objective}
              </li>
            ))}
          </ul>
        </PanelRow>

        <PanelRow term="You practised">
          <p className="text-small text-text-secondary">{exerciseTitle}</p>
          <p className="mt-0.5 text-caption uppercase text-text-muted" data-numeric>
            {formatMinutes(exerciseMinutes)}
          </p>
        </PanelRow>

        {connected.length > 0 && (
          <PanelRow term="Connected concepts">
            <ul className="space-y-1.5">
              {connected.map((lesson) => (
                <li key={lesson.lessonId}>
                  <Link
                    href={`/curriculum/${lesson.moduleSlug}/${lesson.lessonSlug}`}
                    className="text-small text-text-secondary underline decoration-border underline-offset-4 hover:decoration-text-muted"
                  >
                    {lesson.title}
                  </Link>
                  <span className="mt-0.5 block text-caption uppercase text-text-muted">
                    {lesson.moduleTitle}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-small text-text-muted">
              This lesson was written to build on those.
            </p>
          </PanelRow>
        )}

        {competencies.length > 0 && (
          <PanelRow term="Evidence added">
            <p className="text-small text-text-secondary">
              Exposure and practice recorded against{' '}
              {competencies.map((competency, index) => (
                <span key={competency.id}>
                  {index > 0 && (index === competencies.length - 1 ? ' and ' : ', ')}
                  <Link
                    href={`/skills/${competency.id}`}
                    className="underline decoration-border underline-offset-4 hover:decoration-text-muted"
                  >
                    {competency.label}
                  </Link>
                </span>
              ))}
              .
            </p>
            <p className="mt-2 text-small text-text-muted">
              Demonstrating them takes the module project.
            </p>
          </PanelRow>
        )}

        {next !== null && (
          <PanelRow term="Next">
            <Link
              href={next.href as Route}
              className="group inline-flex items-baseline gap-1.5 text-small text-text-primary"
            >
              <span className="underline decoration-border underline-offset-4 group-hover:decoration-text-muted">
                {next.title}
              </span>
              <ArrowRight
                aria-hidden
                size={13}
                strokeWidth={2}
                className="shrink-0 translate-y-0.5 text-text-muted"
              />
            </Link>
            <p className="mt-0.5 text-caption uppercase text-text-muted">{next.context}</p>
          </PanelRow>
        )}
      </dl>
    </section>
  );
}

/**
 * One labelled row. The term sits in its own column on wide viewports and above
 * the content on narrow ones, so the panel stays readable without shrinking the
 * text to fit two columns onto a phone.
 */
function PanelRow({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-1 border-b border-border py-3 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <dt className="text-caption uppercase text-text-muted">{term}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
