/**
 * Theme mode.
 *
 * Stored as a bare string rather than through the persistence adapter: the
 * blocking script in the document head has to read it synchronously before
 * first paint, so the value must not be wrapped in a JSON envelope.
 *
 * "system" is represented by the absence of the data-theme attribute, which is
 * what lets the prefers-color-scheme rules in globals.css take over.
 */

import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from '@/lib/persistence/keys';

export const THEME_MODES = ['light', 'system', 'dark'] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;

/** Read only when the current key is empty, so an upgrade keeps the choice. */
const LEGACY_THEME_KEYS = LEGACY_STORAGE_KEYS.theme;

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function readStoredTheme(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(stored)) return stored;

    for (const legacyKey of LEGACY_THEME_KEYS) {
      const legacy = window.localStorage.getItem(legacyKey);
      if (isThemeMode(legacy)) return legacy;
    }

    return 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', mode);
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* Storage blocked; the theme still applies for this session. */
  }
}

/**
 * Runs before first paint to prevent a flash of the wrong theme.
 *
 * Reads the current key, then any legacy key, and applies the first valid
 * value. The legacy fallback matters: without it a learner who chose a theme
 * under the previous build gets a flash of the wrong one on every load until
 * they touch the control again, which looks exactly like losing the setting.
 *
 * Kept as a string because it is injected as an inline script, and deliberately
 * small and dependency-free — it runs before paint.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify([
  THEME_STORAGE_KEY,
  ...LEGACY_THEME_KEYS,
])};for(var i=0;i<k.length;i++){var m=localStorage.getItem(k[i]);if(m==='dark'||m==='light'){document.documentElement.setAttribute('data-theme',m);if(i>0){localStorage.setItem(k[0],m)}return}}}catch(e){}})()`;
