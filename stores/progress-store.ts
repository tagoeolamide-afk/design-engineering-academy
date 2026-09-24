'use client';

/**
 * The progress store.
 *
 * Deliberately thin: it holds the two record maps and delegates every rule to
 * the pure transitions in lib/progress/records.ts. Nothing derived is stored,
 * so the persisted payload stays small and can never contradict itself.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  LEGACY_STORAGE_KEYS,
  PROGRESS_SCHEMA_VERSION,
  STORAGE_KEYS,
} from '@/lib/persistence/keys';
import { migrateProgress } from '@/lib/persistence/migrations';
import { createVersionedStorage } from '@/lib/persistence/versioned-storage';
import {
  createLessonRecord,
  createProjectRecord,
  normalizeLessonRecord,
  normalizeProjectRecord,
  nowTimestamp,
  withEndReached,
  withExerciseCompleted,
  withExerciseNotes,
  withProjectLink,
  withProjectNotes,
  withProjectReflection,
  withProjectStatus,
  withReflectionAnswer,
  withVisit,
} from '@/lib/progress/records';
import type {
  LessonProgressRecord,
  ProgressState,
  ProjectLinkKind,
  ProjectProgressRecord,
  ProjectStatus,
} from '@/types/progress';

interface ProgressActions {
  /** Called when a lesson route is opened; this is what starts a lesson. */
  visitLesson: (lessonId: string) => void;
  markLessonEndReached: (lessonId: string) => void;
  setExerciseCompleted: (lessonId: string, completed: boolean) => void;
  setExerciseNotes: (lessonId: string, notes: string) => void;
  setReflectionAnswer: (lessonId: string, answer: string) => void;

  setProjectStatus: (projectId: string, moduleId: string, status: ProjectStatus) => void;
  setProjectLink: (
    projectId: string,
    moduleId: string,
    kind: ProjectLinkKind,
    url: string,
  ) => void;
  setProjectNotes: (projectId: string, moduleId: string, notes: string) => void;
  setProjectReflection: (projectId: string, moduleId: string, answer: string) => void;

  resetLesson: (lessonId: string) => void;
  resetAllProgress: () => void;

  /**
   * Replaces everything with the cloud document.
   *
   * Used only by the sync layer on load and after an import. Kept as an action
   * rather than an external setState so the one place allowed to overwrite the
   * learner's work is named and greppable.
   */
  hydrateFromCloud: (state: ProgressState) => void;
}

interface ProgressHydration {
  /** False until the persisted payload has been read back in the browser. */
  readonly hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export type ProgressStore = ProgressState & ProgressActions & ProgressHydration;

const EMPTY_STATE: ProgressState = {
  lessons: {},
  projects: {},
  lastVisitedLessonId: null,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...EMPTY_STATE,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      visitLesson: (lessonId) =>
        set((state) => ({
          lessons: updateLesson(state, lessonId, (record) =>
            withVisit(record, nowTimestamp()),
          ),
          lastVisitedLessonId: lessonId,
        })),

      markLessonEndReached: (lessonId) =>
        set((state) => ({
          lessons: updateLesson(state, lessonId, (record) =>
            withEndReached(record, nowTimestamp()),
          ),
        })),

      setExerciseCompleted: (lessonId, completed) =>
        set((state) => ({
          lessons: updateLesson(state, lessonId, (record) =>
            withExerciseCompleted(record, completed, nowTimestamp()),
          ),
        })),

      setExerciseNotes: (lessonId, notes) =>
        set((state) => ({
          lessons: updateLesson(state, lessonId, (record) =>
            withExerciseNotes(record, notes, nowTimestamp()),
          ),
        })),

      setReflectionAnswer: (lessonId, answer) =>
        set((state) => ({
          lessons: updateLesson(state, lessonId, (record) =>
            withReflectionAnswer(record, answer, nowTimestamp()),
          ),
        })),

      setProjectStatus: (projectId, moduleId, status) =>
        set((state) => ({
          projects: updateProject(state, projectId, moduleId, (record) =>
            withProjectStatus(record, status, nowTimestamp()),
          ),
        })),

      setProjectLink: (projectId, moduleId, kind, url) =>
        set((state) => ({
          projects: updateProject(state, projectId, moduleId, (record) =>
            withProjectLink(record, kind, url, nowTimestamp()),
          ),
        })),

      setProjectNotes: (projectId, moduleId, notes) =>
        set((state) => ({
          projects: updateProject(state, projectId, moduleId, (record) =>
            withProjectNotes(record, notes, nowTimestamp()),
          ),
        })),

      setProjectReflection: (projectId, moduleId, answer) =>
        set((state) => ({
          projects: updateProject(state, projectId, moduleId, (record) =>
            withProjectReflection(record, answer, nowTimestamp()),
          ),
        })),

      resetLesson: (lessonId) =>
        set((state) => ({
          lessons: { ...state.lessons, [lessonId]: createLessonRecord(lessonId) },
        })),

      hydrateFromCloud: (state) =>
        set({
          lessons: state.lessons,
          projects: state.projects,
          lastVisitedLessonId: state.lastVisitedLessonId,
        }),

      resetAllProgress: () => {
        const { hasHydrated } = get();
        set({ ...EMPTY_STATE, hasHydrated });
      },
    }),
    {
      name: STORAGE_KEYS.progress,
      version: PROGRESS_SCHEMA_VERSION,
      storage: createJSONStorage(() =>
        createVersionedStorage(LEGACY_STORAGE_KEYS.progress),
      ),
      migrate: (persisted, fromVersion) => ({
        ...EMPTY_STATE,
        ...migrateProgress(persisted, fromVersion),
      }),
      partialize: (state): ProgressState => ({
        lessons: state.lessons,
        projects: state.projects,
        lastVisitedLessonId: state.lastVisitedLessonId,
      }),
      /* Marked hydrated even when rehydration failed. zustand calls this with
       * an undefined state on error, and a store that never reports hydration
       * leaves every dependent view pinned on its loading message. */
      onRehydrateStorage: () => (state, error) => {
        if (error !== undefined) {
          console.warn('[persistence] progress could not rehydrate; starting empty.', error);
        }
        (state ?? useProgressStore.getState()).setHasHydrated(true);
      },
    },
  ),
);

/* -------------------------------------------------------------------------- */
/* Internals                                                                   */
/* -------------------------------------------------------------------------- */

function updateLesson(
  state: ProgressState,
  lessonId: string,
  update: (record: LessonProgressRecord) => LessonProgressRecord,
): Readonly<Record<string, LessonProgressRecord>> {
  const stored = state.lessons[lessonId];
  const existing =
    stored === undefined ? createLessonRecord(lessonId) : normalizeLessonRecord(stored);
  const next = update(existing);
  if (next === existing) return state.lessons;
  return { ...state.lessons, [lessonId]: next };
}

function updateProject(
  state: ProgressState,
  projectId: string,
  moduleId: string,
  update: (record: ProjectProgressRecord) => ProjectProgressRecord,
): Readonly<Record<string, ProjectProgressRecord>> {
  const stored = state.projects[projectId];
  const existing =
    stored === undefined
      ? createProjectRecord(projectId, moduleId)
      : normalizeProjectRecord(stored);
  const next = update(existing);
  if (next === existing) return state.projects;
  return { ...state.projects, [projectId]: next };
}
