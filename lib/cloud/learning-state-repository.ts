/**
 * The only place in the application that reads or writes user_learning_state.
 *
 * Components never hold a Supabase client for learning state. Keeping the
 * queries here means the table name, the upsert semantics and the
 * one-row-per-user rule are stated once, and Stage 2 can move the local stores
 * onto the cloud by changing this file's callers rather than hunting queries
 * spread across the component tree.
 *
 * Every method is client-agnostic: pass the browser client or a request-bound
 * server client and the same code works in both places.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import {
  EMPTY_LEARNING_STATE_DATA,
  LEARNING_STATE_SCHEMA_VERSION,
  normalizeLearningStateData,
  type LearningState,
  type LearningStateData,
} from './learning-state';

const TABLE = 'user_learning_state';

/** Postgres code for "no rows returned by a single-row query". */
const NO_ROWS = 'PGRST116';

export type LearningStateClient = SupabaseClient<Database>;

export class LearningStateError extends Error {
  constructor(
    message: string,
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'LearningStateError';
  }
}

function toLearningState(row: {
  user_id: string;
  data: unknown;
  schema_version: number;
  created_at: string;
  updated_at: string;
}): LearningState {
  return {
    userId: row.user_id,
    data: normalizeLearningStateData(row.data),
    schemaVersion: row.schema_version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * The caller's row, or null when they have never saved anything.
 *
 * No user_id filter is passed. RLS restricts the result to the caller's own
 * row, and adding a client-side filter would imply the security lives here —
 * it does not, it lives in the database policies.
 */
export async function getLearningState(
  client: LearningStateClient,
): Promise<LearningState | null> {
  const { data, error } = await client
    .from(TABLE)
    .select('user_id, data, schema_version, created_at, updated_at')
    .maybeSingle();

  if (error !== null) {
    if (error.code === NO_ROWS) return null;
    throw new LearningStateError('Could not read learning state.', error);
  }
  if (data === null) return null;

  return toLearningState(data);
}

/**
 * Creates the row for a user who does not have one.
 *
 * user_id must be passed explicitly because the INSERT policy checks it
 * against auth.uid(); a mismatched id is rejected by the database.
 */
export async function createLearningState(
  client: LearningStateClient,
  userId: string,
  data: LearningStateData = EMPTY_LEARNING_STATE_DATA,
): Promise<LearningState> {
  const { data: row, error } = await client
    .from(TABLE)
    .insert({ user_id: userId, data, schema_version: LEARNING_STATE_SCHEMA_VERSION })
    .select('user_id, data, schema_version, created_at, updated_at')
    .single();

  if (error !== null || row === null) {
    throw new LearningStateError('Could not create learning state.', error);
  }

  return toLearningState(row);
}

/**
 * Writes the whole payload, creating the row if it is missing.
 *
 * Upsert on the primary key is what makes "exactly one row per user" safe
 * without a read-then-write, which two tabs could interleave.
 */
export async function saveLearningState(
  client: LearningStateClient,
  userId: string,
  data: LearningStateData,
): Promise<LearningState> {
  const { data: row, error } = await client
    .from(TABLE)
    .upsert(
      { user_id: userId, data, schema_version: LEARNING_STATE_SCHEMA_VERSION },
      { onConflict: 'user_id' },
    )
    .select('user_id, data, schema_version, created_at, updated_at')
    .single();

  if (error !== null || row === null) {
    throw new LearningStateError('Could not save learning state.', error);
  }

  return toLearningState(row);
}

/**
 * Applies a change to the stored payload.
 *
 * Read-modify-write, so the caller does not have to hold the whole state to
 * change one section. Last write wins, which is correct for a single learner on
 * one device at a time and is the assumption Stage 2 will revisit if syncing
 * two devices at once ever matters.
 */
export async function updateLearningState(
  client: LearningStateClient,
  userId: string,
  update: (current: LearningStateData) => LearningStateData,
): Promise<LearningState> {
  const existing = await getLearningState(client);
  const current = existing?.data ?? EMPTY_LEARNING_STATE_DATA;
  return saveLearningState(client, userId, update(current));
}

/** Removes the row. The account itself is untouched. */
export async function deleteLearningState(client: LearningStateClient): Promise<void> {
  const { error } = await client.from(TABLE).delete().not('user_id', 'is', null);

  if (error !== null) {
    throw new LearningStateError('Could not delete learning state.', error);
  }
}

/* -------------------------------------------------------------------------- */
/* Conflict-aware saving                                                       */
/* -------------------------------------------------------------------------- */

export type GuardedSaveResult =
  | { readonly ok: true; readonly state: LearningState }
  | { readonly ok: false; readonly reason: 'conflict'; readonly current: LearningState | null };

/**
 * Saves only if the row has not moved since it was read.
 *
 * `expectedUpdatedAt` is the timestamp this client last saw. It goes into the
 * WHERE clause, so a row another device has since written matches nothing and
 * updates zero rows — the write is refused rather than silently flattening the
 * newer version. Postgres evaluates it, so two tabs cannot interleave a
 * read-then-write and both believe they won.
 *
 * Deliberately not a merge. For one person on a couple of devices, telling them
 * plainly that something newer exists is more honest, and far less likely to
 * corrupt anything, than guessing how to combine two states.
 */
export async function saveLearningStateIfUnchanged(
  client: LearningStateClient,
  userId: string,
  data: LearningStateData,
  expectedUpdatedAt: string,
): Promise<GuardedSaveResult> {
  const { data: rows, error } = await client
    .from(TABLE)
    .update({ data, schema_version: LEARNING_STATE_SCHEMA_VERSION })
    .eq('user_id', userId)
    .eq('updated_at', expectedUpdatedAt)
    .select('user_id, data, schema_version, created_at, updated_at');

  if (error !== null) {
    throw new LearningStateError('Could not save learning state.', error);
  }

  const row = rows?.[0];
  if (row !== undefined) return { ok: true, state: toLearningState(row) };

  /* Zero rows: either somebody else wrote first, or the row is gone. Read back
   * so the caller can show what the cloud actually holds. */
  return { ok: false, reason: 'conflict', current: await getLearningState(client) };
}
