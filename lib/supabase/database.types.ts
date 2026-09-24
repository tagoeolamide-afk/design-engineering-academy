/**
 * The database shape, hand-written to match supabase/migrations.
 *
 * Hand-written rather than generated because the schema is one table and a
 * generation step would be more machinery than the thing it describes. If the
 * schema grows, replace this with `supabase gen types typescript`.
 *
 * Declared with `type` rather than `interface` deliberately. postgrest-js
 * constrains every table to `Record<string, unknown>`, and TypeScript only
 * gives *type aliases* an implicit index signature — an interface silently
 * fails that constraint, the table resolves to `never`, and every insert stops
 * type-checking with a message that never mentions the real cause.
 *
 * `data` carries the learning-state payload rather than a loose Json blob, so
 * writing the wrong shape is an error here instead of a surprise at runtime.
 */

import type { LearningStateData } from '@/lib/cloud/learning-state';

export type UserLearningStateRow = {
  user_id: string;
  data: LearningStateData;
  schema_version: number;
  created_at: string;
  updated_at: string;
};

export type UserLearningStateInsert = {
  user_id: string;
  data: LearningStateData;
  schema_version?: number;
  created_at?: string;
  updated_at?: string;
};

export type UserLearningStateUpdate = {
  data?: LearningStateData;
  schema_version?: number;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      user_learning_state: {
        Row: UserLearningStateRow;
        Insert: UserLearningStateInsert;
        Update: UserLearningStateUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
