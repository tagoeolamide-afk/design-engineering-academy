import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { THEME_INIT_SCRIPT } from '@/lib/theme/theme';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Design Engineering Academy',
    template: '%s · Design Engineering Academy',
  },
  description:
    'A staged path from product design fundamentals to elite design engineering.',
};

export const viewport: Viewport = {
  /* Both entries are declared so the browser chrome matches the active theme
   * rather than flashing the opposite one behind the page. */
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0f' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* suppressHydrationWarning: the inline script below sets data-theme before
     * React hydrates, which is the point — it prevents a flash of the wrong
     * theme, and React must not treat that attribute as a mismatch. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <TooltipProvider delayDuration={300} skipDelayDuration={300}>
          {/* The frame is applied per route group: the learning application
              gets the sidebar, the authentication pages deliberately do not. */}
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
