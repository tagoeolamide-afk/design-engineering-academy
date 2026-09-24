'use client';

import { Library, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { ResourceRow } from './resource-row';
import { useResourceMarks, useResourcesHydrated } from '@/lib/hooks/use-resources';
import {
  EMPTY_RESOURCE_FILTER,
  filterResources,
  getAllResources,
  groupByCategory,
  isResourceFilterActive,
  type ResourceFilter,
} from '@/lib/resources/library';
import { formatCountOf } from '@/lib/utils/format';
import {
  LIBRARY_RESOURCE_TYPES,
  LIBRARY_RESOURCE_TYPE_LABELS,
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_DESCRIPTIONS,
  RESOURCE_CATEGORY_LABELS,
  RESOURCE_DIFFICULTIES,
  RESOURCE_DIFFICULTY_LABELS,
  RESOURCE_STATUSES,
  RESOURCE_STATUS_LABELS,
  isLibraryResourceType,
  isResourceCategory,
  isResourceDifficulty,
  isResourceStatus,
} from '@/types/resources';

/**
 * The library: filters above, then everything grouped by category.
 *
 * Filtering runs against the whole catalogue on every keystroke — there are
 * fewer than a hundred entries, so anything cleverer would be ceremony.
 */
export function ResourceLibrary() {
  const [filter, setFilter] = useState<ResourceFilter>(EMPTY_RESOURCE_FILTER);
  const marks = useResourceMarks();
  const hydrated = useResourcesHydrated();

  const all = getAllResources();

  const visible = useMemo(
    /* Before hydration there are no marks to filter by, so a status filter
     * would silently hide everything. Treated as no marks rather than as
     * unknown, and resolved inside the memo so the empty object does not get a
     * new identity on every render. */
    () => filterResources(all, filter, hydrated ? marks : {}),
    [all, filter, marks, hydrated],
  );
  const groups = useMemo(() => groupByCategory(visible), [visible]);

  const active = isResourceFilterActive(filter);
  const markedCount = hydrated ? Object.keys(marks).length : 0;

  return (
    <div className="space-y-8">
      <section aria-label="Filter resources" className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <TextField
              type="search"
              label="Search"
              placeholder="Title, author, or reason"
              value={filter.query}
              onChange={(event) =>
                setFilter((current) => ({ ...current, query: event.target.value }))
              }
            />
          </div>

          <SelectField
            label="Category"
            value={filter.category}
            onChange={(event) =>
              setFilter((current) => ({
                ...current,
                category: isResourceCategory(event.target.value)
                  ? event.target.value
                  : 'all',
              }))
            }
          >
            <option value="all">All categories</option>
            {RESOURCE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {RESOURCE_CATEGORY_LABELS[category]}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Type"
            value={filter.type}
            onChange={(event) =>
              setFilter((current) => ({
                ...current,
                type: isLibraryResourceType(event.target.value)
                  ? event.target.value
                  : 'all',
              }))
            }
          >
            <option value="all">All types</option>
            {LIBRARY_RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {LIBRARY_RESOURCE_TYPE_LABELS[type]}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Difficulty"
            value={filter.difficulty}
            onChange={(event) =>
              setFilter((current) => ({
                ...current,
                difficulty: isResourceDifficulty(event.target.value)
                  ? event.target.value
                  : 'all',
              }))
            }
          >
            <option value="all">Any difficulty</option>
            {RESOURCE_DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {RESOURCE_DIFFICULTY_LABELS[difficulty]}
              </option>
            ))}
          </SelectField>

          <SelectField
            label="Marked"
            value={filter.status}
            onChange={(event) => {
              const value = event.target.value;
              setFilter((current) => ({
                ...current,
                status:
                  value === 'unmarked' || isResourceStatus(value) ? value : 'any',
              }));
            }}
          >
            <option value="any">Any mark</option>
            {RESOURCE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {RESOURCE_STATUS_LABELS[status]}
              </option>
            ))}
            <option value="unmarked">Not marked</option>
          </SelectField>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-caption uppercase text-text-muted" role="status">
            {active
              ? `${visible.length} of ${formatCountOf(all.length, 'resource')}`
              : formatCountOf(all.length, 'resource')}
            {markedCount > 0 && ` · ${markedCount} marked`}
          </p>

          {active && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => setFilter(EMPTY_RESOURCE_FILTER)}
            >
              <X aria-hidden size={15} strokeWidth={2} />
              Clear filters
            </Button>
          )}
        </div>
      </section>

      {groups.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No resources match these filters"
          description="Nothing in the library fits this combination. Clearing the filters brings the whole catalogue back."
        />
      ) : (
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.category} aria-labelledby={`category-${group.category}`}>
              <div className="border-b border-border pb-3">
                <div className="flex items-baseline justify-between gap-4">
                  <h2
                    id={`category-${group.category}`}
                    className="text-heading text-text-primary"
                  >
                    {RESOURCE_CATEGORY_LABELS[group.category]}
                  </h2>
                  <span
                    className="shrink-0 text-caption uppercase text-text-muted"
                    data-numeric
                  >
                    {formatCountOf(group.resources.length, 'resource')}
                  </span>
                </div>
                <p className="mt-1.5 max-w-measure text-small text-text-muted">
                  {RESOURCE_CATEGORY_DESCRIPTIONS[group.category]}
                </p>
              </div>

              <ul>
                {group.resources.map((resource) => (
                  <ResourceRow key={resource.id} resource={resource} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
