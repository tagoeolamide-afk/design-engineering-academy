import type { Route } from 'next';
import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  FileText,
  FolderGit2,
  LayoutDashboard,
  Waypoints,
  Library,
  Settings,
  Target,
} from 'lucide-react';

export interface NavItem {
  readonly href: Route;
  readonly label: string;
  readonly icon: LucideIcon;
  /** Child routes match by prefix, so a lesson keeps Curriculum active. */
  readonly matchPrefix: boolean;
}

/**
 * The primary destinations. Search is not here: it opens an overlay rather
 * than navigating, so it is rendered as an action beneath this list.
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, matchPrefix: false },
  { href: '/curriculum', label: 'Curriculum', icon: BookOpen, matchPrefix: true },
  { href: '/projects', label: 'Projects', icon: FolderGit2, matchPrefix: true },
  { href: '/skills', label: 'Skills', icon: Target, matchPrefix: true },
  { href: '/connections', label: 'Connections', icon: Waypoints, matchPrefix: true },
  { href: '/notes', label: 'Notes', icon: FileText, matchPrefix: true },
  { href: '/resources', label: 'Resources', icon: Library, matchPrefix: true },
  { href: '/settings', label: 'Settings', icon: Settings, matchPrefix: true },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (!item.matchPrefix) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
