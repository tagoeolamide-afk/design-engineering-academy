import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionHeaderProps {
  readonly title: string;
  readonly description?: string;
  /** Rendered opposite the title: a count, a link, or a small control. */
  readonly aside?: ReactNode;
  /** Associates the section heading with its region via aria-labelledby. */
  readonly id?: string;
  readonly className?: string;
}

/**
 * The quieter sibling of PageHeader. One page has a single display title and
 * as many section headers as it needs, which is what keeps the hierarchy
 * legible without escalating type sizes.
 */
export function SectionHeader({
  title,
  description,
  aside,
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-baseline justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-heading text-text-primary">
          {title}
        </h2>
        {description !== undefined && (
          <p className="mt-1 max-w-measure text-small text-text-muted">{description}</p>
        )}
      </div>
      {aside !== undefined && <div className="shrink-0 text-small text-text-muted">{aside}</div>}
    </div>
  );
}
