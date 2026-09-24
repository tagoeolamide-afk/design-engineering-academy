import type { Metadata } from 'next';
import { CompetencyDevelopment } from '@/components/dashboard/competency-development';
import { ContinueLearning } from '@/components/dashboard/continue-learning';
import { CurrentModulePanel } from '@/components/dashboard/current-module-panel';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { PhaseProgressList } from '@/components/dashboard/phase-progress';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { CourseProgressSummary } from '@/components/learning/course-progress-summary';
import { PageLayout } from '@/components/shell/page-layout';
import { SectionHeader } from '@/components/ui/section-header';
import { getLessonCount, getModules } from '@/lib/curriculum/queries';
import { COMPETENCY_IDS } from '@/types/competency';
import { TOTAL_LESSONS, TOTAL_MODULES } from '@/types/curriculum';

export const metadata: Metadata = { title: 'Dashboard' };

/**
 * The dashboard answers five questions in a fixed order: where am I, what
 * should I study next, how much progress have I made, what am I working
 * toward, and which skills am I developing. Recent activity closes it as the
 * record of what has actually been done.
 *
 * Everything shown is a count of real work. There are no scores, no streaks,
 * and no charts that exist to fill space.
 */
export default function DashboardPage() {
  return (
    <PageLayout rail={<DashboardRail />}>
      <DashboardHeader />

      <section aria-labelledby="continue-heading">
        <SectionHeader
          id="continue-heading"
          title="Continue learning"
          description="One recommendation at a time, chosen by finishing what is open before starting anything new."
        />
        <ContinueLearning />
      </section>

      <section aria-labelledby="curriculum-progress-heading" className="mt-12">
        <SectionHeader
          id="curriculum-progress-heading"
          title="Curriculum progress"
          description="Completion across the five phases. Modules and lessons are counted separately because they are different measures."
        />
        <CourseProgressSummary />
        <div className="mt-6">
          <PhaseProgressList />
        </div>
      </section>

      <section aria-labelledby="current-module-heading" className="mt-12">
        <SectionHeader
          id="current-module-heading"
          title="Current module"
          description="The five lessons and the project that together complete this module."
        />
        <CurrentModulePanel />
      </section>

      <section aria-labelledby="competency-heading" className="mt-12">
        <SectionHeader
          id="competency-heading"
          title="Competency development"
          description="Three records of completed work per competency — a lesson finished, an exercise finished, a project finished. None of them is a rating."
        />
        <CompetencyDevelopment />
      </section>

      <section aria-labelledby="activity-heading" className="mt-12">
        <SectionHeader
          id="activity-heading"
          title="Recent activity"
          description="Read from the timestamps on your stored progress. Everything stays on this device."
        />
        <RecentActivity />
      </section>
    </PageLayout>
  );
}

/**
 * Orientation only: the fixed shape of the course, and how much of it exists
 * so far. Static facts, so this stays a server component.
 */
function DashboardRail() {
  const authoredModules = getModules().length;
  const authoredLessons = getLessonCount();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-caption uppercase text-text-muted">The course</h2>
        <dl className="space-y-2.5 text-small">
          <RailFigure label="Phases" value="5" />
          <RailFigure label="Modules" value={String(TOTAL_MODULES)} />
          <RailFigure label="Lessons" value={String(TOTAL_LESSONS)} />
          <RailFigure label="Competencies" value={String(COMPETENCY_IDS.length)} />
        </dl>
      </div>

      <div>
        <h2 className="mb-3 text-caption uppercase text-text-muted">Authored so far</h2>
        <dl className="space-y-2.5 text-small">
          <RailFigure label="Modules" value={`${authoredModules} of ${TOTAL_MODULES}`} />
          <RailFigure label="Lessons" value={`${authoredLessons} of ${TOTAL_LESSONS}`} />
        </dl>
        <p className="mt-3 text-small text-text-muted">
          The rest of the curriculum is written in later stages. Progress is measured
          against what exists.
        </p>
      </div>
    </div>
  );
}

function RailFigure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-text-muted">{label}</dt>
      <dd data-numeric>{value}</dd>
    </div>
  );
}
