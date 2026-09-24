import Link from 'next/link';
import type { CurriculumModule } from '@/types/curriculum';

interface ModuleNeighboursProps {
  readonly previous: CurriculumModule | null;
  readonly current: CurriculumModule;
  readonly next: CurriculumModule | null;
}

/**
 * Where this module sits in the sequence: what comes before it and what it
 * prepares you for, as a three-step chain.
 *
 * This is the module-scale version of the path on the overview — the same
 * relationship at the resolution the learner needs while they are here.
 */
export function ModuleNeighbours({ previous, current, next }: ModuleNeighboursProps) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-small">
      <Neighbour courseModule={previous} />
      <Arrow show={previous !== null} />

      <li className="rounded-medium border border-border bg-surface px-2 py-1 text-text-primary">
        <span className="text-caption uppercase text-text-muted" data-numeric>
          {current.moduleNumber.toString().padStart(2, '0')}
        </span>{' '}
        {current.title}
      </li>

      <Arrow show={next !== null} />
      <Neighbour courseModule={next} />
    </ol>
  );
}

function Arrow({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <li aria-hidden className="text-text-muted">
      →
    </li>
  );
}

function Neighbour({ courseModule }: { courseModule: CurriculumModule | null }) {
  if (courseModule === null) return null;

  return (
    <li>
      <Link
        href={`/curriculum/${courseModule.slug}`}
        className="rounded-medium px-2 py-1 text-text-secondary underline decoration-border underline-offset-4 hover:text-text-primary hover:decoration-text-muted"
      >
        <span className="text-caption uppercase text-text-muted" data-numeric>
          {courseModule.moduleNumber.toString().padStart(2, '0')}
        </span>{' '}
        {courseModule.title}
      </Link>
    </li>
  );
}
