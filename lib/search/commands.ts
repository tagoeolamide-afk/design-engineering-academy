/**
 * The command half of the palette.
 *
 * Commands are built from live state rather than being a static list, so
 * "Continue current lesson" names the actual lesson and "Open current project"
 * resolves to the project the learner is actually working toward. A command
 * that cannot resolve is omitted, never shown disabled — an inert row in a
 * search result list is noise.
 */

import {
  ArrowRight,
  BookOpen,
  FileText,
  FolderGit2,
  LayoutDashboard,
  Library,
  Monitor,
  Moon,
  Settings,
  Sun,
  SunMoon,
  Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { applyTheme, readStoredTheme, type ThemeMode } from '@/lib/theme/theme';
import type { RecommendedAction } from '@/lib/progress/next-action';
import type { SearchDocument } from './types';

export interface CommandContext {
  readonly action: RecommendedAction;
  /** False until persisted progress is readable; context-aware commands wait. */
  readonly hydrated: boolean;
  readonly navigate: (href: string) => void;
}

function command(
  id: string,
  title: string,
  hint: string,
  icon: LucideIcon,
  keywords: string,
  run: () => void,
): SearchDocument {
  return {
    id: `command:${id}`,
    type: 'command',
    title,
    hint,
    keywords,
    icon,
    href: '',
    run,
    haystack: {
      title: title.toLowerCase(),
      hint: hint.toLowerCase(),
      keywords: keywords.toLowerCase(),
    },
  };
}

/**
 * Light and dark are the two states anyone means by "toggle"; system is a
 * separate, explicit choice. Toggling reads the stored preference so it flips
 * from what is actually in effect.
 */
function toggleTheme(): void {
  const current = readStoredTheme();
  const resolved: ThemeMode =
    current === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : current;

  applyTheme(resolved === 'dark' ? 'light' : 'dark');
}

/** The lesson and project the learner is currently working on, if any. */
function currentWork(action: RecommendedAction): {
  lessonTitle: string | null;
  lessonHref: string | null;
  projectTitle: string | null;
  projectHref: string | null;
} {
  switch (action.kind) {
    case 'resume-lesson':
    case 'start-lesson':
      return {
        lessonTitle: action.lesson.title,
        lessonHref: `/curriculum/${action.courseModule.slug}/${action.lesson.slug}`,
        projectTitle: action.courseModule.project.title,
        projectHref: `/projects/${action.courseModule.slug}`,
      };
    case 'finish-project':
      return {
        lessonTitle: null,
        lessonHref: null,
        projectTitle: action.project.title,
        projectHref: `/projects/${action.courseModule.slug}`,
      };
    default:
      return { lessonTitle: null, lessonHref: null, projectTitle: null, projectHref: null };
  }
}

export function buildCommands({
  action,
  hydrated,
  navigate,
}: CommandContext): readonly SearchDocument[] {
  const commands: SearchDocument[] = [];
  const work = hydrated
    ? currentWork(action)
    : { lessonTitle: null, lessonHref: null, projectTitle: null, projectHref: null };

  const { lessonTitle, lessonHref, projectTitle, projectHref } = work;

  if (lessonHref !== null && lessonTitle !== null) {
    const resuming = action.kind === 'resume-lesson';
    commands.push(
      command(
        'continue-lesson',
        resuming ? `Continue: ${lessonTitle}` : `Start: ${lessonTitle}`,
        resuming ? 'Resume' : 'Next up',
        ArrowRight,
        'continue current lesson resume next carry on',
        () => navigate(lessonHref),
      ),
    );
  }

  if (projectHref !== null && projectTitle !== null) {
    commands.push(
      command(
        'current-project',
        `Open current project: ${projectTitle}`,
        'Project',
        FolderGit2,
        'open current project build',
        () => navigate(projectHref),
      ),
    );
  }

  commands.push(
    command(
      'dashboard',
      'Open dashboard',
      'Navigate',
      LayoutDashboard,
      'home overview progress',
      () => navigate('/'),
    ),
    command(
      'curriculum',
      'Open curriculum',
      'Navigate',
      BookOpen,
      'modules lessons path course',
      () => navigate('/curriculum'),
    ),
    command(
      'projects',
      'Open projects',
      'Navigate',
      FolderGit2,
      'builds portfolio',
      () => navigate('/projects'),
    ),
    command(
      'skills',
      'Open skills',
      'Navigate',
      Target,
      'competencies evidence',
      () => navigate('/skills'),
    ),
    command(
      'notes',
      'Open notes',
      'Navigate',
      FileText,
      'writing scratch',
      () => navigate('/notes'),
    ),
    command(
      'resources',
      'Open resources',
      'Navigate',
      Library,
      'reading reference links',
      () => navigate('/resources'),
    ),
    command(
      'settings',
      'Open settings',
      'Navigate',
      Settings,
      'preferences theme reset data',
      () => navigate('/settings'),
    ),
    command(
      'toggle-theme',
      'Toggle theme',
      'Theme',
      SunMoon,
      'dark light mode switch appearance',
      toggleTheme,
    ),
    command(
      'theme-system',
      'Match system theme',
      'Theme',
      Monitor,
      'auto appearance os',
      () => applyTheme('system'),
    ),
    command(
      'theme-dark',
      'Switch to dark theme',
      'Theme',
      Moon,
      'appearance night',
      () => applyTheme('dark'),
    ),
    command(
      'theme-light',
      'Switch to light theme',
      'Theme',
      Sun,
      'appearance day bright',
      () => applyTheme('light'),
    ),
  );

  return commands;
}
