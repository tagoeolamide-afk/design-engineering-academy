/**
 * Migrations for persisted state.
 *
 * Everything here treats stored data as untrusted. It was written by an older
 * build, it may have been hand-edited in devtools, and it may be truncated or
 * half-written. A migration that assumes a shape and throws would take the
 * whole application down on load, so each step reads defensively and falls back
 * to a valid empty value rather than failing.
 *
 * The rule for adding a version: write the step, raise the number in keys.ts,
 * and add a test that feeds in the previous shape and asserts nothing was lost.
 */

import { CURRICULUM_VERSION } from '@/lib/curriculum/version';
import { createLessonRecord, createProjectRecord } from '@/lib/progress/records';
import {
  PROJECT_STATUSES,
  type LegacyProgressArchive,
  type LessonProgressRecord,
  type ProgressState,
  type ProjectLinks,
  type ProjectProgressRecord,
  type ProjectStatus,
} from '@/types/progress';
import type { Note, NoteScope, NotesState } from '@/types/notes';
import type { ResourceLibraryState, ResourceMark } from '@/types/resources';
import { isResourceStatus } from '@/types/resources';

/* -------------------------------------------------------------------------- */
/* Shared readers                                                              */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

/** A value that must be a non-empty string, or absent. */
function asStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value !== '' ? value : null;
}

/** Timestamps are strings too, but naming the intent keeps call sites honest. */
const asTimestampOrNull = asStringOrNull;

function asBoolean(value: unknown): boolean {
  return value === true;
}

/**
 * Statuses were once not-started / started / submitted / completed. The scale
 * is now five stages, so the two retired values are mapped to their nearest
 * meaning rather than dropped — a submitted project was awaiting review, and a
 * started one had begun without saying how far.
 */
const RETIRED_PROJECT_STATUSES: Readonly<Record<string, ProjectStatus>> = {
  started: 'building',
  submitted: 'reviewing',
};

function asProjectStatus(value: unknown): ProjectStatus {
  if (PROJECT_STATUSES.includes(value as ProjectStatus)) return value as ProjectStatus;
  if (typeof value === 'string') {
    return RETIRED_PROJECT_STATUSES[value] ?? 'not-started';
  }
  return 'not-started';
}

/**
 * A single submissionUrl became four named links. Guessing which one it was
 * beats discarding it: a github.com address is a repository, and anything else
 * is most likely the deployed build.
 */
function readLinks(value: unknown, legacyUrl: string): ProjectLinks {
  const links = isRecord(value) ? value : {};
  const base: ProjectLinks = {
    figma: asString(links.figma),
    github: asString(links.github),
    live: asString(links.live),
    caseStudy: asString(links.caseStudy),
  };

  if (legacyUrl === '') return base;
  if (base.github !== '' || base.live !== '') return base;

  return legacyUrl.includes('github.com')
    ? { ...base, github: legacyUrl }
    : { ...base, live: legacyUrl };
}

/* -------------------------------------------------------------------------- */
/* Progress                                                                    */
/* -------------------------------------------------------------------------- */

export const EMPTY_PROGRESS_STATE: ProgressState = {
  lessons: {},
  projects: {},
  lastVisitedLessonId: null,
  curriculumVersion: CURRICULUM_VERSION,
  legacy: null,
};

function readLessonRecord(id: string, value: unknown): LessonProgressRecord {
  const base = createLessonRecord(id);
  if (!isRecord(value)) return base;

  return {
    lessonId: id,
    startedAt: asTimestampOrNull(value.startedAt),
    lastVisitedAt: asTimestampOrNull(value.lastVisitedAt),
    /* v1 stored a boolean `reachedEnd` before it became a timestamp. Keep the
     * fact by dating it to the last visit, which is the closest thing the old
     * record knows. */
    reachedEndAt:
      asTimestampOrNull(value.reachedEndAt) ??
      (asBoolean(value.reachedEnd) ? asTimestampOrNull(value.lastVisitedAt) : null),
    exerciseCompletedAt: asTimestampOrNull(value.exerciseCompletedAt),
    exerciseNotes: asString(value.exerciseNotes),
    reflectionAnswer: asString(value.reflectionAnswer),
    reflectionAnsweredAt: asTimestampOrNull(value.reflectionAnsweredAt),
  };
}

function readProjectRecord(id: string, value: unknown): ProjectProgressRecord {
  if (!isRecord(value)) return createProjectRecord(id, '');

  return {
    projectId: id,
    moduleId: asString(value.moduleId),
    status: asProjectStatus(value.status),
    startedAt: asTimestampOrNull(value.startedAt),
    completedAt: asTimestampOrNull(value.completedAt),
    /* The retired submittedAt is the best surviving record of the last move. */
    statusUpdatedAt:
      asTimestampOrNull(value.statusUpdatedAt) ?? asTimestampOrNull(value.submittedAt),
    links: readLinks(value.links, asString(value.submissionUrl)),
    notes: asString(value.notes),
    reflectionAnswer: asString(value.reflectionAnswer),
    reflectionAnsweredAt: asTimestampOrNull(value.reflectionAnsweredAt),
  };
}

/**
 * Reads an archive of records from a previous curriculum version.
 *
 * Tolerant like everything else here: a malformed archive becomes no archive
 * rather than an exception, because a learner whose archive is unreadable
 * should still be able to open the application.
 */
export function readLegacyArchive(value: unknown): LegacyProgressArchive | null {
  if (!isRecord(value)) return null;

  const lessonsInput = isRecord(value.lessons) ? value.lessons : {};
  const projectsInput = isRecord(value.projects) ? value.projects : {};

  const lessons: Record<string, LessonProgressRecord> = {};
  for (const [id, record] of Object.entries(lessonsInput)) {
    lessons[id] = readLessonRecord(id, record);
  }

  const projects: Record<string, ProjectProgressRecord> = {};
  for (const [id, record] of Object.entries(projectsInput)) {
    projects[id] = readProjectRecord(id, record);
  }

  if (Object.keys(lessons).length === 0 && Object.keys(projects).length === 0) return null;

  return {
    fromCurriculumVersion:
      typeof value.fromCurriculumVersion === 'number' ? value.fromCurriculumVersion : 1,
    archivedAt: asTimestampOrNull(value.archivedAt) ?? new Date(0).toISOString(),
    lessons,
    projects,
  };
}

/**
 * Brings any stored progress payload up to the current shape.
 *
 * Written as a single tolerant read rather than a chain of per-version steps:
 * every field is optional in practice, so reading each one defensively handles
 * v1, a partially written v2, and anything in between with one code path. When
 * a genuinely structural change arrives — a field that has to be *computed*
 * from old data rather than defaulted — that is the point to split this into
 * versioned steps.
 */
export function migrateProgress(persisted: unknown, _fromVersion: number): ProgressState {
  if (!isRecord(persisted)) return EMPTY_PROGRESS_STATE;

  const lessonsInput = isRecord(persisted.lessons) ? persisted.lessons : {};
  const projectsInput = isRecord(persisted.projects) ? persisted.projects : {};

  const lessons: Record<string, LessonProgressRecord> = {};
  for (const [id, value] of Object.entries(lessonsInput)) {
    lessons[id] = readLessonRecord(id, value);
  }

  const projects: Record<string, ProjectProgressRecord> = {};
  for (const [id, value] of Object.entries(projectsInput)) {
    projects[id] = readProjectRecord(id, value);
  }

  return {
    lessons,
    projects,
    /* Added in v2. Absent in v1, which simply means "no lesson open yet". */
    lastVisitedLessonId: asStringOrNull(persisted.lastVisitedLessonId),
    /* Absent means written before curriculum versioning, i.e. curriculum v1.
     * Zero rather than 1 so "not stated" stays distinguishable from "stated as
     * 1" — the upgrade notice only fires on the former. */
    curriculumVersion: typeof persisted.curriculumVersion === 'number' ? persisted.curriculumVersion : 0,
    legacy: readLegacyArchive(persisted.legacy),
  };
}

/* -------------------------------------------------------------------------- */
/* Notes                                                                       */
/* -------------------------------------------------------------------------- */

export const EMPTY_NOTES_STATE: NotesState = { notes: {} };

function readScope(value: unknown): NoteScope {
  if (!isRecord(value)) return { kind: 'free' };

  switch (value.kind) {
    case 'lesson':
      return {
        kind: 'lesson',
        lessonId: asString(value.lessonId),
        moduleId: asString(value.moduleId),
      };
    case 'module':
      return { kind: 'module', moduleId: asString(value.moduleId) };
    case 'project':
      return {
        kind: 'project',
        projectId: asString(value.projectId),
        moduleId: asString(value.moduleId),
      };
    default:
      return { kind: 'free' };
  }
}

function readNote(id: string, value: unknown): Note | null {
  if (!isRecord(value)) return null;

  const createdAt = asTimestampOrNull(value.createdAt);
  const updatedAt = asTimestampOrNull(value.updatedAt);

  return {
    id,
    title: asString(value.title),
    body: asString(value.body),
    scope: readScope(value.scope),
    tags: Array.isArray(value.tags)
      ? value.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    /* A note with no timestamps is still the learner's writing. Dating it to
     * the epoch keeps it at the bottom of "recently edited" rather than
     * throwing it away. */
    createdAt: createdAt ?? updatedAt ?? new Date(0).toISOString(),
    updatedAt: updatedAt ?? createdAt ?? new Date(0).toISOString(),
  };
}

export function migrateNotes(persisted: unknown, _fromVersion: number): NotesState {
  if (!isRecord(persisted)) return EMPTY_NOTES_STATE;

  const notesInput = isRecord(persisted.notes) ? persisted.notes : {};
  const notes: Record<string, Note> = {};

  for (const [id, value] of Object.entries(notesInput)) {
    const note = readNote(id, value);
    if (note !== null) notes[id] = note;
  }

  return { notes };
}

/* -------------------------------------------------------------------------- */
/* Resource library                                                           */
/* -------------------------------------------------------------------------- */

const EMPTY_RESOURCE_LIBRARY_STATE: ResourceLibraryState = { marks: {} };

function readResourceMark(resourceId: string, value: unknown): ResourceMark | null {
  if (!isRecord(value)) return null;

  const status = typeof value.status === 'string' ? value.status : null;
  if (status === null || !isResourceStatus(status)) return null;

  return {
    resourceId,
    status,
    markedAt:
      typeof value.markedAt === 'string' ? value.markedAt : new Date(0).toISOString(),
  };
}

/**
 * Marks for resources that no longer exist are dropped rather than kept: the
 * library is curated content, and a mark with nothing to attach to is noise.
 */
export function migrateResourceLibrary(
  persisted: unknown,
  _fromVersion: number,
): ResourceLibraryState {
  if (!isRecord(persisted)) return EMPTY_RESOURCE_LIBRARY_STATE;

  const marksInput = isRecord(persisted.marks) ? persisted.marks : {};
  const marks: Record<string, ResourceMark> = {};

  for (const [id, value] of Object.entries(marksInput)) {
    const mark = readResourceMark(id, value);
    if (mark !== null) marks[id] = mark;
  }

  return { marks };
}
