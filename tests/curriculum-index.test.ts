import { describe, expect, it } from 'vitest';
import { makeFullCourseIndex, makeIndex, makeLesson, makeModule } from './fixtures/curriculum';
import {
  LESSONS_PER_MODULE,
  moduleNumbersForPhase,
  TOTAL_LESSONS,
  TOTAL_MODULES,
} from '@/types/curriculum';

describe('lesson ordering', () => {
  it('holds 75 lessons across 15 modules of 5', () => {
    const index = makeFullCourseIndex();

    expect(index.getModules()).toHaveLength(TOTAL_MODULES);
    expect(index.getLessonCount()).toBe(TOTAL_LESSONS);
    for (const courseModule of index.getModules()) {
      expect(courseModule.lessons).toHaveLength(LESSONS_PER_MODULE);
    }
  });

  it('orders by moduleNumber then lessonNumber regardless of authoring order', () => {
    /* Modules and lessons are deliberately registered out of order: authoring
     * order in a file must never leak into the learner's path. */
    const shuffledLessons = [
      makeLesson(1, 3),
      makeLesson(1, 1),
      makeLesson(1, 2),
    ];

    const index = makeIndex([
      makeModule(3, { lessonCount: 2 }),
      makeModule(1, { lessons: shuffledLessons }),
      makeModule(2, { lessonCount: 2 }),
    ]);

    expect(index.getModules().map((m) => m.moduleNumber)).toEqual([1, 2, 3]);
    expect(index.getAllLessons().map((l) => l.lesson.id)).toEqual([
      'lesson-1-1',
      'lesson-1-2',
      'lesson-1-3',
      'lesson-2-1',
      'lesson-2-2',
      'lesson-3-1',
      'lesson-3-2',
    ]);
  });

  it('pairs every lesson with its owning module', () => {
    const index = makeFullCourseIndex();

    for (const { lesson, courseModule } of index.getAllLessons()) {
      expect(lesson.moduleId).toBe(courseModule.id);
    }
  });

  it('numbers lessons continuously across the whole course', () => {
    const index = makeFullCourseIndex();
    const first = index.getLessonNavigation('lesson-1-1');
    const firstOfModuleTwo = index.getLessonNavigation('lesson-2-1');
    const last = index.getLessonNavigation('lesson-15-5');

    expect(first?.courseIndex).toBe(1);
    expect(firstOfModuleTwo?.courseIndex).toBe(6);
    expect(last?.courseIndex).toBe(TOTAL_LESSONS);
  });
});

describe('previous and next lesson', () => {
  const index = makeFullCourseIndex();

  it('moves within a module', () => {
    expect(index.getNextLesson('lesson-1-1')?.lesson.id).toBe('lesson-1-2');
    expect(index.getPreviousLesson('lesson-1-2')?.lesson.id).toBe('lesson-1-1');
  });

  it('crosses module boundaries rather than dead-ending', () => {
    const next = index.getNextLesson('lesson-1-5');
    expect(next?.lesson.id).toBe('lesson-2-1');
    expect(next?.courseModule.id).toBe('module-2');

    const previous = index.getPreviousLesson('lesson-2-1');
    expect(previous?.lesson.id).toBe('lesson-1-5');
    expect(previous?.courseModule.id).toBe('module-1');
  });

  it('returns null at both ends of the course', () => {
    expect(index.getPreviousLesson('lesson-1-1')).toBeNull();
    expect(index.getNextLesson('lesson-15-5')).toBeNull();
  });

  it('returns null for a lesson that does not exist', () => {
    expect(index.getNextLesson('nope')).toBeNull();
    expect(index.getPreviousLesson('nope')).toBeNull();
    expect(index.getLessonNavigation('nope')).toBeNull();
  });

  it('walks the entire course forwards and back without gaps', () => {
    const forwards: string[] = [];
    let cursor = index.getLessonById('lesson-1-1');
    while (cursor !== null) {
      forwards.push(cursor.lesson.id);
      cursor = index.getNextLesson(cursor.lesson.id);
    }

    const backwards: string[] = [];
    cursor = index.getLessonById('lesson-15-5');
    while (cursor !== null) {
      backwards.push(cursor.lesson.id);
      cursor = index.getPreviousLesson(cursor.lesson.id);
    }

    expect(forwards).toHaveLength(TOTAL_LESSONS);
    expect(backwards.reverse()).toEqual(forwards);
  });
});

describe('lookups', () => {
  const index = makeFullCourseIndex();

  it('finds modules by id and slug, and lessons by id and path', () => {
    expect(index.getModuleById('module-4')?.moduleNumber).toBe(4);
    expect(index.getModuleBySlug('module-4')?.id).toBe('module-4');
    expect(index.getLessonById('lesson-4-2')?.lesson.lessonNumber).toBe(2);
    expect(index.getLessonByPath('module-4', 'lesson-2')?.lesson.id).toBe('lesson-4-2');
  });

  it('returns null rather than throwing on unknown keys', () => {
    expect(index.getModuleById('nope')).toBeNull();
    expect(index.getModuleBySlug('nope')).toBeNull();
    expect(index.getLessonByPath('module-4', 'nope')).toBeNull();
    expect(index.getProjectById('nope')).toBeNull();
  });

  it('groups modules into phases of three', () => {
    expect(index.getModulesInPhase('foundations').map((m) => m.moduleNumber)).toEqual([
      1, 2, 3,
    ]);
    expect(index.getModulesInPhase('interface-craft').map((m) => m.moduleNumber)).toEqual([
      4, 5, 6,
    ]);
  });

  it('exposes one project per module, in module order', () => {
    expect(index.getAllProjects()).toHaveLength(TOTAL_MODULES);
    expect(index.getAllProjects()[0]?.id).toBe('project-1');
    expect(index.getProjectByModuleSlug('module-2')?.id).toBe('project-2');
  });

  it('handles an empty course without throwing', () => {
    const empty = makeIndex([]);

    expect(empty.getLessonCount()).toBe(0);
    expect(empty.getAllLessons()).toEqual([]);
    expect(empty.getNextLesson('anything')).toBeNull();
    expect(empty.getModulesInPhase('foundations')).toEqual([]);
  });
});

describe('prerequisite handling', () => {
  it('resolves declared prerequisites to lessons', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [
          makeLesson(1, 1),
          makeLesson(1, 2, { prerequisiteLessonIds: ['lesson-1-1'] }),
          makeLesson(1, 3, { prerequisiteLessonIds: ['lesson-1-1', 'lesson-1-2'] }),
        ],
      }),
    ]);

    expect(index.getPrerequisiteLessons('lesson-1-3').map((l) => l.lesson.id)).toEqual([
      'lesson-1-1',
      'lesson-1-2',
    ]);
  });

  it('resolves prerequisites that reach back across modules', () => {
    const index = makeIndex([
      makeModule(1, { lessonCount: 2 }),
      makeModule(2, {
        lessons: [makeLesson(2, 1, { prerequisiteLessonIds: ['lesson-1-2'] })],
      }),
    ]);

    const prerequisites = index.getPrerequisiteLessons('lesson-2-1');
    expect(prerequisites).toHaveLength(1);
    expect(prerequisites[0]?.courseModule.id).toBe('module-1');
  });

  it('returns an empty list when none are declared', () => {
    expect(makeFullCourseIndex().getPrerequisiteLessons('lesson-3-2')).toEqual([]);
  });

  it('skips unresolvable prerequisites instead of throwing', () => {
    /* A broken link is reported by the integrity check; it must not take a
     * page down at render time. */
    const index = makeIndex([
      makeModule(1, {
        lessons: [makeLesson(1, 1, { prerequisiteLessonIds: ['does-not-exist'] })],
      }),
    ]);

    expect(index.getPrerequisiteLessons('lesson-1-1')).toEqual([]);
  });

  it('returns an empty list for an unknown lesson', () => {
    expect(makeFullCourseIndex().getPrerequisiteLessons('nope')).toEqual([]);
  });
});

describe('related competencies', () => {
  it('resolves lesson tags to competency records', () => {
    const index = makeIndex([
      makeModule(1, {
        lessons: [
          makeLesson(1, 1, { competencyTags: ['accessibility', 'css'] }),
        ],
      }),
    ]);

    expect(index.getRelatedCompetencies('lesson-1-1').map((c) => c.id)).toEqual([
      'accessibility',
      'css',
    ]);
    expect(index.getRelatedCompetencies('lesson-1-1')[0]?.label).toBe('Accessibility');
  });

  it('resolves module-level competencies', () => {
    const index = makeIndex([
      makeModule(1, { competencies: ['performance', 'design-systems'] }),
    ]);

    expect(index.getModuleCompetencies('module-1').map((c) => c.id)).toEqual([
      'performance',
      'design-systems',
    ]);
  });

  it('returns an empty list for unknown ids', () => {
    const index = makeFullCourseIndex();
    expect(index.getRelatedCompetencies('nope')).toEqual([]);
    expect(index.getModuleCompetencies('nope')).toEqual([]);
  });
});

describe('phase module ranges', () => {
  it('assigns each phase the consecutive modules it was designed to hold', () => {
    /* Deliberately uneven: the engineering phase needs four modules and the
     * final phase only two. An even split would rush React and accessibility
     * or pad the capstone. */
    expect(moduleNumbersForPhase(1)).toEqual([1, 2, 3]);
    expect(moduleNumbersForPhase(2)).toEqual([4, 5, 6]);
    expect(moduleNumbersForPhase(3)).toEqual([7, 8, 9, 10]);
    expect(moduleNumbersForPhase(4)).toEqual([11, 12, 13]);
    expect(moduleNumbersForPhase(5)).toEqual([14, 15]);
  });

  it('returns nothing for a phase number that does not exist', () => {
    expect(moduleNumbersForPhase(0)).toEqual([]);
    expect(moduleNumbersForPhase(6)).toEqual([]);
  });

  it('covers every module number exactly once across the five phases', () => {
    const covered = [1, 2, 3, 4, 5].flatMap((n) => moduleNumbersForPhase(n));

    expect(covered).toHaveLength(TOTAL_MODULES);
    expect(new Set(covered).size).toBe(TOTAL_MODULES);
    expect(Math.max(...covered)).toBe(TOTAL_MODULES);
  });

  it('agrees with where the index actually places modules', () => {
    /* The ranges drive the empty module slots on the curriculum page, so they
     * must match the real phase assignment rather than merely look plausible. */
    const index = makeFullCourseIndex();

    for (const phase of index.getPhases()) {
      const actual = index
        .getModulesInPhase(phase.id)
        .map((courseModule) => courseModule.moduleNumber);

      expect(actual).toEqual(moduleNumbersForPhase(phase.phaseNumber));
    }
  });
});
