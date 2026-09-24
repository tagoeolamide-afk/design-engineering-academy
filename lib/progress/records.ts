/**
 * Factories and transitions for progress records.
 *
 * Every mutation the store performs is expressed here as a pure function from
 * an old record to a new one. The store stays a thin container; the rules about
 * what a mutation implies (visiting a lesson starts it, clearing a reflection
 * clears its timestamp) live in one testable place.
 */

import type {
  LessonProgressRecord,
  ProjectLinkKind,
  ProjectProgressRecord,
  ProjectStatus,
  Timestamp,
} from '@/types/progress';

export function nowTimestamp(): Timestamp {
  return new Date().toISOString();
}

export function createLessonRecord(lessonId: string): LessonProgressRecord {
  return {
    lessonId,
    startedAt: null,
    lastVisitedAt: null,
    reachedEndAt: null,
    exerciseCompletedAt: null,
    exerciseNotes: '',
    reflectionAnswer: '',
    reflectionAnsweredAt: null,
  };
}

export function createProjectRecord(
  projectId: string,
  moduleId: string,
): ProjectProgressRecord {
  return {
    projectId,
    moduleId,
    status: 'not-started',
    startedAt: null,
    completedAt: null,
    statusUpdatedAt: null,
    links: { figma: '', github: '', live: '', caseStudy: '' },
    notes: '',
    reflectionAnswer: '',
    reflectionAnsweredAt: null,
  };
}

/**
 * Fills any field a stored record predates.
 *
 * Progress is persisted, so a record written before a field existed comes back
 * missing it — typed as present, undefined at runtime. Normalising on read
 * means a new field can be added without bumping the storage version, which
 * would orphan the learner's existing progress.
 */
export function normalizeLessonRecord(
  record: LessonProgressRecord,
): LessonProgressRecord {
  return { ...createLessonRecord(record.lessonId), ...record };
}

/** The same protection for project records, which also gained fields. */
export function normalizeProjectRecord(
  record: ProjectProgressRecord,
): ProjectProgressRecord {
  const base = createProjectRecord(record.projectId, record.moduleId);
  return { ...base, ...record, links: { ...base.links, ...record.links } };
}

/** Opening a lesson starts it; the first visit is what sets startedAt. */
export function withVisit(
  record: LessonProgressRecord,
  at: Timestamp,
): LessonProgressRecord {
  return {
    ...record,
    startedAt: record.startedAt ?? at,
    lastVisitedAt: at,
  };
}

export function withEndReached(
  record: LessonProgressRecord,
  at: Timestamp,
): LessonProgressRecord {
  if (record.reachedEndAt !== null) return record;
  return { ...record, startedAt: record.startedAt ?? at, reachedEndAt: at };
}

export function withExerciseCompleted(
  record: LessonProgressRecord,
  completed: boolean,
  at: Timestamp,
): LessonProgressRecord {
  if (completed === (record.exerciseCompletedAt !== null)) return record;
  return {
    ...record,
    startedAt: record.startedAt ?? at,
    exerciseCompletedAt: completed ? at : null,
  };
}

/**
 * A reflection counts as answered only when it has non-whitespace content, so
 * clearing the field correctly un-completes the lesson.
 */
export function withReflectionAnswer(
  record: LessonProgressRecord,
  answer: string,
  at: Timestamp,
): LessonProgressRecord {
  const answered = answer.trim().length > 0;
  return {
    ...record,
    startedAt: record.startedAt ?? at,
    reflectionAnswer: answer,
    reflectionAnsweredAt: answered ? (record.reflectionAnsweredAt ?? at) : null,
  };
}

/**
 * Moves a project to a status.
 *
 * Going back to "not started" clears the dates rather than leaving a record
 * that claims to have been started and finished while reading as untouched.
 * Moving backwards from completed — say from completed to reviewing because
 * something was wrong — clears `completedAt` for the same reason: the module it
 * belongs to is no longer complete, and the stored facts must say so.
 */
export function withProjectStatus(
  record: ProjectProgressRecord,
  status: ProjectStatus,
  at: Timestamp,
): ProjectProgressRecord {
  if (status === record.status) return record;

  if (status === 'not-started') {
    return {
      ...record,
      status,
      startedAt: null,
      completedAt: null,
      statusUpdatedAt: at,
    };
  }

  return {
    ...record,
    status,
    startedAt: record.startedAt ?? at,
    completedAt: status === 'completed' ? (record.completedAt ?? at) : null,
    statusUpdatedAt: at,
  };
}

/** Links are stored verbatim; nothing here judges where the work lives. */
export function withProjectLink(
  record: ProjectProgressRecord,
  kind: ProjectLinkKind,
  url: string,
  at: Timestamp,
): ProjectProgressRecord {
  if (record.links[kind] === url) return record;

  return {
    ...record,
    startedAt: record.startedAt ?? at,
    links: { ...record.links, [kind]: url },
  };
}

export function withProjectNotes(
  record: ProjectProgressRecord,
  notes: string,
  at: Timestamp,
): ProjectProgressRecord {
  if (record.notes === notes) return record;
  return { ...record, startedAt: record.startedAt ?? at, notes };
}

/** Mirrors the lesson rule: whitespace is not an answer. */
export function withProjectReflection(
  record: ProjectProgressRecord,
  answer: string,
  at: Timestamp,
): ProjectProgressRecord {
  const answered = answer.trim().length > 0;

  return {
    ...record,
    startedAt: record.startedAt ?? at,
    reflectionAnswer: answer,
    reflectionAnsweredAt: answered ? (record.reflectionAnsweredAt ?? at) : null,
  };
}

/**
 * Exercise notes are free scratch space, so they are stored verbatim and never
 * affect whether the exercise counts as done. Writing a note does start the
 * lesson, because it is evidence the learner is working on it.
 */
export function withExerciseNotes(
  record: LessonProgressRecord,
  notes: string,
  at: Timestamp,
): LessonProgressRecord {
  if (notes === record.exerciseNotes) return record;
  return { ...record, startedAt: record.startedAt ?? at, exerciseNotes: notes };
}
