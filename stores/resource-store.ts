'use client';

/**
 * Marks on library resources.
 *
 * Its own persisted key rather than a slice of progress: the library is
 * curated content that changes when the catalogue changes, and keeping its
 * marks separate means a curriculum migration never has to reason about them.
 * A progress reset still clears it, because a mark is an activity record.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { RESOURCES_SCHEMA_VERSION, STORAGE_KEYS } from '@/lib/persistence/keys';
import { migrateResourceLibrary } from '@/lib/persistence/migrations';
import { createVersionedStorage } from '@/lib/persistence/versioned-storage';
import { nowTimestamp } from '@/lib/progress/records';
import type { ResourceLibraryState, ResourceStatus } from '@/types/resources';

interface ResourceActions {
  /**
   * Sets the status, or clears it when the same status is applied again —
   * pressing "Saved" on something already saved un-saves it, which is what the
   * control looks like it should do.
   */
  toggleResourceStatus: (resourceId: string, status: ResourceStatus) => void;
  clearResourceStatus: (resourceId: string) => void;
  clearAllResourceMarks: () => void;

  /**
   * Replaces everything with the cloud document.
   *
   * Used only by the sync layer on load and after an import. Kept as an action
   * rather than an external setState so the one place allowed to overwrite the
   * learner's work is named and greppable.
   */
  hydrateFromCloud: (marks: ResourceLibraryState['marks']) => void;
}

interface ResourceHydration {
  readonly hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export type ResourceStore = ResourceLibraryState & ResourceActions & ResourceHydration;

export const useResourceStore = create<ResourceStore>()(
  persist(
    (set) => ({
      marks: {},
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      toggleResourceStatus: (resourceId, status) =>
        set((state) => {
          const current = state.marks[resourceId];

          if (current?.status === status) {
            const { [resourceId]: _removed, ...rest } = state.marks;
            return { marks: rest };
          }

          return {
            marks: {
              ...state.marks,
              [resourceId]: { resourceId, status, markedAt: nowTimestamp() },
            },
          };
        }),

      clearResourceStatus: (resourceId) =>
        set((state) => {
          const { [resourceId]: _removed, ...rest } = state.marks;
          return { marks: rest };
        }),

      clearAllResourceMarks: () => set({ marks: {} }),

      hydrateFromCloud: (marks) => set({ marks }),
    }),
    {
      name: STORAGE_KEYS.resources,
      version: RESOURCES_SCHEMA_VERSION,
      storage: createJSONStorage(() => createVersionedStorage()),
      migrate: (persisted, fromVersion) => migrateResourceLibrary(persisted, fromVersion),
      partialize: (state): ResourceLibraryState => ({ marks: state.marks }),
      /* Marked hydrated even when rehydration failed. zustand calls this with
       * an undefined state on error, and a store that never reports hydration
       * leaves every dependent view pinned on its loading message. */
      onRehydrateStorage: () => (state, error) => {
        if (error !== undefined) {
          console.warn('[persistence] resources could not rehydrate; starting empty.', error);
        }
        (state ?? useResourceStore.getState()).setHasHydrated(true);
      },
    },
  ),
);
