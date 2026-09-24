import type { IndustryExample } from '@/types/curriculum';

/**
 * Real products, what they actually do, and why it matters here.
 *
 * The source is set as a quiet label rather than a logo or a card, so the
 * examples read as evidence inside the argument rather than as a sponsor wall.
 */
export function IndustryExamples({ examples }: { examples: readonly IndustryExample[] }) {
  if (examples.length === 0) return null;

  return (
    <ul className="space-y-6">
      {examples.map((example) => (
        <li key={example.id} className="border-l-2 border-border pl-4">
          <p className="text-caption uppercase text-text-muted">{example.source}</p>
          <h3 className="mt-1 text-small font-medium text-text-primary">{example.title}</h3>
          <p className="mt-2 text-body text-text-secondary">{example.observation}</p>
          <p className="mt-2 text-body text-text-muted">
            <span className="text-text-secondary">Why it matters: </span>
            {example.takeaway}
          </p>
        </li>
      ))}
    </ul>
  );
}
