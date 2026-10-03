import { describe, expect, it } from 'vitest';
import { LIBRARY_RESOURCES } from '@/content/resources';
import { getLessonById, getModuleById } from '@/lib/curriculum/queries';
import {
  EMPTY_RESOURCE_FILTER,
  filterResources,
  getResourcesForLesson,
  getResourcesForModule,
  groupByCategory,
  isResourceFilterActive,
  resolveRelatedLinks,
} from '@/lib/resources/library';
import { migrateResourceLibrary } from '@/lib/persistence/migrations';
import {
  LIBRARY_RESOURCE_TYPES,
  RESOURCE_CATEGORIES,
  isLibraryResourceType,
  isResourceCategory,
  isResourceDifficulty,
} from '@/types/resources';
import type { ResourceMark } from '@/types/resources';

describe('the seeded library', () => {
  it('has a unique id for every resource', () => {
    const ids = new Set(LIBRARY_RESOURCES.map((resource) => resource.id));
    expect(ids.size).toBe(LIBRARY_RESOURCES.length);
  });

  it('populates every declared category', () => {
    for (const category of RESOURCE_CATEGORIES) {
      const inCategory = LIBRARY_RESOURCES.filter(
        (resource) => resource.category === category,
      );
      expect(inCategory.length, `${category} is empty`).toBeGreaterThan(0);
    }
  });

  it('uses every declared resource type at least once', () => {
    const used = new Set(LIBRARY_RESOURCES.map((resource) => resource.type));
    for (const type of LIBRARY_RESOURCE_TYPES) {
      expect(used, `${type} is never used`).toContain(type);
    }
  });

  it('only uses valid categories, types, and difficulties', () => {
    for (const resource of LIBRARY_RESOURCES) {
      expect(isResourceCategory(resource.category), resource.id).toBe(true);
      expect(isLibraryResourceType(resource.type), resource.id).toBe(true);
      expect(isResourceDifficulty(resource.difficulty), resource.id).toBe(true);
    }
  });

  it('gives every resource a title, an author, and a stated reason', () => {
    for (const resource of LIBRARY_RESOURCES) {
      expect(resource.title.trim(), resource.id).not.toBe('');
      expect(resource.author.trim(), resource.id).not.toBe('');
      expect(resource.reason.trim(), resource.id).not.toBe('');
    }
  });

  /* The seeded URLs were each checked against the live web before being
   * written down. This guards the shape so a future addition cannot slip in a
   * relative path, an http link, or a placeholder. */
  it('uses only absolute https URLs', () => {
    for (const resource of LIBRARY_RESOURCES) {
      expect(resource.url.startsWith('https://'), `${resource.id}: ${resource.url}`).toBe(
        true,
      );
      expect(() => new URL(resource.url)).not.toThrow();
      expect(resource.url, resource.id).not.toContain('example.com');
    }
  });

  it('has no duplicate URLs', () => {
    const seen = new Map<string, string>();
    for (const resource of LIBRARY_RESOURCES) {
      const existing = seen.get(resource.url);
      expect(existing, `${resource.id} repeats the URL of ${existing}`).toBeUndefined();
      seen.set(resource.url, resource.id);
    }
  });

  it('only references modules and lessons that exist', () => {
    for (const resource of LIBRARY_RESOURCES) {
      for (const moduleId of resource.relatedModuleIds) {
        expect(getModuleById(moduleId), `${resource.id} -> ${moduleId}`).not.toBeNull();
      }
      for (const lessonId of resource.relatedLessonIds) {
        expect(getLessonById(lessonId), `${resource.id} -> ${lessonId}`).not.toBeNull();
      }
    }
  });

  it('includes the seed sources the curriculum was built against', () => {
    const authors = new Set(LIBRARY_RESOURCES.map((resource) => resource.author));
    for (const expected of ['Apple', 'MDN Web Docs', 'W3C WAI', 'Meta', 'Microsoft', 'Git', 'GitHub', 'Google', 'Vercel', 'Figma', 'Shopify']) {
      expect(authors, `missing ${expected}`).toContain(expected);
    }
  });
});

describe('filtering', () => {
  const noMarks: Record<string, ResourceMark> = {};

  it('returns everything when no filter is applied', () => {
    expect(filterResources(LIBRARY_RESOURCES, EMPTY_RESOURCE_FILTER, noMarks)).toHaveLength(
      LIBRARY_RESOURCES.length,
    );
    expect(isResourceFilterActive(EMPTY_RESOURCE_FILTER)).toBe(false);
  });

  it('narrows by category', () => {
    const result = filterResources(
      LIBRARY_RESOURCES,
      { ...EMPTY_RESOURCE_FILTER, category: 'git' },
      noMarks,
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((resource) => resource.category === 'git')).toBe(true);
  });

  it('narrows by type and by difficulty together', () => {
    const result = filterResources(
      LIBRARY_RESOURCES,
      { ...EMPTY_RESOURCE_FILTER, type: 'book', difficulty: 'advanced' },
      noMarks,
    );
    expect(result.every((r) => r.type === 'book' && r.difficulty === 'advanced')).toBe(true);
  });

  it('matches the query against title, author, and reason', () => {
    const byTitle = filterResources(
      LIBRARY_RESOURCES,
      { ...EMPTY_RESOURCE_FILTER, query: 'pro git' },
      noMarks,
    );
    expect(byTitle.map((r) => r.id)).toContain('pro-git');

    const byAuthor = filterResources(
      LIBRARY_RESOURCES,
      { ...EMPTY_RESOURCE_FILTER, query: 'webaim' },
      noMarks,
    );
    expect(byAuthor.length).toBeGreaterThan(0);
  });

  it('filters by mark, including the unmarked case', () => {
    const marks: Record<string, ResourceMark> = {
      'pro-git': { resourceId: 'pro-git', status: 'completed', markedAt: 'x' },
    };

    const completed = filterResources(
      LIBRARY_RESOURCES,
      { ...EMPTY_RESOURCE_FILTER, status: 'completed' },
      marks,
    );
    expect(completed.map((r) => r.id)).toEqual(['pro-git']);

    const unmarked = filterResources(
      LIBRARY_RESOURCES,
      { ...EMPTY_RESOURCE_FILTER, status: 'unmarked' },
      marks,
    );
    expect(unmarked.map((r) => r.id)).not.toContain('pro-git');
    expect(unmarked).toHaveLength(LIBRARY_RESOURCES.length - 1);
  });

  it('groups in the declared category order and skips empty categories', () => {
    const groups = groupByCategory(
      LIBRARY_RESOURCES.filter((resource) => resource.category === 'git'),
    );
    expect(groups).toHaveLength(1);
    expect(groups[0]?.category).toBe('git');
  });
});

describe('cross-linking', () => {
  it('finds resources tagged against a module and a lesson', () => {
    expect(getResourcesForModule('module-06').length).toBeGreaterThan(0);
    expect(getResourcesForLesson('lesson-understanding-git').length).toBeGreaterThan(0);
  });

  it('resolves related ids to real curriculum links', () => {
    const proGit = LIBRARY_RESOURCES.find((resource) => resource.id === 'pro-git');
    expect(proGit).toBeDefined();

    const related = resolveRelatedLinks(proGit!);
    expect(related.modules[0]?.href).toBe(
      '/curriculum/typescript-git-and-workflow',
    );
    expect(related.lessons.length).toBeGreaterThan(0);
    for (const link of [...related.modules, ...related.lessons]) {
      expect(link.href.startsWith('/curriculum/')).toBe(true);
    }
  });
});

describe('mark persistence', () => {
  it('reads back a stored mark', () => {
    const state = migrateResourceLibrary(
      { marks: { 'pro-git': { status: 'started', markedAt: '2026-01-01T00:00:00.000Z' } } },
      1,
    );
    expect(state.marks['pro-git']?.status).toBe('started');
    expect(state.marks['pro-git']?.resourceId).toBe('pro-git');
  });

  it('drops marks with an unknown status rather than throwing', () => {
    const state = migrateResourceLibrary(
      { marks: { a: { status: 'abandoned' }, b: { status: 'saved' } } },
      1,
    );
    expect(Object.keys(state.marks)).toEqual(['b']);
  });

  it('survives malformed stored data', () => {
    expect(migrateResourceLibrary(null, 1)).toEqual({ marks: {} });
    expect(migrateResourceLibrary('nonsense', 1)).toEqual({ marks: {} });
    expect(migrateResourceLibrary({ marks: 'nonsense' }, 1)).toEqual({ marks: {} });
  });
});
