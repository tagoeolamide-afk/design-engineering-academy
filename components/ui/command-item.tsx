import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CommandItemProps {
  readonly label: string;
  readonly icon?: LucideIcon | undefined;
  /** Secondary text on the right, e.g. the section a result belongs to. */
  readonly hint?: string;
  readonly shortcut?: string;
  /** Driven by the palette's cursor, which both the keyboard and the pointer move. */
  readonly selected?: boolean;
  /** Lets the pointer move the cursor, so hover and Enter never disagree. */
  readonly onHover?: () => void;
  readonly onSelect: () => void;
  /** Lets the palette scroll the active row into view. */
  readonly id?: string;
}

/**
 * A single row in the command palette.
 *
 * Rendered as an option inside a listbox: the input keeps focus while the
 * cursor moves, so the active row is announced through aria-activedescendant
 * rather than by moving DOM focus. Selection is shown with a surface change and
 * a leading rule, not by colour alone.
 *
 * Pointing at a row moves the cursor to it. Without that, the row under the
 * pointer and the row Enter would open could be two different rows.
 */
export function CommandItem({
  label,
  icon: Icon,
  hint,
  shortcut,
  selected = false,
  onSelect,
  onHover,
  id,
}: CommandItemProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseDown={(event) => {
        /* Keep focus in the search input so typing is never interrupted. */
        event.preventDefault();
      }}
      className={cn(
        'relative flex min-h-11 cursor-pointer items-center gap-2.5 rounded-medium px-2.5 py-1.5 text-small active:bg-surface-active md:min-h-9',
        selected
          ? 'bg-surface-hover text-text-primary before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-accent'
          : 'text-text-secondary',
      )}
    >
      {Icon !== undefined && (
        <Icon
          aria-hidden
          size={15}
          strokeWidth={1.75}
          className={cn('shrink-0', selected ? 'text-text-primary' : 'text-text-muted')}
        />
      )}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {hint !== undefined && (
        <span className="shrink-0 text-caption uppercase text-text-muted">{hint}</span>
      )}
      {shortcut !== undefined && (
        <kbd className="shrink-0 rounded-small bg-surface-active px-1.5 py-0.5 font-mono text-caption text-text-muted">
          {shortcut}
        </kbd>
      )}
    </li>
  );
}
