'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface TocEntry {
  readonly id: string;
  readonly label: string;
}

/**
 * Table of contents for the lesson body.
 *
 * Tracks the section currently being read so the learner always knows where
 * they are in a long argument. The active entry is marked with a rule and a
 * weight change as well as colour.
 */
export function LessonToc({ entries }: { entries: readonly TocEntry[] }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

  /* Depend on a joined key rather than the array: the parent rebuilds the list
   * on every render, and an array identity would tear down and rebuild the
   * observer each time. */
  const key = entries.map((entry) => entry.id).join(',');

  useEffect(() => {
    const ids = key.split(',').filter((id) => id !== '');
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const first = visible[0];
        if (first !== undefined) setActive(first.target.id);
      },
      /* A band near the top of the viewport: the active section is the one
       * being read, not merely the one on screen. */
      { rootMargin: '-12% 0px -70% 0px' },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element !== null) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [key]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="On this lesson">
      <h2 className="mb-2.5 text-caption uppercase text-text-muted">On this page</h2>
      <ol className="space-y-0.5">
        {entries.map((entry) => {
          const isActive = entry.id === active;

          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'relative block border-l py-1 pl-3 text-small transition-colors duration-100',
                  isActive
                    ? 'border-accent font-medium text-text-primary'
                    : 'border-border text-text-muted hover:border-border-strong hover:text-text-secondary',
                )}
              >
                {entry.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
