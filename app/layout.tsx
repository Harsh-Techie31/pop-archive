import type { Metadata, Viewport } from 'next';
import { awesomeSerif, figtree } from './fonts';
import SvgDefs from '@/components/SvgDefs';
import Scale, { SCALE_SCRIPT } from '@/components/Scale';
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
    // --s is written onto <html> before hydration, so React must not flag it
    <html lang="en" className={`${figtree.variable} ${awesomeSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCALE_SCRIPT }} />
      </head>
      <body>
        <SvgDefs />
        <Scale />
        {children}
      </body>
    </html>
  );
}
