'use client';

import { Award } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { getModules } from '@/lib/curriculum/queries';
import { useProgressHydrated, useProgressSnapshot } from '@/lib/hooks/use-progress';
import type { ProjectLinkKind } from '@/types/progress';
import { getProjectRecord } from '@/lib/progress/derive';
import { presentProjectLink } from '@/lib/progress/project-links';

/**
 * Portfolio evidence across every completed project.
 *
 * Only completed work appears. A project in progress is not evidence of
 * anything yet, and listing it here would turn the section into a wish list —
 * which is exactly what makes a portfolio unconvincing.
 */
export function PortfolioSummary() {
  const snapshot = useProgressSnapshot();
  const hydrated = useProgressHydrated();

  if (!hydrated) {
    return (
      <p className="text-small text-text-muted" role="status">
        Loading portfolio…
      </p>
    );
  }

  const completed = getModules().filter(
    (courseModule) =>
      getProjectRecord(snapshot, courseModule.project.id)?.status === 'completed',
  );

  if (completed.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="No completed projects yet"
        description="When a project's status is set to Completed, it appears here with the specific capabilities the work demonstrates — ready to describe in a portfolio."
      />
    );
  }

  return (
    <ul className="space-y-6">
      {completed.map((courseModule) => {
        const { project } = courseModule;
        const record = getProjectRecord(snapshot, project.id);
        const links = Object.entries(record?.links ?? {}).filter(
          ([, url]) => url.trim() !== '',
        );

        return (
          <li key={project.id} className="border-l-2 border-success pl-4">
            <Link
              href={`/projects/${courseModule.slug}`}
              className="text-small font-medium text-text-primary underline decoration-border underline-offset-4 hover:decoration-text-muted"
            >
              {project.title}
            </Link>
            <p className="mt-1 text-caption uppercase text-text-muted">
              {courseModule.title}
            </p>

            <p className="mt-3 text-caption uppercase text-text-muted">Evidence</p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {project.portfolioEvidence.map((item) => (
                <li
                  key={item}
                  className="rounded-small bg-success-subtle px-2 py-1 text-caption uppercase text-success"
                >
                  {item}
                </li>
              ))}
            </ul>

            {links.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-small">
                {links.map(([kind, url]) => (
                  <a
                    key={kind}
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary"
                  >
                    {presentProjectLink(kind as ProjectLinkKind).label}
                  </a>
                ))}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
