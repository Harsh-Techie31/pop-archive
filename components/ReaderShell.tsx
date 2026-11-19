'use client';

import { useEffect, useRef, useState } from 'react';

/* the reader section: plays the entry motion (title lifts, summary wipes in)
   each time a blog opens, and moves focus to "Back to home" */
export default function ReaderShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('.back')?.focus({ preventScroll: true });
    const t = setTimeout(() => setEntering(false), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={ref} className={`view view--reader${entering ? ' is-entering' : ''}`}>
      {children}
    </section>
  );
}
