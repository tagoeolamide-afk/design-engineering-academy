/**
 * Curriculum integrity checks.
 *
 * The syllabus is authored by hand across many files, so the invariants that
 * make navigation, prerequisites, and progress correct have to be checkable
 * rather than assumed.
 *
 * Severity is the important distinction here:
 *
 *   error   A structural fault. Something is contradictory or unresolvable and
 *           the application cannot behave correctly. These throw in development.
 *   warning Authored but incomplete in a way that degrades a feature — an
 *           untagged lesson contributes to no competency, for example.
 *   info    Content simply not written yet. Expected while the curriculum is
 *           being built out, and never a failure.
 *
 * That split is what lets a half-authored curriculum run normally while a
 * genuine mistake stops the build.
 */

import { isCompetencyId } from '@/types/competency';
import type { CurriculumModule, LessonLocation } from '@/types/curriculum';
import {
  isPhaseId,
  LESSONS_PER_MODULE,
  moduleCountForPhase,
  TOTAL_LESSONS,
  TOTAL_MODULES,
} from '@/types/curriculum';
import type { CurriculumIndex } from './curriculum-index';

export type IntegritySeverity = 'error' | 'warning' | 'info';

export interface IntegrityIssue {
  readonly severity: IntegritySeverity;
  /** Where the problem is, e.g. "module:design-engineering-foundations". */
  readonly scope: string;
  readonly message: string;
  /**
   * The content file to open, derived from the scope. Knowing a lesson is wrong
   * is only half of it — the other half is not having to search for the file.
   */
  readonly file?: string;
  /** What to actually do about it, where the remedy is unambiguous. */
  readonly fix?: string;
}

export interface IntegrityReport {
  readonly issues: readonly IntegrityIssue[];
  readonly errorCount: number;
  readonly warningCount: number;
  readonly infoCount: number;
  readonly moduleCount: number;
  readonly lessonCount: number;
  /** True when there are no structural faults. Info and warnings do not count. */
  readonly isValid: boolean;
}

function findDuplicates(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}


/* -------------------------------------------------------------------------- */
/* Locating the content                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Attaches the content file an issue belongs to.
 *
 * Done once over the finished list rather than at every call site: the scope
 * already identifies the module, and a developer reading "lesson X is wrong"
 * should not then have to work out which of fifteen files to open.
 */
function withFiles(
  issues: readonly IntegrityIssue[],
  index: CurriculumIndex,
): readonly IntegrityIssue[] {
  const fileBySlug = new Map<string, string>();
  for (const courseModule of index.getModules()) {
    const padded = String(courseModule.moduleNumber).padStart(2, '0');
    fileBySlug.set(
      courseModule.slug,
      `content/modules/module-${padded}-${courseModule.slug}.ts`,
    );
  }

  return issues.map((issue) => {
    if (issue.file !== undefined) return issue;

    const [kind, rest] = issue.scope.split(':');
    if (rest === undefined) return issue;

    /* "lesson:<moduleSlug>/<lessonSlug>" carries the module in its first half. */
    const moduleSlug = kind === 'lesson' ? (rest.split('/')[0] ?? rest) : rest;
    const file =
      fileBySlug.get(moduleSlug) ??
      (kind === 'project'
        ? [...fileBySlug.values()].find((path) => path.includes(moduleSlug))
        : undefined);

    return file === undefined ? issue : { ...issue, file };
  });
}

/* -------------------------------------------------------------------------- */
/* Module-level checks                                                         */
/* -------------------------------------------------------------------------- */

function checkModule(courseModule: CurriculumModule): readonly IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const scope = `module:${courseModule.slug}`;

  if (!isPhaseId(courseModule.phase)) {
    issues.push({
      severity: 'error',
      scope,
      message: `Unknown phase "${courseModule.phase}".`,
    });
  }

  if (courseModule.moduleNumber < 1 || courseModule.moduleNumber > TOTAL_MODULES) {
    issues.push({
      severity: 'error',
      scope,
      message: `moduleNumber ${courseModule.moduleNumber} is outside 1..${TOTAL_MODULES}.`,
    });
  }

  /* Too many lessons is a fault; too few is simply unwritten content. */
  if (courseModule.lessons.length > LESSONS_PER_MODULE) {
    issues.push({
      severity: 'error',
      scope,
      message: `Has ${courseModule.lessons.length} lessons, more than the ${LESSONS_PER_MODULE} a module may contain.`,
    });
  } else if (courseModule.lessons.length < LESSONS_PER_MODULE) {
    issues.push({
      severity: 'info',
      scope,
      message: `${courseModule.lessons.length} of ${LESSONS_PER_MODULE} lessons authored.`,
    });
  }

  for (const duplicate of findDuplicates(
    courseModule.lessons.map((lesson) => String(lesson.lessonNumber)),
  )) {
    issues.push({
      severity: 'error',
      scope,
      message: `Duplicate lessonNumber ${duplicate}.`,
    });
  }

  for (const duplicate of findDuplicates(
    courseModule.lessons.map((lesson) => lesson.slug),
  )) {
    issues.push({
      severity: 'error',
      scope,
      message: `Duplicate lesson slug "${duplicate}" within the module.`,
    });
  }

  for (const lesson of courseModule.lessons) {
    const lessonScope = `lesson:${courseModule.slug}/${lesson.slug}`;

    if (lesson.moduleId !== courseModule.id) {
      issues.push({
        severity: 'error',
        scope: lessonScope,
        message: `moduleId "${lesson.moduleId}" does not match owning module "${courseModule.id}".`,
        fix: `Set moduleId to "${courseModule.id}", or move the lesson to the module it names.`,
      });
    }

    if (lesson.lessonNumber < 1 || lesson.lessonNumber > LESSONS_PER_MODULE) {
      issues.push({
        severity: 'error',
        scope: lessonScope,
        message: `lessonNumber ${lesson.lessonNumber} is outside 1..${LESSONS_PER_MODULE}.`,
      });
    }

    for (const tag of lesson.competencyTags) {
      if (!isCompetencyId(tag)) {
        issues.push({
          severity: 'error',
          scope: lessonScope,
          message: `Unknown competency tag "${tag}".`,
          fix: 'Use an id from COMPETENCY_IDS in types/competency.ts.',
        });
      }
    }

    if (lesson.estimatedMinutes <= 0) {
      issues.push({
        severity: 'error',
        scope: lessonScope,
        message: 'estimatedMinutes must be greater than zero.',
      });
    }

    if (lesson.competencyTags.length === 0) {
      issues.push({
        severity: 'warning',
        scope: lessonScope,
        message: 'No competency tags, so this lesson contributes to no skill axis.',
      });
    }

    if (lesson.completionCriteria.length === 0) {
      issues.push({
        severity: 'warning',
        scope: lessonScope,
        message: 'No completionCriteria defined.',
      });
    }

    if (lesson.objectives.length === 0) {
      issues.push({
        severity: 'warning',
        scope: lessonScope,
        message: 'No objectives defined.',
      });
    }

    if (lesson.practicalExercise.successCriteria.length === 0) {
      issues.push({
        severity: 'warning',
        scope: lessonScope,
        message: 'The practical exercise has no success criteria.',
      });
    }

    for (const resource of lesson.resources) {
      if (resource.url.trim() === '') {
        issues.push({
          severity: 'warning',
          scope: lessonScope,
          message: `Resource "${resource.title}" has no URL, so it renders as a link to nowhere.`,
          fix: 'Add the URL, or remove the resource until you have one.',
        });
      }
    }

    if (lesson.reflectionQuestion.trim() === '') {
      issues.push({
        severity: 'error',
        scope: lessonScope,
        message: 'reflectionQuestion is empty, so the lesson can never be completed.',
      });
    }
  }

  if (courseModule.project.moduleId !== courseModule.id) {
    issues.push({
      severity: 'error',
      scope: `project:${courseModule.project.slug}`,
      message: `moduleId "${courseModule.project.moduleId}" does not match owning module "${courseModule.id}".`,
    });
  }

  /* A module should claim every competency its lessons teach, or module-level
   * reporting under-counts what the learner actually covered. */
  const declared = new Set<string>(courseModule.competencies);
  for (const competency of new Set<string>(
    courseModule.lessons.flatMap((lesson) => lesson.competencyTags),
  )) {
    if (!declared.has(competency)) {
      issues.push({
        severity: 'warning',
        scope,
        message: `Lessons teach "${competency}" but the module does not declare it.`,
      });
    }
  }

  return issues;
}

/* -------------------------------------------------------------------------- */
/* Prerequisite graph                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Prerequisites must resolve and must point strictly backwards in course order.
 *
 * Requiring backwards-only edges does more than catch an ordering mistake: a
 * graph whose edges only ever point to lower indices cannot contain a cycle, so
 * this single rule also guarantees the dependency graph is acyclic without a
 * traversal.
 */
function checkPrerequisites(
  lessons: readonly LessonLocation[],
): readonly IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const indexById = new Map(lessons.map((entry, index) => [entry.lesson.id, index]));

  lessons.forEach(({ lesson, courseModule }, index) => {
    const scope = `lesson:${courseModule.slug}/${lesson.slug}`;

    for (const prerequisiteId of lesson.prerequisiteLessonIds ?? []) {
      if (prerequisiteId === lesson.id) {
        issues.push({
          severity: 'error',
          scope,
          message: 'Lists itself as a prerequisite.',
          fix: 'Remove this lesson\'s own id from prerequisiteLessonIds.',
        });
        continue;
      }

      const prerequisiteIndex = indexById.get(prerequisiteId);

      if (prerequisiteIndex === undefined) {
        issues.push({
          severity: 'error',
          scope,
          message: `Prerequisite "${prerequisiteId}" does not resolve to a lesson.`,
          fix: 'Correct the id, or remove it from prerequisiteLessonIds.',
        });
        continue;
      }

      if (prerequisiteIndex > index) {
        issues.push({
          severity: 'error',
          scope,
          message: `Prerequisite "${prerequisiteId}" comes later in the course, so it can never be met in order.`,
          fix: 'Point at an earlier lesson, or move this lesson later in the course.',
        });
      }
    }
  });

  return issues;
}

/* -------------------------------------------------------------------------- */
/* Report                                                                      */
/* -------------------------------------------------------------------------- */

export function checkCurriculumIntegrity(index: CurriculumIndex): IntegrityReport {
  const modules = index.getModules();
  const lessons = index.getAllLessons();
  const issues: IntegrityIssue[] = [];

  for (const duplicate of findDuplicates(modules.map((m) => m.id))) {
    issues.push({ severity: 'error', scope: 'course', message: `Duplicate module id "${duplicate}".` });
  }
  for (const duplicate of findDuplicates(modules.map((m) => m.slug))) {
    issues.push({ severity: 'error', scope: 'course', message: `Duplicate module slug "${duplicate}".` });
  }
  for (const duplicate of findDuplicates(modules.map((m) => String(m.moduleNumber)))) {
    issues.push({ severity: 'error', scope: 'course', message: `Duplicate moduleNumber ${duplicate}.` });
  }
  for (const duplicate of findDuplicates(lessons.map((l) => l.lesson.id))) {
    issues.push({ severity: 'error', scope: 'course', message: `Duplicate lesson id "${duplicate}".` });
  }
  for (const duplicate of findDuplicates(modules.map((m) => m.project.id))) {
    issues.push({ severity: 'error', scope: 'course', message: `Duplicate project id "${duplicate}".` });
  }

  for (const courseModule of modules) {
    issues.push(...checkModule(courseModule));
  }

  issues.push(...checkPrerequisites(lessons));

  for (const phase of index.getPhases()) {
    /* Phases are deliberately uneven — 3, 3, 4, 3, 2 — so each is checked
     * against the size it was designed to be rather than a single constant. */
    const designed = moduleCountForPhase(phase.phaseNumber);
    const phaseModules = index.getModulesInPhase(phase.id);

    if (phaseModules.length > designed) {
      issues.push({
        severity: 'error',
        scope: `phase:${phase.slug}`,
        message: `Has ${phaseModules.length} modules, more than the ${designed} this phase is designed to hold.`,
      });
    } else if (phaseModules.length < designed) {
      issues.push({
        severity: 'info',
        scope: `phase:${phase.slug}`,
        message: `${phaseModules.length} of ${designed} modules authored.`,
      });
    }
  }

  if (modules.length > TOTAL_MODULES) {
    issues.push({
      severity: 'error',
      scope: 'course',
      message: `${modules.length} modules, more than the ${TOTAL_MODULES} the course defines.`,
    });
  } else if (modules.length < TOTAL_MODULES) {
    issues.push({
      severity: 'info',
      scope: 'course',
      message: `${modules.length} of ${TOTAL_MODULES} modules authored.`,
    });
  }

  if (lessons.length < TOTAL_LESSONS) {
    issues.push({
      severity: 'info',
      scope: 'course',
      message: `${lessons.length} of ${TOTAL_LESSONS} lessons authored.`,
    });
  }

  const located = withFiles(issues, index);
  const errorCount = located.filter((issue) => issue.severity === 'error').length;

  return {
    issues: located,
    errorCount,
    warningCount: located.filter((issue) => issue.severity === 'warning').length,
    infoCount: located.filter((issue) => issue.severity === 'info').length,
    moduleCount: modules.length,
    lessonCount: lessons.length,
    isValid: errorCount === 0,
  };
}

/**
 * Throws with every structural fault listed, so a malformed curriculum fails
 * immediately and legibly instead of producing a subtly wrong interface.
 */
export function assertCurriculumIntegrity(index: CurriculumIndex): void {
  const report = checkCurriculumIntegrity(index);
  if (report.isValid) return;

  /* The point of this message is that a developer can act on it without
   * opening anything else: what is wrong, which file it is in, and the remedy
   * where there is an unambiguous one. */
  const details = report.issues
    .filter((issue) => issue.severity === 'error')
    .map((issue) => {
      const lines = [`  · [${issue.scope}] ${issue.message}`];
      if (issue.file !== undefined) lines.push(`      file: ${issue.file}`);
      if (issue.fix !== undefined) lines.push(`      fix:  ${issue.fix}`);
      return lines.join('\n');
    })
    .join('\n');

  throw new Error(
    `Curriculum integrity check failed with ${report.errorCount} error(s):\n${details}\n`,
  );
}
