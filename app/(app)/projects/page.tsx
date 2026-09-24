import type { Metadata } from 'next';
import { PortfolioSummary } from '@/components/projects/portfolio-summary';
import { ProjectCard, ProjectSlot } from '@/components/projects/project-card';
import { PageLayout } from '@/components/shell/page-layout';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { getModules, getPhases, getModulesInPhase } from '@/lib/curriculum/queries';
import { formatCountOf } from '@/lib/utils/format';
import { moduleNumbersForPhase, TOTAL_MODULES } from '@/types/curriculum';

export const metadata: Metadata = { title: 'Projects' };

/**
 * All fifteen projects, grouped by phase so the build arc is visible, followed
 * by the portfolio evidence completed work has already earned.
 *
 * Unauthored projects are shown as slots rather than omitted: fifteen builds is
 * the shape of the course, and hiding the ones not yet written would make it
 * look shorter than it is.
 */
export default function ProjectsPage() {
  const phases = getPhases();
  const modules = getModules();

  return (
    <PageLayout className="max-w-5xl">
      <PageHeader
        eyebrow="Projects"
        title="Fifteen things you build"
        description="One project per module. A module is not complete until its project is — reading the lessons is preparation, the build is the work."
        meta={
          <>
            <span data-numeric>{formatCountOf(TOTAL_MODULES, 'project')}</span>
            <span data-numeric>
              {formatCountOf(modules.length, 'project')} authored so far
            </span>
          </>
        }
      />

      <div className="space-y-12">
        {phases.map((phase) => {
          const phaseModules = getModulesInPhase(phase.id);
          const byNumber = new Map(phaseModules.map((m) => [m.moduleNumber, m]));
          const expected = moduleNumbersForPhase(phase.phaseNumber);

          return (
            <section key={phase.id} aria-labelledby={`phase-${phase.id}-projects`}>
              <SectionHeader
                id={`phase-${phase.id}-projects`}
                title={`Phase ${phase.phaseNumber} · ${phase.title}`}
                aside={
                  <span data-numeric>{formatCountOf(expected.length, 'project')}</span>
                }
              />

              <ul className="space-y-2.5">
                {expected.map((moduleNumber) => {
                  const courseModule = byNumber.get(moduleNumber);

                  return (
                    <li key={moduleNumber}>
                      {courseModule === undefined ? (
                        <ProjectSlot moduleNumber={moduleNumber} />
                      ) : (
                        <ProjectCard courseModule={courseModule} />
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <section aria-labelledby="portfolio-heading" className="mt-14 border-t border-border pt-10">
        <SectionHeader
          id="portfolio-heading"
          title="Portfolio evidence"
          description="What your completed builds demonstrate, in the specific terms a reviewer can check."
        />
        <PortfolioSummary />
      </section>
    </PageLayout>
  );
}
