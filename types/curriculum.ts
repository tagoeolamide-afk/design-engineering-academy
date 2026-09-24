/**
 * The curriculum schema: Course -> Phase -> Module -> Lesson -> Exercise /
 * Reflection / Resources, plus the Module Project and the competencies each
 * level claims to develop.
 *
 * Nothing here knows about the learner. These types describe the syllabus as a
 * fixed body of material; everything about what the learner has done with it
 * lives in `types/progress.ts`.
 */

import type { CompetencyId } from './competency';
import type { Prose } from './content-block';

/* -------------------------------------------------------------------------- */
/* Structural invariants                                                       */
/* -------------------------------------------------------------------------- */

/** Fixed shape of the syllabus. The integrity checks in lib/curriculum enforce these. */
export const LESSONS_PER_MODULE = 5;
export const MODULES_PER_PHASE = 3;
export const TOTAL_MODULES = 15;
export const TOTAL_LESSONS = TOTAL_MODULES * LESSONS_PER_MODULE; // 75

/** Phases are the coarse arc of the course. Their prose lives in content/phases.ts. */
export const PHASE_IDS = [
  'foundations',
  'interface-craft',
  'systems',
  'interaction-and-motion',
  'product-judgement',
] as const;

export type PhaseId = (typeof PHASE_IDS)[number];

const PHASE_ID_SET: ReadonlySet<string> = new Set<string>(PHASE_IDS);

export function isPhaseId(value: string): value is PhaseId {
  return PHASE_ID_SET.has(value);
}

/**
 * The module numbers a phase is responsible for: phase 1 owns 1..3, phase 2
 * owns 4..6, and so on.
 *
 * Derived rather than declared, so the curriculum can show all fifteen module
 * slots — including the ones not yet authored — without inventing placeholder
 * content to hang them on.
 */
export function moduleNumbersForPhase(phaseNumber: number): readonly number[] {
  const first = (phaseNumber - 1) * MODULES_PER_PHASE + 1;
  return Array.from({ length: MODULES_PER_PHASE }, (_, offset) => first + offset);
}

/* -------------------------------------------------------------------------- */
/* Shared leaf types                                                           */
/* -------------------------------------------------------------------------- */

export type ResourceType =
  | 'article'
  | 'documentation'
  | 'specification'
  | 'video'
  | 'book'
  | 'tool'
  | 'repository'
  | 'example';

export interface Resource {
  readonly id: string;
  readonly title: string;
  readonly url: string;
  readonly type: ResourceType;
  readonly author?: string;
  readonly estimatedMinutes?: number;
  /** Why this resource is worth the learner's time. */
  readonly note?: string;
}

export interface IndustryExample {
  readonly id: string;
  /** The product or team the example is drawn from, e.g. "Linear", "Stripe". */
  readonly source: string;
  readonly title: string;
  /** What they actually do. */
  readonly observation: string;
  /** Why it matters to a design engineer. */
  readonly takeaway: string;
}

export interface CommonMistake {
  readonly id: string;
  readonly mistake: string;
  readonly why: string;
  readonly instead: string;
}

/** The hands-on task attached to a lesson. Completing it is required for lesson completion. */
export interface PracticalExercise {
  readonly id: string;
  readonly title: string;
  readonly prompt: string;
  readonly steps: readonly string[];
  readonly successCriteria: readonly string[];
  readonly estimatedMinutes: number;
  readonly hint?: string;
}

/* -------------------------------------------------------------------------- */
/* Lesson                                                                      */
/* -------------------------------------------------------------------------- */

export interface Lesson {
  readonly id: string;
  readonly slug: string;
  readonly moduleId: string;
  /** Position within the module, 1..LESSONS_PER_MODULE. */
  readonly lessonNumber: number;
  readonly title: string;
  readonly summary: string;
  readonly estimatedMinutes: number;
  readonly objectives: readonly string[];
  /** Concepts the learner should already hold before starting. */
  readonly prerequisiteConcepts: readonly string[];
  /**
   * Ids of lessons that must be understood first. Declared explicitly rather
   * than inferred from position, because a dependency can reach back across
   * modules. Validated to resolve, to point backwards, and to be acyclic.
   */
  readonly prerequisiteLessonIds?: readonly string[];
  /** Brief callback to prior material, so lessons chain instead of standing alone. */
  readonly recap: Prose;

  readonly coreConcept: Prose;
  readonly firstPrinciples: Prose;
  readonly designPerspective: Prose;
  readonly engineeringPerspective: Prose;
  /** The synthesis: why the two perspectives above are one subject, not two. */
  readonly connectionBetweenBoth: Prose;

  readonly industryExamples: readonly IndustryExample[];
  readonly practicalWalkthrough: Prose;
  readonly commonMistakes: readonly CommonMistake[];
  /** What separates competent work from elite work on this topic. */
  readonly eliteConsiderations: Prose;

  readonly practicalExercise: PracticalExercise;
  readonly reflectionQuestion: string;
  readonly reflectionHint: string;

  readonly resources: readonly Resource[];
  readonly competencyTags: readonly CompetencyId[];
  readonly completionCriteria: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* Module project                                                              */
/* -------------------------------------------------------------------------- */

export interface ModuleProject {
  readonly id: string;
  readonly slug: string;
  readonly moduleId: string;
  readonly title: string;
  /** One or two sentences: what is being built. */
  readonly brief: string;
  /** Why it is worth building — the situation the work answers. */
  readonly problem: string;
  readonly objectives: readonly string[];
  readonly requirements: readonly string[];
  /** Deliberate limits. What the learner may not use, or must work within. */
  readonly constraints: readonly string[];
  /** How far to take it, so the project can be finished rather than abandoned. */
  readonly suggestedScope: string;
  readonly deliverables: readonly string[];
  readonly completionCriteria: readonly string[];
  /**
   * The specific, demonstrable skills a finished build proves.
   *
   * Deliberately finer-grained than `competencies`: a competency is an axis the
   * whole course measures, while evidence is the concrete thing a reviewer can
   * point at in this particular piece of work — "keyboard behaviour", not
   * "accessibility".
   */
  readonly portfolioEvidence: readonly string[];
  /** Asked once the build is done, in the same spirit as a lesson reflection. */
  readonly reflectionQuestion: string;
  readonly estimatedHours: number;
  readonly competencies: readonly CompetencyId[];
  readonly stretchGoals?: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export interface CurriculumModule {
  readonly id: string;
  readonly slug: string;
  /** Position within the whole course, 1..TOTAL_MODULES. */
  readonly moduleNumber: number;
  readonly phase: PhaseId;
  readonly title: string;
  readonly description: string;
  /** The capability the learner should hold once the module is finished. */
  readonly outcome: string;
  readonly prerequisites: readonly string[];
  readonly lessons: readonly Lesson[];
  readonly resources: readonly Resource[];
  readonly project: ModuleProject;
  readonly competencies: readonly CompetencyId[];
  readonly completionCriteria: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* Phase and course                                                            */
/* -------------------------------------------------------------------------- */

export interface Phase {
  readonly id: PhaseId;
  readonly slug: string;
  readonly phaseNumber: number;
  readonly title: string;
  readonly description: string;
  readonly outcome: string;
}

export interface Course {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly phases: readonly Phase[];
  readonly modules: readonly CurriculumModule[];
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

/** A lesson paired with its module, which is what every lesson route needs. */
export interface LessonLocation {
  readonly lesson: Lesson;
  readonly courseModule: CurriculumModule;
}

/** A module project paired with its module, which is what every project link needs. */
export interface ProjectLocation {
  readonly project: ModuleProject;
  readonly courseModule: CurriculumModule;
}

/** Sequential position of a lesson across the entire course. */
export interface LessonNavigation {
  readonly current: LessonLocation;
  readonly previous: LessonLocation | null;
  readonly next: LessonLocation | null;
  /** 1-based index across all lessons in the course. */
  readonly courseIndex: number;
}
