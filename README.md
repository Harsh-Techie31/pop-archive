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
| `lib/art.ts` | Folder artwork, `ART_BOX` offsets, sticker positions on the closed cards |
| `lib/fit.ts` | Page scale (`--s`) and the home stack's fit to the window height |
| `lib/transition.ts` | Hands a pick from one page to the next; all the opening timings |
| `app/page.tsx` | Home (renders `components/HomeView.tsx`) |
| `app/[slug]/page.tsx` | The reader, one static page per blog |
| `app/globals.css` | All the styles, with the Figma measurements in the comments |
| `components/` | `HomeView`, `ReaderShell`, `GlyphText`, `Card`, `NextCard`, `ShareButton`, `Article`, `Stickers`, `PaperHoles`, `Tv`, `Scale` |
| `public/assets/` | Folder art, stickers, UI vectors, media |
| `app/fonts/` | Figtree and Awesome Serif, loaded with `next/font/local` |

## Where the content lives

Everything you'll want to change is in **`lib/content.ts`**. One entry per blog, front-most
folder first:

```ts
{
  slug: 'motion-to-code',             // becomes /motion-to-code
  title: 'Motion to Code',            // folder tab + the serif header in the black bar
  dek: 'Our dig into how we cracked a workflow…',
  readTime: '5m read',
  heading: 'Motion Design to Code',   // the heading printed on the paper (falls back to title)
  date: 'October 20, 2026',
  medium: 'https://medium.com/…',     // leave it out to hide the "Also find this on Medium" row
  theme: 'blue',                      // 'blue' | 'orange' | 'green'
  stickers: [...],                    // draggable, design px from the open folder's top-left
  blocks: [...]                       // the article
}
```

The "· File # ·" stamp numbers itself from the blog's place in `BLOGS`. Old `#slug` links
from the static version still work: the home page redirects them to `/slug`.

### Block types

| Type | Shape |
| --- | --- |
| Heading | `{ type: 'h2', text }` / `{ type: 'h3', text }` |
| Paragraph | `{ type: 'p', text }` |
| List | `{ type: 'ol' \| 'ul', items: ['…'] }` |
| Pull quote | `{ type: 'quote', text }` |
| Image | `{ type: 'image', src, alt, caption }` |
| Video | `{ type: 'video', src, poster, caption, autoplay: true, loop: true }` |
| TV | `{ type: 'tv', caption? }` — the retro TV illustration (`components/Tv.tsx`) |

Drop images and video into **`public/assets/media/`** and reference them from the site root
(`/assets/media/…`). `autoplay: true` plays muted with no controls.

## The artwork

`public/assets/folder/`, from the Figma hand-off as WebP-backed SVGs:

| File | What it is |
| --- | --- |
| `panel-<colour>.svg` | the folder with its tab — the closed card, and the open folder in the reader |
| `panel-<colour>-hover.svg` | the designer's composite: cover dropped a little, the paper's edge in the gap |
| `flap-<colour>.svg` | the front cover on its own (for the cover-lift beat, switched off) |

The panel is **1443.43 × 961.78** with a **79.02** tab. Each export pads its canvas
differently for its shadow, which is what `ART_BOX` in `lib/art.ts` carries, so the default
and hover pictures line up to the pixel. Keep `preserveAspectRatio="none"` on the SVG roots
when re-exporting — the reader stretches the art into a box and would letterbox without it.

The **green** set is the orange one recoloured: the panel's gradient stops and the cover
bitmap are hue-rotated orange → green (+130°) and darkened to sit with the blue and orange.
Per the hand-off, the orange set is itself a recoloured stand-in until the real export exists.

**No text is baked into any of them** — titles, summaries and stickers are laid over.

## Home

- **The stack.** The front folder is `BLOGS[0]`. The Figma hover: the picked card lifts 57.71,
  any card in front of it drops 76.29. Two CSS rules do it for any number of cards.
- **Hover art.** Cards keep their default art on hover and just lift. The hover composites
  (`panel-*-hover.svg`) and the cross-fade are still there — `<CardArt hover>` in `HomeView` turns them back on.
- **Fitting the window.** `lib/fit.ts` runs inline in `<head>` before first paint and on every
  resize. At rest the masthead may give up at most 20% (`GROW`) more of the stack than the
  Figma layout shows. Hovering the front folder raises it until `FRONT_CONTENT` of it is on
  screen, and the folders behind rise with it so each keeps a `STRIP` (its title) showing,
  never over "Archive". On a very short window the front folder shows less, down to
  `FRONT_MIN` (its full summary), before the strips thin down to `STRIP_MIN`.

## Opening a folder — the rotation

The folder starts turning the instant it's clicked:

- The picked folder **turns from 0° to 90°** as it opens, growing out of the card it was into
  the reader's folder (900ms). It is one rigid turn with one uniform scale: the open folder is
  the 1443.43 × 961.78 panel rotated (1397.396 × 2097.2 at 1512 wide), so its box is the card's
  box on its side and nothing warps — `spin()` in `components/ReaderShell.tsx`.
- The folders that weren't picked **run down and off the bottom edge** (440ms). The reader is
  a different page, so `HomeView` copies the home page as it stands and floats it over the
  reader while they go; whatever hover had moved the cards to is pinned first so nothing
  snaps back.
- **A tile turns where it sits**: pick the front one and it opens in front of the folders still
  leaving; pick one from behind and it opens behind them.
- The masthead **fades where it stands**.
- The header's title, summary and read time **resolve letter by letter** while the folder comes
  down (`components/GlyphText.tsx`): each letter turns up as a narrow random slice of itself
  and opens out, left to right, all landed by the time the folder reaches 90°.
- Picking the next blog at the end of an article turns its little card open the same way.
- Opened directly from a link there is no turn and the text is simply there. Under
  `prefers-reduced-motion` the whole thing is skipped.

Timings live in `lib/transition.ts`. `FLAP_MS` (the cover lifting off its fold before the
turn) is built but **0**: on the home page the card's fold sits far below the viewport, so
rotating about it sweeps the cover across the window and reads as a wall rising. Set it to 400
to see it.

## The reader

Everything is the Figma frame "Frame 2 → when user selects one folder to read" (2143:73443)
and the article page (2186:83608), at 1512 × 951 — the numbers are in `app/globals.css`.

- **The black bar**: back link, serif title, summary, divider, read time at the frame's positions.
- **The open folder** is the card's own illustration laid on its side, so its stitching is
  the cards' stitching. The art is 2097 long; a longer article gets more of the art itself
  (`components/OpenFolderArt.tsx`): it's cut just above its bottom edge, a slice of its plain
  lower body repeats with every other copy mirrored (so colour, grain and stitching run on
  without a seam), and the art's real bottom edge closes the folder off below the article.
  During the opening turn it's just the one picture, since the turn is measured off its box.
- **The tab label** is the card's title carried in: the same size (39.75), weight and tracking,
  starting on the same spot along the tab. During the turn it's scaled against the folder's own
  growth, so it stays exactly the size it was on the card from the click to the open folder.
- **The paper** sits 76 below the folder's top and 64 clear of the tab. It's 1011.65 wide, 20%
  wider than the frame's 843 (and its text column 815 against 679) so long articles don't run
  too long; the stickers start in the 207-wide strip to its left. Perforated top and bottom edges, punch holes (first at 68, then every 119), a dashed
  margin rule, the File # stamp, the Medium row, the heading, date, Share, a rule, the article
  and ✦ The End ✦.
- **The paperclip** hooks over the folder's top edge (its tip cut away behind it) and lies flat
  down onto the paper, 31.8 in from its right edge, with a contact shadow.
- **Stickers** can be dragged anywhere on the open folder, over the article too.
- **Share** uses the system share sheet where there is one, otherwise copies the link.

### Type on the paper — the POP type-scale (2234:85202)

| Role | Figtree | Size / line | Tracking |
| --- | --- | --- | --- |
| Article heading | Bold | 44 / 52 | −2% |
| Paragraph heading (`h2`) | Semibold | 32 / 40 | −1.5% |
| Paragraph subheading (`h3`) | Semibold | 24 / 32 | −1% |
| Body (`p`, lists) | Regular | 18 / 30 | 0 |
| Body small (date, captions) | Regular | 16 / 24 | 0 |
| Highlighted paragraph (`quote`) | American Typewriter | 16 / 24 | 0 |

30 between blocks, 31 under a section heading. American Typewriter is a macOS system font and
falls back to Courier elsewhere; self-host it if the site needs to match off a Mac.

## Adding another blog

1. Add an entry to `BLOGS` in `lib/content.ts` — first entry is the front folder.
2. In `lib/art.ts`, add its `CARD_ART` set and `HOME_STICKERS` (design px on the 1443.43 ×
   961.78 panel). For a new colour, recolour a panel / hover / flap set and add its `ART_BOX`
   rows, then a `[data-theme]` `--bed` colour and hole colour in `app/globals.css`.
3. The home stack, the reader and the next-blog card all read from `BLOGS`; the next-blog card
   wraps round to the first blog after the last.

## Known gaps

1. **Motion to Code and Figma UI to Code share placeholder text.** Real copy is the main thing left.
2. **The orange (and so the green) folder art is a recoloured stand-in** until the real Figma
   UI export exists.
3. **The Medium links are placeholders** (`https://medium.com/`); AI Image Pipeline has none,
   so its row is hidden.
4. **The compass "A" sticker** (`arc.png`) is a screenshot of the Figma node, not a clean export.
5. **No designed mobile layout.** Under 900px the reader falls back to a single column.
6. **Testing motion in Claude's preview pane** is unreliable: hovering can fire a click, and a
   hidden pane freezes animations. Test in a real browser.
7. **Unused files left in place**: `components/OpenFolder.tsx`, `components/SvgDefs.tsx` and
   `public/assets/folder/card-*.svg` belong to the previous folder art and can be deleted.
