/**
 * The cloud representation of one learner's state.
 *
 * Deliberately the *existing* application shapes, not a new model. Every field
 * below is the same type the local stores already persist, so Stage 2 can move
 * data across without a translation layer and without touching the derivation
 * logic that reads it.
 *
 * What is NOT here, and why:
 *
 *   curriculum      modules, lessons, projects, resources and competencies stay
 *                   in the codebase. They are authored content, identical for
 *                   every user, and versioned with the application.
 *   activity        derived from progress timestamps by lib/progress/activity.
 *   completedLessons, statuses
 *                   derived by lib/progress/derive from recorded facts. Storing
 *                   a status would let the record and the rules disagree.
 *
 * Exercise and reflection answers are not separate collections either: they
 * already live inside each LessonProgressRecord, which is where the existing
 * code expects them.
 */

import { CURRICULUM_VERSION } from '@/lib/curriculum/version';
import { readLegacyArchive } from '@/lib/persistence/migrations';
import type { ProgressState } from '@/types/progress';
import type { Note } from '@/types/notes';
import type { ResourceMark } from '@/types/resources';
import type { ThemeMode } from '@/lib/theme/theme';

/**
 * Raised only when the payload shape changes in a way older clients cannot
 * read. Mirrors how the local stores version their envelopes.
 */
export const LEARNING_STATE_SCHEMA_VERSION = 1;

export interface LearningStatePreferences {
  readonly theme: ThemeMode;
}

export interface LearningStateData {
  /** Lessons (with their exercise and reflection answers), projects, and the
   *  lesson most recently opened — i.e. where to continue from. */
  readonly progress: ProgressState;
  readonly notes: Readonly<Record<string, Note>>;
  readonly resources: Readonly<Record<string, ResourceMark>>;
  readonly preferences: LearningStatePreferences;
}

export interface LearningState {
  readonly userId: string;
  readonly data: LearningStateData;
  readonly schemaVersion: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export const EMPTY_LEARNING_STATE_DATA: LearningStateData = {
  progress: {
    lessons: {},
    projects: {},
    lastVisitedLessonId: null,
    curriculumVersion: CURRICULUM_VERSION,
    legacy: null,
  },
  notes: {},
  resources: {},
  preferences: { theme: 'system' },
};

/**
 * Narrows an unknown payload read back from Postgres.
 *
 * The column is JSONB, so the database guarantees valid JSON and nothing more.
 * A row written by a newer client, or edited by hand in the dashboard, must not
 * be able to crash a render — missing sections fall back to empty ones, which
 * is the same forgiving posture the localStorage migrations already take.
 */
export function normalizeLearningStateData(value: unknown): LearningStateData {
  if (typeof value !== 'object' || value === null) return EMPTY_LEARNING_STATE_DATA;

  const record = value as Record<string, unknown>;
  const progress =
    typeof record.progress === 'object' && record.progress !== null
      ? (record.progress as Record<string, unknown>)
      : {};

  return {
    progress: {
      lessons: asRecord(progress.lessons) as ProgressState['lessons'],
      projects: asRecord(progress.projects) as ProgressState['projects'],
      curriculumVersion:
        typeof progress.curriculumVersion === 'number' ? progress.curriculumVersion : 0,
      legacy: readLegacyArchive(progress.legacy),
      lastVisitedLessonId:
        typeof progress.lastVisitedLessonId === 'string'
          ? progress.lastVisitedLessonId
          : null,
    },
    notes: asRecord(record.notes) as Readonly<Record<string, Note>>,
    resources: asRecord(record.resources) as Readonly<Record<string, ResourceMark>>,
    preferences: normalizePreferences(record.preferences),
  };
}

function asRecord(value: unknown): Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizePreferences(value: unknown): LearningStatePreferences {
  const record = asRecord(value);
  const theme = record.theme;
  return {
    theme: theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'system',
  };
}
