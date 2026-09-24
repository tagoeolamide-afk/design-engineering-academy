import type { Metadata } from 'next';
import { ResourceLibrary } from '@/components/resources/resource-library';
import { PageLayout } from '@/components/shell/page-layout';
import { PageHeader } from '@/components/ui/page-header';
import { getAllResources } from '@/lib/resources/library';
import { RESOURCE_CATEGORIES } from '@/types/resources';

export const metadata: Metadata = { title: 'Resources' };

export default function ResourcesPage() {
  const total = getAllResources().length;

  return (
    <PageLayout className="max-w-5xl">
      <PageHeader
        eyebrow="Resources"
        title="Reading and reference"
        description={`${total} recommendations across ${RESOURCE_CATEGORIES.length} categories, each with a reason it is here and the lessons it supports. Official sources are preferred, and every link was checked before it was listed.`}
      />
      <ResourceLibrary />
    </PageLayout>
  );
}
