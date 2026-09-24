import type { Metadata } from 'next';
import { CurriculumSummary } from '@/components/curriculum/curriculum-summary';
import { ModulePath } from '@/components/curriculum/module-path';
import { PhaseSection } from '@/components/curriculum/phase-section';
import { PageLayout } from '@/components/shell/page-layout';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import {
  getCourse,
  getLessonCount,
  getModules,
  getModulesInPhase,
  getPhases,
} from '@/lib/curriculum/queries';
import { formatCountOf } from '@/lib/utils/format';
import { LESSONS_PER_MODULE, TOTAL_LESSONS, TOTAL_MODULES } from '@/types/curriculum';

export const metadata: Metadata = { title: 'Curriculum' };

/**
 * The curriculum overview.
 *
 * Structured so the whole journey is legible from one screen without being
 * overwhelming: the shape of the course first, then the recommended path as a
 * single chain, then the five phases in order with their modules.
 *
 * Nothing is locked. Ordering is expressed as a recommendation — through
 * position, prerequisites, and the path — never by disabling a destination.
 */
export default function CurriculumPage() {
  const course = getCourse();
  const phases = getPhases();
  const modules = getModules();

  return (
    <PageLayout className="max-w-5xl">
      <PageHeader
        eyebrow="Curriculum"
        title="The path"
        description={`Five phases, ${TOTAL_MODULES} modules of ${LESSONS_PER_MODULE} lessons, each module ending in something built. The order is the recommended one — every lesson stays open to read whenever you want it.`}
        meta={
          <>
            <span data-numeric>{formatCountOf(TOTAL_LESSONS, 'lesson')}</span>
            <span data-numeric>{formatCountOf(TOTAL_MODULES, 'module')}</span>
            <span data-numeric>{formatCountOf(phases.length, 'phase')}</span>
            <span data-numeric>
              {formatCountOf(modules.length, 'module')} authored so far
            </span>
          </>
        }
      />

      <CurriculumSummary
        authoredModules={modules.length}
        authoredLessons={getLessonCount()}
      />

      <section aria-labelledby="path-heading" className="mt-10">
        <SectionHeader
          id="path-heading"
          title="Recommended order"
          description="Each module prepares the next. You can open any of them at any time — this is the route, not a gate."
        />
        <ModulePath modules={modules} />
      </section>

      <div className="mt-12 space-y-12">
        {phases.map((phase) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            modules={getModulesInPhase(phase.id)}
          />
        ))}
      </div>

      <p className="mt-12 border-t border-border pt-6 text-small text-text-muted">
        {course.description}
      </p>
    </PageLayout>
  );
}
