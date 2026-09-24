/**
 * A stand-in for the Supabase client, covering exactly the query shapes the
 * learning-state repository uses.
 *
 * Built so the sync engine can be tested for real — load, save, debounce,
 * conflict, failure and recovery — without a live project. It models the two
 * behaviours that actually matter: a single row keyed by user, and an
 * `updated_at` that the database moves on every write, which is what the
 * conflict guard depends on.
 */

import type { LearningStateData } from '@/lib/cloud/learning-state';

interface Row {
  user_id: string;
  data: LearningStateData;
  schema_version: number;
  created_at: string;
  updated_at: string;
}

export interface FakeSupabase {
  /** The client to hand to the repository. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- stands in for the generated client surface
  client: any;
  row: Row | null;
  /** Requests served, so tests can assert writes were coalesced. */
  counts: { select: number; insert: number; upsert: number; update: number };
  /** When set, every request rejects with this error. */
  failWith: Error | null;
  /** Simulates another device writing between this client's read and write. */
  touchFromAnotherDevice: (data?: Partial<LearningStateData>) => void;
}

let clock = 0;
function nextTimestamp(): string {
  clock += 1000;
  return new Date(Date.UTC(2026, 0, 1) + clock).toISOString();
}

export function createFakeSupabase(initial: Row | null = null): FakeSupabase {
  const state: FakeSupabase = {
    client: null,
    row: initial,
    counts: { select: 0, insert: 0, upsert: 0, update: 0 },
    failWith: null,
    touchFromAnotherDevice: (patch) => {
      if (state.row === null) return;
      state.row = {
        ...state.row,
        data: { ...state.row.data, ...patch },
        updated_at: nextTimestamp(),
      };
    },
  };

  const guard = () => {
    if (state.failWith !== null) throw state.failWith;
  };

  function selectable(rows: Row[]) {
    return {
      maybeSingle: async () => {
        guard();
        return { data: rows[0] ?? null, error: null };
      },
      single: async () => {
        guard();
        if (rows[0] === undefined) {
          return { data: null, error: { code: 'PGRST116', message: 'no rows' } };
        }
        return { data: rows[0], error: null };
      },
      /* The guarded update awaits the builder directly. */
      then: (resolve: (value: { data: Row[]; error: null }) => unknown) => {
        guard();
        return Promise.resolve(resolve({ data: rows, error: null }));
      },
    };
  }

  state.client = {
    from: () => ({
      select: () => {
        guard();
        state.counts.select += 1;
        return selectable(state.row === null ? [] : [state.row]);
      },

      insert: (values: { user_id: string; data: LearningStateData; schema_version: number }) => {
        guard();
        state.counts.insert += 1;
        const stamp = nextTimestamp();
        const inserted: Row = { ...values, created_at: stamp, updated_at: stamp };
        state.row = inserted;
        return { select: () => selectable([inserted]) };
      },

      upsert: (values: { user_id: string; data: LearningStateData; schema_version: number }) => {
        guard();
        state.counts.upsert += 1;
        const created = state.row?.created_at ?? nextTimestamp();
        const upserted: Row = { ...values, created_at: created, updated_at: nextTimestamp() };
        state.row = upserted;
        return { select: () => selectable([upserted]) };
      },

      update: (values: { data: LearningStateData; schema_version: number }) => {
        guard();
        state.counts.update += 1;
        const filters: Record<string, string> = {};

        const builder = {
          eq: (column: string, value: string) => {
            filters[column] = value;
            return builder;
          },
          select: () => {
            const current = state.row;
            const matches =
              current !== null &&
              (filters.user_id === undefined || filters.user_id === current.user_id) &&
              (filters.updated_at === undefined || filters.updated_at === current.updated_at);

            if (!matches) return selectable([]);

            const updated: Row = { ...current, ...values, updated_at: nextTimestamp() };
            state.row = updated;
            return selectable([updated]);
          },
        };
        return builder;
      },
    }),
  };

  return state;
}

export function makeRow(data: LearningStateData, userId = 'user-1'): Row {
  const stamp = nextTimestamp();
  return {
    user_id: userId,
    data,
    schema_version: 1,
    created_at: stamp,
    updated_at: stamp,
  };
}
