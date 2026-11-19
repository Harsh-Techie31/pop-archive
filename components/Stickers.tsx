'use client';

import { useRef, useState, type PointerEvent } from 'react';
import type { StickerSpot } from '@/lib/content';

/* draggable stickers inside the open folder */
export default function Stickers({ list }: { list: StickerSpot[] }) {
  const layer = useRef<HTMLDivElement>(null);
  return (
    <div className="stickers" ref={layer}>
      {list.map((s, i) => (
        <Sticker key={i} spot={s} bounds={layer} />
      ))}
    </div>
  );
}

type Grab = { dx: number; dy: number; w: number; h: number; b: DOMRect };

function Sticker({ spot, bounds }: { spot: StickerSpot; bounds: React.RefObject<HTMLDivElement | null> }) {
  // null = still at its Figma slot (scales with --s); once dragged it's in real px
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [held, setHeld] = useState(false);
  const grab = useRef<Grab | null>(null);

  function down(e: PointerEvent<HTMLImageElement>) {
    if (!bounds.current) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    grab.current = {
      dx: e.clientX - r.left,
      dy: e.clientY - r.top,
      w: r.width,
      h: r.height,
      b: bounds.current.getBoundingClientRect(),
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setHeld(true);
  }

  function move(e: PointerEvent<HTMLImageElement>) {
    const g = grab.current;
    if (!g) return;
    const x = e.clientX - g.b.left - g.dx;
    const y = e.clientY - g.b.top - g.dy;
    setPos({
      left: Math.max(-40, Math.min(x, g.b.width - g.w + 40)),
      top: Math.max(-40, Math.min(y, g.b.height - g.h + 40)),
    });
  }

  function up() {
    grab.current = null;
    setHeld(false);
  }

  return (
    <img
      className={`sticker${held ? ' is-held' : ''}`}
      src={spot.src}
      alt=""
      draggable={false}
      style={{
        left: pos ? `${pos.left}px` : `calc(${spot.x}px * var(--s))`,
        top: pos ? `${pos.top}px` : `calc(${spot.y}px * var(--s))`,
        width: `calc(${spot.w}px * var(--s))`,
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    />
  );
}
