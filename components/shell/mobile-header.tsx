'use client';

import { Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { IconButton } from '@/components/ui/icon-button';
import { useUiStore } from '@/stores/ui-store';
import { Wordmark } from './logo';

/**
 * Compact header for small viewports: drawer trigger, mark, search. Both
 * controls are 44px so they clear the touch minimum.
 */
export function MobileHeader() {
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const setCommandPaletteOpen = useUiStore((state) => state.setCommandPaletteOpen);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-1 border-b border-border bg-canvas/85 px-2 backdrop-blur-sm md:hidden">
      <IconButton
        label="Open navigation"
        size="touch"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu aria-hidden size={18} strokeWidth={1.75} />
      </IconButton>

      <Link href="/" className="min-w-0 flex-1 rounded-medium px-1 py-1">
        <Wordmark />
      </Link>

      <IconButton
        label="Search"
        size="touch"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search aria-hidden size={18} strokeWidth={1.75} />
      </IconButton>
    </header>
  );
}
