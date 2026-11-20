'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { BLOGS } from '@/lib/content';
import { HOME_STICKERS } from '@/lib/art';
import { EXIT_MS, reducedMotion, setPending } from '@/lib/transition';
import { CardArt, StickerLayer } from './Card';

export default function HomeView() {
  const router = useRouter();
  const main = useRef<HTMLElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    BLOGS.forEach((b) => router.prefetch(`/${b.slug}`));

    // old links used #slug — send them to the real page
    const legacy = window.location.hash.slice(1);
    if (legacy && BLOGS.some((b) => b.slug === legacy)) router.replace(`/${legacy}`);
  }, [router]);

  /* Selecting a folder. The folders that weren't picked run down and off the
     bottom edge, and the picked one turns open (components/ReaderShell.tsx)
     starting from exactly where it sits — the two overlap, so there's no dead
     moment, but the order still reads: one leaves, then the other turns.

     The reader is a different page, so the home page is copied as it stands
     and floated over the reader while the others leave. Whatever hover had
     moved the cards to is pinned first; without that, the click drops the
     hover and every card snaps back to rest before setting off. */
  function choose(slug: string, node: HTMLElement) {
    if (busy.current || !main.current) return;
    if (reducedMotion()) {
      router.push(`/${slug}`);
      return;
    }
    busy.current = true;

    const cards = [...main.current.querySelectorAll<HTMLElement>('.folder')];
    const hovered = cards.map((c) => c.matches(':hover') || c.matches(':focus-visible'));
    cards.forEach((c) =>
      c.style.setProperty('--lift', getComputedStyle(c).getPropertyValue('--lift').trim() || '0px'),
    );
    const from = node.getBoundingClientRect(); // after the pinning: the turn begins exactly here

    const ghost = main.current.cloneNode(true) as HTMLElement;
    ghost.classList.add('view--ghost');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.inert = true;
    /* A tile turns where it sits: pick the front one and it opens in front of
       the folders still leaving (the reader's sheet is z 5 while it turns);
       pick one from behind and it opens behind them (the stylesheet's 50). */
    if (node === cards[0]) ghost.style.zIndex = '2';
    const ghostCards = ghost.querySelectorAll<HTMLElement>('.folder');
    ghostCards.forEach((c, i) => hovered[i] && c.classList.add('is-hover'));
    ghostCards[cards.indexOf(node)]?.classList.add('is-chosen');
    document.body.appendChild(ghost);
    void ghost.offsetWidth; // start the exit from where the cards are now
    ghost.classList.add('is-leaving');
    ghost.querySelector('.stack')?.classList.add('is-exiting');
    // kept a little past the exit so nothing is ever cut off mid-move (it's
    // see-through by then: the folders are off screen and the masthead faded)
    setTimeout(() => ghost.remove(), EXIT_MS + 260);

    // Let the exit get going on its own first: loading the article in the same
    // frame can stall its first frames, which is what made it look abrupt.
    // Two frames is ~30ms — the turn starts no later than you'd notice.
    setPending(slug, from);
    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      router.push(`/${slug}`);
    };
    requestAnimationFrame(() => requestAnimationFrame(go));
    setTimeout(go, 50); // background tabs don't run animation frames
  }

  const n = BLOGS.length;

  return (
    <main ref={main} className="view view--home">
      {/* trimmed and scaled by --mshift / --mk (lib/fit.ts) so the stack fits the window height */}
      <div className="masthead">
        <div className="masthead__inner">
          <h1 className="masthead__word">Archive</h1>
          <div className="masthead__veil" aria-hidden="true" />
          <img className="masthead__logo" src="/assets/folder/pop-logo.svg" alt="POP" />
        </div>
      </div>

      <div className="stack">
        {BLOGS.map((b, i) => (
          <button
            key={b.slug}
            type="button"
            className="folder"
            data-theme={b.theme}
            data-slug={b.slug}
            aria-label={`${b.title} — ${b.readTime}`}
            style={
              {
                top: `calc(${(n - 1 - i) * 118.33}px * var(--s))`,
                '--z': n - i,
                // how far this folder rises while the front one is hovered (lib/fit.ts)
                '--behind-lift': i ? `var(--behind-lift-${i}, 0)` : 0,
              } as CSSProperties
            }
            onClick={(e) => choose(b.slug, e.currentTarget)}
          >
            {/* the default art only — the hover composite (cover dropped, darker band) is left off */}
            <CardArt slug={b.slug} hover={false} />
            <StickerLayer list={HOME_STICKERS[b.slug] ?? []} />
            <h2 className="folder__title">{b.title}</h2>
            <p className="folder__dek">{b.dek}</p>
            <p className="folder__read">{b.readTime}</p>
          </button>
        ))}
      </div>
    </main>
  );
}
