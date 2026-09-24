'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useUiStore } from '@/stores/ui-store';
import { isNavItemActive, NAV_ITEMS } from './nav-items';

function noop(): void {}

interface SidebarNavProps {
  /** Touch surfaces get taller rows to clear the 44px minimum. */
  readonly touch?: boolean;
  /** Called after a destination is chosen, so the mobile drawer can close. */
  readonly onNavigate?: () => void;
}

export function SidebarNav({ touch = false, onNavigate = noop }: SidebarNavProps) {
  const pathname = usePathname();
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);

  const rowClass = cn(
    'group relative flex items-center gap-2.5 rounded-medium px-2.5 text-small transition-colors duration-100',
    touch ? 'min-h-11' : 'h-8',
  );

  return (
    <nav aria-label="Primary" className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(pathname, item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            onClick={onNavigate}
            className={cn(
              rowClass,
              /* The active row is marked by a filled surface AND a leading
               * rule, so it does not rely on colour alone. */
              active
                ? 'bg-surface-hover font-medium text-text-primary before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-accent'
                : 'text-text-secondary hover:bg-surface-hover active:bg-surface-active hover:text-text-primary',
            )}
          >
            <Icon
              aria-hidden
              size={15}
              strokeWidth={1.75}
              className={cn('shrink-0', active ? 'text-text-primary' : 'text-text-muted')}
            />
            {item.label}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => {
          onNavigate();
          setCommandPaletteOpen(true);
        }}
        className={cn(
          rowClass,
          'mt-0.5 justify-between text-text-secondary hover:bg-surface-hover active:bg-surface-active hover:text-text-primary',
        )}
      >
        <span className="flex items-center gap-2.5">
          <Search aria-hidden size={15} strokeWidth={1.75} className="shrink-0 text-text-muted" />
          Search
        </span>
        <kbd className="hidden rounded-small bg-surface-active px-1.5 py-0.5 font-mono text-caption text-text-muted md:inline-block">
          ⌘K
        </kbd>
      </button>
    </nav>
  );
}
