'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/* paper punch holes, one every ~119px like the design */
export default function PaperHoles() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(4);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setCount(Math.max(4, Math.round(node.offsetHeight / 119)));
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
