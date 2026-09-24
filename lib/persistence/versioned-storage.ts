/**
 * Storage wrapper that adopts data written under an older key, and refuses to
 * hand back anything unreadable.
 *
 * When the current key is empty, the legacy keys are read in order and the
 * first hit is returned as though it had been stored under the new name. The
 * store then migrates it and writes it forward, so the adoption happens exactly
 * once and the learner never notices an upgrade.
 *
 * Legacy keys are never written to. Clearing them is the responsibility of
 * reset, which must remove them as well — otherwise the next page load would
 * re-adopt the copy the learner just asked to delete.
 *
 * Corruption is handled here rather than left to the store. A value that is not
 * parseable JSON makes zustand's rehydration throw, which leaves `hasHydrated`
 * false forever and pins every progress-dependent view on its loading state.
 * One damaged key would brick the interface with no route out that a learner
 * would ever find, so unreadable values are treated as absent and recorded.
 */

import type { StateStorage } from 'zustand/middleware';
import { resolvePersistenceAdapter } from './adapter';

/** Keys whose stored value could not be read on this page load. */
const recoveries: string[] = [];

/**
 * Keys that were found damaged and skipped. Read by Settings so the learner is
 * told their data could not be read, rather than silently starting from zero
 * and being left to wonder where their progress went.
 */
export function getStorageRecoveries(): readonly string[] {
  return [...new Set(recoveries)];
}

/** Test seam: recoveries persist for the page's lifetime otherwise. */
export function clearStorageRecoveries(): void {
  recoveries.length = 0;
}

/**
 * True when `value` is JSON the store could actually rehydrate. Persisted
 * envelopes are always objects, so a bare string or number is damage too.
 */
function isReadable(value: string): boolean {
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
}

function readKey(adapter: ReturnType<typeof resolvePersistenceAdapter>, key: string) {
  const raw = adapter.getItem(key);
  if (raw === null) return null;
  if (isReadable(raw)) return raw;

  recoveries.push(key);
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[persistence] "${key}" could not be read and was skipped. The store starts empty and will overwrite it on the next change.`,
    );
  }
  return null;
}

export function createVersionedStorage(
  legacyKeys: readonly string[] = [],
): StateStorage {
  const adapter = resolvePersistenceAdapter();

  return {
    getItem: (name) => {
      const current = readKey(adapter, name);
      if (current !== null) return current;

      for (const legacyKey of legacyKeys) {
        const legacy = readKey(adapter, legacyKey);
        if (legacy !== null) return legacy;
      }

      return null;
    },
    setItem: (name, value) => {
      adapter.setItem(name, value);
    },
    removeItem: (name) => {
      adapter.removeItem(name);
    },
  };
}

/** Removes every listed key, current and legacy. Used by reset. */
export function clearStorageKeys(keys: readonly string[]): void {
  const adapter = resolvePersistenceAdapter();
  for (const key of keys) adapter.removeItem(key);
}
