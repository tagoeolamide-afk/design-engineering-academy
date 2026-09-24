'use client';

import { ArrowRight, Link2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useProgressHydrated, useProjectRecord } from '@/lib/hooks/use-progress';
import { presentProjectStatus, projectStatusProgress } from '@/lib/progress/project-status';
import { PROJECT_LINK_KINDS, type ProjectStatus } from '@/types/progress';
import { LESSONS_PER_MODULE, type CurriculumModule } from '@/types/curriculum';

/**
 * One project in the overview.
 *
 * Nothing is locked — a project can be opened and read at any point, exactly
 * like the lessons that precede it.
 */
export function ProjectCard({ courseModule }: { courseModule: CurriculumModule }) {
  const { project } = courseModule;
  const record = useProjectRecord(project.id);
  const hydrated = useProgressHydrated();

  const status: ProjectStatus = hydrated ? (record?.status ?? 'not-started') : 'not-started';
  const presentation = presentProjectStatus(status);
  const linkCount = PROJECT_LINK_KINDS.filter(
    (kind) => (record?.links[kind] ?? '').trim() !== '',
  ).length;

  return (
    <Card asChild padding="compact" interactive>
      <Link
        href={`/projects/${courseModule.slug}`}
        className="block focus-visible:outline-offset-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-baseline gap-2.5">
            <span className="text-caption uppercase text-text-muted" data-numeric>
              {courseModule.moduleNumber.toString().padStart(2, '0')}
            </span>
            <h3 className="min-w-0 text-small font-medium text-text-primary">
              {project.title}
            </h3>
          </div>
          <StatusIndicator
            status={presentation.indicator}
            label={presentation.label}
            className="shrink-0 text-caption"
          />
        </div>

        <p className="mt-2 text-small text-text-muted">{project.brief}</p>

        <dl className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5 text-caption uppercase text-text-muted">
          <div className="flex gap-1.5">
            <dt>Module</dt>
            <dd className="text-text-secondary">{courseModule.title}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Effort</dt>
            <dd className="text-text-secondary" data-numeric>
              {project.estimatedHours} hours
            </dd>
          </div>
          {linkCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Link2 aria-hidden size={13} strokeWidth={1.75} />
              <dt className="sr-only">Saved links</dt>
              <dd className="text-text-secondary" data-numeric>
                {linkCount} of {PROJECT_LINK_KINDS.length}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-3.5 flex items-center gap-3">
          <ProgressBar
            size="thin"
            className="flex-1"
            value={projectStatusProgress(status)}
            label={`${project.title} status`}
            complete={status === 'completed'}
          />
          <ArrowRight
            aria-hidden
            size={13}
            strokeWidth={2}
            className="shrink-0 text-text-muted"
          />
        </div>
      </Link>
    </Card>
  );
}

/** A module whose project has not been authored yet. */
export function ProjectSlot({ moduleNumber }: { moduleNumber: number }) {
  return (
    <div className="rounded-large border border-dashed border-border p-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-2.5">
          <span className="text-caption uppercase text-text-muted" data-numeric>
            {moduleNumber.toString().padStart(2, '0')}
          </span>
          <p className="text-small text-text-muted">Project not yet authored</p>
        </div>
        <span className="shrink-0 text-caption uppercase text-text-muted">
          After {LESSONS_PER_MODULE} lessons
        </span>
      </div>
    </div>
  );
}
