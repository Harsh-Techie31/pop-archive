'use client';

import { useEffect } from 'react';
import { fitPage } from '@/lib/fit';

/* Keeps --s / --mshift / --mk right on resize and when a scrollbar comes or goes.
   The first paint is handled by the inline script in app/layout.tsx. */
export default function Scale({ folders }: { folders: number }) {
  useEffect(() => {
    const fit = () => fitPage(folders);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(document.documentElement);
    window.addEventListener('resize', fit); // height-only changes don't resize <html>'s width
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [folders]);
  return null;
}
