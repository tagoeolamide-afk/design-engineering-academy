'use client';

import { useMounted } from '@/lib/hooks/use-mounted';
import { useCurrentPosition, useProgressHydrated } from '@/lib/hooks/use-progress';
import { greetingFor } from '@/lib/utils/format';
import { TOTAL_LESSONS } from '@/types/curriculum';

/**
 * Answers "where am I?" in one line, above everything else.
 *
 * The greeting depends on the clock and the position depends on stored
 * progress, so both are gated: the server and the first client render show the
 * neutral form, and the specific form appears once mounted. Same pattern as
 * every other persisted readout in the app.
 */
export function DashboardHeader() {
  const mounted = useMounted();
  const hydrated = useProgressHydrated();
  const position = useCurrentPosition();

  const greeting = mounted ? greetingFor() : 'Welcome back';

  return (
    <div className="mb-8">
      <h1 className="text-display text-text-primary">{greeting}</h1>
      <p className="mt-2 text-body text-text-secondary">
        {hydrated ? <Position position={position} /> : 'Finding your place in the course…'}
      </p>
    </div>
  );
}

function Position({ position }: { position: ReturnType<typeof useCurrentPosition> }) {
  if (position.totalLessons === 0) {
    return <>No lessons are authored yet. The structure is in place and waiting for content.</>;
  }

  if (position.lesson === null || position.courseModule === null) {
    return position.totalLessons === TOTAL_LESSONS ? (
      <>All {TOTAL_LESSONS} lessons are complete. Nothing is outstanding.</>
    ) : (
      <>Every authored lesson is complete. Nothing is outstanding.</>
    );
  }

  return (
    <>
      You are in{' '}
      <span className="text-text-primary">
        {position.phase === null
          ? position.courseModule.title
          : `${position.phase.title} · ${position.courseModule.title}`}
      </span>
      {position.courseIndex !== null && (
        <>
          , on lesson{' '}
          <span className="text-text-primary" data-numeric>
            {position.courseIndex} of {position.totalLessons}
          </span>
        </>
      )}
      .
    </>
  );
}
