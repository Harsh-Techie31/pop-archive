# POP Archive

The blog archive site, built with Next.js (App Router) and TypeScript. Every page is
prerendered at build time — `/` is the home stack and each blog lives at `/<slug>`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:4178. (In Claude Code, the `pop-archive` launch config does the same.)

For a production build: `npm run build && npm start`.

## Project layout

| Path | What it is |
| --- | --- |
| `lib/content.ts` | The blogs — the only file you need for copy changes |
| `lib/art.ts` | Card illustrations and sticker positions on the closed folders |
| `app/page.tsx` | Home (renders `components/HomeView.tsx`) |
| `app/[slug]/page.tsx` | The reader, one static page per blog |
| `app/layout.tsx` | Fonts, shared SVG defs, the `--s` scale script |
| `app/globals.css` | All the styles |
| `components/` | `HomeView`, `ReaderShell`, `Article`, `Stickers`, `PaperHoles`, `Card`, `Scale`, `SvgDefs` |
| `public/assets/` | Images, stickers, illustrations, media |
| `app/fonts/` | Figtree and Awesome Serif, loaded with `next/font/local` |

## Where the content lives

Everything you'll want to change is in **`lib/content.ts`**. One entry per blog:

```ts
{
  slug: 'motion-to-code',   // becomes /motion-to-code
  title: 'Motion to Code',
  dek: 'Our dig into how we cracked a workflow…',
  readTime: '5m read',
  theme: 'blue',            // 'blue', 'orange' or 'green' — folder colour, outside and in
  stickers: [...],          // draggable stickers on the left of the open folder
  blocks: [...]             // the article
}
```

Both articles currently share the same `PLACEHOLDER` blocks. To give them separate text,
copy `PLACEHOLDER` into two arrays and point each blog at its own.

Old `#slug` links (from the static version) still work: the home page redirects them to `/slug`.

### Block types

| Type | Shape |
| --- | --- |
| Heading | `{ type: 'h2', text }` / `{ type: 'h3', text }` |
| Paragraph | `{ type: 'p', text }` |
| List | `{ type: 'ol' \| 'ul', items: ['…'] }` |
| Pull quote | `{ type: 'quote', text }` |
| Image | `{ type: 'image', src, alt, caption }` |
| Video | `{ type: 'video', src, poster, caption, autoplay: true, loop: true }` |

### Images and video

Drop files into **`public/assets/media/`** and reference them from the site root:

```js
{ type: 'image', src: '/assets/media/handoff.png', alt: 'Handoff diagram', caption: 'Where motion falls out' },
{ type: 'video', src: '/assets/media/slide-to-pay.mp4', caption: 'Slide to pay', autoplay: true, loop: true },
```

`autoplay: true` plays muted and hides the controls (good for short loops). Leave it off and
the player shows normal controls. `lib/content.ts` has one of each commented out as a template.

## Adding another blog

1. Add an entry to `BLOGS` in `lib/content.ts`. The first entry is the front folder on the home stack.
2. Add matching keys to `HOME_STICKERS` and `CARD_ART` in `lib/art.ts` for its closed-folder
   stickers and illustration (sticker positions are design px on the 1512 × 879.5 card).
3. For a new colour, recolour a card SVG (the green one is the orange card with its two overlay fills
   and edge gradient rotated to green), add `g-<colour>` / `g-<colour>-edge` gradients to
   `components/SvgDefs.tsx` sampled from the rendered card, and a `[data-theme]` rule plus hole colour
   in `app/globals.css`.
4. The Figma frame fits two folders under the masthead. Each extra folder lifts the masthead and stack
   40 design px (`HomeView.tsx`) so the front card's summary stays on screen at 1512 × 951.
5. That's it — the home stack, the reader pages and the "next blog" card all read from `BLOGS`, and
   the next-blog card wraps around to the first blog after the last one.

## How the pieces map to the Figma frames

| Figma frame | Here |
| --- | --- |
| Default / When user selects … | `components/HomeView.tsx`, `.view--home` — masthead plus the folder stack, with the hover geometry below |
| Frame 2 – folder selected | `app/[slug]/page.tsx`, `.view--reader` — the chosen folder rises, the rest sink, then the header lifts in and the summary and read time wipe in left → right |
| User scrolls down to read | `.paper` — the article on paper, punch holes, paperclip, draggable stickers, vertical tab |
| End | `.next` — the divider, the next-blog link (white at 40% on hover) and the orange folder; both open the next blog |

## Assets

All under `public/`, except the fonts.

- `assets/folder/card-*.svg` — the card illustrations exported from Figma
- `assets/folder/`, `assets/ui/` — other vectors exported from the Figma file
- `assets/stickers/` — bloom, figma, motion, arc, clip
- `app/fonts/` — Figtree (400/500/600/700) and Awesome Serif Italic Bold Extra Tall
- `assets/media/` — your images and videos

### How the stack opens on hover

Taken from the three Figma frames, measured at 1512 × 951:

| | Figma UI to Code | Motion to Code |
| --- | --- | --- |
| Default | 497.38 | 615.71 |
| Motion hovered | 497.38 | 558.00 (−57.71) |
| Figma UI hovered | 440.00 (−57.71) | 692.00 (+76.29) |

The motion is the same whichever card you pick: the picked card lifts 57.71, and any card
in front of it drops 76.29 so its summary is uncovered. Two CSS rules do this for any
number of cards, keyed off DOM order (front-most first):

```css
.folder:is(:hover,:focus-visible)               {--lift:calc(-57.71px * var(--s));}
.folder:has(~ .folder:is(:hover,:focus-visible)){--lift:calc(76.29px  * var(--s));}
```

One lift value is used for both cards, so Figma UI lands at 439.67 rather than the
frame's 440 — the frames measure 57.71 on Motion and 57.38 on Figma UI.

The card in front keeps its stacking order while it moves, as in the frames.

### Text on the card

From the "Default" frame, measured on the Motion card and used for both: block at
84.05 / 36.97, 296 wide, title box 33 tall, 50 to the summary, summary box 76 tall,
18 to the read time — which puts the summary at 119.97 and the read time at 213.97.

### The cards

Each card is its Figma illustration (`CARD_ART` in `lib/art.ts`), with the title, summary,
read time and stickers laid over it at the coordinates from the Figma frame. The
illustration is a 1538 × 900 canvas with the folder at 0.5 / 19.5 and its drop shadow
baked in, which is why `.folder__art` sits slightly outside the card box.

`Motion to code.svg` came out of Figma as one flattened 5 MB PNG. It's stored here as a
WebP at 2× (277 KB) re-wrapped in the same SVG with the same shadow filter, so the two
cards behave identically in CSS. To refresh it after a new export:

```bash
ffmpeg -i "Motion to code-embedded.png" -c:v libwebp -quality 88 motion-card.webp
```

then base64 it back into `card-motion-to-code.svg`.

Sticker positions live in `HOME_STICKERS` and `END_STICKERS` in `lib/art.ts`, in design px
on the 1512 × 879.5 (or 711.5 × 413.9) card. The sticker PNGs already carry their own
tilt, so no rotation is applied in code.

The opened folder in the reader is still drawn from the Figma vector rather than the
illustration, tinted by the `g-blue` / `g-orange` gradients in `components/SvgDefs.tsx` —
those are sampled from the card art so the two match.

## Where this is up to

Built and verified against the Figma frames at 1512 × 951:

- **Home** — masthead and the folder stack, with the hover geometry above. Measured in the
  browser: default 497.38 / 615.71, Motion picked 497.38 / 557.99, Figma UI picked
  439.67 / 691.99.
- **Opening a card** — the picked card rises, the others sink, then the reader's header
  lifts in and the summary and read time wipe left → right. This moment is the one piece
  with no Figma frame behind it, so the timings are a judgement call.
- **Reader** — the article on paper, punch holes, paperclip, draggable stickers, vertical
  tab. Stickers are at the Figma positions from the "folder selected" frame.
- **End** — divider, next-blog link (white at 40% on hover) and the small card; both open
  the next blog, wrapping round to the first.

Known gaps, in the order they're probably worth picking up:

1. **Article text is placeholder.** Both blogs share the `PLACEHOLDER` array in
   `lib/content.ts`. Real copy, images and video are the main thing left.
2. **The reader's open folder is still the Figma vector**, not the card illustration —
   the illustrations are landscape and the open folder is portrait, so using them there
   means re-wrapping both SVGs rotated. Its gradients are sampled from the card art so
   the colours match in the meantime.
3. **The compass "A" sticker** (`assets/stickers/arc.png`) is a screenshot of the Figma
   node rather than a clean export; the other four are real exports.
4. **No mobile design yet.** There's a sensible fallback under 900px — the stickers hide
   and the paper goes full width — but it isn't designed.
5. **Testing hovers in Claude's preview pane** fires a click alongside the hover, which
   opens the blog instead. Test the stack in a real browser.
# pop-archive
