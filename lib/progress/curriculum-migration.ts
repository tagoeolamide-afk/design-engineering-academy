/**
 * Moving stored progress from one curriculum version to the next.
 *
 * The v1 -> v2 rewrite reassigned every lesson and project id, so there is no
 * pair of ids whose learning objective is "the same lesson, renamed". The
 * honest migration is therefore a reset of completion, not a remapping — and
 * the spec for this is explicit that correctness beats preserving a percentage.
 *
 * What is *not* reset: the learner's writing. Reflections, exercise notes and
 * project links are preserved inside the archive, and module-scoped notes are
 * re-scoped rather than left pointing at a module that now teaches a different
 * subject.
 *
 * Everything here is a pure function over stored state. Nothing is deleted;
 * records move into `legacy`, where the interface can show them.
 */

import { CURRICULUM_VERSION, LEGACY_CURRICULUM_VERSION } from '@/lib/curriculum/version';
import { getLessonById, getModuleById, getProjectById } from '@/lib/curriculum/queries';
import type {
  LessonProgressRecord,
  ProgressState,
  ProjectProgressRecord,
} from '@/types/progress';
import type { Note, NotesState } from '@/types/notes';

/* -------------------------------------------------------------------------- */
/* Assessing what a migration would do                                        */
/* -------------------------------------------------------------------------- */

export interface CurriculumMigrationPlan {
  /** True when stored progress refers to an older curriculum. */
  readonly needsUpgrade: boolean;
  readonly fromVersion: number;
  readonly toVersion: number;
  /** Records whose ids still resolve, and which therefore carry over untouched. */
  readonly keptLessonIds: readonly string[];
  readonly keptProjectIds: readonly string[];
  /** Records whose ids resolve to nothing in the current curriculum. */
  readonly archivedLessonIds: readonly string[];
  readonly archivedProjectIds: readonly string[];
  /**
   * How much writing the archived records contain. Reported because it is the
   * part the learner would mind losing, and the part the notice should name.
   */
  readonly archivedReflections: number;
  readonly archivedExerciseNotes: number;
  readonly archivedProjectLinks: number;
  /** Notes scoped to a lesson or project that no longer exists. */
  readonly orphanedNoteIds: readonly string[];
  /**
   * Notes scoped to a module id that still resolves but now teaches a different
   * subject. These are the silent mis-attributions.
   */
  readonly reattributedNoteIds: readonly string[];
}

/** Module ids whose subject changed between v1 and v2. */
const REASSIGNED_MODULE_IDS: ReadonlySet<string> = new Set([
  /* v1: Design Systems            -> v2: Accessibility for Design Engineers */
  'module-09',
  /* v1: Interaction and Motion    -> v2: Design Systems */
  'module-10',
  /* v1: Async Product States      -> v2: Data and Async Interfaces (renamed, same subject) */
  /* v1: Performance and Rendering -> v2: Motion and Interaction Quality */
  'module-12',
  /* v1: Product Architecture      -> v2: Performance, Testing and Design QA */
  'module-13',
  /* v1: Taste and Critique        -> v2: Product Architecture and Systems Thinking */
  'module-14',
  /* v1: AI-Assisted and Capstone  -> v2: Advanced Design Engineering and Capstone (renamed) */
]);

function countLinks(record: ProjectProgressRecord): number {
  return Object.values(record.links).filter((url) => url.trim() !== '').length;
}

export function planCurriculumMigration(
  progress: ProgressState,
  notes: NotesState,
): CurriculumMigrationPlan {
  const stored = progress.curriculumVersion;
  const fromVersion = stored === 0 ? LEGACY_CURRICULUM_VERSION : stored;

  const keptLessonIds: string[] = [];
  const archivedLessonIds: string[] = [];
  let archivedReflections = 0;
  let archivedExerciseNotes = 0;

  for (const [id, record] of Object.entries(progress.lessons)) {
    if (getLessonById(id) !== null) {
      keptLessonIds.push(id);
      continue;
    }
    archivedLessonIds.push(id);
    if (record.reflectionAnswer.trim() !== '') archivedReflections++;
    if (record.exerciseNotes.trim() !== '') archivedExerciseNotes++;
  }

  const keptProjectIds: string[] = [];
  const archivedProjectIds: string[] = [];
  let archivedProjectLinks = 0;

  for (const [id, record] of Object.entries(progress.projects)) {
    if (getProjectById(id) !== null) {
      keptProjectIds.push(id);
      continue;
    }
    archivedProjectIds.push(id);
    archivedProjectLinks += countLinks(record);
  }

  const orphanedNoteIds: string[] = [];
  const reattributedNoteIds: string[] = [];

  for (const note of Object.values(notes.notes)) {
    switch (note.scope.kind) {
      case 'lesson':
        if (getLessonById(note.scope.lessonId) === null) orphanedNoteIds.push(note.id);
        break;
      case 'project':
        if (getProjectById(note.scope.projectId) === null) orphanedNoteIds.push(note.id);
        break;
      case 'module':
        if (getModuleById(note.scope.moduleId) === null) orphanedNoteIds.push(note.id);
        else if (REASSIGNED_MODULE_IDS.has(note.scope.moduleId)) reattributedNoteIds.push(note.id);
        break;
      default:
        break;
    }
  }

  const hasLegacyRecords = archivedLessonIds.length > 0 || archivedProjectIds.length > 0;
  const hasNoteProblems = orphanedNoteIds.length > 0 || reattributedNoteIds.length > 0;

  return {
    /* Nothing to acknowledge if the version is current, and nothing to show if
     * an older version left no trace worth mentioning. */
    needsUpgrade:
      stored < CURRICULUM_VERSION && (hasLegacyRecords || hasNoteProblems),
    fromVersion,
    toVersion: CURRICULUM_VERSION,
    keptLessonIds,
    keptProjectIds,
    archivedLessonIds,
    archivedProjectIds,
    archivedReflections,
    archivedExerciseNotes,
    archivedProjectLinks,
    orphanedNoteIds,
    reattributedNoteIds,
  };
}

/** True when there is any stored progress at all, upgraded or not. */
export function hasAnyProgress(progress: ProgressState): boolean {
  return (
    Object.keys(progress.lessons).length > 0 || Object.keys(progress.projects).length > 0
  );
}

/* -------------------------------------------------------------------------- */
/* Applying it                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Moves unresolvable records into `legacy` and stamps the current version.
 *
 * Idempotent: running it on already-migrated state changes nothing but the
 * version stamp, and an existing archive is merged rather than replaced, so a
 * second upgrade cannot discard the first one's contents.
 */
export function applyCurriculumMigration(progress: ProgressState): ProgressState {
  const plan = planCurriculumMigration(progress, { notes: {} });

  const lessons: Record<string, LessonProgressRecord> = {};
  for (const id of plan.keptLessonIds) {
    const record = progress.lessons[id];
    if (record !== undefined) lessons[id] = record;
  }

  const projects: Record<string, ProjectProgressRecord> = {};
  for (const id of plan.keptProjectIds) {
    const record = progress.projects[id];
    if (record !== undefined) projects[id] = record;
  }

  const archivedLessons: Record<string, LessonProgressRecord> = {
    ...(progress.legacy?.lessons ?? {}),
  };
  for (const id of plan.archivedLessonIds) {
    const record = progress.lessons[id];
    if (record !== undefined) archivedLessons[id] = record;
  }

  const archivedProjects: Record<string, ProjectProgressRecord> = {
    ...(progress.legacy?.projects ?? {}),
  };
  for (const id of plan.archivedProjectIds) {
    const record = progress.projects[id];
    if (record !== undefined) archivedProjects[id] = record;
  }

  const hasArchive =
    Object.keys(archivedLessons).length > 0 || Object.keys(archivedProjects).length > 0;

  return {
    lessons,
    projects,
    /* A pointer at a lesson that no longer exists would send "continue" nowhere. */
    lastVisitedLessonId:
      progress.lastVisitedLessonId !== null &&
      getLessonById(progress.lastVisitedLessonId) !== null
        ? progress.lastVisitedLessonId
        : null,
    curriculumVersion: CURRICULUM_VERSION,
    legacy: hasArchive
      ? {
          fromCurriculumVersion: progress.legacy?.fromCurriculumVersion ?? plan.fromVersion,
          archivedAt: progress.legacy?.archivedAt ?? new Date().toISOString(),
          lessons: archivedLessons,
          projects: archivedProjects,
        }
      : (progress.legacy ?? null),
  };
}

/**
 * Re-scopes notes that would otherwise point somewhere misleading.
 *
 * A note about a lesson that no longer exists, or about a module that now
 * teaches a different subject, keeps its title and body and loses only its
 * scope. The original scope is recorded in the body so the learner can see what
 * it referred to — dropping that silently would be the data loss this whole
 * migration exists to avoid.
 */
export function migrateNotesForCurriculum(notes: NotesState): NotesState {
  const plan = planCurriculumMigration(
    { lessons: {}, projects: {}, lastVisitedLessonId: null, curriculumVersion: 0, legacy: null },
    notes,
  );

  const affected = new Set([...plan.orphanedNoteIds, ...plan.reattributedNoteIds]);
  if (affected.size === 0) return notes;

  const migrated: Record<string, Note> = {};

  for (const [id, note] of Object.entries(notes.notes)) {
    if (affected.has(id) === false) {
      migrated[id] = note;
      continue;
    }

    const describedScope = describeScope(note);
    migrated[id] = {
      ...note,
      scope: { kind: 'free' },
      body:
        note.body.trim() === ''
          ? `(Written against curriculum v1, ${describedScope}.)`
          : `${note.body}\n\n(Written against curriculum v1, ${describedScope}.)`,
    };
  }

  return { notes: migrated };
}

function describeScope(note: Note): string {
  switch (note.scope.kind) {
    case 'lesson':
      return `originally attached to ${note.scope.lessonId}`;
    case 'project':
      return `originally attached to ${note.scope.projectId}`;
    case 'module':
      return `originally attached to ${note.scope.moduleId}, which now covers a different subject`;
    default:
      return 'scope no longer resolvable';
  }
}
