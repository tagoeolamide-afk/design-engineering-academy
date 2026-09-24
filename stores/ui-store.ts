'use client';

/**
 * Ephemeral shell state.
 *
 * Deliberately not persisted: which overlay is open is a property of the
 * current session, not something to restore on the next visit. It lives in a
 * store rather than React context because the triggers (sidebar, mobile header,
 * a global shortcut) sit in different parts of the tree.
 */

import { create } from 'zustand';

/**
 * Whatever had focus when the palette was asked to open.
 *
 * Radix restores focus to its own Dialog.Trigger, and this palette has none —
 * it is opened from three different places and from a global shortcut. So the
 * origin is captured here, in the action, which runs synchronously inside the
 * click or keydown handler while the real element still has focus. Held outside
 * the store's state because it is a DOM node, not something to render.
 */
let focusOrigin: HTMLElement | null = null;

function captureFocusOrigin(): void {
  if (typeof document === 'undefined') return;
  const active = document.activeElement;
  focusOrigin = active instanceof HTMLElement ? active : null;
}

/** Returns the captured element once, clearing it so it cannot be reused. */
export function consumeFocusOrigin(): HTMLElement | null {
  const origin = focusOrigin;
  focusOrigin = null;
  return origin;
}

interface UiState {
  readonly isCommandPaletteOpen: boolean;
  readonly isMobileNavOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isCommandPaletteOpen: false,
  isMobileNavOpen: false,
  setCommandPaletteOpen: (open) => {
    if (open) captureFocusOrigin();
    set({ isCommandPaletteOpen: open });
  },
  /* Opening the palette from the drawer should leave one overlay, not two.
   * The drawer captures its origin for the same reason the palette does: it is
   * opened from a plain button rather than a Dialog.Trigger, so Radix has
   * nothing to restore focus to when it closes. */
  setMobileNavOpen: (open) => {
    if (open) captureFocusOrigin();
    set({ isMobileNavOpen: open });
  },
}));
