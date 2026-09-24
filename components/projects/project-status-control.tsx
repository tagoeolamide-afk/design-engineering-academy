'use client';

import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useProjectRecord, useProgressHydrated } from '@/lib/hooks/use-progress';
import {
  PROJECT_STATUS_ORDER,
  presentProjectStatus,
  projectStatusProgress,
} from '@/lib/progress/project-status';
import { cn } from '@/lib/utils/cn';
import { useProgressStore } from '@/stores/progress-store';
import type { ProjectStatus } from '@/types/progress';

interface ProjectStatusControlProps {
  readonly projectId: string;
  readonly moduleId: string;
}

/**
 * The five stages, as a radio group.
 *
 * Presented as the whole scale rather than a "next step" button, because the
 * learner is the only one who knows where the work actually is — and because
 * moving backwards is a legitimate thing to do when a review finds something
 * wrong.
 */
export function ProjectStatusControl({ projectId, moduleId }: ProjectStatusControlProps) {
  const record = useProjectRecord(projectId);
  const hydrated = useProgressHydrated();
  const setProjectStatus = useProgressStore((state) => state.setProjectStatus);

  const status: ProjectStatus = hydrated ? (record?.status ?? 'not-started') : 'not-started';

  if (!hydrated) {
    return (
      <p className="text-small text-text-muted" role="status">
        Loading status…
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-caption uppercase text-text-muted">Status</h2>
        <StatusIndicator
          status={presentProjectStatus(status).indicator}
          label={presentProjectStatus(status).label}
          className="text-small"
        />
      </div>

      <ProgressBar
        className="mt-2.5"
        size="thin"
        value={projectStatusProgress(status)}
        label="Project status"
        complete={status === 'completed'}
      />

      <fieldset className="mt-4">
        <legend className="sr-only">Project status</legend>

        <div className="space-y-1">
          {PROJECT_STATUS_ORDER.map((option) => {
            const presentation = presentProjectStatus(option);
            const isCurrent = option === status;

            return (
              <label
                key={option}
                className={cn(
                  'flex min-h-11 cursor-pointer items-start gap-2.5 rounded-medium border px-3 py-2 transition-colors duration-100',
                  isCurrent
                    ? 'border-accent bg-surface'
                    : 'border-transparent hover:bg-surface-hover active:bg-surface-active',
                )}
              >
                <input
                  type="radio"
                  name={`project-status-${projectId}`}
                  value={option}
                  checked={isCurrent}
                  onChange={() => setProjectStatus(projectId, moduleId, option)}
                  className="mt-1 size-3.5 shrink-0 accent-[var(--color-accent)]"
                />
                <span className="min-w-0">
                  <span className="block text-small text-text-primary">
                    {presentation.label}
                  </span>
                  <span className="mt-0.5 block text-small text-text-muted">
                    {presentation.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
