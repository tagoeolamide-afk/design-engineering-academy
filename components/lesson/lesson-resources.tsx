import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatMinutes } from '@/lib/utils/format';
import type { Resource } from '@/types/curriculum';

/** Follow-up reading, with the reason each one is worth the time. */
export function LessonResources({ resources }: { resources: readonly Resource[] }) {
  if (resources.length === 0) return null;

  return (
    <ul className="border-t border-border">
      {resources.map((resource) => (
        <li key={resource.id} className="border-b border-border py-3.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-baseline gap-1.5 text-small text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-muted"
            >
              {resource.title}
              <ArrowUpRight
                aria-hidden
                size={13}
                strokeWidth={2}
                className="shrink-0 text-text-muted"
              />
            </a>
            <span className="flex shrink-0 items-center gap-2">
              {resource.estimatedMinutes !== undefined && (
                <span className="text-caption uppercase text-text-muted" data-numeric>
                  {formatMinutes(resource.estimatedMinutes)}
                </span>
              )}
              <Badge>{resource.type}</Badge>
            </span>
          </div>

          {resource.author !== undefined && (
            <p className="mt-1 text-caption uppercase text-text-muted">{resource.author}</p>
          )}
          {resource.note !== undefined && (
            <p className="mt-1.5 text-small text-text-muted">{resource.note}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
