'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useLessonProgress, useProgressHydrated } from '@/lib/hooks/use-progress';

interface NeighbourLink {
  readonly title: string;
  readonly moduleSlug: string;
  readonly lessonSlug: string;
  readonly moduleTitle: string;
}

interface LessonNavigationProps {
  readonly lessonId: string;
  readonly previous: NeighbourLink | null;
  readonly next: NeighbourLink | null;
}

/**
 * Previous and next, plus the Shift + Enter shortcut for continuing.
 *
 * The shortcut only fires once the lesson is complete. Offering it earlier
 * would let the learner skip past the exercise and reflection by reflex, which
 * is precisely the behaviour the completion rule exists to prevent.
 */
export function LessonNavigation({ lessonId, previous, next }: LessonNavigationProps) {
  const router = useRouter();
  const progress = useLessonProgress(lessonId);
  const hydrated = useProgressHydrated();

  const isComplete = hydrated && progress.status === 'completed';
  const canContinue = isComplete && next !== null;

  useEffect(() => {
    if (!canContinue || next === null) return;

    /* Captured after the guard: TypeScript does not carry the narrowing into a
     * handler that runs later. */
    const destination = next;

    function onKeyDown(event: KeyboardEvent) {
      if (!event.shiftKey || event.key !== 'Enter') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      /* Shift + Enter is a newline inside a field. Reading the shortcut while
       * the learner is writing their reflection would both steal the keystroke
       * and navigate away from unsaved text. */
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (
          tag === 'TEXTAREA' ||
          tag === 'INPUT' ||
          tag === 'SELECT' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      event.preventDefault();
      router.push(`/curriculum/${destination.moduleSlug}/${destination.lessonSlug}`);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [canContinue, next, router]);

  return (
    <nav
      aria-label="Lesson"
      className="mt-12 border-t border-border pt-6"
    >
      {/* Only while there is something outstanding. Once the lesson is done the
          completion panel above states it, and saying it twice is noise. */}
      {hydrated && !isComplete && (
        <div className="mb-5">
          <StatusIndicator
            status="in-progress"
            label={`${progress.requirementsMet} of ${progress.requirementsTotal} requirements met`}
            className="text-small"
          />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {previous === null ? (
          <span />
        ) : (
          <Link
            href={`/curriculum/${previous.moduleSlug}/${previous.lessonSlug}`}
            className="group rounded-large border border-border p-4 transition-colors duration-100 hover:border-border-strong hover:bg-surface-hover active:bg-surface-active"
          >
            <span className="flex items-center gap-1.5 text-caption uppercase text-text-muted">
              <ArrowLeft aria-hidden size={13} strokeWidth={2} />
              Previous
            </span>
            <span className="mt-1.5 block text-small text-text-primary">
              {previous.title}
            </span>
            <span className="mt-0.5 block text-caption uppercase text-text-muted">
              {previous.moduleTitle}
            </span>
          </Link>
        )}

        {next === null ? (
          <span />
        ) : (
          <Link
            href={`/curriculum/${next.moduleSlug}/${next.lessonSlug}`}
            className="group rounded-large border border-border p-4 text-right transition-colors duration-100 hover:border-border-strong hover:bg-surface-hover active:bg-surface-active sm:col-start-2"
          >
            <span className="flex items-center justify-end gap-1.5 text-caption uppercase text-text-muted">
              Next
              <ArrowRight aria-hidden size={13} strokeWidth={2} />
            </span>
            <span className="mt-1.5 block text-small text-text-primary">{next.title}</span>
            <span className="mt-0.5 block text-caption uppercase text-text-muted">
              {next.moduleTitle}
            </span>
          </Link>
        )}
      </div>

      {next !== null && (
        <p className="mt-4 text-small text-text-muted">
          {canContinue ? (
            <>
              Press{' '}
              <kbd className="rounded-small bg-surface-active px-1.5 py-0.5 font-mono text-caption text-text-secondary">
                Shift
              </kbd>{' '}
              +{' '}
              <kbd className="rounded-small bg-surface-active px-1.5 py-0.5 font-mono text-caption text-text-secondary">
                Enter
              </kbd>{' '}
              to continue to the next lesson.
            </>
          ) : (
            'Complete this lesson to unlock Shift + Enter for continuing.'
          )}
        </p>
      )}
    </nav>
  );
}
