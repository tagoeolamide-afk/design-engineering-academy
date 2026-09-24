/**
 * How each project status is presented.
 *
 * Kept in one place because the same mapping is needed by the dashboard, the
 * module page, and the projects area — and three copies of it is exactly how a
 * "Reviewing" project ends up described three different ways.
 */

import type { StatusKind } from '@/components/ui/status-indicator';
import { PROJECT_STATUSES, type ProjectStatus } from '@/types/progress';

export interface ProjectStatusPresentation {
  readonly label: string;
  /** Maps onto the shared status glyphs, so colour is never the only signal. */
  readonly indicator: StatusKind;
  /** What choosing this status means, shown when picking one. */
  readonly description: string;
}

export const PROJECT_STATUS_PRESENTATION: Readonly<
  Record<ProjectStatus, ProjectStatusPresentation>
> = {
  'not-started': {
    label: 'Not started',
    indicator: 'not-started',
    description: 'Not begun yet.',
  },
  planning: {
    label: 'Planning',
    indicator: 'in-progress',
    description: 'Deciding scope, states, and approach before building.',
  },
  building: {
    label: 'Building',
    indicator: 'in-progress',
    description: 'Writing the thing.',
  },
  reviewing: {
    label: 'Reviewing',
    indicator: 'attention',
    description: 'Built, and being checked against the completion criteria.',
  },
  completed: {
    label: 'Completed',
    indicator: 'complete',
    description: 'Finished. This is what completes the module.',
  },
};

export const PROJECT_STATUS_ORDER: readonly ProjectStatus[] = PROJECT_STATUSES;

export function presentProjectStatus(status: ProjectStatus): ProjectStatusPresentation {
  return PROJECT_STATUS_PRESENTATION[status];
}

/** 0..1 through the five stages, for a progress readout. */
export function projectStatusProgress(status: ProjectStatus): number {
  const index = PROJECT_STATUSES.indexOf(status);
  return index <= 0 ? 0 : index / (PROJECT_STATUSES.length - 1);
}
