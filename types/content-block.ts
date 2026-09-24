/**
 * Lesson prose is stored as structured blocks rather than raw markdown strings.
 *
 * The reason is rendering control: a lesson body needs to interleave explanation,
 * code, and emphasis, and the reading experience should be composed from known
 * component types rather than parsed at runtime. MDX can be layered on later for
 * authoring convenience without changing this contract.
 */

export type CalloutTone = 'note' | 'insight' | 'warning' | 'pitfall';

export type ContentBlock =
  | { readonly kind: 'paragraph'; readonly text: string }
  | { readonly kind: 'list'; readonly ordered?: boolean; readonly items: readonly string[] }
  | {
      readonly kind: 'code';
      readonly language: string;
      readonly code: string;
      readonly caption?: string;
    }
  | {
      readonly kind: 'callout';
      readonly tone: CalloutTone;
      readonly title?: string;
      readonly body: string;
    }
  | { readonly kind: 'heading'; readonly text: string };

/** An ordered run of content blocks. Every prose field on a lesson uses this shape. */
export type Prose = readonly ContentBlock[];

export const CONTENT_BLOCK_KINDS = [
  'paragraph',
  'list',
  'code',
  'callout',
  'heading',
] as const satisfies readonly ContentBlock['kind'][];
