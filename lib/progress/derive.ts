/**
 * Derivation of every progress view the UI renders.
 *
 * These are pure functions of (stored facts + curriculum). No status is ever
 * stored, so there is no way for the displayed state and the recorded state to
 * drift apart, and the completion rules exist exactly once:
 *
 *   A lesson is complete when the learner reached the end, completed the
 *   practical exercise, and recorded a reflection answer.
 *
 *   A module is complete when every one of its lessons is complete and its
 *   module project is marked completed.
 */

import type { CompetencyId, EvidenceLevel } from '@/types/competency';
import type { CurriculumModule, PhaseId } from '@/types/curriculum';
import type {
  CompetencyEvidence,
  CourseProgress,
  LessonCompletionRequirements,
  LessonProgress,
  LessonProgressRecord,
  LessonStatus,
  ModuleProgress,
  PhaseProgress,
  ProgressState,
  ProjectProgressRecord,
  ProjectStatus,
  Timestamp,
} from '@/types/progress';
import { COMPETENCY_IDS } from '@/types/competency';
import type { CurriculumIndex } from '@/lib/curriculum/curriculum-index';
import { CURRICULUM } from '@/lib/curriculum/queries';
import {
  createLessonRecord,
  normalizeLessonRecord,
  normalizeProjectRecord,
} from './records';

const LESSON_REQUIREMENT_COUNT = 3;

/* -------------------------------------------------------------------------- */
/* Record access                                                               */
/* -------------------------------------------------------------------------- */

export function getLessonRecord(
  state: ProgressState,
  lessonId: string,
): LessonProgressRecord {
  const stored = state.lessons[lessonId];
  return stored === undefined ? createLessonRecord(lessonId) : normalizeLessonRecord(stored);
}

export function getProjectRecord(
  state: ProgressState,
  projectId: string,
): ProjectProgressRecord | null {
  const stored = state.projects[projectId];
  return stored === undefined ? null : normalizeProjectRecord(stored);
}

export function getProjectStatus(state: ProgressState, projectId: string): ProjectStatus {
  return getProjectRecord(state, projectId)?.status ?? 'not-started';
}

/* -------------------------------------------------------------------------- */
/* Lesson                                                                      */
/* -------------------------------------------------------------------------- */

export function getLessonRequirements(
  record: LessonProgressRecord,
): LessonCompletionRequirements {
  return {
    reachedEnd: record.reachedEndAt !== null,
    exerciseCompleted: record.exerciseCompletedAt !== null,
    reflectionAnswered: record.reflectionAnsweredAt !== null,
  };
}

function countMet(requirements: LessonCompletionRequirements): number {
  return (
    Number(requirements.reachedEnd) +
    Number(requirements.exerciseCompleted) +
    Number(requirements.reflectionAnswered)
  );
}

export function isLessonComplete(record: LessonProgressRecord): boolean {
  const requirements = getLessonRequirements(record);
  return (
    requirements.reachedEnd &&
    requirements.exerciseCompleted &&
    requirements.reflectionAnswered
  );
}

function deriveLessonStatus(record: LessonProgressRecord): LessonStatus {
  if (isLessonComplete(record)) return 'completed';
  if (record.startedAt !== null) return 'in-progress';
  return 'not-started';
}

/** The moment the final outstanding requirement was satisfied. */
function deriveCompletedAt(record: LessonProgressRecord): Timestamp | null {
  if (!isLessonComplete(record)) return null;
  const stamps = [
    record.reachedEndAt,
    record.exerciseCompletedAt,
    record.reflectionAnsweredAt,
  ].filter((stamp): stamp is Timestamp => stamp !== null);
  return stamps.reduce((latest, stamp) => (stamp > latest ? stamp : latest));
}

export function deriveLessonProgress(
  state: ProgressState,
  lessonId: string,
): LessonProgress {
  const record = getLessonRecord(state, lessonId);
  const requirements = getLessonRequirements(record);

  return {
    lessonId,
    status: deriveLessonStatus(record),
    requirements,
    requirementsMet: countMet(requirements),
    requirementsTotal: LESSON_REQUIREMENT_COUNT,
    reflectionAnswer: record.reflectionAnswer,
    exerciseNotes: record.exerciseNotes,
    startedAt: record.startedAt,
    lastVisitedAt: record.lastVisitedAt,
    completedAt: deriveCompletedAt(record),
  };
}

/* -------------------------------------------------------------------------- */
/* Module                                                                      */
/* -------------------------------------------------------------------------- */

export function deriveModuleProgress(
  state: ProgressState,
  courseModule: CurriculumModule,
): ModuleProgress {
  const statuses = courseModule.lessons.map((lesson) =>
    deriveLessonStatus(getLessonRecord(state, lesson.id)),
  );

  const lessonsTotal = statuses.length;
  const lessonsCompleted = statuses.filter((status) => status === 'completed').length;
  const lessonsInProgress = statuses.filter((status) => status === 'in-progress').length;
  const projectStatus = getProjectStatus(state, courseModule.project.id);

  /* An unauthored module has no lessons; that is not the same as having
   * finished them, so it must not read as complete. */
  const allLessonsCompleted = lessonsTotal > 0 && lessonsCompleted === lessonsTotal;
  const projectCompleted = projectStatus === 'completed';

  return {
    moduleId: courseModule.id,
    lessonsTotal,
    lessonsCompleted,
    lessonsInProgress,
    lessonsNotStarted: lessonsTotal - lessonsCompleted - lessonsInProgress,
    lessonCompletionRatio: lessonsTotal === 0 ? 0 : lessonsCompleted / lessonsTotal,
    projectStatus,
    requirements: { allLessonsCompleted, projectCompleted },
    isComplete: allLessonsCompleted && projectCompleted,
  };
}

/* -------------------------------------------------------------------------- */
/* Phase                                                                       */
/* -------------------------------------------------------------------------- */

export function derivePhaseProgress(
  state: ProgressState,
  phaseId: PhaseId,
  index: CurriculumIndex = CURRICULUM,
): PhaseProgress {
  const modules = index.getModulesInPhase(phaseId);
  const summaries = modules.map((courseModule) => deriveModuleProgress(state, courseModule));

  const lessonsTotal = summaries.reduce((total, summary) => total + summary.lessonsTotal, 0);
  const lessonsCompleted = summaries.reduce(
    (total, summary) => total + summary.lessonsCompleted,
    0,
  );
  const modulesCompleted = summaries.filter((summary) => summary.isComplete).length;

  return {
    phaseId,
    modulesTotal: modules.length,
    modulesCompleted,
    lessonsTotal,
    lessonsCompleted,
    completionRatio: lessonsTotal === 0 ? 0 : lessonsCompleted / lessonsTotal,
    isComplete: modules.length > 0 && modulesCompleted === modules.length,
  };
}

/* -------------------------------------------------------------------------- */
/* Course                                                                      */
/* -------------------------------------------------------------------------- */

export function deriveCourseProgress(
  state: ProgressState,
  index: CurriculumIndex = CURRICULUM,
): CourseProgress {
  const modules = index.getModules();
  const moduleSummaries = modules.map((courseModule) => deriveModuleProgress(state, courseModule));
  const phaseSummaries = index
    .getPhases()
    .map((phase) => derivePhaseProgress(state, phase.id, index));

  const lessonStatuses = index.getAllLessons().map((location) =>
    deriveLessonStatus(getLessonRecord(state, location.lesson.id)),
  );

  const lessonsTotal = lessonStatuses.length;
  const lessonsCompleted = lessonStatuses.filter((status) => status === 'completed').length;

  return {
    lessonsTotal,
    lessonsCompleted,
    lessonsInProgress: lessonStatuses.filter((status) => status === 'in-progress').length,
    modulesTotal: modules.length,
    modulesCompleted: moduleSummaries.filter((summary) => summary.isComplete).length,
    phasesTotal: phaseSummaries.length,
    phasesCompleted: phaseSummaries.filter((summary) => summary.isComplete).length,
    projectsCompleted: moduleSummaries.filter(
      (summary) => summary.projectStatus === 'completed',
    ).length,
    completionRatio: lessonsTotal === 0 ? 0 : lessonsCompleted / lessonsTotal,
  };
}

/* -------------------------------------------------------------------------- */
/* Competencies                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Competency evidence is counted from what the learner actually finished.
 *
 * Three separate records, never combined into a score:
 *   exposure      a tagged lesson was completed
 *   practised     a tagged lesson's exercise was completed
 *   demonstrated  a tagged module project was completed
 *
 * Denominators come from the curriculum's own tagging, so a competency with no
 * tagged project reports nothing rather than a failure — the Skills view says
 * so in words instead of drawing an empty bar.
 */
export function deriveCompetencyEvidence(
  state: ProgressState,
  index: CurriculumIndex = CURRICULUM,
): Readonly<Record<CompetencyId, CompetencyEvidence>> {
  interface Bucket {
    lessonsTagged: number;
    lessonsCompleted: number;
    exercisesCompleted: number;
    projectsTagged: number;
    projectsCompleted: number;
  }

  const buckets = new Map<CompetencyId, Bucket>(
    COMPETENCY_IDS.map((id) => [
      id,
      {
        lessonsTagged: 0,
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        projectsTagged: 0,
        projectsCompleted: 0,
      },
    ]),
  );

  for (const { lesson } of index.getAllLessons()) {
    const record = getLessonRecord(state, lesson.id);
    const completed = isLessonComplete(record);
    const practised = record.exerciseCompletedAt !== null;

    for (const tag of lesson.competencyTags) {
      const bucket = buckets.get(tag);
      if (bucket === undefined) continue;
      bucket.lessonsTagged += 1;
      if (completed) bucket.lessonsCompleted += 1;
      if (practised) bucket.exercisesCompleted += 1;
    }
  }

  for (const project of index.getAllProjects()) {
    const completed = getProjectStatus(state, project.id) === 'completed';

    for (const tag of project.competencies) {
      const bucket = buckets.get(tag);
      if (bucket === undefined) continue;
      bucket.projectsTagged += 1;
      if (completed) bucket.projectsCompleted += 1;
    }
  }

  const entries = COMPETENCY_IDS.map((id): [CompetencyId, CompetencyEvidence] => {
    const bucket = buckets.get(id);
    return [
      id,
      {
        competencyId: id,
        lessonsTagged: bucket?.lessonsTagged ?? 0,
        lessonsCompleted: bucket?.lessonsCompleted ?? 0,
        exercisesCompleted: bucket?.exercisesCompleted ?? 0,
        projectsTagged: bucket?.projectsTagged ?? 0,
        projectsCompleted: bucket?.projectsCompleted ?? 0,
      },
    ];
  });

  return Object.fromEntries(entries) as Record<CompetencyId, CompetencyEvidence>;
}

/** How many completed items back a given evidence level. */
export function evidenceCount(evidence: CompetencyEvidence, level: EvidenceLevel): number {
  switch (level) {
    case 'exposure':
      return evidence.lessonsCompleted;
    case 'practised':
      return evidence.exercisesCompleted;
    case 'demonstrated':
      return evidence.projectsCompleted;
  }
}

/** How many items the curriculum offers toward a given evidence level. */
export function evidenceTotal(evidence: CompetencyEvidence, level: EvidenceLevel): number {
  return level === 'demonstrated' ? evidence.projectsTagged : evidence.lessonsTagged;
}

/** True when at least one completed item backs this level. */
export function hasEvidence(evidence: CompetencyEvidence, level: EvidenceLevel): boolean {
  return evidenceCount(evidence, level) > 0;
}
