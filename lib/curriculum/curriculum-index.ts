/**
 * The curriculum index.
 *
 * Every read of the syllabus goes through an index built from a Course. It is a
 * factory rather than a set of module-level functions for one reason: the real
 * content is a singleton, but the query logic has to be testable against
 * fixtures — a fifteen-module course, an empty course, a malformed one — without
 * mutating global state or mocking the content modules.
 *
 * lib/curriculum/queries.ts binds this to the real content and is what the
 * application imports.
 */

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

export interface CurriculumIndex {
  readonly course: Course;

  /* Phases */
  getPhases: () => readonly Phase[];
  getPhaseById: (id: PhaseId) => Phase | null;
  getPhaseBySlug: (slug: string) => Phase | null;

  /* Modules */
  getModules: () => readonly CurriculumModule[];
  getModuleById: (id: string) => CurriculumModule | null;
  getModuleBySlug: (slug: string) => CurriculumModule | null;
  getModulesInPhase: (phaseId: PhaseId) => readonly CurriculumModule[];

  /* Lessons */
  getAllLessons: () => readonly LessonLocation[];
  getLessonCount: () => number;
  getLessonById: (lessonId: string) => LessonLocation | null;
  getLessonByPath: (moduleSlug: string, lessonSlug: string) => LessonLocation | null;
  getLessonsInModule: (moduleId: string) => readonly Lesson[];
  getLessonNavigation: (lessonId: string) => LessonNavigation | null;
  getPreviousLesson: (lessonId: string) => LessonLocation | null;
  getNextLesson: (lessonId: string) => LessonLocation | null;

  /* Relationships */
  getPrerequisiteLessons: (lessonId: string) => readonly LessonLocation[];
  getRelatedCompetencies: (lessonId: string) => readonly Competency[];
  getModuleCompetencies: (moduleId: string) => readonly Competency[];

  /* Competencies — the inverse lookups the Skills section is built on. */
  getCompetencyById: (id: CompetencyId) => Competency | null;
  getLessonsForCompetency: (id: CompetencyId) => readonly LessonLocation[];
  getProjectsForCompetency: (id: CompetencyId) => readonly ProjectLocation[];

  /* Projects */
  getAllProjects: () => readonly ModuleProject[];
  getProjectById: (projectId: string) => ModuleProject | null;
  getProjectByModuleSlug: (moduleSlug: string) => ModuleProject | null;
}

function lessonPathKey(moduleSlug: string, lessonSlug: string): string {
  return `${moduleSlug}/${lessonSlug}`;
}

export function createCurriculumIndex(
  course: Course,
  competencies: Readonly<Record<CompetencyId, Competency>>,
): CurriculumIndex {
  /* Canonical order is moduleNumber then lessonNumber, applied once here so no
   * caller has to remember to sort. Authoring order in the file is irrelevant. */
  const orderedModules: readonly CurriculumModule[] = [...course.modules].sort(
    (a, b) => a.moduleNumber - b.moduleNumber,
  );

  const orderedLessons: readonly LessonLocation[] = orderedModules.flatMap(
    (courseModule) =>
      [...courseModule.lessons]
        .sort((a, b) => a.lessonNumber - b.lessonNumber)
        .map((lesson) => ({ lesson, courseModule })),
  );

  const orderedProjects: readonly ProjectLocation[] = orderedModules.map(
    (courseModule) => ({ project: courseModule.project, courseModule }),
  );

  const modulesById = new Map(orderedModules.map((m) => [m.id, m]));
  const modulesBySlug = new Map(orderedModules.map((m) => [m.slug, m]));
  const lessonsById = new Map(orderedLessons.map((l) => [l.lesson.id, l]));
  const lessonsByPath = new Map(
    orderedLessons.map((l) => [lessonPathKey(l.courseModule.slug, l.lesson.slug), l]),
  );
  const lessonIndexById = new Map(orderedLessons.map((l, i) => [l.lesson.id, i]));

  const phasesById = new Map(course.phases.map((phase) => [phase.id, phase]));

  const orderedProjectList: readonly ModuleProject[] = orderedProjects.map(
    (location) => location.project,
  );
  const projectsById = new Map(orderedProjectList.map((project) => [project.id, project]));

  function getLessonById(lessonId: string): LessonLocation | null {
    return lessonsById.get(lessonId) ?? null;
  }

  function lessonAtOffset(lessonId: string, offset: number): LessonLocation | null {
    const index = lessonIndexById.get(lessonId);
    if (index === undefined) return null;
    return orderedLessons[index + offset] ?? null;
  }

  return {
    course,

    getPhases: () => course.phases,
    getPhaseById: (id) => phasesById.get(id) ?? null,
    getPhaseBySlug: (slug) => course.phases.find((phase) => phase.slug === slug) ?? null,

    getModules: () => orderedModules,
    getModuleById: (id) => modulesById.get(id) ?? null,
    getModuleBySlug: (slug) => modulesBySlug.get(slug) ?? null,
    getModulesInPhase: (phaseId) =>
      orderedModules.filter((courseModule) => courseModule.phase === phaseId),

    getAllLessons: () => orderedLessons,
    getLessonCount: () => orderedLessons.length,
    getLessonById,
    getLessonByPath: (moduleSlug, lessonSlug) =>
      lessonsByPath.get(lessonPathKey(moduleSlug, lessonSlug)) ?? null,
    getLessonsInModule: (moduleId) => {
      const courseModule = modulesById.get(moduleId);
      if (courseModule === undefined) return [];
      return [...courseModule.lessons].sort((a, b) => a.lessonNumber - b.lessonNumber);
    },

    /* Previous and next run across the whole course, not within a module: the
     * learner moves through seventy-five lessons in one line, and a module
     * boundary should not be a dead end. */
    getPreviousLesson: (lessonId) => lessonAtOffset(lessonId, -1),
    getNextLesson: (lessonId) => lessonAtOffset(lessonId, 1),

    getLessonNavigation: (lessonId) => {
      const current = getLessonById(lessonId);
      const index = lessonIndexById.get(lessonId);
      if (current === null || index === undefined) return null;

      return {
        current,
        previous: lessonAtOffset(lessonId, -1),
        next: lessonAtOffset(lessonId, 1),
        courseIndex: index + 1,
      };
    },

    /* Unresolvable ids are skipped rather than thrown on: the integrity check
     * is what reports them, and a broken link must not take down a page. */
    getPrerequisiteLessons: (lessonId) => {
      const location = getLessonById(lessonId);
      if (location === null) return [];
      return (location.lesson.prerequisiteLessonIds ?? [])
        .map((id) => lessonsById.get(id))
        .filter((entry): entry is LessonLocation => entry !== undefined);
    },

    getRelatedCompetencies: (lessonId) => {
      const location = getLessonById(lessonId);
      if (location === null) return [];
      return location.lesson.competencyTags
        .map((tag) => competencies[tag])
        .filter((entry): entry is Competency => entry !== undefined);
    },

    getModuleCompetencies: (moduleId) => {
      const courseModule = modulesById.get(moduleId);
      if (courseModule === undefined) return [];
      return courseModule.competencies
        .map((tag) => competencies[tag])
        .filter((entry): entry is Competency => entry !== undefined);
    },

    getCompetencyById: (id) => competencies[id] ?? null,

    getLessonsForCompetency: (id) =>
      orderedLessons.filter((location) => location.lesson.competencyTags.includes(id)),

    getProjectsForCompetency: (id) =>
      orderedProjects.filter((location) => location.project.competencies.includes(id)),

    getAllProjects: () => orderedProjectList,
    getProjectById: (projectId) => projectsById.get(projectId) ?? null,
    getProjectByModuleSlug: (moduleSlug) =>
      modulesBySlug.get(moduleSlug)?.project ?? null,
  };
}
