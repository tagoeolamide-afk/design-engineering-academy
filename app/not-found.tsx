import Link from 'next/link';
import { ArrowRight, BookOpen, FolderGit2, Library, Target } from 'lucide-react';
import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';
import { AppShell } from '@/components/shell/app-shell';
import { PageLayout } from '@/components/shell/page-layout';
import { PageHeader } from '@/components/ui/page-header';
import { getLessonCount, getModules } from '@/lib/curriculum/queries';
import { formatCountOf } from '@/lib/utils/format';

/**
 * The 404.
 *
 * A dead end with one button is technically not a blank screen and practically
 * is one. Someone arrives here from a stale bookmark, a mistyped slug, or a
 * link written before a rename — so the page says which kinds of address exist,
 * and offers the places worth going instead of making them use the back button.
 *
 * Search is the fastest route of all when the name is half-remembered, so the
 * shortcut is named explicitly rather than left to be discovered.
 */

interface Destination {
  readonly href: Route;
  readonly label: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

export default function NotFound() {
  const moduleCount = getModules().length;
  const lessonCount = getLessonCount();

  const destinations: readonly Destination[] = [
    {
      href: '/curriculum',
      label: 'Curriculum',
      description: `${formatCountOf(moduleCount, 'module')} and ${formatCountOf(lessonCount, 'lesson')}, in the order they are meant to be taken.`,
      icon: BookOpen,
    },
    {
      href: '/projects',
      label: 'Projects',
      description: 'One build per module, with its brief and completion criteria.',
      icon: FolderGit2,
    },
    {
      href: '/skills',
      label: 'Skills',
      description: 'Competencies, and the finished work that evidences each one.',
      icon: Target,
    },
    {
      href: '/resources',
      label: 'Resources',
      description: 'Reading and reference, grouped by topic.',
      icon: Library,
    },
  ];

  return (
    /* Outside the (app) route group, so the frame is added here rather than
       inherited — an unmatched URL should still look like the application. */
    <AppShell>
      <PageLayout className="max-w-3xl">
        <PageHeader
          eyebrow="404"
          title="That page does not exist"
          description="The address did not match a module, lesson, project, or competency. It may have been renamed, or the link may have been written before it existed."
        />

        <p className="-mt-4 mb-10 max-w-measure text-small text-text-muted">
          Lessons live at{' '}
          <code className="font-mono text-code text-text-secondary">
            /curriculum/&lt;module&gt;/&lt;lesson&gt;
          </code>
          , projects at{' '}
          <code className="font-mono text-code text-text-secondary">
            /projects/&lt;module&gt;
          </code>
          , and competencies at{' '}
          <code className="font-mono text-code text-text-secondary">
            /skills/&lt;competency&gt;
          </code>
          . If you know roughly what it was called, search is quicker than
          browsing — press{' '}
          <kbd className="rounded-small bg-surface-elevated px-1.5 py-0.5 font-mono text-code text-text-secondary">
            Ctrl K
          </kbd>{' '}
          or{' '}
          <kbd className="rounded-small bg-surface-elevated px-1.5 py-0.5 font-mono text-code text-text-secondary">
            ⌘ K
          </kbd>
          .
        </p>

        <h2 className="mb-1 text-caption uppercase text-text-muted">Go somewhere useful</h2>
        <ul className="border-t border-border">
          {destinations.map((destination) => (
            <li key={destination.href} className="border-b border-border">
              <Link
                href={destination.href}
                className="group flex items-center gap-4 py-4"
              >
                <destination.icon
                  aria-hidden
                  size={18}
                  strokeWidth={1.75}
                  className="shrink-0 text-text-muted group-hover:text-text-secondary"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-small font-medium text-text-primary group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
                    {destination.label}
                  </span>
                  <span className="mt-0.5 block text-small text-text-muted">
                    {destination.description}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  size={15}
                  strokeWidth={2}
                  className="shrink-0 text-text-muted group-hover:text-text-secondary"
                />
              </Link>
            </li>
          ))}
        </ul>
      </PageLayout>
    </AppShell>
  );
}
