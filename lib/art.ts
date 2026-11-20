import type { StickerSpot } from './content';

/* The folder artwork, from the Figma hand-off, as WebP-backed SVGs.
   panel        the folder with its tab — the closed card
   hover        the designer's composite: cover dropped a little, paper in the gap
   flap         the front cover on its own (for the cover-lift beat, switched off)
   The green set is the orange one recoloured (scripts aren't kept; see README). */
export const CARD_W = 1443.43; // the panel itself, design px
export const CARD_H = 961.78;

export type CardArtSet = { base: string; hover: string; flap: string };

export const CARD_ART: Record<string, CardArtSet> = {
  'motion-to-code': {
    base: '/assets/folder/panel-blue.svg',
    hover: '/assets/folder/panel-blue-hover.svg',
    flap: '/assets/folder/flap-blue.svg',
  },
  'figma-ui-to-code': {
    base: '/assets/folder/panel-orange.svg',
    hover: '/assets/folder/panel-orange-hover.svg',
    flap: '/assets/folder/flap-orange.svg',
  },
  'ai-image-catalogue-cleaning': {
    base: '/assets/folder/panel-green.svg',
    hover: '/assets/folder/panel-green-hover.svg',
    flap: '/assets/folder/flap-green.svg',
  },
};

export function cardArt(slug: string): CardArtSet {
  return CARD_ART[slug] ?? CARD_ART['motion-to-code'];
}

/* Every export pads its canvas differently for its shadow, so this carries the
   canvas size and where the panel sits in it — that keeps the default and the
   hover on the same spot to the pixel.   [canvas w, canvas h, panel x, panel y] */
export const ART_BOX: Record<string, [number, number, number, number]> = {
  '/assets/folder/panel-blue.svg': [1473, 989, 4, 19],
  '/assets/folder/panel-orange.svg': [1444, 962, 0, 0],
  '/assets/folder/panel-green.svg': [1444, 962, 0, 0],
  '/assets/folder/panel-blue-hover.svg': [1489, 989, 20, 19],
  '/assets/folder/panel-orange-hover.svg': [1484, 962, 20, 0],
  '/assets/folder/panel-green-hover.svg': [1484, 962, 20, 0],
};

/* Sticker placement, in design px on the 1443.43 × 961.78 panel. The PNGs carry
   their own tilt, so only position and width come from the Figma slot. */
export const STICKER = {
  bloom: '/assets/stickers/bloom.png',
  figma: '/assets/stickers/figma.png',
  motion: '/assets/stickers/motion.png',
  arc: '/assets/stickers/arc.png',
  clip: '/assets/stickers/clip.png',
  /* made from the official marks (via dashboardicons.com): die-cut white border, creases, tilt */
  n8n: '/assets/stickers/n8n.png',
  gemini: '/assets/stickers/gemini.png',
} as const;

export const HOME_STICKERS: Record<string, StickerSpot[]> = {
  'ai-image-catalogue-cleaning': [
    { src: STICKER.bloom, x: 764, y: 200, w: 196 },
    { src: STICKER.n8n, x: 983, y: 160, w: 218 },
    { src: STICKER.gemini, x: 1231, y: 218, w: 160 },
  ],
  'motion-to-code': [
    { src: STICKER.motion, x: 721, y: 194, w: 171 },
    { src: STICKER.figma, x: 980, y: 151, w: 144 },
    { src: STICKER.bloom, x: 1143, y: 230, w: 215 },
    { src: STICKER.clip, x: 980, y: 87, w: 81 },
  ],
  'figma-ui-to-code': [
    { src: STICKER.figma, x: 809, y: 214, w: 143 },
    { src: STICKER.arc, x: 990, y: 148, w: 152 },
    { src: STICKER.bloom, x: 1179, y: 234, w: 210 },
  ],
};

/* …and on the small card in the end section: design px on 711.5 × 474.07, the
   same shape as the big card, scaled down */
export const END_CARD_BOX: [number, number] = [711.539, 474.07];

export const END_STICKERS: StickerSpot[] = [
  { src: STICKER.figma, x: 98.57, y: 136.29, w: 131.99 },
  { src: STICKER.arc, x: 283.18, y: 184.27, w: 145.19 },
  { src: STICKER.bloom, x: 435.2, y: 145.03, w: 212.62 },
];

/* blogs whose end card wears its own stickers instead of END_STICKERS */
export const END_STICKERS_BY_SLUG: Record<string, StickerSpot[]> = {
  'ai-image-catalogue-cleaning': [
    { src: STICKER.n8n, x: 78, y: 169.29, w: 190 },
    { src: STICKER.gemini, x: 292, y: 137.29, w: 138 },
    { src: STICKER.bloom, x: 448, y: 147.29, w: 205 },
  ],
};
