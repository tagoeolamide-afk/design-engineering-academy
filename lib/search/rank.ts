/**
 * Ranking.
 *
 * Not a substring filter. Typing "flex" should put the Flexbox lesson above a
 * lesson that merely mentions flex in passing, and typing two words should
 * require both — otherwise the list fills with near-misses and the feature
 * stops being worth opening.
 *
 * The algorithm is deliberately small: every token must match somewhere (AND),
 * each token scores its best field match, and the total is weighted by the kind
 * of thing found. Scanning ~1,200 pre-lowercased documents costs well under a
 * millisecond, so there is no debounce and no stale-result problem.
 */

import type {
  SearchDocument,
  SearchGroup,
  SearchResult,
  SearchResultType,
} from './types';
import { SEARCH_TYPE_LABELS, SEARCH_TYPE_ORDER } from './types';

/* Field weights. A title hit is worth far more than a keyword hit, because a
 * keyword hit only means the topic was mentioned. */
const TITLE_EXACT = 1000;
/* A complete word beats a word the token merely begins: searching "grid"
 * should find "CSS Grid" before "Grids, Alignment and Optical Correction". */
const TITLE_WHOLE_WORD = 620;
const TITLE_PREFIX = 600;
const TITLE_WORD_START = 380;
const TITLE_SUBSTRING = 170;
const HINT_WHOLE_WORD = 110;
const HINT_WORD_START = 90;
const HINT_SUBSTRING = 45;
const KEYWORD_WHOLE_WORD = 75;
const KEYWORD_WORD_START = 60;
const KEYWORD_SUBSTRING = 20;

/**
 * Nudges between kinds of result, applied once. Commands lead because the
 * learner who types "notes" almost always wants to go there, not to read a
 * lesson that mentions notes.
 */
const TYPE_WEIGHT: Readonly<Record<SearchResultType, number>> = {
  command: 120,
  lesson: 80,
  concept: 40,
  module: 70,
  project: 70,
  competency: 55,
  connection: 60,
  note: 65,
  resource: 20,
};

/**
 * How many results one group may contribute when searching, so no single type
 * floods the list. The command list shown before anything is typed is not
 * capped — it is a menu, and a menu that hides half its entries is useless.
 */
const PER_GROUP_LIMIT = 5;

/** How well a token sits inside a field. Higher is a stronger signal. */
const MATCH_NONE = 0;
const MATCH_SUBSTRING = 1;
const MATCH_WORD_START = 2;
const MATCH_WHOLE_WORD = 3;

/** Letters and digits continue a word; everything else ends one. */
function isWordChar(code: number): boolean {
  return (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
}

/**
 * Best match of `needle` in `haystack`, in one pass over the occurrences.
 * Both strings are already lowercased by the index.
 */
function matchKind(haystack: string, needle: string): number {
  let best = MATCH_NONE;
  let from = haystack.indexOf(needle);

  while (from !== -1) {
    const startsWord = from === 0 || !isWordChar(haystack.charCodeAt(from - 1));
    const after = from + needle.length;
    const endsWord = after === haystack.length || !isWordChar(haystack.charCodeAt(after));

    if (startsWord && endsWord) return MATCH_WHOLE_WORD;
    if (startsWord) best = Math.max(best, MATCH_WORD_START);
    else best = Math.max(best, MATCH_SUBSTRING);

    from = haystack.indexOf(needle, from + 1);
  }

  return best;
}

function scoreToken(document: SearchDocument, token: string): number {
  const { title, hint, keywords } = document.haystack;

  if (title === token) return TITLE_EXACT;

  const inTitle = matchKind(title, token);
  if (inTitle === MATCH_WHOLE_WORD) return TITLE_WHOLE_WORD;
  if (title.startsWith(token)) return TITLE_PREFIX;
  if (inTitle === MATCH_WORD_START) return TITLE_WORD_START;
  if (inTitle === MATCH_SUBSTRING) return TITLE_SUBSTRING;

  const inHint = matchKind(hint, token);
  if (inHint === MATCH_WHOLE_WORD) return HINT_WHOLE_WORD;
  if (inHint === MATCH_WORD_START) return HINT_WORD_START;
  if (inHint === MATCH_SUBSTRING) return HINT_SUBSTRING;

  const inKeywords = matchKind(keywords, token);
  if (inKeywords === MATCH_WHOLE_WORD) return KEYWORD_WHOLE_WORD;
  if (inKeywords === MATCH_WORD_START) return KEYWORD_WORD_START;
  if (inKeywords === MATCH_SUBSTRING) return KEYWORD_SUBSTRING;

  return MATCH_NONE;
}

export function tokenize(query: string): readonly string[] {
  return query.toLowerCase().split(/\s+/).filter((token) => token.length > 0);
}

/**
 * Score one document. Returns 0 when any token is unmatched, which is what
 * makes a two-word query narrow the list rather than widen it.
 */
export function scoreDocument(
  document: SearchDocument,
  tokens: readonly string[],
): number {
  let total = 0;

  for (const token of tokens) {
    const score = scoreToken(document, token);
    if (score === 0) return 0;
    total += score;
  }

  /* Shorter titles win ties: "CSS Grid" should beat "Grids, Alignment and
   * Optical Correction" for the query "grid". */
  const brevity = Math.max(0, 40 - document.haystack.title.length) / 4;

  return total + TYPE_WEIGHT[document.type] + brevity;
}

export function search(
  documents: readonly SearchDocument[],
  query: string,
): readonly SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];
  for (const document of documents) {
    const score = scoreDocument(document, tokens);
    if (score > 0) results.push({ document, score });
  }

  results.sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title));
  return results;
}

/**
 * Group ranked results by type, capped per group.
 *
 * With a query, groups are ordered by their strongest member so the most
 * relevant kind leads; with none, the fixed order applies. Results inside a
 * group keep their ranking.
 */
export function groupResults(
  results: readonly SearchResult[],
  { ordered, limit = PER_GROUP_LIMIT }: { ordered: boolean; limit?: number },
): readonly SearchGroup[] {
  const byType = new Map<SearchResultType, SearchResult[]>();

  for (const result of results) {
    const bucket = byType.get(result.document.type);
    if (bucket === undefined) byType.set(result.document.type, [result]);
    else if (bucket.length < limit) bucket.push(result);
  }

  const groups: SearchGroup[] = [...byType.entries()].map(([type, groupResultsList]) => ({
    type,
    label: SEARCH_TYPE_LABELS[type],
    results: groupResultsList,
  }));

  if (ordered) {
    groups.sort((a, b) => (b.results[0]?.score ?? 0) - (a.results[0]?.score ?? 0));
  } else {
    groups.sort(
      (a, b) => SEARCH_TYPE_ORDER.indexOf(a.type) - SEARCH_TYPE_ORDER.indexOf(b.type),
    );
  }

  return groups;
}

/** The flat, ordered list the keyboard cursor moves through across groups. */
export function flattenGroups(groups: readonly SearchGroup[]): readonly SearchDocument[] {
  return groups.flatMap((group) => group.results.map((result) => result.document));
}
