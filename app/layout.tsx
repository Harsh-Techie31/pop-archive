import type { Metadata, Viewport } from 'next';
import { awesomeSerif, figtree } from './fonts';
import Scale from '@/components/Scale';
import { fitScript } from '@/lib/fit';
import { BLOGS } from '@/lib/content';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'POP Archive', template: '%s — POP Archive' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // --s / --mshift / --mk are written onto <html> before hydration, so React must not flag them
    <html lang="en" className={`${figtree.variable} ${awesomeSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: fitScript(BLOGS.length) }} />
      </head>
      <body>
        <Scale folders={BLOGS.length} />
        {children}
      </body>
    </html>
  );
}
