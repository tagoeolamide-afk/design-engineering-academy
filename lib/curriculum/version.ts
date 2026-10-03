/**
 * The curriculum version.
 *
 * Raised when the authored curriculum changes enough that stored progress can
 * no longer be read at face value. This is not the persistence schema version
 * in lib/persistence/keys.ts — that tracks the *shape* of stored records, this
 * tracks the *meaning* of the ids inside them.
 *
 * v1 -> v2 is the rewrite that replaced positional lesson ids (`lesson-01-01`)
 * with content-derived ones (`lesson-what-makes-an-interface-interactive`), and
 * reordered modules so that module 9 became Accessibility rather than Design
 * Systems. Two consequences follow, and they are why this constant exists:
 *
 *   Lesson and project records keyed by a v1 id match nothing in v2. The
 *   derivation layer already skips records it cannot resolve, so they never
 *   inflate a percentage — but they would sit in storage forever, invisible.
 *
 *   Module ids did *not* change. `module-09` is still a valid id, so a note
 *   scoped to it still resolves — to a module about a different subject. That
 *   one is a silent mis-attribution rather than a dropped record, which makes
 *   it the more dangerous of the two.
 */
export const CURRICULUM_VERSION = 2;

/**
 * The version assumed when a stored payload does not say.
 *
 * Anything written before this constant existed is v1 by definition.
 */
export const LEGACY_CURRICULUM_VERSION = 1;
