import { describe, expect, it } from 'vitest';
import { getCurriculumDocuments } from '@/lib/search/documents';
import { flattenGroups, groupResults, scoreDocument, search, tokenize } from '@/lib/search/rank';
import type { SearchDocument, SearchResultType } from '@/lib/search/types';

function doc(
  id: string,
  type: SearchResultType,
  title: string,
  hint = '',
  keywords = '',
): SearchDocument {
  return {
    id,
    type,
    title,
    hint,
    keywords,
    href: `/${id}`,
    haystack: {
      title: title.toLowerCase(),
      hint: hint.toLowerCase(),
      keywords: keywords.toLowerCase(),
    },
  };
}

describe('tokenize', () => {
  it('splits on whitespace and drops empties', () => {
    expect(tokenize('  CSS   Grid ')).toEqual(['css', 'grid']);
    expect(tokenize('   ')).toEqual([]);
  });
});

describe('scoring', () => {
  it('ranks a title match above a keyword mention', () => {
    const title = doc('a', 'lesson', 'Flexbox');
    const mention = doc('b', 'lesson', 'CSS Grid', 'Module 4', 'compared with flexbox');
    const tokens = tokenize('flexbox');

    expect(scoreDocument(title, tokens)).toBeGreaterThan(scoreDocument(mention, tokens));
  });

  it('ranks a prefix above a mid-word substring', () => {
    const prefix = doc('a', 'lesson', 'Rendering');
    const inside = doc('b', 'lesson', 'Understanding prerendering');
    const tokens = tokenize('render');

    expect(scoreDocument(prefix, tokens)).toBeGreaterThan(scoreDocument(inside, tokens));
  });

  it('requires every token to match, so a second word narrows the list', () => {
    const both = doc('a', 'lesson', 'Reduced Motion');
    const one = doc('b', 'lesson', 'Motion Has a Job');

    expect(scoreDocument(both, tokenize('reduced motion'))).toBeGreaterThan(0);
    expect(scoreDocument(one, tokenize('reduced motion'))).toBe(0);
  });

  it('prefers the shorter title when matches are otherwise equal', () => {
    const short = doc('a', 'lesson', 'CSS Grid');
    const long = doc('b', 'lesson', 'Grids, Alignment and Optical Correction');
    const tokens = tokenize('grid');

    expect(scoreDocument(short, tokens)).toBeGreaterThan(scoreDocument(long, tokens));
  });

  it('scores nothing for an unmatched query', () => {
    expect(scoreDocument(doc('a', 'lesson', 'Flexbox'), tokenize('kubernetes'))).toBe(0);
  });
});

describe('grouping', () => {
  const results = [
    { document: doc('l1', 'lesson', 'One'), score: 500 },
    { document: doc('c1', 'concept', 'Two'), score: 900 },
    { document: doc('l2', 'lesson', 'Three'), score: 400 },
  ];

  it('orders groups by their best member when a query is present', () => {
    const groups = groupResults(results, { ordered: true });
    expect(groups.map((group) => group.type)).toEqual(['concept', 'lesson']);
  });

  it('keeps the flat cursor order consistent with the rendered groups', () => {
    const groups = groupResults(results, { ordered: true });
    expect(flattenGroups(groups).map((document) => document.id)).toEqual(['c1', 'l1', 'l2']);
  });

  it('caps a single type so it cannot flood the list', () => {
    const many = Array.from({ length: 12 }, (_, i) => ({
      document: doc(`l${i}`, 'lesson', `Lesson ${i}`),
      score: 100 - i,
    }));
    const groups = groupResults(many, { ordered: true });

    expect(groups[0]?.results).toHaveLength(5);
  });
});

describe('the real curriculum index', () => {
  const documents = getCurriculumDocuments();

  it('indexes every type the search claims to cover', () => {
    const types = new Set(documents.map((document) => document.type));
    for (const type of ['lesson', 'concept', 'module', 'project', 'competency', 'resource']) {
      expect(types, `missing ${type}`).toContain(type);
    }
  });

  it('indexes all seventy-five lessons and fifteen projects', () => {
    expect(documents.filter((d) => d.type === 'lesson')).toHaveLength(75);
    expect(documents.filter((d) => d.type === 'project')).toHaveLength(15);
    expect(documents.filter((d) => d.type === 'module')).toHaveLength(15);
    expect(documents.filter((d) => d.type === 'competency')).toHaveLength(33);
  });

  it('has no duplicate ids, so every row has a stable identity', () => {
    const ids = new Set(documents.map((document) => document.id));
    expect(ids.size).toBe(documents.length);
  });

  it('finds a lesson by its exact title', () => {
    const top = search(documents, 'flexbox')[0];
    expect(top?.document.title).toBe('Flexbox');
    expect(top?.document.href).toBe('/curriculum/css-interface-engineering/flexbox');
  });

  it('finds a concept taught inside a lesson and links to that section', () => {
    const hit = search(documents, 'layout thrashing').find((r) => r.document.type === 'concept');
    expect(hit?.document.href).toContain('#');
  });

  it('finds a competency by label', () => {
    /* The lesson of the same name leading is correct — it is where the topic is
     * taught. What matters is that the competency is reachable and links right. */
    const hit = search(documents, 'design qa').find(
      (result) => result.document.type === 'competency',
    );
    expect(hit?.document.href).toBe('/skills/design-qa');
  });

  it('prefers a whole-word title match over a longer word it only begins', () => {
    const top = search(documents, 'grid')[0];
    expect(top?.document.title).toBe('CSS Grid');
  });

  it('finds a project', () => {
    const top = search(documents, 'command palette')[0];
    expect(top?.document.type).toBe('project');
  });

  it('marks external resources so they are not pushed through the router', () => {
    const resources = documents.filter((document) => document.type === 'resource');
    expect(resources.length).toBeGreaterThan(0);
    for (const resource of resources) {
      expect(resource.external).toBe(true);
      expect(resource.href.startsWith('http')).toBe(true);
    }
  });

  it('returns nothing for a query that matches nothing', () => {
    expect(search(documents, 'zzzznotathing')).toHaveLength(0);
  });

  it('searches the whole index well within a keystroke', () => {
    const started = performance.now();
    for (let i = 0; i < 50; i += 1) search(documents, 'state');
    const perSearch = (performance.now() - started) / 50;

    /* Generous bound: the point is to catch an accidental O(n^2) or a rebuild
     * of the index inside the loop, not to assert a specific machine's speed. */
    expect(perSearch).toBeLessThan(20);
  });
});
