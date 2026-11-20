/* plain <img>: the art is positioned in % of the card, not sized by next/image */
import type { StickerSpot } from '@/lib/content';
import { ART_BOX, CARD_H, CARD_W, cardArt } from '@/lib/art';

/* one export, placed so its panel lands exactly on the card box */
export function ArtImg({ src, className = '' }: { src: string; className?: string }) {
  const [cw, ch, ox, oy] = ART_BOX[src];
  return (
    <img
      className={`folder__art ${className}`.trim()}
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        left: `${((-ox / CARD_W) * 100).toFixed(4)}%`,
        top: `${((-oy / CARD_H) * 100).toFixed(4)}%`,
        width: `${((cw / CARD_W) * 100).toFixed(4)}%`,
        height: `${((ch / CARD_H) * 100).toFixed(4)}%`,
      }}
    />
  );
}

/* a card's two pictures: the closed folder, and the one opened a little,
   which cross-fades in on hover */
export function CardArt({ slug, hover = true }: { slug: string; hover?: boolean }) {
  const art = cardArt(slug);
  return (
    <>
      <ArtImg src={art.base} />
      {hover && <ArtImg src={art.hover} className="folder__art--hover" />}
    </>
  );
}

/* `box` is the design size the coordinates were measured against, so the same
   list works on the full card and on the smaller end-section card */
export function StickerLayer({ list, box = [CARD_W, CARD_H] }: { list: StickerSpot[]; box?: [number, number] }) {
  const [W, H] = box;
  return (
    <div className="folder__stickers">
      {list.map((s, i) => (
        <img
          key={i}
          src={s.src}
          alt=""
          draggable={false}
          style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%`, width: `${(s.w / W) * 100}%` }}
        />
      ))}
    </div>
  );
}
