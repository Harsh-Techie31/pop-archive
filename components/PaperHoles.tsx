'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/* Paper punch holes. The frame puts the first hole's centre 68 design px down
   the page and one every 119 after that; CSS does the spacing, this only
   counts how many fit. */
export default function PaperHoles() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(4);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      const s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--s')) || 1;
      const h = node.offsetHeight / s;
      setCount(Math.max(4, Math.floor((h - 58 - 20) / 119) + 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="paper__holes" aria-hidden="true" ref={ref}>
      {Array.from({ length: count }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}
