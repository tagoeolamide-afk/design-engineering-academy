/**
 * Read access to the real curriculum.
 *
 * A thin binding over createCurriculumIndex. Routes and components import from
 * here and never touch content modules directly, which keeps content authoring
 * free to change shape without the application noticing.
 */

import { COMPETENCIES } from '@/content/competencies';
import { COURSE } from '@/content/course';
import type { Competency, CompetencyId } from '@/types/competency';
import type {
  Course,
  CurriculumModule,
  Lesson,
  LessonLocation,
  LessonNavigation,
  ModuleProject,
  Phase,
  PhaseId,
  ProjectLocation,
} from '@/types/curriculum';
import { createCurriculumIndex, type CurriculumIndex } from './curriculum-index';
import { assertCurriculumIntegrity } from './integrity';

export const CURRICULUM: CurriculumIndex = createCurriculumIndex(COURSE, COMPETENCIES);

/**
 * Structural faults fail loudly the moment the curriculum is first read, so a
 * bad edit surfaces on the next page load rather than as a confusing blank
 * screen later. Production never throws: shipping a degraded page beats
 * shipping none.
 */
if (process.env.NODE_ENV !== 'production') {
  assertCurriculumIntegrity(CURRICULUM);
}

/* -------------------------------------------------------------------------- */
/* Course and phases                                                           */
/* -------------------------------------------------------------------------- */

export function getCourse(): Course {
  return CURRICULUM.course;
}

export function getPhases(): readonly Phase[] {
  return CURRICULUM.getPhases();
}

export function getPhaseById(id: PhaseId): Phase {
  const phase = CURRICULUM.getPhaseById(id);
  /* PhaseId is a closed union and every phase is declared, so a miss here is a
   * programming error rather than missing content. */
  if (phase === null) throw new Error(`Unknown phase "${id}".`);
  return phase;
}

export function getPhaseBySlug(slug: string): Phase | null {
  return CURRICULUM.getPhaseBySlug(slug);
}

/* -------------------------------------------------------------------------- */
/* Modules                                                                     */
/* -------------------------------------------------------------------------- */

export function getModules(): readonly CurriculumModule[] {
  return CURRICULUM.getModules();
}

export function getModuleById(id: string): CurriculumModule | null {
  return CURRICULUM.getModuleById(id);
}

export function getModuleBySlug(slug: string): CurriculumModule | null {
  return CURRICULUM.getModuleBySlug(slug);
}

export function getModulesInPhase(phaseId: PhaseId): readonly CurriculumModule[] {
  return CURRICULUM.getModulesInPhase(phaseId);
}

/* -------------------------------------------------------------------------- */
/* Lessons                                                                     */
/* -------------------------------------------------------------------------- */

export function getAllLessons(): readonly LessonLocation[] {
  return CURRICULUM.getAllLessons();
}

export function getLessonCount(): number {
  return CURRICULUM.getLessonCount();
}

export function getLessonById(lessonId: string): LessonLocation | null {
  return CURRICULUM.getLessonById(lessonId);
}

export function getLessonByPath(
  moduleSlug: string,
  lessonSlug: string,
): LessonLocation | null {
  return CURRICULUM.getLessonByPath(moduleSlug, lessonSlug);
}

export function getLessonsInModule(moduleId: string): readonly Lesson[] {
  return CURRICULUM.getLessonsInModule(moduleId);
}

export function getPreviousLesson(lessonId: string): LessonLocation | null {
  return CURRICULUM.getPreviousLesson(lessonId);
}

export function getNextLesson(lessonId: string): LessonLocation | null {
  return CURRICULUM.getNextLesson(lessonId);
}

export function getLessonNavigation(lessonId: string): LessonNavigation | null {
  return CURRICULUM.getLessonNavigation(lessonId);
}

/* -------------------------------------------------------------------------- */
/* Relationships                                                               */
/* -------------------------------------------------------------------------- */

export function getPrerequisiteLessons(lessonId: string): readonly LessonLocation[] {
  return CURRICULUM.getPrerequisiteLessons(lessonId);
}

export function getRelatedCompetencies(lessonId: string): readonly Competency[] {
  return CURRICULUM.getRelatedCompetencies(lessonId);
}

export function getModuleCompetencies(moduleId: string): readonly Competency[] {
  return CURRICULUM.getModuleCompetencies(moduleId);
}

export function getCompetencyById(id: CompetencyId): Competency | null {
  return CURRICULUM.getCompetencyById(id);
}

export function getLessonsForCompetency(id: CompetencyId): readonly LessonLocation[] {
  return CURRICULUM.getLessonsForCompetency(id);
}

export function getProjectsForCompetency(id: CompetencyId): readonly ProjectLocation[] {
  return CURRICULUM.getProjectsForCompetency(id);
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export function getAllProjects(): readonly ModuleProject[] {
  return CURRICULUM.getAllProjects();
}

export function getProjectByModuleSlug(moduleSlug: string): ModuleProject | null {
  return CURRICULUM.getProjectByModuleSlug(moduleSlug);
}

export function getProjectById(projectId: string): ModuleProject | null {
  return CURRICULUM.getProjectById(projectId);
}
