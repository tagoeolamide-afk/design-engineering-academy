import { Circle, CircleCheck, CircleDot, CircleSlash, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type StatusKind =
  | 'not-started'
  | 'in-progress'
  | 'complete'
  | 'attention'
  | 'blocked';

interface StatusDefinition {
  readonly icon: LucideIcon;
  readonly tone: string;
  readonly defaultLabel: string;
}

/**
 * Each status carries a distinct glyph as well as a distinct colour, so the
 * meaning survives greyscale, low vision, and every form of colour blindness.
 * Colour is reinforcement here, never the signal itself.
 */
const STATUSES: Record<StatusKind, StatusDefinition> = {
  'not-started': { icon: Circle, tone: 'text-text-muted', defaultLabel: 'Not started' },
  'in-progress': { icon: CircleDot, tone: 'text-accent-text', defaultLabel: 'In progress' },
  complete: { icon: CircleCheck, tone: 'text-success', defaultLabel: 'Complete' },
  attention: { icon: TriangleAlert, tone: 'text-warning', defaultLabel: 'Needs attention' },
  blocked: { icon: CircleSlash, tone: 'text-danger', defaultLabel: 'Blocked' },
};

export interface StatusIndicatorProps {
  readonly status: StatusKind;
  /** Overrides the default wording; the label is never dropped silently. */
  readonly label?: string;
  /** Hides the text visually but keeps it available to assistive technology. */
  readonly iconOnly?: boolean;
  readonly className?: string;
}

export function StatusIndicator({
  status,
  label,
  iconOnly = false,
  className,
}: StatusIndicatorProps) {
  const definition = STATUSES[status];
  const Icon = definition.icon;
  const text = label ?? definition.defaultLabel;

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-small', definition.tone, className)}
    >
      <Icon aria-hidden size={15} strokeWidth={2} className="shrink-0" />
      <span className={cn(iconOnly && 'sr-only')}>{text}</span>
    </span>
  );
}
