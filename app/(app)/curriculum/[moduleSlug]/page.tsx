import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ModuleLessonList } from '@/components/curriculum/module-lesson-list';
import { ModuleCompletionPanel } from '@/components/curriculum/module-completion-panel';
import { ModuleNeighbours } from '@/components/curriculum/module-neighbours';
import { ModuleProgressPanel } from '@/components/curriculum/module-progress-panel';
import { PageLayout } from '@/components/shell/page-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import {
  getModuleBySlug,
  getModuleCompetencies,
  getModules,
  getPhaseById,
} from '@/lib/curriculum/queries';
import { formatCountOf, formatMinutes } from '@/lib/utils/format';
import { LESSONS_PER_MODULE, moduleNumbersForPhase } from '@/types/curriculum';

interface ModulePageProps {
  readonly params: Promise<{ readonly moduleSlug: string }>;
}

export function generateStaticParams(): { moduleSlug: string }[] {
  return getModules().map((courseModule) => ({ moduleSlug: courseModule.slug }));
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { moduleSlug } = await params;
  const courseModule = getModuleBySlug(moduleSlug);
  if (courseModule === null) return { title: 'Module not found' };
  return { title: courseModule.title, description: courseModule.description };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleSlug } = await params;
  const courseModule = getModuleBySlug(moduleSlug);
  if (courseModule === null) notFound();

  const phase = getPhaseById(courseModule.phase);
  const competencies = getModuleCompetencies(courseModule.id);

  /* Neighbours are resolved by module number across the whole course, so a
   * phase boundary is not a dead end. */
  const modules = getModules();
  const previous =
    modules.find((m) => m.moduleNumber === courseModule.moduleNumber - 1) ?? null;
  const next = modules.find((m) => m.moduleNumber === courseModule.moduleNumber + 1) ?? null;

  const totalMinutes = courseModule.lessons.reduce(
    (total, lesson) => total + lesson.estimatedMinutes,
    0,
  );

  const phaseRange = moduleNumbersForPhase(phase.phaseNumber);
  const rangeLabel =
    phaseRange.length === 0
      ? ''
      : `Modules ${phaseRange[0]}–${phaseRange[phaseRange.length - 1]}`;

  return (
    <PageLayout
      rail={
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-caption uppercase text-text-muted">Progress</h2>
            <ModuleProgressPanel courseModule={courseModule} />
          </div>

          <div>
            <h2 className="mb-2 text-caption uppercase text-text-muted">Outcome</h2>
            <p className="text-small text-text-secondary">{courseModule.outcome}</p>
          </div>

          {courseModule.prerequisites.length > 0 && (
            <div>
              <h2 className="mb-2 text-caption uppercase text-text-muted">
                Assumed knowledge
              </h2>
              <ul className="space-y-1.5 text-small text-text-secondary">
                {courseModule.prerequisites.map((prerequisite) => (
                  <li key={prerequisite}>{prerequisite}</li>
                ))}
              </ul>
              <p className="mt-2 text-small text-text-muted">
                A recommendation, not a requirement. Nothing here is locked.
              </p>
            </div>
          )}

          {competencies.length > 0 && (
            <div>
              <h2 className="mb-2 text-caption uppercase text-text-muted">Competencies</h2>
              <ul className="flex flex-wrap gap-1.5">
                {competencies.map((competency) => (
                  <li key={competency.id}>
                    <Badge>{competency.label}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
    >
      <PageHeader
        eyebrow={`Phase ${phase.phaseNumber} · ${phase.title} · ${rangeLabel}`}
        title={courseModule.title}
        description={courseModule.description}
        meta={
          <>
            <span data-numeric>
              {courseModule.lessons.length} of {formatCountOf(LESSONS_PER_MODULE, 'lesson')}{' '}
              authored
            </span>
            {totalMinutes > 0 && <span data-numeric>{formatMinutes(totalMinutes)}</span>}
          </>
        }
      />

      <ModuleCompletionPanel
        courseModule={courseModule}
        competencies={competencies.map(({ id, label }) => ({
          id,
          label,
          demonstrated: courseModule.project.competencies.includes(id),
        }))}
        nextModule={
          next === null
            ? null
            : {
                moduleNumber: next.moduleNumber,
                title: next.title,
                slug: next.slug,
                outcome: next.outcome,
              }
        }
      />

      <section aria-labelledby="position-heading">
        <SectionHeader
          id="position-heading"
          title="Where this sits"
          description="What comes before it, and what it prepares you for."
        />
        <ModuleNeighbours previous={previous} current={courseModule} next={next} />
      </section>

      <section aria-labelledby="lessons-heading" className="mt-10">
        <SectionHeader
          id="lessons-heading"
          title="Lessons"
          description="Every lesson is open to read at any time, in any order."
        />
        <ModuleLessonList courseModule={courseModule} />
      </section>

      <section aria-labelledby="project-heading" className="mt-10">
        <SectionHeader
          id="project-heading"
          title="Module project"
          description="The module is not complete until this is built."
        />

        <Card padding="compact">
          <h3 className="text-small font-medium text-text-primary">
            {courseModule.project.title}
          </h3>
          <p className="mt-1.5 text-small text-text-muted">{courseModule.project.brief}</p>
          <div className="mt-4">
            <Button asChild>
              <Link href={`/projects/${courseModule.slug}`}>
                Open project
                <ArrowRight aria-hidden size={15} strokeWidth={2} />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </PageLayout>
  );
}
