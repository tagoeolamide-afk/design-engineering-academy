import { Prose } from './prose';
import type { Prose as ProseBlocks } from '@/types/content-block';

interface PerspectivesProps {
  readonly design: ProseBlocks;
  readonly engineering: ProseBlocks;
}

/**
 * The design and engineering readings of the same idea, set side by side.
 *
 * This is the one place in a lesson where a comparison layout earns its keep:
 * the whole point of the two fields is that they describe one subject from two
 * directions, and stacking them vertically loses that. On narrow viewports they
 * stack anyway, each keeping its label, so nothing depends on the columns.
 */
export function Perspectives({ design, engineering }: PerspectivesProps) {
  return (
    <div className="grid gap-x-8 gap-y-8 lg:grid-cols-2">
      <Column label="From design" blocks={design} />
      <Column label="From engineering" blocks={engineering} />
    </div>
  );
}

function Column({ label, blocks }: { label: string; blocks: ProseBlocks }) {
  if (blocks.length === 0) return null;

  return (
    <div className="min-w-0">
      <h3 className="mb-3 border-b border-border pb-2 text-small font-medium text-text-primary">
        {label}
      </h3>
      <Prose blocks={blocks} />
    </div>
  );
}
