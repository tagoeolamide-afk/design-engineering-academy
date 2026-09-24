import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectLinksPanel } from '@/components/projects/project-links';
import { ProjectStatusControl } from '@/components/projects/project-status-control';
import {
  PortfolioEvidence,
  ProjectNotes,
  ProjectReflection,
} from '@/components/projects/project-workspace';
import { PageLayout } from '@/components/shell/page-layout';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import {
  getModuleBySlug,
  getModuleCompetencies,
  getModules,
  getPhaseById,
} from '@/lib/curriculum/queries';
import { formatCountOf } from '@/lib/utils/format';

interface ProjectPageProps {
  readonly params: Promise<{ readonly moduleSlug: string }>;
}

export function generateStaticParams(): { moduleSlug: string }[] {
  return getModules().map((courseModule) => ({ moduleSlug: courseModule.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { moduleSlug } = await params;
  const courseModule = getModuleBySlug(moduleSlug);
  if (courseModule === null) return { title: 'Project not found' };
  return { title: courseModule.project.title, description: courseModule.project.brief };
}

/**
 * One module project, in the order the work actually happens: why it matters,
 * what it must do, what limits it, how far to take it, what to hand over, and
 * how to tell it is finished. The interactive parts — status, links, notes,
 * reflection — sit in the rail so the brief reads uninterrupted.
 */
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { moduleSlug } = await params;
  const courseModule = getModuleBySlug(moduleSlug);
  if (courseModule === null) notFound();

  const { project } = courseModule;
  const phase = getPhaseById(courseModule.phase);
  const competencies = getModuleCompetencies(courseModule.id);

  return (
    <PageLayout
      rail={
        <div className="space-y-8">
          <ProjectStatusControl projectId={project.id} moduleId={courseModule.id} />

          <div>
            <h2 className="mb-2.5 text-caption uppercase text-text-muted">Links</h2>
            <ProjectLinksPanel projectId={project.id} moduleId={courseModule.id} />
          </div>

          <div>
            <h2 className="mb-2.5 text-caption uppercase text-text-muted">
              Working notes
            </h2>
            <ProjectNotes projectId={project.id} moduleId={courseModule.id} />
          </div>

          {competencies.length > 0 && (
            <div>
              <h2 className="mb-2.5 text-caption uppercase text-text-muted">
                Required capabilities
              </h2>
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
        eyebrow={
          <>
            <Link
              href={`/curriculum/${courseModule.slug}`}
              className="underline decoration-border underline-offset-4 hover:text-text-secondary"
            >
              {courseModule.title}
            </Link>
            {` · Phase ${phase.phaseNumber} · Module project`}
          </>
        }
        title={project.title}
        description={project.brief}
        meta={
          <>
            <span data-numeric>{project.estimatedHours} hours</span>
            <span data-numeric>
              {formatCountOf(project.deliverables.length, 'deliverable')}
            </span>
          </>
        }
      />

      <div className="space-y-10">
        <section aria-labelledby="problem-heading">
          <SectionHeader id="problem-heading" title="The problem" />
          <p className="max-w-measure text-body text-text-secondary">{project.problem}</p>
        </section>

        {project.objectives.length > 0 && (
          <ListSection
            id="objectives"
            title="Objectives"
            items={project.objectives}
            accent
          />
        )}

        {project.requirements.length > 0 && (
          <ListSection id="requirements" title="Requirements" items={project.requirements} />
        )}

        {project.constraints.length > 0 && (
          <ListSection
            id="constraints"
            title="Constraints"
            description="Deliberate limits. They are the point, not an obstacle."
            items={project.constraints}
          />
        )}

        <section aria-labelledby="scope-heading">
          <SectionHeader
            id="scope-heading"
            title="Suggested scope"
            description="Sized so it can be finished."
          />
          <p className="max-w-measure text-body text-text-secondary">
            {project.suggestedScope}
          </p>
        </section>

        {project.deliverables.length > 0 && (
          <ListSection id="deliverables" title="Deliverables" items={project.deliverables} />
        )}

        {project.completionCriteria.length > 0 && (
          <ListSection
            id="completion"
            title="Completion criteria"
            description="How to tell the work is done rather than merely stopped."
            items={project.completionCriteria}
          />
        )}

        {project.stretchGoals !== undefined && project.stretchGoals.length > 0 && (
          <ListSection
            id="stretch"
            title="If you want to go further"
            items={project.stretchGoals}
          />
        )}

        <section aria-labelledby="evidence-heading">
          <SectionHeader id="evidence-heading" title="Portfolio evidence" />
          <PortfolioEvidence
            projectId={project.id}
            evidence={project.portfolioEvidence}
            title={project.title}
          />
        </section>

        <section aria-labelledby="reflection-heading">
          <SectionHeader id="reflection-heading" title="Reflection" />
          <ProjectReflection
            projectId={project.id}
            moduleId={courseModule.id}
            question={project.reflectionQuestion}
          />
        </section>
      </div>
    </PageLayout>
  );
}

function ListSection({
  id,
  title,
  description,
  items,
  accent = false,
}: {
  id: string;
  title: string;
  description?: string;
  items: readonly string[];
  accent?: boolean;
}) {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <SectionHeader
        id={`${id}-heading`}
        title={title}
        {...(description === undefined ? {} : { description })}
      />
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1.25rem_1fr] gap-x-2">
            <span
              aria-hidden
              className={`mt-2.5 h-px w-3 ${accent ? 'bg-accent' : 'bg-border-strong'}`}
            />
            <span className="text-body text-text-secondary">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
