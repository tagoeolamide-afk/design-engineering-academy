'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { Divider } from '@/components/ui/divider';
import { consumeFocusOrigin, useUiStore } from '@/stores/ui-store';
import { Wordmark } from './logo';
import { SidebarNav } from './sidebar-nav';
import { SidebarProgress } from './sidebar-progress';
import { ThemeControl } from './theme-control';

/**
 * The drawer carries the same navigation, theme control, and progress readout
 * as the desktop sidebar — mobile loses the persistent chrome, not the
 * functionality.
 *
 * Radix Dialog handles the focus trap and marks the rest of the page inert.
 * Focus restoration is handled here rather than by Radix: the drawer opens from
 * the header button through the store, not from a Dialog.Trigger, so Radix has
 * no element to return focus to and would drop it on the body.
 */
export function MobileNav() {
  const isOpen = useUiStore((state) => state.isMobileNavOpen);
  const setOpen = useUiStore((state) => state.setMobileNavOpen);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-canvas/70 backdrop-blur-[2px] data-[state=open]:animate-[overlay-in_120ms_ease-out] md:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            const origin = consumeFocusOrigin();
            if (origin === null || !document.contains(origin)) return;
            event.preventDefault();
            origin.focus();
          }}
          className="fixed inset-y-0 left-0 z-50 flex w-[17rem] max-w-[85vw] flex-col border-r border-border bg-canvas data-[state=open]:animate-[drawer-in_180ms_cubic-bezier(0.22,1,0.36,1)] md:hidden"
        >
          <VisuallyHidden asChild>
            <Dialog.Title>Navigation</Dialog.Title>
          </VisuallyHidden>

          <div className="flex h-14 items-center justify-between gap-2 px-3">
            <Wordmark />
            <Dialog.Close asChild>
              <IconButton label="Close navigation" size="touch">
                <X aria-hidden size={18} strokeWidth={1.75} />
              </IconButton>
            </Dialog.Close>
          </div>

          <Divider />

          <div className="flex-1 overflow-y-auto p-2">
            <SidebarNav touch onNavigate={() => setOpen(false)} />
          </div>

          <Divider />

          <div className="p-2">
            <div className="flex items-center justify-between gap-2 px-2.5 py-2">
              <span className="text-caption uppercase text-text-muted">Theme</span>
              <ThemeControl />
            </div>
            <SidebarProgress />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
