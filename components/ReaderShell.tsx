'use client';

import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import {
  FLAP_MS,
  REVEAL_DUR,
  REVEAL_SPAN,
  REVEAL_START,
  SPIN_MS,
  clearPending,
  peekPending,
  reducedMotion,
  type Rect,
} from '@/lib/transition';

/* true while the header text is arriving letter by letter (components/GlyphText.tsx) */
const Revealing = createContext(false);
export const useRevealing = () => useContext(Revealing);

/* The reader page. Arrived at from a card (home or the next-blog card), it
   turns the open folder out of that card's box and resolves the header text
   letter by letter while it comes down. Visited directly, it simply appears. */
export default function ReaderShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [from] = useState<Rect | null>(() => (reducedMotion() ? null : peekPending(slug)));
  const [spinning, setSpinning] = useState(!!from);
  const [revealing, setRevealing] = useState(!!from);

  useLayoutEffect(() => {
    clearPending();
    const section = ref.current;
    if (!section) return;
    // into the new view for keyboards and screen readers, without a focus ring on "Back"
    section.focus({ preventScroll: true });
    if (!from) return;

    window.scrollTo(0, 0); // measure from the top, where the page will be
    // set here as well as initially: in development React runs this effect twice,
    // and the first run's cleanup has to be able to stand the turn down
    setSpinning(true);
    const stop = spin(section, from, () => setSpinning(false));
    const settle = setTimeout(
      () => setRevealing(false), // the plain text goes back in once it has all arrived
      FLAP_MS + REVEAL_START + REVEAL_SPAN + REVEAL_DUR + 60,
    );
    return () => {
      clearTimeout(settle);
      stop();
    };
  }, [from]);

  return (
    <Revealing.Provider value={revealing}>
      <section
        ref={ref}
        tabIndex={-1}
        className={`view view--reader${spinning ? ' is-spinning' : ''}${revealing ? ' is-revealing' : ''}`}
      >
        {children}
      </section>
    </Revealing.Provider>
  );
}

/* Turn the open folder from the closed card's box into its own.
   The open folder is the card's silhouette a quarter turn round, so playing it
   from −90° back to 0° *is* the folder opening 0° → 90°. Its box is the card's
   box rotated, so ONE uniform scale lands it exactly — the folder and the paper
   in it keep their proportions the whole way round. Both ratios below come out
   the same; averaging just absorbs the sub-pixel difference. */
/* Returns a cancel function that undoes the turn without reporting it done. */
function spin(section: HTMLElement, from: Rect, done: () => void) {
  const stage = section.querySelector<HTMLElement>('.sheet__stage');
  const folder = section.querySelector<HTMLElement>('.folder-open');
  if (!stage || !folder || !from.width) {
    done();
    return () => {};
  }
  const f = folder.getBoundingClientRect();
  const st = stage.getBoundingClientRect();
  const scale = (from.height / f.width + from.width / f.height) / 2;

  // turn about the folder's middle, then carry that point onto the card's
  const ox = f.left - st.left + f.width / 2;
  const oy = f.top - st.top + f.height / 2;
  const tx = from.left + from.width / 2 - (f.left + f.width / 2);
  const ty = from.top + from.height / 2 - (f.top + f.height / 2);

  const root = document.documentElement;
  stage.style.transformOrigin = `${ox}px ${oy}px`;
  root.dataset.spinning = '';

  // beat one, in the card's own orientation while the stage is held there
  if (FLAP_MS > 0) {
    section.style.setProperty('--flap-ms', `${FLAP_MS}ms`);
    section.classList.add('is-opening');
  }

  const anim = stage.animate(
    [{ transform: `translate(${tx}px, ${ty}px) rotate(-90deg) scale(${scale})` }, { transform: 'none' }],
    { duration: SPIN_MS, delay: FLAP_MS, easing: 'cubic-bezier(.33,0,.15,1)', fill: 'both' },
  );

  const tidy = () => {
    section.classList.remove('is-opening');
    delete root.dataset.spinning;
    stage.style.transformOrigin = '';
  };
  const t = setTimeout(() => {
    anim.finish(); // lands on 'none' even if the page was throttled in the background
    anim.cancel();
    tidy();
    done();
  }, FLAP_MS + SPIN_MS);
  return () => {
    clearTimeout(t);
    anim.cancel();
    tidy();
  };
}
