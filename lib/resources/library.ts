/**
 * Reading the resource library.
 *
 * Filtering is a pure function over the catalogue so it can be tested without
 * a browser, and so the page never holds a derived copy of the list in state.
 */

import { LIBRARY_RESOURCES } from '@/content/resources';
import { getLessonById, getModuleById } from '@/lib/curriculum/queries';
import {
  RESOURCE_CATEGORIES,
  type LibraryResource,
  type LibraryResourceType,
  type ResourceCategory,
  type ResourceDifficulty,
  type ResourceStatus,
} from '@/types/resources';

export interface ResourceFilter {
  readonly query: string;
  readonly category: ResourceCategory | 'all';
  readonly type: LibraryResourceType | 'all';
  readonly difficulty: ResourceDifficulty | 'all';
  /** 'any' shows everything; 'unmarked' shows only what carries no mark. */
  readonly status: ResourceStatus | 'any' | 'unmarked';
}

export const EMPTY_RESOURCE_FILTER: ResourceFilter = {
  query: '',
  category: 'all',
  type: 'all',
  difficulty: 'all',
  status: 'any',
};

export function isResourceFilterActive(filter: ResourceFilter): boolean {
  return (
    filter.query.trim() !== '' ||
    filter.category !== 'all' ||
    filter.type !== 'all' ||
    filter.difficulty !== 'all' ||
    filter.status !== 'any'
  );
}

export function getAllResources(): readonly LibraryResource[] {
  return LIBRARY_RESOURCES;
}

export function getResourceById(id: string): LibraryResource | null {
  return LIBRARY_RESOURCES.find((resource) => resource.id === id) ?? null;
}

/** Resources tagged against a given module or lesson, for cross-linking. */
export function getResourcesForModule(moduleId: string): readonly LibraryResource[] {
  return LIBRARY_RESOURCES.filter((resource) =>
    resource.relatedModuleIds.includes(moduleId),
  );
}

export function getResourcesForLesson(lessonId: string): readonly LibraryResource[] {
  return LIBRARY_RESOURCES.filter((resource) =>
    resource.relatedLessonIds.includes(lessonId),
  );
}

function matchesQuery(resource: LibraryResource, needle: string): boolean {
  return (
    resource.title.toLowerCase().includes(needle) ||
    resource.author.toLowerCase().includes(needle) ||
    resource.reason.toLowerCase().includes(needle)
  );
}

export function filterResources(
  resources: readonly LibraryResource[],
  filter: ResourceFilter,
  marks: Readonly<Record<string, { readonly status: ResourceStatus }>>,
): readonly LibraryResource[] {
  const needle = filter.query.trim().toLowerCase();

  return resources.filter((resource) => {
    if (filter.category !== 'all' && resource.category !== filter.category) return false;
    if (filter.type !== 'all' && resource.type !== filter.type) return false;
    if (filter.difficulty !== 'all' && resource.difficulty !== filter.difficulty) {
      return false;
    }

    if (filter.status !== 'any') {
      const status = marks[resource.id]?.status;
      if (filter.status === 'unmarked') {
        if (status !== undefined) return false;
      } else if (status !== filter.status) {
        return false;
      }
    }

    if (needle !== '' && !matchesQuery(resource, needle)) return false;

    return true;
  });
}

export interface ResourceGroup {
  readonly category: ResourceCategory;
  readonly resources: readonly LibraryResource[];
}

/** Groups in the declared category order, skipping categories with no matches. */
export function groupByCategory(
  resources: readonly LibraryResource[],
): readonly ResourceGroup[] {
  return RESOURCE_CATEGORIES.map((category) => ({
    category,
    resources: resources.filter((resource) => resource.category === category),
  })).filter((group) => group.resources.length > 0);
}

/* -------------------------------------------------------------------------- */
/* Related work                                                                */
/* -------------------------------------------------------------------------- */

export interface RelatedLink {
  readonly label: string;
  readonly href: string;
}

/**
 * Resolves the related ids to links. Ids that no longer exist are dropped
 * rather than rendered as dead links — the library test is what reports them.
 */
export function resolveRelatedLinks(resource: LibraryResource): {
  readonly modules: readonly RelatedLink[];
  readonly lessons: readonly RelatedLink[];
} {
  const modules = resource.relatedModuleIds
    .map((id) => getModuleById(id))
    .filter((courseModule) => courseModule !== null)
    .map((courseModule) => ({
      label: courseModule.title,
      href: `/curriculum/${courseModule.slug}`,
    }));

  const lessons = resource.relatedLessonIds
    .map((id) => getLessonById(id))
    .filter((location) => location !== null)
    .map((location) => ({
      label: location.lesson.title,
      href: `/curriculum/${location.courseModule.slug}/${location.lesson.slug}`,
    }));

  return { modules, lessons };
}
