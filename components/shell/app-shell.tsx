import type { ReactNode } from 'react';
import Link from 'next/link';
import { CloudLoadError } from '@/components/cloud/cloud-load-error';
import { CurriculumUpgradeNotice } from '@/components/curriculum/curriculum-upgrade-notice';
import { SyncStatus } from '@/components/cloud/sync-status';
import { Divider } from '@/components/ui/divider';
import { CommandPalette } from './command-palette';
import { Wordmark } from './logo';
import { MobileHeader } from './mobile-header';
import { MobileNav } from './mobile-nav';
import { SidebarNav } from './sidebar-nav';
import { SidebarProgress } from './sidebar-progress';
import { ThemeControl } from './theme-control';

/**
 * The application frame.
 *
 * Desktop: a fixed 248px sidebar — mark, primary navigation, search, then a
 * footer holding the theme control and the progress readout — beside a single
 * scrolling content column.
 *
 * Mobile: a compact header opens the same content as a drawer. The landmarks
 * (banner, navigation, main, contentinfo) are real elements, so screen-reader
 * users get the same structure the layout implies visually.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <a
        href="#main"
        className="sr-only z-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-medium focus:border focus:border-border focus:bg-surface-elevated focus:px-3 focus:py-2 focus:text-small focus:shadow-overlay"
      >
        Skip to content
      </a>

      <aside className="sticky top-0 hidden h-screen w-62 shrink-0 flex-col border-r border-border bg-surface/40 md:flex">
        <div className="flex h-14 items-center px-3">
          <Link href="/" className="min-w-0 rounded-medium px-2.5 py-1">
            <Wordmark />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <SidebarNav />
        </div>

        <footer className="px-2 pb-2">
          <Divider className="mb-2" />
          <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
            <span className="text-caption uppercase text-text-muted">Theme</span>
            <ThemeControl />
          </div>
          <SidebarProgress />
          {/* Silent unless a save is in flight or has failed. */}
          <SyncStatus />
        </footer>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        {/* Only rendered when the cloud load failed; the application keeps
            working on whatever this device holds. */}
        <CloudLoadError />
        {/* Only rendered when stored progress refers to an older curriculum. */}
        <CurriculumUpgradeNotice />
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>

      <MobileNav />
      <CommandPalette />
    </div>
  );
}
