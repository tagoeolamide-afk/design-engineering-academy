/**
 * Progress fixtures.
 *
 * Records are built by running the real transitions rather than by writing
 * object literals, so the tests exercise the same code path the store uses and
 * cannot drift into asserting against a shape the application never produces.
 */

import {
  createLessonRecord,
  createProjectRecord,
  withEndReached,
  withExerciseCompleted,
  withProjectStatus,
  withReflectionAnswer,
  withVisit,
} from '@/lib/progress/records';
import type {
  LessonProgressRecord,
  ProgressState,
  ProjectProgressRecord,
  ProjectStatus,
} from '@/types/progress';

const AT = '2026-01-01T00:00:00.000Z';

export interface LessonProgressOptions {
  readonly visited?: boolean;
  readonly reachedEnd?: boolean;
  readonly exerciseCompleted?: boolean;
  readonly reflection?: string;
}

export function lessonRecord(
  lessonId: string,
  options: LessonProgressOptions = {},
): LessonProgressRecord {
  let record = createLessonRecord(lessonId);

  if (options.visited === true) record = withVisit(record, AT);
  if (options.reachedEnd === true) record = withEndReached(record, AT);
  if (options.exerciseCompleted === true) {
    record = withExerciseCompleted(record, true, AT);
  }
  if (options.reflection !== undefined) {
    record = withReflectionAnswer(record, options.reflection, AT);
  }

  return record;
}

/** A lesson meeting all three completion requirements. */
export function completedLesson(lessonId: string): LessonProgressRecord {
  return lessonRecord(lessonId, {
    reachedEnd: true,
    exerciseCompleted: true,
    reflection: 'A real reflection.',
  });
}

export function projectRecord(
  projectId: string,
  moduleId: string,
  status: ProjectStatus,
): ProjectProgressRecord {
  return withProjectStatus(createProjectRecord(projectId, moduleId), status, AT);
}

export function makeState(
  lessons: readonly LessonProgressRecord[] = [],
  projects: readonly ProjectProgressRecord[] = [],
): ProgressState {
  return {
    lessons: Object.fromEntries(lessons.map((record) => [record.lessonId, record])),
    projects: Object.fromEntries(projects.map((record) => [record.projectId, record])),
    lastVisitedLessonId: null,
  };
}

/** Every lesson in the given modules completed. */
export function completeModules(
  moduleNumbers: readonly number[],
  lessonsPerModule: number,
): readonly LessonProgressRecord[] {
  return moduleNumbers.flatMap((moduleNumber) =>
    Array.from({ length: lessonsPerModule }, (_, i) =>
      completedLesson(`lesson-${moduleNumber}-${i + 1}`),
    ),
  );
}
