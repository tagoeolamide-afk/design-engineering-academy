'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Radix supplies roving focus, arrow-key traversal, and the tab/tabpanel
 * relationship — the parts of a tab set that are invisible until someone
 * navigates by keyboard.
 */
export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('flex items-center gap-1 border-b border-border', className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'relative -mb-px inline-flex h-8 items-center whitespace-nowrap rounded-t-small px-2.5 text-small font-medium text-text-muted transition-colors duration-100',
        'hover:text-text-primary',
        /* The active tab is marked by a rule and a weight change, not colour
         * alone, so the selected state survives a greyscale rendering. */
        'data-[state=active]:text-text-primary data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-px data-[state=active]:after:bg-accent',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('pt-5', className)} {...props} />;
}
