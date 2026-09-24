import type { ReactNode } from 'react';

interface LessonLayoutProps {
  /** Module navigation. Appears only on very wide viewports. */
  readonly nav: ReactNode;
  /** The lesson itself. */
  readonly children: ReactNode;
  /** Table of contents and lesson status. */
  readonly aside: ReactNode;
}

/**
 * The reading layout.
 *
 * Three columns on a wide desktop, and a single column everywhere else. The
 * centre column is capped near 68 characters regardless of how much room is
 * available, because the measure is what makes long-form reading comfortable —
 * widening the text to fill a large display would make the lesson harder to
 * read, not easier.
 *
 * The side columns appear in order of how much they earn their space: the
 * contents and status arrive first at xl, module navigation only at 2xl. Both
 * are supplementary, so dropping them on smaller screens costs nothing — the
 * same information is reachable from the module page and from the lesson body.
 */
export function LessonLayout({ nav, children, aside }: LessonLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-[96rem] px-5 py-8 md:px-8 md:py-10">
      <div className="flex justify-center gap-10 2xl:gap-12">
        <aside
          aria-label="Module navigation"
          className="hidden w-44 shrink-0 2xl:block"
        >
          <div className="sticky top-8 max-h-[calc(100vh-5rem)] overflow-y-auto pb-6">
            {nav}
          </div>
        </aside>

        <div className="min-w-0 max-w-measure flex-1">{children}</div>

        <aside aria-label="Lesson contents and status" className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-8 max-h-[calc(100vh-5rem)] space-y-8 overflow-y-auto pb-6">
            {aside}
          </div>
        </aside>
      </div>
    </div>
  );
}
