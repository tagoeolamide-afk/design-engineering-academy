import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly icon?: LucideIcon;
  readonly action?: ReactNode;
  readonly className?: string;
}

/**
 * States what will be here and why it is not here yet, rather than apologising
 * or showing a drawing. An unpopulated route should still read as deliberate.
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-large border border-dashed border-border px-6 py-10 text-center',
        className,
      )}
    >
      {Icon !== undefined && (
        <Icon aria-hidden size={18} strokeWidth={1.75} className="mb-3 text-text-muted" />
      )}
      <p className="text-small font-medium text-text-primary">{title}</p>
      <p className="mt-1.5 max-w-measure-narrow text-small text-text-muted">{description}</p>
      {action !== undefined && <div className="mt-5">{action}</div>}
    </div>
  );
}
