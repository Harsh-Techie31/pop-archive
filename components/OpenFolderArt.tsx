'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { ArtImg } from './Card';

/* The open folder in the reader: the closed card's own illustration laid on its
   side (1397.396 × 2097.2 design px, the 1443.43 × 961.78 panel rotated and
   scaled ×1.45292), carried on for as long as the article runs.

   The art stops at 2097, so a longer article gets more of it rather than a
   painted stand-in:
     · the art itself, down to just above its bottom edge (ART_END − BOTTOM)
     · then a slice of its plain lower body, repeated with every other copy
       mirrored, so colour, grain and the stitching down both sides run on
       with no seam — an even number of copies always ends on the row the
       last piece starts from
     · then the art's real bottom edge, corners and stitching, at the end.
   During the opening turn the folder is just the one picture (the turn is
   measured off its box), so the extension only appears once it has landed. */

const ART_END = 2097.2; // the art's length, design px
const BOTTOM = 150; // the bottom edge piece, design px
const CUT = ART_END - BOTTOM; // where the art is cut and the run begins
const SLICE_MAX = 560; // longest slice of body to repeat (well clear of the tab, which ends at 767)

type Piece = { top: number; height: number; from: number; flip: boolean };

export default function OpenFolderArt({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState<{ s: number; pieces: Piece[] } | null>(null);

  useLayoutEffect(() => {
    const stage = ref.current?.parentElement;
    if (!stage) return;
    const measure = () => {
      const s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--s')) || 1;
      const extra = stage.offsetHeight / s - ART_END; // how far the article runs past the art
      if (extra <= 1) {
        setRun(null);
        return;
      }
      const n = Math.max(2, 2 * Math.ceil(extra / (2 * SLICE_MAX))); // always even
      const t = extra / n;
      const pieces: Piece[] = [];
      for (let i = 0; i < n; i++) {
        pieces.push({ top: CUT + i * t, height: t, from: CUT - t, flip: i % 2 === 0 });
      }
      pieces.push({ top: CUT + extra, height: BOTTOM, from: CUT, flip: false });
      setRun((r) =>
        r && Math.abs(r.s - s) < 1e-4 && r.pieces.length === pieces.length &&
        Math.abs(r.pieces[r.pieces.length - 1].top - pieces[pieces.length - 1].top) < 0.5
          ? r
          : { s, pieces },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div ref={ref} className={`folder-open${run ? ' is-cut' : ''}`} aria-hidden="true">
        <Flat src={src} />
      </div>
      {run &&
        run.pieces.map((p, i) => {
          // whole real pixels, each piece overlapping the next by one, so no hairline shows
          const top = Math.round(p.top * run.s);
          const height = Math.round((p.top + p.height) * run.s) - top + (i < run.pieces.length - 1 ? 1 : 0);
          return (
            <div
              key={i}
              className="folder-ext"
              aria-hidden="true"
              style={{ top, height, transform: p.flip ? 'scaleY(-1)' : undefined }}
            >
              {/* the whole folder, slid up so this piece shows rows from → from + height;
                  a mirrored piece shows the same rows upside down */}
              <div className="folder-ext__art" style={{ top: -Math.round(p.from * run.s) }}>
                <Flat src={src} />
              </div>
            </div>
          );
        })}
    </>
  );
}

function Flat({ src }: { src: string }) {
  return (
    <div className="folder-open__flat">
      <ArtImg src={src} />
    </div>
  );
}
