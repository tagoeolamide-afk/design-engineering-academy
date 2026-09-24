'use client';

import { useSyncExternalStore } from 'react';

/** Never notifies: the value is constant per environment, so nothing changes. */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False during server render and the first client render, true afterwards.
 *
 * Anything whose value differs between the server and the browser — persisted
 * progress, which storage backend is available — must be gated on this so the
 * first client render still matches the server markup and React can hydrate.
 *
 * Implemented with useSyncExternalStore rather than a mount flag in an effect:
 * it expresses "this value differs between server and client" directly, and
 * avoids the cascading render a setState-in-effect would cause.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
