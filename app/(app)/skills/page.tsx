import type { Metadata } from 'next';
import { CompetencyCatalogue } from '@/components/skills/competency-catalogue';
import { PageLayout } from '@/components/shell/page-layout';
import { PageHeader } from '@/components/ui/page-header';
import { COMPETENCY_CATEGORIES, COMPETENCY_IDS } from '@/types/competency';

export const metadata: Metadata = { title: 'Skills' };

export default function SkillsPage() {
  return (
    <PageLayout className="max-w-5xl">
      <PageHeader
        eyebrow="Skills"
        title="Competencies"
        description={`The ${COMPETENCY_IDS.length} competencies this course develops, across ${COMPETENCY_CATEGORIES.length} categories. Everything here is derived from curriculum work you have finished — there are no scores, levels, or ratings, because none of them would mean anything.`}
      />
      <CompetencyCatalogue />
    </PageLayout>
  );
}
