/**
 * Progress is stored as *facts*, never as statuses.
 *
 * The store records only what the learner actually did — reached the end of a
 * lesson, ticked the exercise, wrote a reflection — and every status in the UI
 * is derived from those facts by pure functions in lib/progress. This keeps the
 * completion rules in exactly one place and makes stored data impossible to put
 * into a self-contradicting state (e.g. "completed" with no reflection).
 */

import type { CompetencyId } from './competency';
import type { PhaseId } from './curriculum';

/* -------------------------------------------------------------------------- */
/* Stored records                                                              */
/* -------------------------------------------------------------------------- */

/** ISO-8601 timestamp. */
export type Timestamp = string;

export interface LessonProgressRecord {
  readonly lessonId: string;
  readonly startedAt: Timestamp | null;
  readonly lastVisitedAt: Timestamp | null;
  /** Set when the learner scrolled/paged to the end of the lesson body. */
  readonly reachedEndAt: Timestamp | null;
  readonly exerciseCompletedAt: Timestamp | null;
  /**
   * Optional working notes kept alongside the exercise. Never a completion
   * requirement — the checkbox is. These are the learner's scratch space.
   */
  readonly exerciseNotes: string;
  readonly reflectionAnswer: string;
  readonly reflectionAnsweredAt: Timestamp | null;
}

/**
 * Where a build has got to.
 *
 * Ordered, and the order is meaningful: the interface advances through it, and
 * only the last value completes a module.
 */
export const PROJECT_STATUSES = [
  'not-started',
  'planning',
  'building',
  'reviewing',
  'completed',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** The external places a piece of project work can live. */
export const PROJECT_LINK_KINDS = ['figma', 'github', 'live', 'caseStudy'] as const;

export type ProjectLinkKind = (typeof PROJECT_LINK_KINDS)[number];

export type ProjectLinks = Readonly<Record<ProjectLinkKind, string>>;

export interface ProjectProgressRecord {
  readonly projectId: string;
  readonly moduleId: string;
  readonly status: ProjectStatus;
  readonly startedAt: Timestamp | null;
  readonly completedAt: Timestamp | null;
  /** When the status last moved, whichever direction it moved in. */
  readonly statusUpdatedAt: Timestamp | null;
  readonly links: ProjectLinks;
  readonly notes: string;
  readonly reflectionAnswer: string;
  readonly reflectionAnsweredAt: Timestamp | null;
}

/** The complete persisted progress shape. */
/**
 * Records that belonged to a previous curriculum version.
 *
 * Kept rather than deleted. Their ids resolve to nothing in the current
 * curriculum, so they can never contribute to a status or a percentage, but
 * they are still the learner's record of work they actually did — and the
 * reflections and project links inside them are writing, not derived data.
 */
export interface LegacyProgressArchive {
  /** The curriculum version these records were written against. */
  readonly fromCurriculumVersion: number;
  readonly archivedAt: Timestamp;
  readonly lessons: Readonly<Record<string, LessonProgressRecord>>;
  readonly projects: Readonly<Record<string, ProjectProgressRecord>>;
}

export interface ProgressState {
  readonly lessons: Readonly<Record<string, LessonProgressRecord>>;
  readonly projects: Readonly<Record<string, ProjectProgressRecord>>;
  /**
   * The lesson most recently opened.
   *
   * Stored rather than derived because it answers a different question from
   * the recommended next action: where the learner actually was, which may be
   * a lesson they jumped ahead to read.
   */
  readonly lastVisitedLessonId: string | null;
  /**
   * Which curriculum the ids in this record refer to.
   *
   * 0 means "not stated", which is how everything written before curriculum
   * versioning existed reads. The upgrade is not applied automatically on load:
   * the learner is told first, because archiving their completion record is
   * their decision to acknowledge rather than ours to make quietly.
   */
  readonly curriculumVersion: number;
  /** Records from an earlier curriculum, moved aside rather than discarded. */
  readonly legacy: LegacyProgressArchive | null;
}

/* -------------------------------------------------------------------------- */
/* Derived views                                                               */
/* -------------------------------------------------------------------------- */

export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

/**
 * The three conditions that must all hold for a lesson to count as completed.
 * Surfaced as data so the UI can show the learner exactly what is outstanding.
 */
export interface LessonCompletionRequirements {
  readonly reachedEnd: boolean;
  readonly exerciseCompleted: boolean;
  readonly reflectionAnswered: boolean;
}

export interface LessonProgress {
  readonly lessonId: string;
  readonly status: LessonStatus;
  readonly requirements: LessonCompletionRequirements;
  readonly requirementsMet: number;
  readonly requirementsTotal: number;
  readonly reflectionAnswer: string;
  readonly exerciseNotes: string;
  readonly startedAt: Timestamp | null;
  readonly lastVisitedAt: Timestamp | null;
  /** Latest of the timestamps that satisfied the final requirement, if complete. */
  readonly completedAt: Timestamp | null;
}

/** The two conditions that must both hold for a module to count as completed. */
export interface ModuleCompletionRequirements {
  readonly allLessonsCompleted: boolean;
  readonly projectCompleted: boolean;
}

export interface ModuleProgress {
  readonly moduleId: string;
  readonly lessonsTotal: number;
  readonly lessonsCompleted: number;
  readonly lessonsInProgress: number;
  readonly lessonsNotStarted: number;
  /** 0..1, lesson completion only — the project is tracked separately. */
  readonly lessonCompletionRatio: number;
  readonly projectStatus: ProjectStatus;
  readonly requirements: ModuleCompletionRequirements;
  readonly isComplete: boolean;
}

export interface PhaseProgress {
  readonly phaseId: PhaseId;
  readonly modulesTotal: number;
  readonly modulesCompleted: number;
  readonly lessonsTotal: number;
  readonly lessonsCompleted: number;
  /** 0..1 across every lesson in the phase. */
  readonly completionRatio: number;
  readonly isComplete: boolean;
}

/**
 * What a competency can point at as evidence.
 *
 * Three independent counts of finished work, never a score. Each numerator is
 * work the learner actually completed and each denominator is the work the
 * curriculum tags with this competency, so both halves are real.
 *
 * `exercisesCompleted` is not a subset of `lessonsCompleted`: completing a
 * lesson requires completing its exercise, so every completed lesson is also a
 * completed exercise, but an exercise can be finished while the lesson is not.
 * The two are reported separately rather than stacked into a ladder.
 */
export interface CompetencyEvidence {
  readonly competencyId: CompetencyId;
  /** Lessons whose tags include this competency. */
  readonly lessonsTagged: number;
  /** Tagged lessons fully completed — the exposure record. */
  readonly lessonsCompleted: number;
  /** Tagged lessons whose exercise is marked done — the practised record. */
  readonly exercisesCompleted: number;
  /** Module projects this competency contributes to. */
  readonly projectsTagged: number;
  /** Tagged projects marked completed — the demonstrated record. */
  readonly projectsCompleted: number;
}

export interface CourseProgress {
  readonly lessonsTotal: number;
  readonly lessonsCompleted: number;
  readonly lessonsInProgress: number;
  readonly modulesTotal: number;
  readonly modulesCompleted: number;
  readonly phasesTotal: number;
  readonly phasesCompleted: number;
  readonly projectsCompleted: number;
  /** 0..1 across every lesson in the course. */
  readonly completionRatio: number;
}
