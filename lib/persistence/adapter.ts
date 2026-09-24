/**
 * Persistence abstraction.
 *
 * Everything that stores learner data goes through this interface rather than
 * touching localStorage directly. Two reasons: the app renders on the server
 * where localStorage does not exist, and the storage target is expected to
 * change (a file, a local database) without the stores having to care.
 */

export interface PersistenceAdapter {
  readonly name: 'local-storage' | 'memory';
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Used on the server, and as the fallback when the browser denies storage. */
export function createMemoryAdapter(): PersistenceAdapter {
  const store = new Map<string, string>();
  return {
    name: 'memory',
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

/**
 * Every call is guarded: Safari private mode and blocked site data both throw
 * on access, and a learning app must not crash because storage is unavailable.
 */
export function createLocalStorageAdapter(): PersistenceAdapter {
  return {
    name: 'local-storage',
    getItem: (key) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        /* Quota exceeded or storage blocked; the session continues in memory. */
      }
    },
    removeItem: (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* See above. */
      }
    },
  };
}

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__dea_probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

let cachedAdapter: PersistenceAdapter | null = null;

/** The adapter the application should use. Resolved once per runtime. */
export function resolvePersistenceAdapter(): PersistenceAdapter {
  if (cachedAdapter === null) {
    cachedAdapter = isLocalStorageAvailable()
      ? createLocalStorageAdapter()
      : createMemoryAdapter();
  }
  return cachedAdapter;
}
