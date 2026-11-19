'use client';

import { useEffect, useState, useTransition, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { BLOGS } from '@/lib/content';
import { HOME_STICKERS } from '@/lib/art';
import { CardArt, StickerLayer } from './Card';

export default function HomeView() {
  const router = useRouter();
  const [chosen, setChosen] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    BLOGS.forEach((b) => router.prefetch(`/${b.slug}`));

    // old links used #slug — send them to the real page
    const legacy = window.location.hash.slice(1);
    if (legacy && BLOGS.some((b) => b.slug === legacy)) router.replace(`/${legacy}`);
  }, [router]);

  /* click on a closed folder: it rises, the others sink, then it opens */
  function choose(slug: string) {
    if (chosen) return;
    setChosen(slug);
    setTimeout(() => {
      // both updates land together once the reader is ready, so there's no flash back
      startTransition(() => {
        router.push(`/${slug}`);
        setChosen(null);
      });
    }, 430);
  }

  const n = BLOGS.length;

  return (
    <main className={`view view--home${chosen ? ' is-leaving' : ''}`}>
      {/* the Figma frame fits two folders under the masthead; every folder past
          that lifts masthead + stack 40 design px so the front card's text stays on screen */}
      <div className="masthead" style={{ marginTop: `calc(${-40 * Math.max(0, n - 2)}px * var(--s))` }}>
        <h1 className="masthead__word">Archive</h1>
        <div className="masthead__veil" aria-hidden="true" />
        <img className="masthead__logo" src="/assets/folder/pop-logo.svg" alt="POP" />
      </div>

      <div className={`stack${chosen ? ' is-choosing' : ''}`}>
        {BLOGS.map((b, i) => (
          <button
            key={b.slug}
            type="button"
            className={`folder${chosen === b.slug ? ' is-chosen is-open' : ''}`}
            data-theme={b.theme}
            data-slug={b.slug}
            aria-label={`${b.title} — ${b.readTime}`}
            style={{ top: `calc(${(n - 1 - i) * 118.33}px * var(--s))`, '--z': n - i } as CSSProperties}
            onClick={() => choose(b.slug)}
          >
            <CardArt slug={b.slug} />
            <StickerLayer list={HOME_STICKERS[b.slug] ?? []} />
            <div className="folder__text">
              <h2 className="folder__title">{b.title}</h2>
              <p className="folder__dek">{b.dek}</p>
              <p className="folder__read">{b.readTime}</p>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
