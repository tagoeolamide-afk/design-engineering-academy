'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Delay after the last keystroke before an autosave is written. */
export const AUTOSAVE_DELAY_MS = 600;

export type SaveStatus = 'idle' | 'pending' | 'saved';

export interface Autosave {
  readonly status: SaveStatus;
  /** Call from a change handler after updating the draft; restarts the delay. */
  readonly markEdited: () => void;
  /** Writes immediately. Bound to onBlur so leaving a field always commits. */
  readonly flush: () => void;
}

/**
 * Debounced saving for scratch space — the notes surface and project notes.
 *
 * `commit` closes over the current draft, so it is a different function on
 * every keystroke. It is held in a ref and the timer depends on an edit
 * counter instead: depending on the closure directly would restart the timer
 * on every render and the write would never fire, and depending on nothing
 * would fire once after the *first* keystroke rather than the last.
 *
 * A pending edit is also written on unmount. Blur covers the ordinary paths —
 * clicking another note, opening the palette — but a route change can unmount
 * the editor without one, and losing what someone just typed is not an
 * acceptable outcome of navigating.
 */
export function useAutosave(commit: () => void): Autosave {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [edit, setEdit] = useState(0);

  const commitRef = useRef(commit);
  const statusRef = useRef(status);

  useEffect(() => {
    commitRef.current = commit;
    statusRef.current = status;
  });

  const write = useCallback(() => {
    commitRef.current();
    setStatus('saved');
  }, []);

  const markEdited = useCallback(() => {
    setStatus('pending');
    setEdit((count) => count + 1);
  }, []);

  const flush = useCallback(() => {
    if (statusRef.current !== 'pending') return;
    write();
  }, [write]);

  useEffect(() => {
    if (status !== 'pending') return;

    const timer = setTimeout(write, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status, edit, write]);

  useEffect(
    () => () => {
      /* Unmount. Reads through the refs because this cleanup is created once. */
      if (statusRef.current === 'pending') commitRef.current();
    },
    [],
  );

  return { status, markEdited, flush };
}
