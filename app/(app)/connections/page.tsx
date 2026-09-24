import type { Metadata } from 'next';
import { ConceptChainSection } from '@/components/connections/concept-chain';
import { PageLayout } from '@/components/shell/page-layout';
import { PageHeader } from '@/components/ui/page-header';
import { getChainLessonIds, resolveAllConceptChains } from '@/lib/connections/chains';
import { formatCountOf } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'Connections',
  description:
    'How the ideas in this course connect: concept chains tracing one idea from a single screen to a whole product.',
};

export default function ConnectionsPage() {
  const chains = resolveAllConceptChains();
  const lessonCount = getChainLessonIds().length;

  return (
    <PageLayout className="max-w-4xl">
      <PageHeader
        eyebrow="Connections"
        title="One discipline, not fifteen topics"
        description="The curriculum is taught in modules because something has to come first, not because the subject divides that way. Each chain below follows a single idea as it reappears at a larger scale, and says what each level adds."
      />

      <p className="-mt-4 mb-10 text-caption uppercase text-text-muted" data-numeric>
        {chains.length} chains · {formatCountOf(lessonCount, 'lesson')} referenced
      </p>

      <nav aria-label="Chains" className="mb-12 border-y border-border py-4">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {chains.map((chain) => (
            <li key={chain.id}>
              <a
                href={`#${chain.id}`}
                className="text-small text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary"
              >
                {chain.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-16">
        {chains.map((chain) => (
          <ConceptChainSection key={chain.id} chain={chain} />
        ))}
      </div>
    </PageLayout>
  );
}
