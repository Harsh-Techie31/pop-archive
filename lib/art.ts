import type { StickerSpot } from './content';

/* Sticker placement, in design px on the 1512 × 879.5 card, straight from the
   Figma frames. The sticker PNGs already carry their own tilt, so no rotation
   is applied here — only the position and width of the Figma slot. */
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
    { src: STICKER.bloom, x: 800, y: 160, w: 205 },
    { src: STICKER.n8n, x: 1030, y: 120, w: 228 },
    { src: STICKER.gemini, x: 1290, y: 178, w: 168 },
  ],
  'motion-to-code': [
    { src: STICKER.motion, x: 755.27, y: 154.65, w: 178.88 },
    { src: STICKER.figma, x: 1026.15, y: 111.49, w: 150.42 },
    { src: STICKER.bloom, x: 1197.74, y: 190.3, w: 225.03 },
    { src: STICKER.clip, x: 1026.15, y: 47, w: 85 },
  ],
  'figma-ui-to-code': [
    { src: STICKER.figma, x: 847.26, y: 174.74, w: 149.49 },
    { src: STICKER.arc, x: 1036.5, y: 108.53, w: 159.14 },
    { src: STICKER.bloom, x: 1235.38, y: 194.52, w: 219.81 },
  ],
};

/* …and on the small card in the end section (design px on 711.5 × 413.9) */
export const END_STICKERS: StickerSpot[] = [
  { src: STICKER.figma, x: 98.57, y: 117.0, w: 131.99 },
  { src: STICKER.arc, x: 283.18, y: 164.98, w: 145.19 },
  { src: STICKER.bloom, x: 435.2, y: 125.74, w: 212.62 },
];

/* blogs whose end card wears its own stickers instead of END_STICKERS */
export const END_STICKERS_BY_SLUG: Record<string, StickerSpot[]> = {
  'ai-image-catalogue-cleaning': [
    { src: STICKER.n8n, x: 78, y: 150, w: 190 },
    { src: STICKER.gemini, x: 292, y: 118, w: 138 },
    { src: STICKER.bloom, x: 448, y: 128, w: 205 },
  ],
};

export const END_CARD_BOX: [number, number] = [711.539, 413.888];

/* the card illustrations exported from Figma (1538 × 900 canvas, the folder
   itself sitting at 0.5 / 19.5 with its drop shadow baked in) */
export const CARD_ART: Record<string, string> = {
  'motion-to-code': '/assets/folder/card-motion-to-code.svg',
  'figma-ui-to-code': '/assets/folder/card-figma-ui-to-code.svg',
  /* the orange card with its overlay and edge colours rotated to green */
  'ai-image-catalogue-cleaning': '/assets/folder/card-ai-image-catalogue-cleaning.svg',
};
