'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ArrowUpRight, CornerDownLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Route } from 'next';
import { CommandItem } from '@/components/ui/command-item';
import { useNotes, useNotesHydrated } from '@/lib/hooks/use-notes';
import { useProgressHydrated, useRecommendedAction } from '@/lib/hooks/use-progress';
import { buildCommands } from '@/lib/search/commands';
import { buildNoteDocuments, getCurriculumDocuments } from '@/lib/search/documents';
import { flattenGroups, groupResults, search } from '@/lib/search/rank';
import type { SearchDocument } from '@/lib/search/types';
import { consumeFocusOrigin, useUiStore } from '@/stores/ui-store';

/**
 * Global search and commands.
 *
 * Radix Dialog handles the parts that are easy to get wrong — focus trap,
 * focus restoration to whatever opened it, Escape, and inert background. The
 * list is a combobox: focus stays in the input while the cursor moves, and the
 * active row is announced through aria-activedescendant.
 *
 * Results are grouped by type but the keyboard cursor runs through them as one
 * flat list, so arrowing never stalls at a group boundary.
 */
export function CommandPalette() {
  const router = useRouter();
  const isOpen = useUiStore((state) => state.isCommandPaletteOpen);
  const setOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);

  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const action = useRecommendedAction();
  const progressHydrated = useProgressHydrated();
  const notes = useNotes();
  const notesHydrated = useNotesHydrated();

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setCursor(0);
  }, [setOpen]);

  const navigate = useCallback(
    (href: string) => {
      /* Every href here is produced from the curriculum or a fixed command, so
       * the cast is asserting what the route map already guarantees. */
      router.push(href as Route);
    },
    [router],
  );

  const commands = useMemo(
    () => buildCommands({ action, hydrated: progressHydrated, navigate }),
    [action, progressHydrated, navigate],
  );

  const noteDocuments = useMemo(
    () => (notesHydrated ? buildNoteDocuments(Object.fromEntries(notes.map((n) => [n.id, n]))) : []),
    [notes, notesHydrated],
  );

  /* The curriculum half is built once and cached across opens; only the
   * learner's notes and the context-aware commands are rebuilt. */
  const documents = useMemo(
    () => [...commands, ...getCurriculumDocuments(), ...noteDocuments],
    [commands, noteDocuments],
  );

  const groups = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed === '') {
      /* Nothing typed: offer the commands rather than a sample of content.
       * A list of arbitrary lessons would be decoration. */
      return groupResults(
        commands.map((document) => ({ document, score: 0 })),
        { ordered: false, limit: Number.POSITIVE_INFINITY },
      );
    }
    return groupResults(search(documents, trimmed), { ordered: true });
  }, [commands, documents, query]);

  const flat = useMemo(() => flattenGroups(groups), [groups]);

  /* Rows render group by group but the cursor runs across all of them, so each
   * row looks up its position in the flat list rather than counting as it goes. */
  const indexById = useMemo(
    () => new Map(flat.map((document, index) => [document.id, index])),
    [flat],
  );

  /* The cursor must never point past a shrinking result list. */
  const activeIndex = flat.length === 0 ? -1 : Math.min(cursor, flat.length - 1);
  const active = activeIndex === -1 ? undefined : flat[activeIndex];

  const runDocument = useCallback(
    (document: SearchDocument) => {
      if (document.run !== undefined) {
        document.run();
      } else if (document.external === true) {
        window.open(document.href, '_blank', 'noopener,noreferrer');
      } else {
        navigate(document.href);
      }
      close();
    },
    [close, navigate],
  );

  /* Global shortcut, bound on the document so it works from anywhere. It is
   * allowed to fire from inside inputs too: Cmd+K is not text entry, and a
   * learner writing a note is exactly who wants to jump somewhere. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!isShortcut) return;

      event.preventDefault();
      setMobileNavOpen(false);
      setOpen(!useUiStore.getState().isCommandPaletteOpen);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [setOpen, setMobileNavOpen]);

  useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (flat.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setCursor((current) => (current + 1) % flat.length);
        return;
      case 'ArrowUp':
        event.preventDefault();
        setCursor((current) => (current - 1 + flat.length) % flat.length);
        return;
      case 'Home':
        event.preventDefault();
        setCursor(0);
        return;
      case 'End':
        event.preventDefault();
        setCursor(flat.length - 1);
        return;
      case 'Enter':
        if (active === undefined) return;
        event.preventDefault();
        runDocument(active);
        return;
      default:
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (open) setOpen(true);
        else close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-canvas/70 backdrop-blur-[2px] data-[state=open]:animate-[overlay-in_120ms_ease-out]" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            /* Radix would restore focus to a Dialog.Trigger, which this palette
             * does not have — it opens from the sidebar, the mobile header, or
             * a global shortcut. Restore to whatever actually had focus. */
            const origin = consumeFocusOrigin();
            if (origin === null || !document.contains(origin)) return;
            event.preventDefault();
            origin.focus();
          }}
          className="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-large border border-border bg-surface-elevated shadow-overlay data-[state=open]:animate-[dialog-in_140ms_ease-out]"
        >
          <VisuallyHidden asChild>
            <Dialog.Title>Search and commands</Dialog.Title>
          </VisuallyHidden>

          <div className="flex items-center gap-2.5 border-b border-border px-3">
            <Search aria-hidden size={15} strokeWidth={1.75} className="text-text-muted" />
            <input
              autoFocus
              type="text"
              role="combobox"
              aria-expanded
              aria-controls="command-results"
              aria-activedescendant={
                activeIndex === -1 ? undefined : `command-option-${activeIndex}`
              }
              aria-label="Search lessons, projects, competencies, notes and commands"
              placeholder="Search or run a command…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCursor(0);
              }}
              onKeyDown={onInputKeyDown}
              className="h-11 w-full bg-transparent text-small text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>

          {flat.length === 0 ? (
            <p className="px-3 py-6 text-center text-small text-text-muted">
              Nothing matches “{query.trim()}”.
            </p>
          ) : (
            <div
              ref={listRef}
              id="command-results"
              role="listbox"
              aria-label="Search results"
              className="max-h-[min(60vh,26rem)] overflow-y-auto p-1.5"
            >
              {groups.map((group) => (
                <div key={group.type} role="group" aria-label={group.label}>
                  <p className="px-2.5 pb-1 pt-2.5 text-caption uppercase text-text-muted">
                    {group.label}
                  </p>
                  <ul>
                    {group.results.map(({ document }) => {
                      const index = indexById.get(document.id) ?? -1;

                      return (
                        <div key={document.id} data-index={index}>
                          <CommandItem
                            id={`command-option-${index}`}
                            label={document.title}
                            icon={document.icon}
                            hint={document.hint}
                            selected={index === activeIndex}
                            onSelect={() => runDocument(document)}
                            onHover={() => setCursor(index)}
                          />
                        </div>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2 text-caption uppercase text-text-muted">
            <span>
              {flat.length} {flat.length === 1 ? 'result' : 'results'}
            </span>
            <span className="flex items-center gap-3">
              {active?.external === true && (
                <span className="flex items-center gap-1.5">
                  <ArrowUpRight aria-hidden size={13} strokeWidth={2} />
                  opens externally
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <CornerDownLeft aria-hidden size={13} strokeWidth={2} />
                to open
              </span>
              <span>esc to close</span>
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
