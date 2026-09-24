import type { ModuleProgress } from '@/types/progress';

/**
 * Which end-of-module summary a module has earned, if any.
 *
 * The rule this encodes: finishing every lesson does not finish the module.
 * Lessons are reading and exercises; the project is the part that demonstrates
 * the material, so a module with all its lessons done but no project is
 * reported as outstanding, never as complete.
 */
export type ModuleCompletionState = 'hidden' | 'project-outstanding' | 'complete';

export function resolveModuleCompletionState(
  progress: ModuleProgress,
): ModuleCompletionState {
  const { allLessonsCompleted, projectCompleted } = progress.requirements;

  if (!allLessonsCompleted) return 'hidden';
  return projectCompleted ? 'complete' : 'project-outstanding';
}
