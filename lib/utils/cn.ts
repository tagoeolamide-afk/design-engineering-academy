import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be taught this project's type scale.
 *
 * Without this, it cannot tell `text-small` (a font size) from
 * `text-text-muted` (a colour) — both look like `text-*` — and treats them as
 * one conflicting group, so whichever is written last silently deletes the
 * other. That produced an unreadable primary button: the size class dropped the
 * foreground colour and left near-white text on a light accent fill.
 *
 * Declaring the font-size names explicitly puts every other `text-*` class in
 * the colour group, where it belongs.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'heading', 'body', 'small', 'caption', 'code'] }],
    },
  },
});

/** Conditional class names with later Tailwind utilities winning over earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
