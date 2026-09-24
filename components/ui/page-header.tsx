import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface PageHeaderProps {
  readonly eyebrow?: ReactNode;
  readonly title: string;
  readonly description?: string;
  /** Controls aligned to the title baseline, e.g. a primary action. */
  readonly actions?: ReactNode;
  /** A row of small facts under the description — counts, durations, status. */
  readonly meta?: ReactNode;
  readonly className?: string;
}

/**
 * Rendered as a div, not a header: a header element here would expose a second
 * banner landmark inside main, competing with the real one in the app shell.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          {eyebrow !== undefined && (
            <p className="mb-2 text-caption uppercase text-text-muted">{eyebrow}</p>
          )}
          <h1 className="text-display text-balance text-text-primary">{title}</h1>
        </div>
        {actions !== undefined && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {description !== undefined && (
        <p className="mt-3 max-w-measure text-body text-text-secondary">{description}</p>
      )}

      {meta !== undefined && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-text-muted">
          {meta}
        </div>
      )}
    </div>
  );
}
