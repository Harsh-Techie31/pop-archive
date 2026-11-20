/* Handing a pick from one page to the next.

   Choosing a folder (or the next-blog card) records where that card sits on
   screen and navigates. The reader page picks it up on mount and turns its open
   folder out of exactly that box. A direct visit has nothing pending, so the
   page just appears.

   Timings are the zip/Figma brief's. */

export const EXIT_MS = 440; // the folders that weren't picked, running off the bottom
export const SPIN_MS = 900; // the turn, 0° → 90°
/* Beat one — the cover lifting off its fold — is built but switched off at 0.
   On the home page the card's bottom fold, the hinge, sits far below the
   viewport, so rotating about it sweeps the cover over everything and reads as
   a wall rising. Set this to 400 to see it. */
export const FLAP_MS = 0;
export const REVEAL_START = 220; // header letters begin, measured from the turn's start
export const REVEAL_SPAN = 420; // left to right across the line
export const REVEAL_DUR = 260; // one letter, broken to whole

export type Rect = { left: number; top: number; width: number; height: number };
type Pending = { slug: string; rect: Rect };

let pending: Pending | null = null;

export function setPending(slug: string, r: DOMRect) {
  pending = { slug, rect: { left: r.left, top: r.top, width: r.width, height: r.height } };
}

/* read without consuming (safe to call during render) */
export function peekPending(slug: string): Rect | null {
  return pending && pending.slug === slug ? pending.rect : null;
}

export function clearPending() {
  pending = null;
}

export function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
