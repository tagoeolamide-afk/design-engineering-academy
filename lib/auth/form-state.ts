/**
 * The shape every authentication form action returns.
 *
 * Kept out of the actions module because a `'use server'` file may only export
 * async functions — a constant or a type alongside them is a build error.
 */

export interface AuthFormState {
  readonly error: string | null;
  readonly message: string | null;
}

export const EMPTY_AUTH_STATE: AuthFormState = { error: null, message: null };
