/**
 * Building the searchable documents.
 *
 * The curriculum half is static, so it is built once on first search and reused
 * for the life of the page. Notes are the learner's and change, so they are
 * rebuilt from the store when they change — cheaply, because there are never
 * many of them.
 *
 * Only fields worth matching are indexed. Lesson bodies are deliberately left
 * out: indexing every paragraph would triple the index for results that could
 * not say where in a lesson the match was, which is worse than not matching.
 */

import {
  BookOpen,
  FileText,
  FolderGit2,
  GraduationCap,
  Library,
  Lightbulb,
  Target,
  Waypoints,
} from 'lucide-react';
import { COMPETENCY_LIST } from '@/content/competencies';
import { CONCEPT_CHAINS } from '@/content/connections';
import { LIBRARY_RESOURCES } from '@/content/resources';
import { getAllLessons, getModules } from '@/lib/curriculum/queries';
import { COMPETENCY_CATEGORY_LABELS } from '@/types/competency';
import { RESOURCE_CATEGORY_LABELS } from '@/types/resources';
import type { Note } from '@/types/notes';
import type { SearchDocument } from './types';

function haystack(title: string, hint: string, keywords: string | undefined) {
  return {
    title: title.toLowerCase(),
    hint: hint.toLowerCase(),
    keywords: (keywords ?? '').toLowerCase(),
  };
}

function make(
  document: Omit<SearchDocument, 'haystack'>,
): SearchDocument {
  return { ...document, haystack: haystack(document.title, document.hint, document.keywords) };
}

/* -------------------------------------------------------------------------- */
/* Curriculum                                                                  */
/* -------------------------------------------------------------------------- */

function buildCurriculumDocuments(): readonly SearchDocument[] {
  const documents: SearchDocument[] = [];

  for (const courseModule of getModules()) {
    documents.push(
      make({
        id: `module:${courseModule.id}`,
        type: 'module',
        title: courseModule.title,
        hint: `Module ${courseModule.moduleNumber}`,
        keywords: `${courseModule.description} ${courseModule.outcome}`,
        icon: BookOpen,
        href: `/curriculum/${courseModule.slug}`,
      }),
    );

    const { project } = courseModule;
    documents.push(
      make({
        id: `project:${project.id}`,
        type: 'project',
        title: project.title,
        hint: `Module ${courseModule.moduleNumber}`,
        keywords: `${project.brief} ${project.portfolioEvidence.join(' ')}`,
        icon: FolderGit2,
        href: `/projects/${courseModule.slug}`,
      }),
    );
  }

  for (const { lesson, courseModule } of getAllLessons()) {
    const lessonHref = `/curriculum/${courseModule.slug}/${lesson.slug}`;
    const hint = `Module ${courseModule.moduleNumber}`;

    documents.push(
      make({
        id: `lesson:${lesson.id}`,
        type: 'lesson',
        title: lesson.title,
        hint,
        keywords: `${lesson.summary} ${lesson.prerequisiteConcepts.join(' ')}`,
        icon: GraduationCap,
        href: lessonHref,
      }),
    );

    /* Concepts: the named things a lesson teaches. Each links to the section
     * that covers it, so a match lands on the right part of a long page. */
    for (const [index, objective] of lesson.objectives.entries()) {
      documents.push(
        make({
          id: `concept:${lesson.id}:objective:${index}`,
          type: 'concept',
          title: objective,
          hint: lesson.title,
          keywords: courseModule.title,
          icon: Lightbulb,
          href: `${lessonHref}#objectives`,
        }),
      );
    }

    for (const mistake of lesson.commonMistakes) {
      documents.push(
        make({
          id: `concept:${lesson.id}:mistake:${mistake.id}`,
          type: 'concept',
          title: mistake.mistake,
          hint: lesson.title,
          keywords: `${mistake.why} ${mistake.instead} common mistake pitfall`,
          icon: Lightbulb,
          href: `${lessonHref}#mistakes`,
        }),
      );
    }

    documents.push(
      make({
        id: `concept:${lesson.id}:exercise`,
        type: 'concept',
        title: lesson.practicalExercise.title,
        hint: lesson.title,
        keywords: `exercise practice ${lesson.practicalExercise.prompt}`,
        icon: Lightbulb,
        href: `${lessonHref}#exercise`,
      }),
    );

    for (const resource of lesson.resources) {
      documents.push(
        make({
          id: `resource:${resource.id}`,
          type: 'resource',
          title: resource.title,
          hint: resource.type,
          keywords: `${resource.author ?? ''} ${resource.note ?? ''} ${lesson.title}`,
          icon: Library,
          href: resource.url,
          external: true,
        }),
      );
    }
  }

  for (const courseModule of getModules()) {
    for (const resource of courseModule.resources) {
      documents.push(
        make({
          id: `resource:${resource.id}`,
          type: 'resource',
          title: resource.title,
          hint: resource.type,
          keywords: `${resource.author ?? ''} ${resource.note ?? ''} ${courseModule.title}`,
          icon: Library,
          href: resource.url,
          external: true,
        }),
      );
    }
  }

  for (const competency of COMPETENCY_LIST) {
    documents.push(
      make({
        id: `competency:${competency.id}`,
        type: 'competency',
        title: competency.label,
        hint: COMPETENCY_CATEGORY_LABELS[competency.category],
        keywords: competency.description,
        icon: Target,
        href: `/skills/${competency.id}`,
      }),
    );
  }

  for (const chain of CONCEPT_CHAINS) {
    documents.push(
      make({
        id: `connection:${chain.id}`,
        type: 'connection',
        title: chain.title,
        hint: 'Concept chain',
        keywords: `${chain.subtitle} ${chain.links.map((link) => link.label).join(' ')}`,
        icon: Waypoints,
        href: `/connections#${chain.id}`,
      }),
    );
  }

  /* Library entries carry a category and a stated reason, so they are the
   * better match for the same link. Added last, then preferred during dedupe. */
  for (const resource of LIBRARY_RESOURCES) {
    documents.push(
      make({
        id: `library:${resource.id}`,
        type: 'resource',
        title: resource.title,
        hint: RESOURCE_CATEGORY_LABELS[resource.category],
        keywords: `${resource.author} ${resource.type} ${resource.reason}`,
        icon: Library,
        href: resource.url,
        external: true,
      }),
    );
  }

  /* Resources are authored per lesson and per module, so the same one can be
   * attached twice — and the library may list the same URL again. Keep one row
   * per link, preferring the library's richer entry. */
  const byUrl = new Map<string, SearchDocument>();
  const seenIds = new Set<string>();
  const result: SearchDocument[] = [];

  for (const document of documents) {
    if (seenIds.has(document.id)) continue;

    if (document.type === 'resource') {
      const existing = byUrl.get(document.href);
      if (existing !== undefined) {
        /* A later library entry replaces the curriculum one in place. */
        if (document.id.startsWith('library:')) {
          result[result.indexOf(existing)] = document;
          byUrl.set(document.href, document);
          seenIds.add(document.id);
        }
        continue;
      }
      byUrl.set(document.href, document);
    }

    seenIds.add(document.id);
    result.push(document);
  }

  return result;
}

let cached: readonly SearchDocument[] | null = null;

/** The static half of the index, built once per page load. */
export function getCurriculumDocuments(): readonly SearchDocument[] {
  cached ??= buildCurriculumDocuments();
  return cached;
}

/* -------------------------------------------------------------------------- */
/* Notes                                                                       */
/* -------------------------------------------------------------------------- */

function noteHint(note: Note): string {
  switch (note.scope.kind) {
    case 'lesson':
      return 'Lesson note';
    case 'module':
      return 'Module note';
    case 'project':
      return 'Project note';
    case 'free':
      return 'Note';
  }
}

/**
 * Notes are matched on title, tags, and the opening of the body. Indexing a
 * whole note would let a passing mention outrank its own title, and the row has
 * no room to show where the match was.
 */
export function buildNoteDocuments(
  notes: Readonly<Record<string, Note>>,
): readonly SearchDocument[] {
  return Object.values(notes).map((note) =>
    make({
      id: `note:${note.id}`,
      type: 'note',
      title: note.title.trim() === '' ? 'Untitled note' : note.title,
      hint: noteHint(note),
      keywords: `${note.tags.join(' ')} ${note.body.slice(0, 400)}`,
      icon: FileText,
      href: `/notes?note=${note.id}`,
    }),
  );
}
