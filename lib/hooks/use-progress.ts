'use client';

/**
 * The read side of progress for components.
 *
 * Components never call the derivation functions directly against the store,
 * because those functions build fresh objects on every call and an unstable
 * snapshot would re-render without end. Each hook selects the stable record
 * maps out of the store and memoises the derivation against them.
 */

import { useMemo } from 'react';
import { useMounted } from './use-mounted';
import { useCloudSettled } from './use-cloud';
import {
  deriveCompetencyEvidence,
  deriveCourseProgress,
  deriveLessonProgress,
  deriveModuleProgress,
  derivePhaseProgress,
  getProjectRecord,
  getProjectStatus,
} from '@/lib/progress/derive';
import { deriveRecentActivity, type ActivityEvent } from '@/lib/progress/activity';
import { getRecommendedAction, type RecommendedAction } from '@/lib/progress/next-action';
import {
  getLessonCount,
  getLessonNavigation,
  getModules,
  getPhaseById,
} from '@/lib/curriculum/queries';
import { useProgressStore } from '@/stores/progress-store';
import type { CompetencyId } from '@/types/competency';
import type { CurriculumModule, Lesson, Phase, PhaseId } from '@/types/curriculum';
import type {
  CompetencyEvidence,
  CourseProgress,
  LessonProgress,
  ModuleProgress,
  PhaseProgress,
  ProgressState,
  ProjectProgressRecord,
  ProjectStatus,
} from '@/types/progress';

export function useProgressSnapshot(): ProgressState {
  const lessons = useProgressStore((state) => state.lessons);
  const projects = useProgressStore((state) => state.projects);
  const lastVisitedLessonId = useProgressStore((state) => state.lastVisitedLessonId);

  return useMemo(
    () => ({ lessons, projects, lastVisitedLessonId }),
    [lessons, projects, lastVisitedLessonId],
  );
}

/**
 * True once the persisted payload has been read back AND the first client
 * render is past. Anything whose output depends on stored progress waits on
 * this, otherwise the server markup and the first client render disagree.
 */
export function useProgressHydrated(): boolean {
  const mounted = useMounted();
  const hasHydrated = useProgressStore((state) => state.hasHydrated);
  const cloudSettled = useCloudSettled();
  return mounted && hasHydrated && cloudSettled;
}

export function useLessonProgress(lessonId: string): LessonProgress {
  const snapshot = useProgressSnapshot();
  return useMemo(() => deriveLessonProgress(snapshot, lessonId), [snapshot, lessonId]);
}

export function useModuleProgress(courseModule: CurriculumModule): ModuleProgress {
  const snapshot = useProgressSnapshot();
  return useMemo(() => deriveModuleProgress(snapshot, courseModule), [snapshot, courseModule]);
}

export function usePhaseProgress(phaseId: PhaseId): PhaseProgress {
  const snapshot = useProgressSnapshot();
  return useMemo(() => derivePhaseProgress(snapshot, phaseId), [snapshot, phaseId]);
}

export function useCourseProgress(): CourseProgress {
  const snapshot = useProgressSnapshot();
  return useMemo(() => deriveCourseProgress(snapshot), [snapshot]);
}

export function useCompetencyEvidence(): Readonly<
  Record<CompetencyId, CompetencyEvidence>
> {
  const snapshot = useProgressSnapshot();
  return useMemo(() => deriveCompetencyEvidence(snapshot), [snapshot]);
}

export function useProjectStatus(projectId: string): ProjectStatus {
  const snapshot = useProgressSnapshot();
  return useMemo(() => getProjectStatus(snapshot, projectId), [snapshot, projectId]);
}

export function useProjectRecord(projectId: string): ProjectProgressRecord | null {
  const snapshot = useProgressSnapshot();
  return useMemo(() => getProjectRecord(snapshot, projectId), [snapshot, projectId]);
}

/* -------------------------------------------------------------------------- */
/* Dashboard views                                                             */
/* -------------------------------------------------------------------------- */

export function useRecommendedAction(): RecommendedAction {
  const snapshot = useProgressSnapshot();
  return useMemo(() => getRecommendedAction(snapshot), [snapshot]);
}

export function useRecentActivity(limit = 8): readonly ActivityEvent[] {
  const snapshot = useProgressSnapshot();
  return useMemo(() => deriveRecentActivity(snapshot, limit), [snapshot, limit]);
}

/**
 * Where the learner currently is in the course, taken from the recommended
 * action so the header and the Continue panel can never point at different
 * lessons.
 */
export interface CurrentPosition {
  readonly lesson: Lesson | null;
  readonly courseModule: CurriculumModule | null;
  readonly phase: Phase | null;
  /** 1-based position across all authored lessons. */
  readonly courseIndex: number | null;
  readonly totalLessons: number;
}

export function useCurrentPosition(): CurrentPosition {
  const action = useRecommendedAction();

  return useMemo(() => {
    const totalLessons = getLessonCount();

    const lesson =
      action.kind === 'resume-lesson' || action.kind === 'start-lesson'
        ? action.lesson
        : null;

    const courseModule =
      action.kind === 'resume-lesson' ||
      action.kind === 'start-lesson' ||
      action.kind === 'finish-project'
        ? action.courseModule
        : (getModules()[0] ?? null);

    const navigation = lesson === null ? null : getLessonNavigation(lesson.id);

    return {
      lesson,
      courseModule,
      phase: courseModule === null ? null : getPhaseById(courseModule.phase),
      courseIndex: navigation?.courseIndex ?? null,
      totalLessons,
    };
  }, [action]);
}
