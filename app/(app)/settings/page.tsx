import type { Metadata } from 'next';
import { PageLayout } from '@/components/shell/page-layout';
import { AccountPanel } from '@/components/settings/account-panel';
import { SettingsTabs } from '@/components/settings/settings-tabs';
import { PageHeader } from '@/components/ui/page-header';
import { checkCurriculumIntegrity } from '@/lib/curriculum/integrity';
import { CURRICULUM } from '@/lib/curriculum/queries';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata: Metadata = { title: 'Settings' };

/* Reads the signed-in user, so this page is per-request and must never be
 * served from a shared cache. */
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const report = checkCurriculumIntegrity(CURRICULUM);

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Settings"
        title="Account, data and integrity"
        description={
          isSupabaseConfigured()
            ? 'Your learning data is stored on this device. An account lets it follow you to another one.'
            : 'This application is local-first. Nothing is sent anywhere, and there is no account.'
        }
      />
      <AccountPanel />
      <SettingsTabs report={report} />
    </PageLayout>
  );
}
