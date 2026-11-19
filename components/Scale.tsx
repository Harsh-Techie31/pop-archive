'use client';

import { useEffect } from 'react';

/* The design is drawn at 1512 wide — --s turns a design px into a real px.
   SCALE_SCRIPT runs inline in <head> so the first paint is already scaled;
   the component keeps it right on resize and when a scrollbar comes or goes. */
export const SCALE_SCRIPT = `document.documentElement.style.setProperty('--s',String(document.documentElement.clientWidth/1512));`;

export default function Scale() {
  useEffect(() => {
    const root = document.documentElement;
    const set = () => root.style.setProperty('--s', String(root.clientWidth / 1512));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);
  return null;
}
