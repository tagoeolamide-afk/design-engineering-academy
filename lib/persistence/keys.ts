/**
 * Storage keys and schema versions.
 *
 * Keys are stable and carry no version. An earlier design put the version in
 * the key — `dea:progress:v1` — which meant bumping the version silently
 * orphaned everything the learner had done: the new build simply looked in a
 * different place and found nothing. That is the opposite of migration support.
 *
 * The version now lives *inside* the stored envelope, so raising it runs a
 * migration over the existing data instead of abandoning it.
 */

export const STORAGE_NAMESPACE = 'dea';

export const STORAGE_KEYS = {
  progress: `${STORAGE_NAMESPACE}:progress`,
  notes: `${STORAGE_NAMESPACE}:notes`,
  resources: `${STORAGE_NAMESPACE}:resources`,
  /** Written as a bare string so the blocking theme script can read it fast. */
  theme: `${STORAGE_NAMESPACE}:theme`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Keys written by earlier builds, newest first.
 *
 * Read once when the current key is empty, so an upgrade adopts existing
 * progress rather than starting the learner from zero. They are never written
 * to again, and a reset clears them as well — otherwise a reset would be undone
 * by the next page load re-adopting the legacy copy.
 */
export const LEGACY_STORAGE_KEYS = {
  progress: [`${STORAGE_NAMESPACE}:progress:v1`],
  notes: [`${STORAGE_NAMESPACE}:notes:v1`],
  theme: [`${STORAGE_NAMESPACE}:theme:v1`],
} as const;

/**
 * Schema versions for each persisted store.
 *
 * Raise one only when the stored shape changes, and add the matching step to
 * lib/persistence/migrations.ts in the same commit.
 */
export const PROGRESS_SCHEMA_VERSION = 2;
export const RESOURCES_SCHEMA_VERSION = 1;
export const NOTES_SCHEMA_VERSION = 2;

/** Everything a progress reset should remove, current and legacy. */
export const RESETTABLE_PROGRESS_KEYS: readonly string[] = [
  STORAGE_KEYS.progress,
  ...LEGACY_STORAGE_KEYS.progress,
  /* Resource marks are activity records, not authored content, so a progress
   * reset clears them too. Notes stay, because the learner wrote those. */
  STORAGE_KEYS.resources,
];

/** Everything a notes reset should remove, current and legacy. */
export const RESETTABLE_NOTES_KEYS: readonly string[] = [
  STORAGE_KEYS.notes,
  ...LEGACY_STORAGE_KEYS.notes,
];
