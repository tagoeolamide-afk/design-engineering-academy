/**
 * Recent activity.
 *
 * Derived from the timestamps already stored on progress records rather than
 * kept as a separate event log. A second log would be a second source of truth:
 * it could disagree with the progress it describes, it would survive a progress
 * reset, and it would need its own migration. Since every completion already
 * records when it happened, the timeline is a projection of state that exists.
 *
 * The cost is that only the most recent occurrence of each event is known — an
 * exercise ticked, unticked, and ticked again appears once. For a personal
 * learning log that is the right trade.
 */

import type { CurriculumIndex } from '@/lib/curriculum/curriculum-index';
import { CURRICULUM } from '@/lib/curriculum/queries';
import type { ProgressState, Timestamp } from '@/types/progress';
import { deriveLessonProgress } from './derive';

export type ActivityKind =
  | 'lesson-started'
  | 'exercise-completed'
  | 'reflection-saved'
  | 'lesson-completed'
  | 'project-started'
  | 'project-advanced'
  | 'project-completed';

/**
 * Where an event points, as parts rather than a URL. Route construction stays
 * in the component, where typed routes can check the literal — and this module
 * stays free of framework types.
 */
export type ActivityTarget =
  | { readonly kind: 'lesson'; readonly moduleSlug: string; readonly lessonSlug: string }
  | { readonly kind: 'project'; readonly moduleSlug: string };

export interface ActivityEvent {
  /** Stable across renders so React keys do not churn. */
  readonly id: string;
  readonly kind: ActivityKind;
  readonly at: Timestamp;
  /** What the event happened to, e.g. the lesson or project title. */
  readonly subject: string;
  /** Where it sits, e.g. the owning module. */
  readonly context: string;
  readonly target: ActivityTarget;
}

const KIND_LABELS: Record<ActivityKind, string> = {
  'lesson-started': 'Lesson started',
  'exercise-completed': 'Exercise completed',
  'reflection-saved': 'Reflection saved',
  'lesson-completed': 'Lesson completed',
  'project-started': 'Project started',
  'project-advanced': 'Project moved on',
  'project-completed': 'Project completed',
};

export function activityLabel(kind: ActivityKind): string {
  return KIND_LABELS[kind];
}

export function deriveActivity(
  state: ProgressState,
  index: CurriculumIndex = CURRICULUM,
): readonly ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const { lesson, courseModule } of index.getAllLessons()) {
    const record = state.lessons[lesson.id];
    if (record === undefined) continue;

    const base = {
      subject: lesson.title,
      context: courseModule.title,
      target: {
        kind: 'lesson',
        moduleSlug: courseModule.slug,
        lessonSlug: lesson.slug,
      },
    } as const;

    const progress = deriveLessonProgress(state, lesson.id);

    if (record.startedAt !== null) {
      events.push({
        id: `${lesson.id}:started`,
        kind: 'lesson-started',
        at: record.startedAt,
        ...base,
      });
    }
    if (record.exerciseCompletedAt !== null) {
      events.push({
        id: `${lesson.id}:exercise`,
        kind: 'exercise-completed',
        at: record.exerciseCompletedAt,
        ...base,
      });
    }
    if (record.reflectionAnsweredAt !== null) {
      events.push({
        id: `${lesson.id}:reflection`,
        kind: 'reflection-saved',
        at: record.reflectionAnsweredAt,
        ...base,
      });
    }
    if (progress.completedAt !== null) {
      events.push({
        id: `${lesson.id}:completed`,
        kind: 'lesson-completed',
        at: progress.completedAt,
        ...base,
      });
    }
  }

  for (const courseModule of index.getModules()) {
    const record = state.projects[courseModule.project.id];
    if (record === undefined) continue;

    const base = {
      subject: courseModule.project.title,
      context: courseModule.title,
      target: { kind: 'project', moduleSlug: courseModule.slug },
    } as const;

    if (record.startedAt !== null) {
      events.push({
        id: `${record.projectId}:started`,
        kind: 'project-started',
        at: record.startedAt,
        ...base,
      });
    }
    /* Only when the last status move was neither the start nor the finish —
     * otherwise every completed project would report the same moment twice. */
    if (
      record.statusUpdatedAt !== null &&
      record.statusUpdatedAt !== record.startedAt &&
      record.statusUpdatedAt !== record.completedAt
    ) {
      events.push({
        id: `${record.projectId}:advanced`,
        kind: 'project-advanced',
        at: record.statusUpdatedAt,
        ...base,
      });
    }
    if (record.completedAt !== null) {
      events.push({
        id: `${record.projectId}:completed`,
        kind: 'project-completed',
        at: record.completedAt,
        ...base,
      });
    }
  }

  /* Newest first. Ties are broken by id so the order is stable rather than
   * dependent on iteration order, which matters because several events can
   * share a timestamp to the millisecond. */
  return events.sort((a, b) =>
    a.at === b.at ? a.id.localeCompare(b.id) : b.at.localeCompare(a.at),
  );
}

export function deriveRecentActivity(
  state: ProgressState,
  limit = 8,
  index: CurriculumIndex = CURRICULUM,
): readonly ActivityEvent[] {
  return deriveActivity(state, index).slice(0, limit);
}
