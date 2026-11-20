'use client';

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ElementType } from 'react';
import { FLAP_MS, REVEAL_DUR, REVEAL_SPAN, REVEAL_START } from '@/lib/transition';
import { useRevealing } from './ReaderShell';

/* The header text arriving.
   Every letter turns up broken — clipped to a narrow band of itself, so the M
   of "Motion" reads as a bare stem or the arm of an F appears on its own — and
   the band opens out until the letter is whole. Bands run left to right across
   the line; each letter's band is picked at random, about three in five a
   vertical slice and the rest horizontal, so the line doesn't resolve in lockstep.

   How it's laid out: the real text is set (invisibly) exactly as it will settle,
   kerning and wrapping and all, and each letter is measured off it. A boxed copy
   of every letter is then placed on its measured spot, so the letters animate one
   by one in every browser (clipping a box works everywhere, clipping a run of
   text doesn't) and sit exactly where the plain text lands when it comes back. */
export default function GlyphText({
  as: Tag = 'p',
  className,
  text,
}: {
  as?: ElementType;
  className?: string;
  text: string;
}) {
  const revealing = useRevealing();
  const host = useRef<HTMLElement>(null);
  const [spots, setSpots] = useState<{ x: number; y: number }[] | null>(null);
  const looks = useMemo(() => (revealing ? bands(text) : null), [revealing, text]);

  useLayoutEffect(() => {
    if (!revealing) return;
    const el = host.current;
    const node = el?.querySelector('.glyph-base')?.firstChild;
    if (!el || !node) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const box = el.getBoundingClientRect();
    const range = document.createRange();
    const out: { x: number; y: number }[] = [];
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text[i])) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getClientRects()[0] ?? range.getBoundingClientRect();
      out.push({ x: r.left - box.left, y: r.top - box.top });
    }
    setSpots(out);
  }, [revealing, text]);

  if (!revealing || !looks) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={host} className={className} aria-label={text}>
      {/* the text as it will settle — invisible, it only sets the layout */}
      <span className="glyph-base" aria-hidden="true">
        {text}
      </span>
      {spots &&
        looks.map((g, i) => (
          <span
            key={i}
            className="glyph"
            aria-hidden="true"
            style={{ ...g.style, left: spots[i]?.x ?? 0, top: spots[i]?.y ?? 0 }}
          >
            {g.ch}
          </span>
        ))}
    </Tag>
  );
}

/* every non-space letter: its delay and the band it starts as */
function bands(text: string) {
  const letters = [...text].filter((c) => !/\s/.test(c));
  const n = letters.length;
  return letters.map((ch, i) => {
    const at = n > 1 ? i / (n - 1) : 0;
    const v: Record<string, string> = {
      '--d': `${Math.round(FLAP_MS + REVEAL_START + at * REVEAL_SPAN)}ms`,
      '--dur': `${REVEAL_DUR}ms`,
    };
    if (Math.random() < 0.62) {
      // a slice down the letter
      const l = 10 + Math.random() * 45;
      const w = 12;
      v['--band'] = `inset(-60% ${(100 - l - w).toFixed(1)}% -60% ${l.toFixed(1)}%)`;
      v['--mid'] = `inset(-60% ${Math.max(0, 100 - l - w - 24).toFixed(1)}% -60% ${Math.max(0, l - 9).toFixed(1)}%)`;
    } else {
      // a slice across it
      const t = 8 + Math.random() * 44;
      const h = 18;
      v['--band'] = `inset(${t.toFixed(1)}% -70% ${(100 - t - h).toFixed(1)}% -70%)`;
      v['--mid'] = `inset(${Math.max(0, t - 15).toFixed(1)}% -70% ${Math.max(0, 100 - t - h - 17).toFixed(1)}% -70%)`;
    }
    return { ch, style: v as CSSProperties };
  });
}
