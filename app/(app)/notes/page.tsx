import type { Metadata } from 'next';
import { Suspense } from 'react';
import { NotesWorkspace } from '@/components/notes/notes-workspace';
import { PageLayout } from '@/components/shell/page-layout';
import { PageHeader } from '@/components/ui/page-header';

export const metadata: Metadata = { title: 'Notes' };

export default function NotesPage() {
  return (
    <PageLayout className="max-w-6xl">
      <PageHeader
        eyebrow="Notes"
        title="Your writing"
        description="Notes can stand alone or attach to a lesson, a module, or a project. They save themselves as you type, and resetting progress never touches them."
      />
      {/* The workspace reads ?note= so global search can open a note directly.
          Reading search params opts a client component out of static rendering
          unless it sits behind a boundary, so this page keeps its shell static
          and streams the workspace in. */}
      <Suspense
        fallback={
          <p className="text-small text-text-muted" role="status">
            Loading notes…
          </p>
        }
      >
        <NotesWorkspace />
      </Suspense>
    </PageLayout>
  );
}
