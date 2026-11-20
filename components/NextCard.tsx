'use client';

import { useRef, type MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Blog } from '@/lib/content';
import { END_CARD_BOX, END_STICKERS, END_STICKERS_BY_SLUG, cardArt } from '@/lib/art';
import { reducedMotion, setPending } from '@/lib/transition';
import { ArtImg, StickerLayer } from './Card';

/* The end of the article: the next blog. It arrives the same way a home pick
   does — the little card turns open where it sits — whether it's picked from
   the text link or the card. */
export default function NextCard({ next }: { next: Blog }) {
  const router = useRouter();
  const card = useRef<HTMLAnchorElement>(null);
  const href = `/${next.slug}`;

  function go(e: MouseEvent) {
    if (reducedMotion() || !card.current || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setPending(next.slug, card.current.getBoundingClientRect());
    router.push(href);
  }

  return (
    <div className="next__inner">
      <Link className="next__link" href={href} onClick={go}>
        <img className="next__arrow" src="/assets/ui/arrow.svg" alt="" aria-hidden="true" />
        <span className="next__text">
          <span className="next__title">{next.title}</span>
          <span className="next__dek">{next.dek}</span>
          <span className="next__read">{next.readTime}</span>
        </span>
      </Link>
      <Link
        ref={card}
        className="next__folder"
        href={href}
        onClick={go}
        data-theme={next.theme}
        aria-label={`Read ${next.title}`}
      >
        <ArtImg src={cardArt(next.slug).base} />
        <StickerLayer list={END_STICKERS_BY_SLUG[next.slug] ?? END_STICKERS} box={END_CARD_BOX} />
      </Link>
    </div>
  );
}
