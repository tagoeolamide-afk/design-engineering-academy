'use client';

import { useResourceStore } from '@/stores/resource-store';
import { useMounted } from './use-mounted';
import { useCloudSettled } from './use-cloud';
import type { ResourceMark, ResourceStatus } from '@/types/resources';

/** True once the stored marks have been read back and the first render is past. */
export function useResourcesHydrated(): boolean {
  const mounted = useMounted();
  const hasHydrated = useResourceStore((state) => state.hasHydrated);
  const cloudSettled = useCloudSettled();
  return mounted && hasHydrated && cloudSettled;
}

export function useResourceMarks(): Readonly<Record<string, ResourceMark>> {
  return useResourceStore((state) => state.marks);
}

export function useResourceStatus(resourceId: string): ResourceStatus | null {
  return useResourceStore((state) => state.marks[resourceId]?.status ?? null);
}
