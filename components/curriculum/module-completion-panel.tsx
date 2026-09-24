'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useModuleProgress, useProgressHydrated } from '@/lib/hooks/use-progress';
import { resolveModuleCompletionState } from '@/lib/progress/module-completion';
import { LESSONS_PER_MODULE, type CurriculumModule } from '@/types/curriculum';

/**
 * The end of a module, and only when it has actually ended.
 *
 * A module is finished when every lesson is complete *and* the project is
 * built. Lessons alone are reading and exercises; the project is the part that
 * demonstrates any of it. So this panel has two states — one that says the
 * project is still outstanding, and one that says the module is done — and it
 * never shows the second without the first being satisfied.
 */

export interface ModuleCompetencyRef {
  /** Widened to string so the interpolated href matches the route pattern. */
  readonly id: string;
  readonly label: string;
  /**
   * Whether the module project is tagged with this competency.
   *
   * Only these become "demonstrated" when the project is finished. A module
   * teaches more than its project can prove, so the two sets differ in every
   * module and the panel must not claim otherwise.
   */
  readonly demonstrated: boolean;
}

export interface NextModuleRef {
  readonly moduleNumber: number;
  readonly title: string;
  readonly slug: string;
  readonly outcome: string;
}

export interface ModuleCompletionPanelProps {
  readonly courseModule: CurriculumModule;
  readonly competencies: readonly ModuleCompetencyRef[];
  readonly nextModule: NextModuleRef | null;
}

export function ModuleCompletionPanel({
  courseModule,
  competencies,
  nextModule,
}: ModuleCompletionPanelProps) {
  const progress = useModuleProgress(courseModule);
  const hydrated = useProgressHydrated();

  if (!hydrated) return null;

  /* Nothing to summarise until at least the lessons are done. The rail already
   * reports ordinary in-progress state. */
  const state = resolveModuleCompletionState(progress);
  if (state === 'hidden') return null;

  const demonstratedCount = competencies.filter((c) => c.demonstrated).length;

  if (state === 'project-outstanding') {
    return (
      <section
        aria-labelledby="module-outstanding-heading"
        className="mb-10 rounded-large border border-border bg-surface p-5"
      >
        <h2 id="module-outstanding-heading">
          <StatusIndicator
            status="in-progress"
            label="Lessons complete — project outstanding"
            className="text-small font-medium"
          />
        </h2>

        <p className="mt-2.5 max-w-measure text-small text-text-secondary">
          All {LESSONS_PER_MODULE} lessons in this module are complete. The module itself
          is not finished until {courseModule.project.title} is built — reading and
          exercises show the material was worked through, the project is what
          demonstrates it.
        </p>

        <div className="mt-4">
          <Button asChild>
            <Link href={`/projects/${courseModule.slug}`}>
              Open the project
              <ArrowRight aria-hidden size={15} strokeWidth={2} />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="module-complete-heading"
      className="mb-10 rounded-large border border-border bg-surface p-5"
    >
      <h2 id="module-complete-heading">
        <StatusIndicator
          status="complete"
          label="Module complete"
          className="text-small font-medium"
        />
      </h2>

      <p className="mt-2.5 max-w-measure text-small text-text-secondary">
        {courseModule.outcome}
      </p>

      <dl className="mt-5 border-t border-border">
        <ModuleRow term="Skills practised">
          <ul className="flex flex-wrap gap-1.5">
            {competencies.map((competency) => (
              <li key={competency.id}>
                <Link href={`/skills/${competency.id}`}>
                  <Badge tone={competency.demonstrated ? 'accent' : 'neutral'}>
                    {competency.demonstrated && (
                      <Check aria-hidden size={13} strokeWidth={2} className="shrink-0" />
                    )}
                    {competency.label}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-small text-text-muted">
            {demonstratedCount === 0
              ? 'All of these were practised across the lessons. The project is not tagged with any of them, so none are recorded as demonstrated.'
              : `Every one of these was practised across the lessons. The ${demonstratedCount} marked with a check are also tagged on the project, so the finished build records those as demonstrated.`}
          </p>
        </ModuleRow>

        <ModuleRow term="Concepts learned">
          <ul className="space-y-3">
            {courseModule.lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/curriculum/${courseModule.slug}/${lesson.slug}`}
                  className="text-small text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-muted"
                >
                  {lesson.title}
                </Link>
                <ul className="mt-1 space-y-0.5">
                  {lesson.objectives.map((objective) => (
                    <li key={objective} className="text-small text-text-muted">
                      {objective}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </ModuleRow>

        <ModuleRow term="Module project">
          <Link
            href={`/projects/${courseModule.slug}`}
            className="text-small text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-muted"
          >
            {courseModule.project.title}
          </Link>
          <p className="mt-1 text-small text-text-muted">{courseModule.project.brief}</p>
          <div className="mt-2">
            <StatusIndicator status="complete" label="Built" className="text-small" />
          </div>
        </ModuleRow>

        <ModuleRow term="Recommended next">
          {nextModule === null ? (
            <>
              <p className="text-small text-text-secondary">
                This is the final module of the course.
              </p>
              <p className="mt-1 text-small text-text-muted">
                Skills shows which competencies the whole course has evidence for, and
                which work produced it.
              </p>
              <div className="mt-2.5">
                <Button asChild variant="secondary" size="small">
                  <Link href="/skills">
                    Review your evidence
                    <ArrowRight aria-hidden size={13} strokeWidth={2} />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/curriculum/${nextModule.slug}`}
                className="text-small text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-muted"
              >
                Module {nextModule.moduleNumber} · {nextModule.title}
              </Link>
              <p className="mt-1 text-small text-text-muted">{nextModule.outcome}</p>
            </>
          )}
        </ModuleRow>
      </dl>
    </section>
  );
}

function ModuleRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 border-b border-border py-3.5 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <dt className="text-caption uppercase text-text-muted">{term}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
