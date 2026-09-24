import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface LessonSectionProps {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * One titled section of the lesson body.
 *
 * A hairline and a quiet uppercase label rather than a large heading: with
 * thirteen sections in a lesson, big headings would fight the prose and the
 * lesson title for attention. The rule does the separating, the label does the
 * naming, and the body keeps the emphasis.
 *
 * scroll-mt keeps the heading clear of the sticky mobile header when the table
 * of contents jumps to it.
 */
export function LessonSection({ id, title, children, className }: LessonSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn('scroll-mt-20 border-t border-border pt-8', className)}
    >
      <h2 id={`${id}-heading`} className="mb-4 text-caption uppercase text-text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}
