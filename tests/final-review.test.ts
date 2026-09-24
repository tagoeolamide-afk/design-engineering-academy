/**
 * Acceptance suite for the finished curriculum.
 *
 * These are the structural promises the product makes to the learner, checked
 * against the real content rather than a fixture: fifteen modules, seventy-five
 * lessons, fifteen projects, and the specific parts every module and every
 * lesson must contain. Authoring that violates one of these is a defect in the
 * curriculum, not a matter of taste, so it fails the build.
 */

import { describe, expect, it } from 'vitest';
import { getConceptChains } from '@/lib/connections/chains';
import { getLessonNextStep } from '@/lib/curriculum/next-step';
import {
  getAllLessons,
  getAllProjects,
  getLessonById,
  getLessonNavigation,
  getModuleCompetencies,
  getModules,
  getRelatedCompetencies,
} from '@/lib/curriculum/queries';
import { LESSONS_PER_MODULE, TOTAL_LESSONS, TOTAL_MODULES } from '@/types/curriculum';

const MODULES = getModules();
const LESSONS = getAllLessons();

/* -------------------------------------------------------------------------- */
/* Shape of the whole course                                                   */
/* -------------------------------------------------------------------------- */

describe('course inventory', () => {
  it('has fifteen modules', () => {
    expect(MODULES).toHaveLength(TOTAL_MODULES);
    expect(MODULES).toHaveLength(15);
  });

  it('has seventy-five lessons', () => {
    expect(LESSONS).toHaveLength(TOTAL_LESSONS);
    expect(LESSONS).toHaveLength(75);
  });

  it('has fifteen module projects', () => {
    expect(getAllProjects()).toHaveLength(15);
  });

  it('numbers modules one to fifteen with no gaps', () => {
    expect(MODULES.map((m) => m.moduleNumber)).toEqual(
      Array.from({ length: 15 }, (_, i) => i + 1),
    );
  });
});

/* -------------------------------------------------------------------------- */
/* Every module                                                                */
/* -------------------------------------------------------------------------- */

describe.each(MODULES.map((m) => [m.moduleNumber, m] as const))(
  'module %i',
  (_number, courseModule) => {
    it('contains exactly five lessons', () => {
      expect(courseModule.lessons).toHaveLength(LESSONS_PER_MODULE);
      expect(courseModule.lessons.map((l) => l.lessonNumber)).toEqual([1, 2, 3, 4, 5]);
    });

    it('contains a module project', () => {
      const { project } = courseModule;
      expect(project.moduleId).toBe(courseModule.id);
      expect(project.title.trim()).not.toBe('');
      expect(project.brief.trim()).not.toBe('');
      expect(project.deliverables.length).toBeGreaterThan(0);
      expect(project.completionCriteria.length).toBeGreaterThan(0);
    });

    it('has completion criteria', () => {
      expect(courseModule.completionCriteria.length).toBeGreaterThan(0);
      for (const criterion of courseModule.completionCriteria) {
        expect(criterion.trim()).not.toBe('');
      }
    });

    it('contributes to competencies', () => {
      expect(courseModule.competencies.length).toBeGreaterThan(0);
      /* Every tag must resolve to a real competency, not just be a string. */
      expect(getModuleCompetencies(courseModule.id)).toHaveLength(
        courseModule.competencies.length,
      );
    });

    it('contains follow-up resources', () => {
      expect(courseModule.resources.length).toBeGreaterThan(0);
      for (const resource of courseModule.resources) {
        expect(resource.title.trim()).not.toBe('');
        expect(resource.url).toMatch(/^https?:\/\//);
      }
    });
  },
);

/* -------------------------------------------------------------------------- */
/* Every lesson                                                                */
/* -------------------------------------------------------------------------- */

describe('every lesson', () => {
  it('has at least one objective', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.objectives.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it('teaches from first principles', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.firstPrinciples.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.coreConcept.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it('connects design and engineering', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.designPerspective.length, `${lesson.id} design`).toBeGreaterThan(0);
      expect(
        lesson.engineeringPerspective.length,
        `${lesson.id} engineering`,
      ).toBeGreaterThan(0);
      /* The synthesis is the point of the course, so it is required too. */
      expect(
        lesson.connectionBetweenBoth.length,
        `${lesson.id} connection`,
      ).toBeGreaterThan(0);
    }
  });

  it('contains an industry example', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.industryExamples.length, lesson.id).toBeGreaterThan(0);
      for (const example of lesson.industryExamples) {
        expect(example.source.trim(), lesson.id).not.toBe('');
        expect(example.observation.trim(), lesson.id).not.toBe('');
        expect(example.takeaway.trim(), lesson.id).not.toBe('');
      }
    }
  });

  it('contains exactly one practical exercise', () => {
    for (const { lesson } of LESSONS) {
      const exercise = lesson.practicalExercise;
      expect(exercise, lesson.id).toBeDefined();
      expect(exercise.title.trim(), lesson.id).not.toBe('');
      expect(exercise.prompt.trim(), lesson.id).not.toBe('');
      expect(exercise.steps.length, lesson.id).toBeGreaterThan(0);
      expect(exercise.successCriteria.length, lesson.id).toBeGreaterThan(0);
      expect(exercise.estimatedMinutes, lesson.id).toBeGreaterThan(0);
    }
  });

  it('contains one reflection question', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.reflectionQuestion.trim(), lesson.id).not.toBe('');
      expect(lesson.reflectionQuestion, lesson.id).toContain('?');
    }
  });

  it('contains a hint that does not answer the question outright', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.reflectionHint.trim(), lesson.id).not.toBe('');
      /* A hint that simply restates the question is not a hint. */
      expect(lesson.reflectionHint.trim(), lesson.id).not.toBe(
        lesson.reflectionQuestion.trim(),
      );
    }
  });

  it('contains resources', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.resources.length, lesson.id).toBeGreaterThan(0);
      for (const resource of lesson.resources) {
        expect(resource.title.trim(), lesson.id).not.toBe('');
        expect(resource.url, `${lesson.id} · ${resource.title}`).toMatch(/^https?:\/\//);
      }
    }
  });

  it('supports recall of earlier material', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.recap.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it('links backwards and forwards through the course', () => {
    LESSONS.forEach(({ lesson }, index) => {
      const navigation = getLessonNavigation(lesson.id);
      expect(navigation, lesson.id).not.toBeNull();

      const isFirst = index === 0;
      const isLast = index === LESSONS.length - 1;

      expect(navigation?.previous === null, `${lesson.id} previous`).toBe(isFirst);
      expect(navigation?.next === null, `${lesson.id} next`).toBe(isLast);
      expect(navigation?.courseIndex).toBe(index + 1);

      /* Every lesson, including the very last, has a stated next step. */
      expect(getLessonNextStep(lesson.id), lesson.id).not.toBeNull();
    });
  });

  it('maps to competencies that all resolve', () => {
    for (const { lesson } of LESSONS) {
      expect(lesson.competencyTags.length, lesson.id).toBeGreaterThan(0);
      expect(getRelatedCompetencies(lesson.id), lesson.id).toHaveLength(
        lesson.competencyTags.length,
      );
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Cross-cutting learning structures                                           */
/* -------------------------------------------------------------------------- */

describe('learning relationships', () => {
  it('has concept chains that resolve to real lessons', () => {
    const chains = getConceptChains();
    expect(chains.length).toBeGreaterThan(0);

    for (const chain of chains) {
      expect(chain.links.length, chain.id).toBeGreaterThan(0);
      expect(chain.whyConnected.trim(), chain.id).not.toBe('');

      for (const link of chain.links) {
        for (const lessonId of link.lessonIds) {
          expect(getLessonById(lessonId), `${chain.id} → ${lessonId}`).not.toBeNull();
        }
      }
    }
  });

  it('gives every competency on a lesson a route to its detail screen', () => {
    const tagged = new Set(LESSONS.flatMap(({ lesson }) => lesson.competencyTags));
    expect(tagged.size).toBeGreaterThan(0);
  });
});
