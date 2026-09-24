/**
 * The learning-progress guarantees: what the end-of-lesson and end-of-module
 * summaries are allowed to claim, and when a module is permitted to call
 * itself finished.
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getLessonNextStep } from '@/lib/curriculum/next-step';
import {
  getAllLessons,
  getLessonById,
  getModules,
  getPrerequisiteLessons,
  getRelatedCompetencies,
} from '@/lib/curriculum/queries';
import { resolveModuleCompletionState } from '@/lib/progress/module-completion';
import {
  deriveCourseProgress,
  derivePhaseProgress,
  deriveModuleProgress,
} from '@/lib/progress/derive';
import { LESSONS_PER_MODULE } from '@/types/curriculum';
import { completedLesson, makeState, projectRecord } from './fixtures/progress';
import type { ProjectStatus } from '@/types/progress';

/* -------------------------------------------------------------------------- */
/* What the end-of-lesson panel is allowed to say                              */
/* -------------------------------------------------------------------------- */

describe('end-of-lesson summary data', () => {
  it('every lesson states between three and five concepts it teaches', () => {
    for (const { lesson } of getAllLessons()) {
      expect(
        lesson.objectives.length,
        `${lesson.id} has ${lesson.objectives.length} objectives`,
      ).toBeGreaterThanOrEqual(3);
      expect(lesson.objectives.length).toBeLessThanOrEqual(5);
    }
  });

  it('every lesson has a named exercise to report as practised', () => {
    for (const { lesson } of getAllLessons()) {
      expect(lesson.practicalExercise.title.trim()).not.toBe('');
      expect(lesson.practicalExercise.estimatedMinutes).toBeGreaterThan(0);
    }
  });

  it('every lesson records evidence against at least one competency', () => {
    for (const { lesson } of getAllLessons()) {
      expect(getRelatedCompetencies(lesson.id).length).toBeGreaterThan(0);
    }
  });

  it('connected concepts resolve to real lessons that come earlier', () => {
    const order = new Map(
      getAllLessons().map(({ lesson }, index) => [lesson.id, index] as const),
    );

    for (const { lesson } of getAllLessons()) {
      const position = order.get(lesson.id) ?? -1;

      for (const connected of getPrerequisiteLessons(lesson.id)) {
        expect(getLessonById(connected.lesson.id)).not.toBeNull();
        expect(
          order.get(connected.lesson.id) ?? -1,
          `${lesson.id} points at ${connected.lesson.id}`,
        ).toBeLessThan(position);
      }
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Where the learner is sent next                                              */
/* -------------------------------------------------------------------------- */

describe('next step after a lesson', () => {
  it('continues to the next lesson while one remains in the module', () => {
    for (const courseModule of getModules()) {
      const lessons = courseModule.lessons;

      for (const lesson of lessons.slice(0, -1)) {
        const step = getLessonNextStep(lesson.id);

        expect(step?.kind).toBe('lesson');
        expect(step?.href).toMatch(
          new RegExp(`^/curriculum/${courseModule.slug}/[a-z0-9-]+$`),
        );
      }
    }
  });

  it('sends the last lesson of every module to that module project, not onward', () => {
    for (const courseModule of getModules()) {
      const last = courseModule.lessons[courseModule.lessons.length - 1];
      expect(last).toBeDefined();

      const step = getLessonNextStep(last!.id);

      expect(step?.kind).toBe('project');
      expect(step?.title).toBe(courseModule.project.title);
      expect(step?.href).toBe(`/projects/${courseModule.slug}`);
    }
  });

  it('returns nothing for a lesson that does not exist', () => {
    expect(getLessonNextStep('no-such-lesson')).toBeNull();
  });
});

/* -------------------------------------------------------------------------- */
/* A module is not finished until its project is built                         */
/* -------------------------------------------------------------------------- */

describe('module completion gating', () => {
  const [first] = getModules();

  function stateWithLessonsDone(projectStatus: ProjectStatus) {
    const lessons = first!.lessons.map((lesson) => completedLesson(lesson.id));
    const projects =
      projectStatus === 'not-started'
        ? []
        : [projectRecord(first!.project.id, first!.id, projectStatus)];

    return makeState(lessons, projects);
  }

  it('reports every lesson done without calling the module complete', () => {
    const progress = deriveModuleProgress(stateWithLessonsDone('not-started'), first!);

    expect(progress.lessonsCompleted).toBe(LESSONS_PER_MODULE);
    expect(progress.requirements.allLessonsCompleted).toBe(true);
    expect(progress.requirements.projectCompleted).toBe(false);
    expect(progress.isComplete).toBe(false);
  });

  it('still refuses to call it complete while the project is under way', () => {
    const progress = deriveModuleProgress(stateWithLessonsDone('building'), first!);

    expect(progress.isComplete).toBe(false);
    expect(resolveModuleCompletionState(progress)).toBe('project-outstanding');
  });

  it('completes only once the project is built', () => {
    const progress = deriveModuleProgress(stateWithLessonsDone('completed'), first!);

    expect(progress.isComplete).toBe(true);
    expect(resolveModuleCompletionState(progress)).toBe('complete');
  });

  it('shows no summary at all until the lessons are done', () => {
    const partial = makeState([completedLesson(first!.lessons[0]!.id)]);

    expect(resolveModuleCompletionState(deriveModuleProgress(partial, first!))).toBe(
      'hidden',
    );
  });

  it('does not count a lessons-only module towards phase or course totals', () => {
    const state = stateWithLessonsDone('not-started');

    expect(derivePhaseProgress(state, first!.phase).modulesCompleted).toBe(0);
    expect(deriveCourseProgress(state).modulesCompleted).toBe(0);

    /* The lessons themselves are still counted — the gate is on the module, not
     * on the work the learner actually did. */
    expect(deriveCourseProgress(state).lessonsCompleted).toBe(LESSONS_PER_MODULE);
  });

  it('counts the module once the project is built', () => {
    const state = stateWithLessonsDone('completed');

    expect(derivePhaseProgress(state, first!.phase).modulesCompleted).toBe(1);
    expect(deriveCourseProgress(state).modulesCompleted).toBe(1);
  });
});

/* -------------------------------------------------------------------------- */
/* Practised is not the same claim as demonstrated                             */
/* -------------------------------------------------------------------------- */

describe('module competency claims', () => {
  it('teaches more competencies than its project can demonstrate', () => {
    /* If these sets were ever identical the panel could say "the project
     * demonstrates all of these". They are not, in any module, which is why it
     * marks the demonstrated subset instead. */
    for (const courseModule of getModules()) {
      const onProject = new Set<string>(courseModule.project.competencies);
      const taughtOnly = courseModule.competencies.filter((id) => !onProject.has(id));

      expect(
        taughtOnly.length,
        `module ${courseModule.moduleNumber} would demonstrate everything it teaches`,
      ).toBeGreaterThan(0);
    }
  });

  it('never marks a competency demonstrated that the module does not claim to teach', () => {
    for (const courseModule of getModules()) {
      const taught = new Set<string>(courseModule.competencies);

      for (const id of courseModule.project.competencies) {
        expect(
          taught.has(id),
          `module ${courseModule.moduleNumber} project is tagged ${id}, which the module does not list`,
        ).toBe(true);
      }
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Progress communicates learning, not game mechanics                          */
/* -------------------------------------------------------------------------- */

describe('progress vocabulary', () => {
  const PANELS = [
    'components/lesson/lesson-completion-panel.tsx',
    'components/curriculum/module-completion-panel.tsx',
    'components/lesson/lesson-status-panel.tsx',
    'components/curriculum/module-progress-panel.tsx',
  ];

  /* Deliberately narrow: each of these is a game mechanic and nothing else, so
   * a match is a real regression rather than an ordinary English word. */
  const GAMIFICATION = [
    /\bXP\b/,
    /\bstreaks?\b/i,
    /\bleaderboards?\b/i,
    /\bcoins?\b/i,
    /\btrophy|trophies\b/i,
    /\bbadges? earned\b/i,
    /\blevel(?:ed)? up\b/i,
  ];

  it.each(PANELS)('%s uses no points, ranks or streaks', (file) => {
    const source = readFileSync(file, 'utf8');

    for (const pattern of GAMIFICATION) {
      expect(source, `${file} matched ${String(pattern)}`).not.toMatch(pattern);
    }
  });
});
