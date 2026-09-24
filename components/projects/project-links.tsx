'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useProgressHydrated, useProjectRecord } from '@/lib/hooks/use-progress';
import { isAcceptableLink } from '@/lib/utils/url';
import { presentProjectLink } from '@/lib/progress/project-links';
import { useProgressStore } from '@/stores/progress-store';
import { PROJECT_LINK_KINDS, type ProjectLinks } from '@/types/progress';

/**
 * The four places a project lives.
 *
 * Validation goes no further than "is this a usable http address" — whether the
 * page exists or what is on it is not this application's business. An empty
 * field is always valid, because clearing a link is a normal thing to do.
 */
export function ProjectLinksPanel({
  projectId,
  moduleId,
}: {
  projectId: string;
  moduleId: string;
}) {
  const record = useProjectRecord(projectId);
  const hydrated = useProgressHydrated();

  if (!hydrated) {
    return (
      <p className="text-small text-text-muted" role="status">
        Loading links…
      </p>
    );
  }

  const links: ProjectLinks = record?.links ?? {
    figma: '',
    github: '',
    live: '',
    caseStudy: '',
  };

  return (
    <LinksEditor key={projectId} projectId={projectId} moduleId={moduleId} links={links} />
  );
}

function LinksEditor({
  projectId,
  moduleId,
  links,
}: {
  projectId: string;
  moduleId: string;
  links: ProjectLinks;
}) {
  const setProjectLink = useProgressStore((state) => state.setProjectLink);
  const [draft, setDraft] = useState<ProjectLinks>(links);
  const [saved, setSaved] = useState<ProjectLinks>(links);

  const invalid = PROJECT_LINK_KINDS.filter((kind) => !isAcceptableLink(draft[kind]));
  const isDirty = PROJECT_LINK_KINDS.some((kind) => draft[kind] !== saved[kind]);

  function save() {
    for (const kind of PROJECT_LINK_KINDS) {
      if (draft[kind] === saved[kind]) continue;
      if (!isAcceptableLink(draft[kind])) continue;
      setProjectLink(projectId, moduleId, kind, draft[kind].trim());
    }
    setSaved(draft);
  }

  return (
    <div>
      <div className="space-y-3">
        {PROJECT_LINK_KINDS.map((kind) => {
          const value = draft[kind];
          const isInvalid = !isAcceptableLink(value);
          const savedValue = saved[kind];

          return (
            <div key={kind}>
              <TextField
                label={presentProjectLink(kind).label}
                type="url"
                inputMode="url"
                placeholder={presentProjectLink(kind).placeholder}
                value={value}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [kind]: event.target.value }))
                }
                {...(isInvalid
                  ? { error: 'That does not look like a web address.' }
                  : {})}
              />

              {/* The saved link is shown as a real link, so it can be checked. */}
              {savedValue.trim() !== '' && savedValue === value && !isInvalid && (
                <a
                  href={savedValue}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1.5 inline-flex items-center gap-1 text-caption text-text-muted underline decoration-border underline-offset-4 hover:text-text-secondary"
                >
                  Open
                  <ArrowUpRight aria-hidden size={13} strokeWidth={2} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={!isDirty || invalid.length > 0}>
          Save links
        </Button>
        <span className="text-small text-text-muted" role="status">
          {invalid.length > 0
            ? 'Fix the highlighted address to save'
            : isDirty
              ? 'Unsaved changes'
              : 'Saved'}
        </span>
      </div>
    </div>
  );
}
