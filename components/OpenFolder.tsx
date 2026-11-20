'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/* The opened folder in the reader, drawn from the Figma folder vector.

   The Figma path is landscape (1512 × 879, tab top-left). Here it's turned
   portrait (tab on the right) and drawn at the folder's real pixel size, so
   the tab keeps its Figma proportions and only the long straight run of the
   folder stretches with the article. The stitching is a true inset of the
   outline with real-px dashes, so it sits the same distance in everywhere.

   1 unit = folder width / 879 (the Figma folder's short side). */

const UNITS_ACROSS = 879;
const STITCH_INSET = 14; // units in from the edge
const STITCH_RADIUS = 9; // units, rounding at the stitch's corners

type P = [number, number];

/* the Figma outline, landscape units: [command, ...points] */
const OUTLINE: [string, ...P[]][] = [
  ['M', [0, 71.3435]],
  ['L', [0, 877.301]],
  ['L', [1512, 879]],
  ['L', [1512, 74.2087]],
  ['C', [1512, 67.5813], [1506.63, 62.2087], [1500, 62.2087]],
  ['L', [466.236, 62.2087]],
  ['C', [456.086, 62.2087], [446.624, 57.0764], [441.089, 48.5683]],
  ['L', [418.366, 13.6404]],
  ['C', [412.831, 5.13232], [403.369, 0], [393.219, 0]],
  ['L', [75.8875, 0]],
  ['C', [65.5601, 0], [55.9588, 5.31192], [50.4719, 14.0612]],
  ['L', [25.8326, 53.3502]],
  ['C', [22.0443, 59.3909], [15.4153, 63.0584], [8.28507, 63.0584]],
  ['C', [3.70935, 63.0584], [0, 66.7677], [0, 71.3435]],
];

/* the same outline with its corners as sharp vertices (the straight edges
   extended to meet), for the stitch's inset */
const CORNERS: P[] = [
  [0, 877.301],
  [1512, 879],
  [1512, 62.2087],
  [449.93, 62.2087], // body top meets the tab's lower slant
  [409.5, 0],
  [59.3, 0],
  [19.75, 63.0584],
  [0, 63.0584],
];

/* landscape units → portrait px. The tab end (x < 520) and the far corner
   (x > 1490) keep the uniform scale; the straight run between them stretches. */
function mapper(W: number, H: number) {
  const u = W / UNITS_ACROSS;
  const A = 520;
  const B = 1490;
  const yA = A * u;
  const yB = Math.max(yA, H - (1512 - B) * u);
  return ([x, y]: P): P => {
    const Y = x <= A ? x * u : x >= B ? yB + (x - B) * u : yA + ((x - A) / (B - A)) * (yB - yA);
    return [W - y * u, Y];
  };
}

function outlinePath(W: number, H: number) {
  const m = mapper(W, H);
  return (
    OUTLINE.map(([cmd, ...pts]) => cmd + pts.map((p) => m(p).map((v) => v.toFixed(2)).join(' ')).join(' ')).join(' ') +
    ' Z'
  );
}

/* inset a closed polygon by d (miter joins), then round its corners by r */
function stitchPath(W: number, H: number) {
  const u = W / UNITS_ACROSS;
  const m = mapper(W, H);
  const pts = CORNERS.map(m);
  const n = pts.length;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }
  const inward = area > 0 ? 1 : -1; // y-down coordinates
  const d = STITCH_INSET * u;
  const normal = (a: P, b: P): P => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return [(-dy / len) * inward, (dx / len) * inward];
  };
  const inset: P[] = pts.map((p, i) => {
    const n1 = normal(pts[(i - 1 + n) % n], p);
    const n2 = normal(p, pts[(i + 1) % n]);
    const k = d / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
    return [p[0] + (n1[0] + n2[0]) * k, p[1] + (n1[1] + n2[1]) * k];
  });

  const r = STITCH_RADIUS * u;
  let path = '';
  inset.forEach((p, i) => {
    const prev = inset[(i - 1 + n) % n];
    const next = inset[(i + 1) % n];
    const toward = (a: P, b: P, dist: number): P => {
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const t = Math.min(dist, len / 2) / len;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    };
    const a = toward(p, prev, r);
    const b = toward(p, next, r);
    const f = (q: P) => `${q[0].toFixed(2)} ${q[1].toFixed(2)}`;
    path += `${i ? 'L' : 'M'}${f(a)} Q${f(p)} ${f(b)} `;
  });
  return path + 'Z';
}

export default function OpenFolder() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ W: number; H: number } | null>(null);

  useLayoutEffect(() => {
    const node = ref.current?.parentElement;
    if (!node) return;
    const measure = () => {
      const W = node.clientWidth;
      const H = node.clientHeight;
      setSize((s) => (s && Math.abs(s.W - W) < 0.5 && Math.abs(s.H - H) < 0.5 ? s : { W, H }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="folder-open" aria-hidden="true">
      {size && (
        <svg width={size.W} height={size.H} viewBox={`0 0 ${size.W} ${size.H}`}>
          <path d={outlinePath(size.W, size.H)} className="folder-open__fill" />
          <path d={outlinePath(size.W, size.H)} className="folder-open__grain" filter="url(#grain)" />
          <path d={outlinePath(size.W, size.H)} className="folder-open__edge" />
          <path
            d={stitchPath(size.W, size.H)}
            className="folder-open__stitch"
            style={{ strokeDasharray: `${(10 * size.W) / UNITS_ACROSS} ${(10 * size.W) / UNITS_ACROSS}` }}
          />
        </svg>
      )}
    </div>
  );
}
