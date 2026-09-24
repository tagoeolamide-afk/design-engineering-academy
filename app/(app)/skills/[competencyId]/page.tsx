import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CompetencyEvidenceDetail } from '@/components/skills/competency-evidence-detail';
import { PageLayout } from '@/components/shell/page-layout';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import {
  getCompetencyById,
  getLessonsForCompetency,
  getProjectsForCompetency,
} from '@/lib/curriculum/queries';
import { formatCountOf } from '@/lib/utils/format';
import {
  COMPETENCY_CATEGORY_LABELS,
  COMPETENCY_IDS,
  isCompetencyId,
} from '@/types/competency';

interface CompetencyPageProps {
  readonly params: Promise<{ readonly competencyId: string }>;
}

export function generateStaticParams(): { competencyId: string }[] {
  return COMPETENCY_IDS.map((competencyId) => ({ competencyId }));
}

export async function generateMetadata({
  params,
}: CompetencyPageProps): Promise<Metadata> {
  const { competencyId } = await params;
  if (!isCompetencyId(competencyId)) return { title: 'Competency' };

  const competency = getCompetencyById(competencyId);
  return competency === null
    ? { title: 'Competency' }
    : { title: competency.label, description: competency.description };
}

export default async function CompetencyPage({ params }: CompetencyPageProps) {
  const { competencyId } = await params;
  if (!isCompetencyId(competencyId)) notFound();

  const competency = getCompetencyById(competencyId);
  if (competency === null) notFound();

  const lessons = getLessonsForCompetency(competencyId);
  const projects = getProjectsForCompetency(competencyId);

  return (
    <PageLayout className="max-w-3xl">
      <Link
        href="/skills"
        className="mb-6 inline-flex items-center gap-1.5 text-small text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        All competencies
      </Link>

      <PageHeader
        eyebrow={`${COMPETENCY_CATEGORY_LABELS[competency.category]} competency`}
        title={competency.label}
        description={competency.description}
      />

      <p className="-mt-4 mb-10 flex flex-wrap items-center gap-2">
        <Badge tone={competency.category === 'hybrid' ? 'accent' : 'neutral'}>
          {COMPETENCY_CATEGORY_LABELS[competency.category]}
        </Badge>
        <span className="text-caption uppercase text-text-muted">
          {formatCountOf(lessons.length, 'lesson')} · {formatCountOf(projects.length, 'project')}
        </span>
      </p>

      <CompetencyEvidenceDetail
        competency={competency}
        lessons={lessons}
        projects={projects}
      />
    </PageLayout>
  );
}
