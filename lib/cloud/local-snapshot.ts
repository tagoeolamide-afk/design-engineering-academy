'use client';

/**
 * Reading and writing the in-memory stores as one learning-state document.
 *
 * This is the seam between the three existing Zustand stores and the single
 * cloud row. The stores keep their own shapes and actions untouched — every
 * component that reads them is unaffected — and this module only assembles and
 * applies the combined payload.
 */

import { useNotesStore } from '@/stores/notes-store';
import { useProgressStore } from '@/stores/progress-store';
import { useResourceStore } from '@/stores/resource-store';
import { readStoredTheme, applyTheme, THEME_STORAGE_KEY } from '@/lib/theme/theme';
import {
  EMPTY_LEARNING_STATE_DATA,
  normalizeLearningStateData,
  type LearningStateData,
} from './learning-state';

/** Everything currently held in memory, as the cloud document shape. */
export function readLocalLearningState(): LearningStateData {
  const progress = useProgressStore.getState();
  const notes = useNotesStore.getState();
  const resources = useResourceStore.getState();

  return {
    progress: {
      lessons: progress.lessons,
      projects: progress.projects,
      lastVisitedLessonId: progress.lastVisitedLessonId,
    },
    notes: notes.notes,
    resources: resources.marks,
    preferences: { theme: readStoredTheme() },
  };
}

/**
 * Replaces store contents with the cloud document.
 *
 * The theme is the one field not applied unconditionally. It is a device
 * preference read by a blocking script before React exists, so overwriting a
 * choice already made here would flip the interface after paint. It is adopted
 * only when this device has never chosen — which is exactly the new-device case
 * the preference is worth syncing for.
 */
export function applyLearningState(data: LearningStateData): void {
  useProgressStore.getState().hydrateFromCloud(data.progress);
  useNotesStore.getState().hydrateFromCloud(data.notes);
  useResourceStore.getState().hydrateFromCloud(data.resources);

  let deviceHasTheme = false;
  try {
    deviceHasTheme = window.localStorage.getItem(THEME_STORAGE_KEY) !== null;
  } catch {
    deviceHasTheme = true; /* Storage blocked: leave the current theme alone. */
  }

  if (!deviceHasTheme) applyTheme(data.preferences.theme);
}

/**
 * Whether the device holds learning work worth offering to import.
 *
 * "Meaningful" means the learner actually did something — opened a lesson,
 * wrote a note, marked a resource. An empty record map, or lesson records with
 * no timestamps at all, is just the shape of a store that has never been used
 * and must not trigger a migration prompt.
 */
export function hasMeaningfulProgress(data: LearningStateData): boolean {
  const lessonTouched = Object.values(data.progress.lessons).some(
    (record) =>
      record.startedAt !== null ||
      record.reachedEndAt !== null ||
      record.exerciseCompletedAt !== null ||
      record.reflectionAnsweredAt !== null ||
      record.exerciseNotes.trim() !== '' ||
      record.reflectionAnswer.trim() !== '',
  );

  return (
    lessonTouched ||
    Object.keys(data.progress.projects).length > 0 ||
    Object.keys(data.notes).length > 0 ||
    Object.keys(data.resources).length > 0
  );
}

/**
 * A short human summary of what would be imported, for the prompt.
 *
 * Counts only, and only of things the learner would recognise. Deciding whether
 * to keep work is easier when the offer says how much work it is.
 */
export interface LocalProgressSummary {
  readonly lessonsTouched: number;
  readonly reflections: number;
  readonly projects: number;
  readonly notes: number;
  readonly resources: number;
}

export function summarizeLocalProgress(data: LearningStateData): LocalProgressSummary {
  const lessons = Object.values(data.progress.lessons);

  return {
    lessonsTouched: lessons.filter(
      (record) => record.startedAt !== null || record.reachedEndAt !== null,
    ).length,
    reflections: lessons.filter((record) => record.reflectionAnswer.trim() !== '').length,
    projects: Object.keys(data.progress.projects).length,
    notes: Object.keys(data.notes).length,
    resources: Object.keys(data.resources).length,
  };
}

/** Normalises whatever the stores hold before it is sent to the cloud. */
export function readLocalLearningStateForUpload(): LearningStateData {
  return normalizeLearningStateData(readLocalLearningState());
}

export { EMPTY_LEARNING_STATE_DATA };
