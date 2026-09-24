/**
 * Synthetic curriculum fixtures.
 *
 * The real content has one module and one lesson, which cannot exercise
 * ordering across module boundaries, phase rollups, or a full fifteen-module
 * course. These builders produce a curriculum of any shape so the engine is
 * tested against the syllabus it will eventually hold, not the one it holds
 * today.
 */

import { COMPETENCIES } from '@/content/competencies';
import { PHASE_LIST } from '@/content/phases';
import {
  createCurriculumIndex,
  type CurriculumIndex,
} from '@/lib/curriculum/curriculum-index';
import type { CompetencyId } from '@/types/competency';
import type {
  Course,
  CurriculumModule,
  Lesson,
  ModuleProject,
  PhaseId,
} from '@/types/curriculum';
import { LESSONS_PER_MODULE, MODULES_PER_PHASE, PHASE_IDS } from '@/types/curriculum';

export function makeLesson(
  moduleNumber: number,
  lessonNumber: number,
  overrides: Partial<Lesson> = {},
): Lesson {
  const moduleId = `module-${moduleNumber}`;

  return {
    id: `lesson-${moduleNumber}-${lessonNumber}`,
    slug: `lesson-${lessonNumber}`,
    moduleId,
    lessonNumber,
    title: `Module ${moduleNumber} Lesson ${lessonNumber}`,
    summary: 'Fixture lesson.',
    estimatedMinutes: 10,
    objectives: ['Objective'],
    prerequisiteConcepts: [],
    recap: [],
    coreConcept: [],
    firstPrinciples: [],
    designPerspective: [],
    engineeringPerspective: [],
    connectionBetweenBoth: [],
    industryExamples: [],
    practicalWalkthrough: [],
    commonMistakes: [],
    eliteConsiderations: [],
    practicalExercise: {
      id: `exercise-${moduleNumber}-${lessonNumber}`,
      title: 'Exercise',
      prompt: 'Do the thing.',
      steps: ['Step one'],
      successCriteria: ['Done'],
      estimatedMinutes: 10,
    },
    reflectionQuestion: 'What changed in your thinking?',
    reflectionHint: 'Anything honest.',
    resources: [],
    competencyTags: ['product-thinking'],
    completionCriteria: ['Criterion'],
    ...overrides,
  };
}

export function makeProject(moduleNumber: number): ModuleProject {
  return {
    id: `project-${moduleNumber}`,
    slug: `project-${moduleNumber}`,
    moduleId: `module-${moduleNumber}`,
    title: `Project ${moduleNumber}`,
    brief: 'Build the thing.',
    problem: 'A fixture problem statement.',
    objectives: ['Objective'],
    requirements: ['Requirement'],
    constraints: ['Constraint'],
    suggestedScope: 'Small.',
    deliverables: ['Deliverable'],
    completionCriteria: ['Criterion'],
    portfolioEvidence: ['Evidence'],
    reflectionQuestion: 'What did you learn?',
    estimatedHours: 4,
    competencies: ['product-thinking'],
  };
}

export function makeModule(
  moduleNumber: number,
  options: {
    readonly lessonCount?: number;
    readonly phase?: PhaseId;
    readonly competencies?: readonly CompetencyId[];
    readonly lessons?: readonly Lesson[];
    readonly project?: ModuleProject;
  } = {},
): CurriculumModule {
  const lessonCount = options.lessonCount ?? LESSONS_PER_MODULE;

  /* Phases hold three modules each, so module 4 belongs to phase 2. */
  const phaseIndex = Math.floor((moduleNumber - 1) / MODULES_PER_PHASE);
  const phase = options.phase ?? PHASE_IDS[phaseIndex] ?? 'foundations';

  const lessons =
    options.lessons ??
    Array.from({ length: lessonCount }, (_, i) => makeLesson(moduleNumber, i + 1));

  return {
    id: `module-${moduleNumber}`,
    slug: `module-${moduleNumber}`,
    moduleNumber,
    phase,
    title: `Module ${moduleNumber}`,
    description: 'Fixture module.',
    outcome: 'Outcome.',
    prerequisites: [],
    lessons,
    resources: [],
    project: options.project ?? makeProject(moduleNumber),
    competencies: options.competencies ?? ['product-thinking'],
    completionCriteria: ['Criterion'],
  };
}

export function makeCourse(modules: readonly CurriculumModule[]): Course {
  return {
    id: 'fixture-course',
    title: 'Fixture Course',
    description: 'Synthetic curriculum for tests.',
    phases: PHASE_LIST,
    modules,
  };
}

export function makeIndex(modules: readonly CurriculumModule[]): CurriculumIndex {
  return createCurriculumIndex(makeCourse(modules), COMPETENCIES);
}

/** A complete fifteen-module, seventy-five-lesson course. */
export function makeFullCourseIndex(): CurriculumIndex {
  return makeIndex(Array.from({ length: 15 }, (_, i) => makeModule(i + 1)));
}
