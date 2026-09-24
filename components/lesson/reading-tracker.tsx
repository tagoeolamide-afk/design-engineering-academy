'use client';

import { useEffect, useRef } from 'react';
import { useProgressHydrated } from '@/lib/hooks/use-progress';
import { useProgressStore } from '@/stores/progress-store';

/**
 * Records that the lesson was opened.
 *
 * Gated on hydration: writing a visit before the persisted state has loaded
 * would create a fresh record and discard whatever was already stored for this
 * lesson.
 */
export function LessonVisitTracker({ lessonId }: { lessonId: string }) {
  const hydrated = useProgressHydrated();
  const visitLesson = useProgressStore((state) => state.visitLesson);

  useEffect(() => {
    if (!hydrated) return;
    visitLesson(lessonId);
  }, [hydrated, lessonId, visitLesson]);

  return null;
}

/** How far up the viewport the marker must come before the end counts as read. */
const REACHED_AT = 0.85;

/**
 * Marks the lesson as read to the end once this point in the page is reached.
 *
 * Placed after the last section of the body — before the exercise and
 * reflection — so "reached the end" means the learner got through the material,
 * not that they scrolled past the form controls.
 *
 * Implemented as a position check on scroll rather than with an
 * IntersectionObserver. An observer only reports threshold *crossings*, and
 * jumping to a later section from the table of contents moves this element from
 * below the viewport to above it within a single frame — it never intersects,
 * no callback fires, and the lesson becomes impossible to complete without
 * scrolling back up. Asking "is this point at or above the fold?" has no such
 * hole, and answers correctly for jumps, instant scrolls, and resizes alike.
 */
export function LessonEndMarker({ lessonId }: { lessonId: string }) {
  const hydrated = useProgressHydrated();
  const markLessonEndReached = useProgressStore((state) => state.markLessonEndReached);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!hydrated || node === null) return;

    let frame = 0;
    let done = false;

    function check() {
      if (done || node === null) return;

      if (node.getBoundingClientRect().top <= window.innerHeight * REACHED_AT) {
        done = true;
        markLessonEndReached(lessonId);
        stop();
      }
    }

    function onScroll() {
      /* Coalesce to one check per frame: scroll fires far more often than the
       * answer can change. */
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        check();
      });
    }

    function stop() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    /* A short lesson can already be fully on screen at load. */
    check();
    if (done) return;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return stop;
  }, [hydrated, lessonId, markLessonEndReached]);

  return <div ref={sentinel} aria-hidden className="h-px w-full" />;
}
