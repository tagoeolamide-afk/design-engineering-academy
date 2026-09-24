/**
 * Labels and placeholders for the four project links.
 *
 * Shared so the projects overview and the project page name them identically —
 * the alternative is a portfolio that lists "caseStudy" next to "Case study".
 */

import type { ProjectLinkKind } from '@/types/progress';

export interface ProjectLinkPresentation {
  readonly label: string;
  readonly placeholder: string;
}

export const PROJECT_LINK_PRESENTATION: Readonly<
  Record<ProjectLinkKind, ProjectLinkPresentation>
> = {
  figma: { label: 'Figma', placeholder: 'https://figma.com/file/…' },
  github: { label: 'GitHub', placeholder: 'https://github.com/…' },
  live: { label: 'Live build', placeholder: 'https://…' },
  caseStudy: { label: 'Case study', placeholder: 'https://…' },
};

export function presentProjectLink(kind: ProjectLinkKind): ProjectLinkPresentation {
  return PROJECT_LINK_PRESENTATION[kind];
}
