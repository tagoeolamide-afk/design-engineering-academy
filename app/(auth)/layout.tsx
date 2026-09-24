import type { ReactNode } from 'react';
import Link from 'next/link';
import { Wordmark } from '@/components/shell/logo';

/**
 * The frame for signing in.
 *
 * No sidebar: primary navigation and a progress readout are meaningless before
 * there is an account to read progress from, and every link would bounce
 * straight back here. Same tokens, same type scale, same surfaces as the rest
 * of the application — a single centred column rather than a second design.
 */
export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center px-4 md:px-6">
        <Link href="/" className="min-w-0 rounded-medium px-2.5 py-1">
          <Wordmark />
        </Link>
      </header>

      <main id="main" className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
