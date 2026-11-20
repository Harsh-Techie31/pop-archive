'use client';

import { Fragment, useMemo, type CSSProperties, type ElementType } from 'react';
import { FLAP_MS, REVEAL_DUR, REVEAL_SPAN, REVEAL_START } from '@/lib/transition';
import { useRevealing } from './ReaderShell';

/* The header text arriving.
   Every letter turns up broken — clipped to a narrow band of itself, so the M
   of "Motion" reads as a bare stem or the arm of an F appears on its own — and
   the band opens out until the letter is whole. Bands run left to right across
   the line. Each letter's band is picked at random, about three in five a
   vertical slice and the rest horizontal, which stops the line resolving in
   lockstep. Words stay unbreakable so a wrapped line still breaks between them.
   Outside the reveal it's plain text. */
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
  const parts = useMemo(() => (revealing ? split(text) : null), [revealing, text]);

  if (!parts) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag className={className} aria-label={text}>
      {parts.map((p, i) =>
        p.space ? (
          <Fragment key={i}>{p.space}</Fragment>
        ) : (
          <span key={i} className="word" aria-hidden="true">
            {p.glyphs!.map((g, j) => (
              <span key={j} className="glyph" style={g.style}>
                {g.ch}
              </span>
            ))}
          </span>
        ),
      )}
    </Tag>
  );
}

type Part = { space?: string; glyphs?: { ch: string; style: CSSProperties }[] };

function split(text: string): Part[] {
  const parts: Part[] = [];
  const all: { ch: string; style: CSSProperties }[] = [];
  for (const chunk of text.split(/(\s+)/)) {
    if (!chunk) continue;
    if (/^\s+$/.test(chunk)) {
      parts.push({ space: chunk });
      continue;
    }
    const glyphs = [...chunk].map((ch) => ({ ch, style: {} as CSSProperties }));
    all.push(...glyphs);
    parts.push({ glyphs });
  }
  const n = all.length;
  all.forEach((g, i) => {
    const at = n > 1 ? i / (n - 1) : 0;
    const v: Record<string, string> = {
      '--d': `${Math.round(FLAP_MS + REVEAL_START + at * REVEAL_SPAN)}ms`,
      '--dur': `${REVEAL_DUR}ms`,
    };
    if (Math.random() < 0.62) {
      // a slice down the letter
      const l = 10 + Math.random() * 45;
      const w = 12;
      v['--band'] = `inset(-25% ${(100 - l - w).toFixed(1)}% -25% ${l.toFixed(1)}%)`;
      v['--mid'] = `inset(-25% ${Math.max(0, 100 - l - w - 24).toFixed(1)}% -25% ${Math.max(0, l - 9).toFixed(1)}%)`;
    } else {
      // a slice across it
      const t = 8 + Math.random() * 44;
      const h = 18;
      v['--band'] = `inset(${t.toFixed(1)}% -6% ${(100 - t - h).toFixed(1)}% -6%)`;
      v['--mid'] = `inset(${Math.max(0, t - 15).toFixed(1)}% -6% ${Math.max(0, 100 - t - h - 17).toFixed(1)}% -6%)`;
    }
    g.style = v as CSSProperties;
  });
  return parts;
}
