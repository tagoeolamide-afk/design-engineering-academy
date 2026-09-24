import { redirect } from 'next/navigation';

/**
 * The dashboard lives at `/`, which is where the sidebar and the command
 * palette have always pointed. This alias exists so `/dashboard` resolves for
 * anyone — or anything — that expects the conventional URL, without moving the
 * real route and rewriting every link to it.
 */
export default function DashboardAliasPage() {
  redirect('/');
}
