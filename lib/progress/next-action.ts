/**
 * The recommended next action.
 *
 * One function answering "what should I do now?", so the dashboard, a module
 * page, and the command palette can never disagree about it.
 *
 * The rule is: finish what you started before starting anything new, and treat
 * a module's project as the last thing standing between the learner and a
 * completed module.
 */

import type { CurriculumIndex } from '@/lib/curriculum/curriculum-index';
import { CURRICULUM } from '@/lib/curriculum/queries';
import type { CurriculumModule, Lesson, ModuleProject } from '@/types/curriculum';
import type { LessonCompletionRequirements, ProgressState } from '@/types/progress';
import {
  deriveLessonProgress,
  getLessonRecord,
  getProjectStatus,
  isLessonComplete,
} from './derive';

export type RecommendedAction =
  /** Nothing is authored yet, so there is nothing to recommend. */
  | { readonly kind: 'no-content' }
  /** A lesson was started but is not finished; requirements says what is left. */
  | {
      readonly kind: 'resume-lesson';
      readonly lesson: Lesson;
      readonly courseModule: CurriculumModule;
      readonly requirements: LessonCompletionRequirements;
    }
  /** Every started lesson is done; this is the next unopened one. */
  | {
      readonly kind: 'start-lesson';
      readonly lesson: Lesson;
      readonly courseModule: CurriculumModule;
    }
  /** All lessons in a module are complete but its project is not. */
  | {
      readonly kind: 'finish-project';
      readonly project: ModuleProject;
      readonly courseModule: CurriculumModule;
    }
  /** Everything authored is complete. */
  | { readonly kind: 'course-complete' };

export function getRecommendedAction(
  state: ProgressState,
  index: CurriculumIndex = CURRICULUM,
): RecommendedAction {
  const lessons = index.getAllLessons();
  if (lessons.length === 0) return { kind: 'no-content' };

  /* 1. Finish what is already open, in course order. */
  for (const { lesson, courseModule } of lessons) {
    const progress = deriveLessonProgress(state, lesson.id);
    if (progress.status === 'in-progress') {
      return {
        kind: 'resume-lesson',
        lesson,
        courseModule,
        requirements: progress.requirements,
      };
    }
  }

  /* 2. Otherwise begin the first lesson not yet opened. */
  for (const { lesson, courseModule } of lessons) {
    if (deriveLessonProgress(state, lesson.id).status === 'not-started') {
      return { kind: 'start-lesson', lesson, courseModule };
    }
  }

  /* 3. Every authored lesson is complete. A module is still unfinished if its
   *    project has not been marked completed. */
  for (const courseModule of index.getModules()) {
    const allLessonsComplete =
      courseModule.lessons.length > 0 &&
      courseModule.lessons.every((lesson) =>
        isLessonComplete(getLessonRecord(state, lesson.id)),
      );

    if (
      allLessonsComplete &&
      getProjectStatus(state, courseModule.project.id) !== 'completed'
    ) {
      return { kind: 'finish-project', project: courseModule.project, courseModule };
    }
  }

  return { kind: 'course-complete' };
}
