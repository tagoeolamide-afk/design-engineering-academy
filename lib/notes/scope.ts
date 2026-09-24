/**
 * Turning a note's scope into something the learner can read and click.
 *
 * Scopes store ids; the interface needs titles and a route. Resolution happens
 * here so a note whose lesson was renamed — or removed — degrades to a plain
 * label instead of rendering a dead link or crashing a list.
 */

import { getLessonById, getModuleById, getProjectById } from '@/lib/curriculum/queries';
import type { NoteScope } from '@/types/notes';

export interface ScopeTarget {
  /** Short label for the note row, e.g. "Lesson · Interfaces Are Stateful Systems". */
  readonly label: string;
  /** What kind of thing it is attached to, for grouping and filters. */
  readonly kind: NoteScope['kind'];
  /** Where "open source lesson" should go, when the target still resolves. */
  readonly target:
    | { readonly kind: 'lesson'; readonly moduleSlug: string; readonly lessonSlug: string }
    | { readonly kind: 'module'; readonly moduleSlug: string }
    | { readonly kind: 'project'; readonly moduleSlug: string }
    | null;
}

export function describeScope(scope: NoteScope): ScopeTarget {
  switch (scope.kind) {
    case 'free':
      return { label: 'Global note', kind: 'free', target: null };

    case 'lesson': {
      const location = getLessonById(scope.lessonId);
      if (location === null) {
        return { label: 'Lesson note', kind: 'lesson', target: null };
      }
      return {
        label: `${location.courseModule.title} · ${location.lesson.title}`,
        kind: 'lesson',
        target: {
          kind: 'lesson',
          moduleSlug: location.courseModule.slug,
          lessonSlug: location.lesson.slug,
        },
      };
    }

    case 'module': {
      const courseModule = getModuleById(scope.moduleId);
      if (courseModule === null) {
        return { label: 'Module note', kind: 'module', target: null };
      }
      return {
        label: courseModule.title,
        kind: 'module',
        target: { kind: 'module', moduleSlug: courseModule.slug },
      };
    }

    case 'project': {
      const project = getProjectById(scope.projectId);
      const courseModule = getModuleById(scope.moduleId);
      if (project === null || courseModule === null) {
        return { label: 'Project note', kind: 'project', target: null };
      }
      return {
        label: project.title,
        kind: 'project',
        target: { kind: 'project', moduleSlug: courseModule.slug },
      };
    }
  }
}

export const SCOPE_KIND_LABELS: Record<NoteScope['kind'], string> = {
  free: 'Global',
  lesson: 'Lesson',
  module: 'Module',
  project: 'Project',
};
