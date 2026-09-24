import { Info, Lightbulb, TriangleAlert, OctagonAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { CalloutTone, ContentBlock, Prose as ProseBlocks } from '@/types/content-block';

const CALLOUT_TONES: Record<
  CalloutTone,
  { icon: LucideIcon; rule: string; icontone: string }
> = {
  note: { icon: Info, rule: 'border-l-border-strong', icontone: 'text-text-muted' },
  insight: { icon: Lightbulb, rule: 'border-l-accent', icontone: 'text-accent-text' },
  warning: { icon: TriangleAlert, rule: 'border-l-warning', icontone: 'text-warning' },
  pitfall: { icon: OctagonAlert, rule: 'border-l-danger', icontone: 'text-danger' },
};

/**
 * Renders a run of content blocks as lesson prose.
 *
 * The reading measure is set by the column, not here, and spacing between
 * blocks is uniform so a lesson reads as one continuous argument rather than a
 * stack of separately styled widgets.
 */
export function Prose({ blocks, className }: { blocks: ProseBlocks; className?: string }) {
  if (blocks.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.kind) {
    case 'paragraph':
      return <p className="text-body text-text-secondary">{block.text}</p>;

    case 'heading':
      return (
        <h3 className="pt-2 text-small font-semibold tracking-tight text-text-primary">
          {block.text}
        </h3>
      );

    case 'list':
      return block.ordered === true ? (
        <ol className="list-decimal space-y-2 pl-5 text-body text-text-secondary marker:text-text-muted">
          {block.items.map((item, index) => (
            <li key={index} className="pl-1">
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2 text-body text-text-secondary">
          {block.items.map((item, index) => (
            <li key={index} className="grid grid-cols-[0.75rem_1fr] gap-x-2">
              {/* A rule rather than a bullet: list items here are often full
                  sentences, and a dot competes with the text. */}
              <span aria-hidden className="mt-2.5 h-px w-2 bg-border-strong" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'code':
      return (
        <figure className="my-5">
          <pre className="overflow-x-auto rounded-medium border border-border bg-surface p-4">
            <code className="font-mono text-code text-text-primary">{block.code}</code>
          </pre>
          {block.caption !== undefined && (
            <figcaption className="mt-2 text-small text-text-muted">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'callout': {
      const tone = CALLOUT_TONES[block.tone];
      const Icon = tone.icon;

      return (
        <aside
          className={cn('my-5 border-l-2 bg-surface/60 py-3 pl-4 pr-4', tone.rule)}
        >
          <div className="flex gap-2.5">
            <Icon
              aria-hidden
              size={15}
              strokeWidth={1.75}
              className={cn('mt-0.5 shrink-0', tone.icontone)}
            />
            <div className="min-w-0">
              {block.title !== undefined && (
                <p className="text-small font-medium text-text-primary">{block.title}</p>
              )}
              <p
                className={cn(
                  'text-body text-text-secondary',
                  block.title !== undefined && 'mt-1',
                )}
              >
                {block.body}
              </p>
            </div>
          </div>
        </aside>
      );
    }
  }
}
