'use client';

import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { IntegrityReport, IntegritySeverity } from '@/lib/curriculum/integrity';
import { DataControls } from './data-controls';

const SEVERITY_TONE: Record<IntegritySeverity, BadgeTone> = {
  error: 'danger',
  warning: 'warning',
  info: 'neutral',
};

/**
 * The report is computed on the server and passed in, so the tab shell can be
 * a client component without dragging curriculum queries into the browser.
 */
export function SettingsTabs({ report }: { report: IntegrityReport }) {
  return (
    <Tabs defaultValue="data">
      <TabsList>
        <TabsTrigger value="data">Stored data</TabsTrigger>
        <TabsTrigger value="integrity">Curriculum integrity</TabsTrigger>
      </TabsList>

      <TabsContent value="data">
        <DataControls />
      </TabsContent>

      <TabsContent value="integrity">
        <p className="mb-5 max-w-measure text-small text-text-muted">
          The syllabus is authored by hand, so its invariants are checked rather than
          assumed: unique identifiers, five lessons per module, valid competency tags.
        </p>

        <dl className="mb-6 flex flex-wrap gap-x-10 gap-y-3">
          <Figure label="Modules" value={report.moduleCount} />
          <Figure label="Lessons" value={report.lessonCount} />
          <Figure label="Errors" value={report.errorCount} />
          <Figure label="Warnings" value={report.warningCount} />
        </dl>

        {report.issues.length === 0 ? (
          <p className="text-small text-text-muted">No issues reported.</p>
        ) : (
          <ul className="border-t border-border">
            {report.issues.map((issue, index) => (
              <li
                key={`${issue.scope}-${index}`}
                className="flex items-baseline gap-3 border-b border-border py-3"
              >
                <Badge tone={SEVERITY_TONE[issue.severity]}>{issue.severity}</Badge>
                <div className="min-w-0">
                  <p className="font-mono text-code text-text-muted">{issue.scope}</p>
                  <p className="mt-0.5 text-small text-text-secondary">{issue.message}</p>
                  {issue.file !== undefined && (
                    <p className="mt-1 font-mono text-code text-text-muted">
                      {issue.file}
                    </p>
                  )}
                  {issue.fix !== undefined && (
                    <p className="mt-1 text-small text-text-muted">Fix: {issue.fix}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-caption uppercase text-text-muted">{label}</dt>
      <dd className="mt-1 text-heading text-text-primary" data-numeric>
        {value}
      </dd>
    </div>
  );
}
