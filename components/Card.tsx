/* plain <img>: the art is positioned in % of the card, not sized by next/image */
import type { StickerSpot } from '@/lib/content';
import { CARD_ART } from '@/lib/art';

export function CardArt({ slug }: { slug: string }) {
  return <img className="folder__art" src={CARD_ART[slug]} alt="" aria-hidden="true" draggable={false} />;
}

/* `box` is the design size the coordinates were measured against, so the same
   list works on the full card and on the smaller end-section card */
export function StickerLayer({ list, box = [1512, 879.5] }: { list: StickerSpot[]; box?: [number, number] }) {
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
