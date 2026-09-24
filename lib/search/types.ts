/**
 * Global search types.
 *
 * A search document is the smallest thing worth finding: a lesson, a concept
 * taught inside one, a project, a note. Documents carry only the fields search
 * needs — never whole lesson bodies — so the index stays small enough to scan
 * on every keystroke without a worker or a debounce.
 */

import type { LucideIcon } from 'lucide-react';

export const SEARCH_RESULT_TYPES = [
  'command',
  'lesson',
  'concept',
  'module',
  'project',
  'competency',
  'connection',
  'note',
  'resource',
] as const;

export type SearchResultType = (typeof SEARCH_RESULT_TYPES)[number];

/** Plural labels for the group headings. */
export const SEARCH_TYPE_LABELS: Readonly<Record<SearchResultType, string>> = {
  command: 'Commands',
  lesson: 'Lessons',
  concept: 'Concepts',
  module: 'Modules',
  project: 'Projects',
  competency: 'Competencies',
  connection: 'Connections',
  note: 'Notes',
  resource: 'Resources',
};

/**
 * Fixed order used when nothing is typed. With a query, groups are ordered by
 * their best-scoring member instead, so the most relevant kind of thing leads.
 */
export const SEARCH_TYPE_ORDER: readonly SearchResultType[] = SEARCH_RESULT_TYPES;

export interface SearchDocument {
  readonly id: string;
  readonly type: SearchResultType;
  readonly title: string;
  /** Where this sits in the course — shown on the right of the row. */
  readonly hint: string;
  /**
   * Additional searchable text that is not displayed. Kept short: this is what
   * makes "thrashing" find the layout lesson, not a full-text dump.
   */
  readonly keywords?: string;
  readonly icon?: LucideIcon;
  /** Internal route, or an absolute URL for an external resource. */
  readonly href: string;
  readonly external?: boolean;
  /** Commands act rather than navigate. */
  readonly run?: () => void;
  /**
   * Lowercased fields, computed once when the document is built. Re-lowercasing
   * a thousand documents on every keystroke is the difference between search
   * that feels instant and search that does not.
   */
  readonly haystack: {
    readonly title: string;
    readonly hint: string;
    readonly keywords: string;
  };
}

export interface SearchResult {
  readonly document: SearchDocument;
  readonly score: number;
}

export interface SearchGroup {
  readonly type: SearchResultType;
  readonly label: string;
  readonly results: readonly SearchResult[];
}
