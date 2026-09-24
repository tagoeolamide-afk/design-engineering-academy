import { describe, expect, it } from 'vitest';
import {
  deriveCompetencyEvidence,
  evidenceTotal,
  hasEvidence,
  deriveCourseProgress,
  deriveLessonProgress,
  deriveModuleProgress,
  derivePhaseProgress,
  isLessonComplete,
} from '@/lib/progress/derive';
import { LESSONS_PER_MODULE, TOTAL_LESSONS } from '@/types/curriculum';
import { EVIDENCE_LEVELS } from '@/types/competency';
import {
  makeFullCourseIndex,
  makeIndex,
  makeLesson,
  makeModule,
  makeProject,
} from './fixtures/curriculum';
import {
  createLessonRecord,
  normalizeLessonRecord,
  withEndReached,
  withExerciseCompleted,
  withExerciseNotes,
} from '@/lib/progress/records';
import type { LessonProgressRecord, ProgressState } from '@/types/progress';
import {
  completeModules,
  completedLesson,
  lessonRecord,
  makeState,
  projectRecord,
} from './fixtures/progress';

describe('lesson completion rules', () => {
  it('is not started until the lesson is opened', () => {
    const progress = deriveLessonProgress(makeState(), 'lesson-1-1');

    expect(progress.status).toBe('not-started');
    expect(progress.requirementsMet).toBe(0);
    expect(progress.completedAt).toBeNull();
  });

  it('is in progress once opened, even with nothing else done', () => {
    const state = makeState([lessonRecord('lesson-1-1', { visited: true })]);

    expect(deriveLessonProgress(state, 'lesson-1-1').status).toBe('in-progress');
  });

  it('requires all three of end, exercise, and reflection', () => {
    const combinations = [
      { reachedEnd: true, exerciseCompleted: true },
      { reachedEnd: true, reflection: 'Yes.' },
      { exerciseCompleted: true, reflection: 'Yes.' },
    ];

    for (const options of combinations) {
      const state = makeState([lessonRecord('lesson-1-1', options)]);
      const progress = deriveLessonProgress(state, 'lesson-1-1');

      expect(progress.status).toBe('in-progress');
      expect(progress.requirementsMet).toBe(2);
      expect(progress.requirementsTotal).toBe(3);
    }
  });

  it('completes only when all three are met', () => {
    const state = makeState([completedLesson('lesson-1-1')]);
    const progress = deriveLessonProgress(state, 'lesson-1-1');

    expect(progress.status).toBe('completed');
    expect(progress.requirementsMet).toBe(3);
    expect(progress.requirements).toEqual({
      reachedEnd: true,
      exerciseCompleted: true,
      reflectionAnswered: true,
    });
    expect(progress.completedAt).not.toBeNull();
  });

  it('does not count whitespace as a reflection', () => {
    const state = makeState([
      lessonRecord('lesson-1-1', {
        reachedEnd: true,
        exerciseCompleted: true,
        reflection: '   \n  ',
      }),
    ]);

    expect(deriveLessonProgress(state, 'lesson-1-1').status).toBe('in-progress');
  });

  it('un-completes when the reflection is cleared', () => {
    const cleared = lessonRecord('lesson-1-1', {
      reachedEnd: true,
      exerciseCompleted: true,
      reflection: 'Something real.',
    });
    expect(isLessonComplete(cleared)).toBe(true);

    const state = makeState([
      lessonRecord('lesson-1-1', {
        reachedEnd: true,
        exerciseCompleted: true,
        reflection: '',
      }),
    ]);

    expect(deriveLessonProgress(state, 'lesson-1-1').status).toBe('in-progress');
  });

  it('un-completes when the exercise is unticked', () => {
    const state = makeState([
      lessonRecord('lesson-1-1', { reachedEnd: true, reflection: 'Real.' }),
    ]);

    expect(deriveLessonProgress(state, 'lesson-1-1').status).toBe('in-progress');
  });
});

describe('module completion', () => {
  const index = makeFullCourseIndex();
  const moduleOne = index.getModuleById('module-1');

  it('requires every lesson and the project', () => {
    if (moduleOne === null) throw new Error('fixture missing');

    const lessonsOnly = makeState(completeModules([1], LESSONS_PER_MODULE));
    const lessonsAndProject = makeState(completeModules([1], LESSONS_PER_MODULE), [
      projectRecord('project-1', 'module-1', 'completed'),
    ]);

    const withoutProject = deriveModuleProgress(lessonsOnly, moduleOne);
    expect(withoutProject.lessonsCompleted).toBe(LESSONS_PER_MODULE);
    expect(withoutProject.requirements.allLessonsCompleted).toBe(true);
    expect(withoutProject.requirements.projectCompleted).toBe(false);
    expect(withoutProject.isComplete).toBe(false);

    const complete = deriveModuleProgress(lessonsAndProject, moduleOne);
    expect(complete.requirements.projectCompleted).toBe(true);
    expect(complete.isComplete).toBe(true);
  });

  it('is not complete when the project is only under review', () => {
    if (moduleOne === null) throw new Error('fixture missing');

    const state = makeState(completeModules([1], LESSONS_PER_MODULE), [
      projectRecord('project-1', 'module-1', 'reviewing'),
    ]);
    const progress = deriveModuleProgress(state, moduleOne);

    expect(progress.projectStatus).toBe('reviewing');
    expect(progress.isComplete).toBe(false);
  });

  it('is not complete with four of five lessons done', () => {
    if (moduleOne === null) throw new Error('fixture missing');

    const state = makeState(
      [1, 2, 3, 4].map((n) => completedLesson(`lesson-1-${n}`)),
      [projectRecord('project-1', 'module-1', 'completed')],
    );
    const progress = deriveModuleProgress(state, moduleOne);

    expect(progress.lessonsCompleted).toBe(4);
    expect(progress.isComplete).toBe(false);
  });

  it('counts lessons by status and reports a ratio', () => {
    if (moduleOne === null) throw new Error('fixture missing');

    const state = makeState([
      completedLesson('lesson-1-1'),
      completedLesson('lesson-1-2'),
      lessonRecord('lesson-1-3', { visited: true }),
    ]);
    const progress = deriveModuleProgress(state, moduleOne);

    expect(progress.lessonsCompleted).toBe(2);
    expect(progress.lessonsInProgress).toBe(1);
    expect(progress.lessonsNotStarted).toBe(2);
    expect(progress.lessonCompletionRatio).toBeCloseTo(0.4);
  });

  it('does not report an unauthored module as complete', () => {
    /* A module with no lessons has vacuously completed all of them. It must
     * still not read as finished. */
    const emptyIndex = makeIndex([makeModule(1, { lessonCount: 0 })]);
    const emptyModule = emptyIndex.getModuleById('module-1');
    if (emptyModule === null) throw new Error('fixture missing');

    const state = makeState([], [projectRecord('project-1', 'module-1', 'completed')]);
    const progress = deriveModuleProgress(state, emptyModule);

    expect(progress.requirements.allLessonsCompleted).toBe(false);
    expect(progress.isComplete).toBe(false);
    expect(progress.lessonCompletionRatio).toBe(0);
  });
});

describe('phase progress', () => {
  const index = makeFullCourseIndex();

  it('rolls up the three modules in a phase', () => {
    const state = makeState(completeModules([1, 2], LESSONS_PER_MODULE), [
      projectRecord('project-1', 'module-1', 'completed'),
    ]);
    const progress = derivePhaseProgress(state, 'foundations', index);

    expect(progress.modulesTotal).toBe(3);
    expect(progress.lessonsTotal).toBe(15);
    expect(progress.lessonsCompleted).toBe(10);
    expect(progress.completionRatio).toBeCloseTo(10 / 15);
    /* Module 2's lessons are done but its project is not, so only module 1
     * counts as complete. */
    expect(progress.modulesCompleted).toBe(1);
    expect(progress.isComplete).toBe(false);
  });

  it('is complete only when all three modules are', () => {
    const state = makeState(
      completeModules([1, 2, 3], LESSONS_PER_MODULE),
      [1, 2, 3].map((n) => projectRecord(`project-${n}`, `module-${n}`, 'completed')),
    );

    expect(derivePhaseProgress(state, 'foundations', index).isComplete).toBe(true);
    expect(derivePhaseProgress(state, 'interface-craft', index).isComplete).toBe(false);
  });

  it('reports zero for a phase with no modules', () => {
    const sparse = makeIndex([makeModule(1)]);
    const progress = derivePhaseProgress(makeState(), 'product-judgement', sparse);

    expect(progress.modulesTotal).toBe(0);
    expect(progress.completionRatio).toBe(0);
    expect(progress.isComplete).toBe(false);
  });
});

describe('overall progress', () => {
  const index = makeFullCourseIndex();

  it('is zero on a fresh state', () => {
    const progress = deriveCourseProgress(makeState(), index);

    expect(progress.lessonsTotal).toBe(TOTAL_LESSONS);
    expect(progress.lessonsCompleted).toBe(0);
    expect(progress.completionRatio).toBe(0);
    expect(progress.modulesCompleted).toBe(0);
    expect(progress.phasesCompleted).toBe(0);
  });

  it('counts lessons across the whole course', () => {
    const state = makeState(completeModules([1, 2, 3], LESSONS_PER_MODULE));
    const progress = deriveCourseProgress(state, index);

    expect(progress.lessonsCompleted).toBe(15);
    expect(progress.completionRatio).toBeCloseTo(15 / 75);
  });

  it('tracks projects separately from lessons', () => {
    const state = makeState(completeModules([1], LESSONS_PER_MODULE), [
      projectRecord('project-1', 'module-1', 'completed'),
      projectRecord('project-2', 'module-2', 'reviewing'),
    ]);
    const progress = deriveCourseProgress(state, index);

    expect(progress.projectsCompleted).toBe(1);
    expect(progress.modulesCompleted).toBe(1);
  });

  it('reaches 1 only when every lesson is complete', () => {
    const allLessons = completeModules(
      Array.from({ length: 15 }, (_, i) => i + 1),
      LESSONS_PER_MODULE,
    );
    const progress = deriveCourseProgress(makeState(allLessons), index);

    expect(progress.lessonsCompleted).toBe(TOTAL_LESSONS);
    expect(progress.completionRatio).toBe(1);
  });

  it('handles an empty course without dividing by zero', () => {
    const progress = deriveCourseProgress(makeState(), makeIndex([]));

    expect(progress.lessonsTotal).toBe(0);
    expect(progress.completionRatio).toBe(0);
  });
});

const AT = '2026-01-01T00:00:00.000Z';

describe('competency evidence', () => {
  const index = makeIndex([
    makeModule(1, {
      lessons: [
        makeLesson(1, 1, { competencyTags: ['accessibility'] }),
        makeLesson(1, 2, { competencyTags: ['accessibility', 'css'] }),
      ],
      project: { ...makeProject(1), competencies: ['accessibility'] },
    }),
  ]);

  it('records exposure only when a tagged lesson is fully completed', () => {
    const started = makeState([lessonRecord('lesson-1-1', { visited: true })]);
    expect(deriveCompetencyEvidence(started, index).accessibility).toEqual({
      competencyId: 'accessibility',
      lessonsTagged: 2,
      lessonsCompleted: 0,
      exercisesCompleted: 0,
      projectsTagged: 1,
      projectsCompleted: 0,
    });

    const done = makeState([completedLesson('lesson-1-1')]);
    const evidence = deriveCompetencyEvidence(done, index);
    expect(evidence.accessibility.lessonsCompleted).toBe(1);
    expect(evidence.css.lessonsCompleted).toBe(0);
  });

  it('records practice from the exercise alone, without the rest of the lesson', () => {
    const exerciseOnly = makeState([
      withExerciseCompleted(createLessonRecord('lesson-1-1'), true, AT),
    ]);
    const evidence = deriveCompetencyEvidence(exerciseOnly, index);

    expect(evidence.accessibility.exercisesCompleted).toBe(1);
    // The lesson is not finished, so there is no exposure to report.
    expect(evidence.accessibility.lessonsCompleted).toBe(0);
  });

  it('records demonstration only when a tagged project is completed', () => {
    const building = makeState([], [projectRecord('project-1', 'module-1', 'building')]);
    expect(deriveCompetencyEvidence(building, index).accessibility.projectsCompleted).toBe(0);

    const completed = makeState([], [projectRecord('project-1', 'module-1', 'completed')]);
    expect(deriveCompetencyEvidence(completed, index).accessibility.projectsCompleted).toBe(1);
    // The project is not tagged with css, so it contributes nothing there.
    expect(deriveCompetencyEvidence(completed, index).css.projectsTagged).toBe(0);
  });

  it('reports every competency, including ones nothing is tagged with', () => {
    const evidence = deriveCompetencyEvidence(makeState(), makeIndex([makeModule(1)]));

    expect(evidence.performance).toEqual({
      competencyId: 'performance',
      lessonsTagged: 0,
      lessonsCompleted: 0,
      exercisesCompleted: 0,
      projectsTagged: 0,
      projectsCompleted: 0,
    });
  });

  it('reports no evidence at any level for an untouched course', () => {
    const evidence = deriveCompetencyEvidence(makeState(), index);

    for (const level of EVIDENCE_LEVELS) {
      expect(hasEvidence(evidence.accessibility, level)).toBe(false);
    }
  });

  it('counts totals against tagged work, never against the whole curriculum', () => {
    const evidence = deriveCompetencyEvidence(makeState(), index);

    expect(evidenceTotal(evidence.accessibility, 'exposure')).toBe(2);
    expect(evidenceTotal(evidence.accessibility, 'practised')).toBe(2);
    expect(evidenceTotal(evidence.accessibility, 'demonstrated')).toBe(1);
    expect(evidenceTotal(evidence.css, 'demonstrated')).toBe(0);
  });
});


describe('exercise notes', () => {
  const index = makeFullCourseIndex();
  const moduleOne = index.getModuleById('module-1');

  it('are stored and read back without affecting completion', () => {
    const record = withExerciseNotes(createLessonRecord('lesson-1-1'), 'Some working.', AT);
    const state = makeState([record]);
    const progress = deriveLessonProgress(state, 'lesson-1-1');

    expect(progress.exerciseNotes).toBe('Some working.');
    expect(progress.requirements.exerciseCompleted).toBe(false);
    expect(progress.status).toBe('in-progress');
  });

  it('start the lesson, because writing them is doing the work', () => {
    const record = withExerciseNotes(createLessonRecord('lesson-1-1'), 'Thinking.', AT);

    expect(record.startedAt).toBe(AT);
  });

  it('are left alone when unchanged', () => {
    const first = withExerciseNotes(createLessonRecord('lesson-1-1'), 'Same.', AT);
    const second = withExerciseNotes(first, 'Same.', AT);

    expect(second).toBe(first);
  });

  it('do not count toward module progress', () => {
    if (moduleOne === null) throw new Error('fixture missing');

    const state = makeState([
      withExerciseNotes(createLessonRecord('lesson-1-1'), 'Notes only.', AT),
    ]);

    expect(deriveModuleProgress(state, moduleOne).lessonsCompleted).toBe(0);
  });
});

describe('stored records that predate a field', () => {
  it('are filled in on read rather than coming back undefined', () => {
    /* Simulates progress saved before exerciseNotes existed. Without
     * normalisation this reads as undefined despite being typed as a string,
     * which would put `undefined` straight into a textarea. */
    const legacy = createLessonRecord('lesson-1-1');
    const withoutNotes = { ...legacy } as Record<string, unknown>;
    delete withoutNotes.exerciseNotes;

    const normalized = normalizeLessonRecord(
      withoutNotes as unknown as LessonProgressRecord,
    );

    expect(normalized.exerciseNotes).toBe('');
    expect(normalized.lessonId).toBe('lesson-1-1');
  });

  it('keep every value that was actually stored', () => {
    const stored = withExerciseCompleted(
      withEndReached(createLessonRecord('lesson-1-1'), AT),
      true,
      AT,
    );

    expect(normalizeLessonRecord(stored)).toEqual(stored);
  });

  it('are normalised by the derivation path too', () => {
    const withoutNotes = { ...createLessonRecord('lesson-1-1') } as Record<string, unknown>;
    delete withoutNotes.exerciseNotes;

    const state = { lessons: { 'lesson-1-1': withoutNotes }, projects: {} } as unknown as ProgressState;

    expect(deriveLessonProgress(state, 'lesson-1-1').exerciseNotes).toBe('');
  });
});
