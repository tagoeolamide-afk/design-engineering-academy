'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import { useMounted } from '@/lib/hooks/use-mounted';
import { applyTheme, readStoredTheme, type ThemeMode } from '@/lib/theme/theme';
import { cn } from '@/lib/utils/cn';

const OPTIONS: readonly { mode: ThemeMode; label: string; icon: LucideIcon }[] = [
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'system', label: 'System', icon: Monitor },
  { mode: 'dark', label: 'Dark', icon: Moon },
];

/**
 * Three explicit choices rather than a toggle, because "follow the system" is
 * a real preference and a two-state switch cannot express it.
 *
 * The stored mode is unknown during server render, so the pressed state is only
 * applied once mounted — otherwise the markup would not match on hydration.
 */
export function ThemeControl() {
  const mounted = useMounted();
  const [mode, setMode] = useState<ThemeMode>(() =>
    typeof window === 'undefined' ? 'system' : readStoredTheme(),
  );

  function select(next: ThemeMode) {
    setMode(next);
    applyTheme(next);
  }

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="inline-flex items-center gap-0.5 rounded-medium border border-border bg-surface p-0.5"
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = mounted && mode === option.mode;

        return (
          <Tooltip key={option.mode} content={`${option.label} theme`}>
            <button
              type="button"
              aria-pressed={isActive}
              aria-label={`${option.label} theme`}
              onClick={() => select(option.mode)}
              className={cn(
                'inline-flex h-6 w-7 items-center justify-center rounded-small transition-colors duration-100',
                isActive
                  ? 'bg-surface-active text-text-primary'
                  : 'text-text-muted hover:text-text-primary',
              )}
            >
              <Icon aria-hidden size={13} strokeWidth={2} />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
