import Link from 'next/link';
import type { Route } from 'next';
import type { ResolvedConceptChain } from '@/lib/connections/chains';
import { formatCountOf } from '@/lib/utils/format';

/**
 * One chain, rendered as an ordered sequence.
 *
 * Deliberately a list and not a diagram. It is a real `<ol>`, so the order is
 * available to a screen reader and to anyone reading with styles off, and it
 * reflows to a single column without a viewBox or a layout engine. The rule
 * between markers is the only thing that draws the connection, and it is
 * decorative — the meaning is carried by the numbering.
 */
export function ConceptChainSection({ chain }: { readonly chain: ResolvedConceptChain }) {
  return (
    <section aria-labelledby={`chain-${chain.id}`} className="scroll-mt-24" id={chain.id}>
      <div className="border-b border-border pb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id={`chain-${chain.id}`} className="text-heading text-text-primary">
            {chain.title}
          </h2>
          <span className="shrink-0 text-caption uppercase text-text-muted" data-numeric>
            {chain.links.length} steps · {formatCountOf(chain.lessonCount, 'lesson')}
          </span>
        </div>
        <p className="mt-1.5 max-w-measure text-small text-text-secondary">
          {chain.subtitle}
        </p>
      </div>

      {/* The chain itself. */}
      <ol className="mt-6">
        {chain.links.map((link, index) => {
          const isLast = index === chain.links.length - 1;

          return (
            <li key={link.id} className="grid grid-cols-[1.5rem_1fr] gap-x-4">
              {/* Marker column: the step number, and the rule joining it to the
                  next step. Both are presentational; the <ol> carries order. */}
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated text-caption text-text-secondary"
                  data-numeric
                >
                  {index + 1}
                </span>
                {!isLast && <span aria-hidden className="w-px flex-1 bg-border" />}
              </div>

              <div className={isLast ? 'pb-0' : 'pb-7'}>
                <h3 className="text-small font-medium text-text-primary">{link.label}</h3>
                <p className="mt-1 max-w-measure text-small text-text-secondary">
                  {link.contribution}
                </p>

                {link.lessons.length > 0 && (
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {link.lessons.map((lesson) => (
                      <li key={lesson.lessonId}>
                        <Link
                          href={lesson.href as Route}
                          className="inline-flex items-baseline gap-1.5 rounded-small bg-surface-elevated px-2 py-1 text-caption text-text-secondary underline decoration-transparent underline-offset-4 hover:text-text-primary hover:decoration-border"
                        >
                          <span className="text-text-muted" data-numeric>
                            M{lesson.moduleNumber}
                          </span>
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 border-l-2 border-accent/40 pl-4">
        <h3 className="text-caption uppercase text-text-muted">
          Why are these ideas connected?
        </h3>
        <p className="mt-1.5 max-w-measure text-small text-text-secondary">
          {chain.whyConnected}
        </p>
      </div>
    </section>
  );
}
