import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface PageLayoutProps {
  readonly children: ReactNode;
  /**
   * Optional contextual rail. Shown beside the content on wide viewports and
   * stacked underneath it otherwise, so nothing in it is ever unreachable.
   */
  readonly rail?: ReactNode;
  readonly className?: string;
}

/**
 * The content column. Measure is capped near 72ch so prose stays readable on a
 * wide display instead of running the full width of the screen.
 */
export function PageLayout({ children, rail, className }: PageLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-10',
        rail !== undefined && 'xl:flex xl:gap-12',
        className,
      )}
    >
      <div className={cn('min-w-0', rail !== undefined ? 'xl:flex-1' : 'max-w-3xl')}>
        {children}
      </div>

      {rail !== undefined && (
        <aside
          aria-label="Page details"
          className="mt-10 shrink-0 border-t border-border pt-8 xl:mt-0 xl:w-64 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0"
        >
          {rail}
        </aside>
      )}
    </div>
  );
}
