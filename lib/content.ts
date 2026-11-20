/* ──────────────────────────────────────────────────────────────
   POP Archive — content
   Edit this file to change blogs. Nothing else needs to change.

   Each blog:
     slug       url path, e.g. /motion-to-code
     title      folder tab + reader header
     dek        one-line summary shown next to the header
     readTime   "5m read"
     heading    the article heading printed on the paper (falls back to title)
     date       the line under it, e.g. "October 20, 2026"
     medium     link for "Also find this on Medium" — leave it out to hide the row
     theme      "blue" | "orange" | "green"  (folder colour, inside + out)
     stickers   draggable stickers, design px from the open folder's top-left
     blocks     the article itself, in order

   Block types:
     { type: 'h2',    text }                     section heading
     { type: 'h3',    text }                     sub heading
     { type: 'p',     text }                     paragraph
     { type: 'ol',    items: [] }                numbered list
     { type: 'ul',    items: [] }                bulleted list
     { type: 'image', src, alt, caption }        drop files in public/assets/media/
     { type: 'video', src, poster, caption,
                      autoplay: true, loop: true } .mp4 / .webm
     { type: 'quote', text }                     pulled-out line
     { type: 'tv', caption }                     the retro TV illustration
   ────────────────────────────────────────────────────────────── */

export type Block =
  | { type: 'h2' | 'h3' | 'p' | 'quote'; text: string }
  | { type: 'ol' | 'ul'; items: string[] }
  | { type: 'image'; src: string; alt?: string; caption?: string }
  | { type: 'tv'; caption?: string }
  | {
      type: 'video';
      src: string;
      poster?: string;
      caption?: string;
      autoplay?: boolean;
      loop?: boolean;
    };

/** a sticker slot, in design px */
export type StickerSpot = { src: string; x: number; y: number; w: number };

export type Blog = {
  slug: string;
  title: string;
  dek: string;
  readTime: string;
  /** the heading printed on the paper; falls back to the title */
  heading?: string;
  date?: string;
  /** "Also find this on Medium" — leave out to hide the row */
  medium?: string;
  theme: 'blue' | 'orange' | 'green';
  /** design px inside the opened folder */
  stickers: StickerSpot[];
  blocks: Block[];
};

const PLACEHOLDER_INTRO: Block[] = [
  { type: 'h2', text: 'The 800 decisions' },
  {
    type: 'p',
    text: 'Designers make about 800 decisions while building a user journey. I’m not counting the big journey calls here, like using a bottom sheet or taking someone into an immersive flow to upload a profile photo. Those are judgement calls shaped by the designer’s thesis and by heuristics. The 800 are the micro decisions: auto-layout, spacing, padding, sizing, and showing every edge case with as much fidelity as we can. This has always been part of a designer’s day.',
  },
  { type: 'p', text: 'Then the handoff happens, and a frontend engineer is expected to:' },
  {
    type: 'ol',
    items: [
      'Understand all 800 decisions.',
      'Implement all 800 decisions.',
      'Do that while building the flow itself and the platform work around it, which is the part they joined engineering for in the first place.',
      'In effect, redo in a code editor the decisions the designer already made in Figma.',
    ],
  },
  {
    type: 'p',
    text: 'Given that, anyone would lean towards the work they enjoy (3) and away from (1) and (2). This isn’t an attack on engineers. It’s a defence of them. If I were a frontend engineer in the age of AI abundance, I’d want to spend my time on what I find important and hand the rest to people who find it interesting.',
  },
  {
    type: 'p',
    text: 'That’s the idea behind our UI-to-Code approach. UX designers own the 800 decisions, which is the visual hygiene. Earlier, getting that hygiene took a lot of pushing. Now the system gives it to us by default. Designers like crafting experiences, and they’re making those 800 decisions anyway.',
  },

  // ── Drop a video in here. Uncomment once the file is in public/assets/media/
  // { type: 'video', src: '/assets/media/slide-to-pay.mp4', caption: 'Slide to pay', autoplay: true, loop: true },

  { type: 'h2', text: 'But, we wanted more' },
  {
    type: 'p',
    text: 'Once we started shipping UI code, our wants outran what we had again. Most of the app started to feel static. Our visual language at POP is Future-Retro Noir, and it’s distinctive enough that it practically asks to move. So the conversation became: could we ship motion design code too?',
  },
  {
    type: 'p',
    text: 'In a conventional bootstrapped organisation, even basic motion takes at least 2 Design Engineers (DEs) and an in-house Motion Designer (MD). For us it was 2 MDs and 2 DEs. The workload wasn’t a steady stream, so the DEs kept getting pulled onto other work, and getting their time back was a hassle. We decided to lock in, and that’s how Motion-to-Code started.',
  },
];

const PLACEHOLDER_PROBLEM: Block[] = [
  { type: 'h2', text: 'Problem: motion gets lost in handoff' },
  { type: 'h3', text: 'What is motion design?' },
  {
    type: 'p',
    text: 'Is motion design just movement? No! Motion design is movement, timing and transitions used to show how an interface behaves. Take the slide-to-pay motion. The forward bounce and spring on the button nudges the user to drag the white handle the right way and complete the action.',
  },

  // ── Drop an image in here. Uncomment once the file is in public/assets/media/
  // { type: 'image', src: '/assets/media/handoff.png', alt: 'Handoff diagram', caption: 'Where motion falls out of the handoff' },

  {
    type: 'p',
    text: 'Software has no physical feedback of its own, so it borrows from physical things: a button that gives when pressed, a toggle that slides on. Take that away and a working app feels static and a bit broken, because nothing shows cause and effect. Copying a visual design is easy now. How an interface behaves is what sets it apart.',
  },
  {
    type: 'p',
    text: 'Pull-to-refresh is a good example. Before it, refreshing a feed meant tapping a small button crammed into the navbar. In Tweetie, the Twitter client Loren Brichter built in 2009, adding other controls left no room for that button. He didn’t look for more screen space. He asked why refreshing couldn’t be part of the scroll gesture people were already making.',
  },
  {
    type: 'quote',
    text: 'Motion design earns its place when it makes an interaction understandable at the moment someone needs to understand it.',
  },
];

/* ── AI Image Pipeline — condensed from the Substack write-up:
      harsh3101.substack.com/p/end-to-end-e-commerce-catalogue-image */
const CATALOGUE: Block[] = [
  { type: 'h2', text: '1 lakh images, one look' },
  {
    type: 'p',
    text: 'An apparel catalogue looks effortless from the outside: every hoodie on the same clean background, in the same light, at the same crop. Behind it are vendor photos shot in a hundred different studios. Before a SKU goes live, someone has to clean each one up, and at 1 lakh+ images, “someone” stops being a plan.',
  },
  {
    type: 'p',
    text: 'One AI editing script wasn’t the answer either. A good prompt gets you a great demo, not a catalogue: at this volume some edits come back with a blurred logo or a warped sleeve, and nobody can eyeball every one. So we built a loop instead. Edit, check, fix what failed, check again, all in n8n, with Gemini doing the visual work.',
  },
  {
    type: 'image',
    src: '/assets/media/catalogue/three-phases.webp',
    alt: 'Three pipelines: core editing, automated QC, and failure re-editing, feeding a production-ready catalogue',
    caption: 'Three pipelines, one loop: edit → QC → re-edit what failed.',
  },

  { type: 'h2', text: 'Phase 1: Edit' },
  {
    type: 'p',
    text: 'It all runs off a Google Sheet. One tab holds the master editing prompt (lighting, fit, background rules), the other holds the inventory: SKU, style code, image URL and an empty “edit status” column. For each row, n8n downloads the vendor photo and our standard background, hands both to Gemini with the prompt, uploads the result to Supabase and writes the link, plus a live preview, back into the sheet.',
  },
  { type: 'p', text: 'Three small decisions are what let it run at scale:' },
  {
    type: 'ol',
    items: [
      'An empty status is the gate. Only rows with no edit status get picked up, so a crash or a rerun never edits (or pays for) the same image twice.',
      '500 images per run, max. Holding hundreds of 5 MB images in memory crashed the n8n worker; capping the batch kept it steady.',
      'One image at a time. Download, edit, upload and write-back add up to about 3.8 s per image, roughly 15 a minute, which keeps us under every rate limit without a single sleep node.',
    ],
  },
  {
    type: 'image',
    src: '/assets/media/catalogue/phase-1-edit.webp',
    alt: 'The Phase 1 n8n workflow',
    caption: 'Phase 1: sheet → filter → loop → fetch both images → Gemini edit → Supabase → back to the sheet.',
  },

  { type: 'h2', text: 'Phase 2: Let AI check AI' },
  {
    type: 'p',
    text: 'Every row marked “Success” moves on to quality control. A faster model, Gemini 2.5 Flash, looks at the vendor photo and the edit side by side and answers PASS or FAIL: did the logo survive, is the garment distorted, are the edges against the background clean?',
  },
  {
    type: 'p',
    text: 'A fail has to come with a reason. The reply is split on “REASON:” and written straight into a QC remark column, things like “Sleeve logo blurred during compositing”. And as in Phase 1, only rows that haven’t been checked get picked up, so nothing is inspected twice.',
  },
  {
    type: 'image',
    src: '/assets/media/catalogue/phase-2-qc.webp',
    alt: 'The Phase 2 QC workflow in n8n',
    caption: 'Phase 2: one Gemini check per image, split into passed and failed.',
  },

  { type: 'h2', text: 'Phase 3: Fix what failed' },
  {
    type: 'p',
    text: 'Failed rows get a second attempt, with more context and a stronger model. Gemini 3 Pro sees three images (the background, the original and the failed edit), and the prompt carries the QC remark: “The qc failure reason being: …”. It knows exactly what went wrong and is told to fix that.',
  },
  {
    type: 'p',
    text: 'If the failed image can’t be fetched, the flow falls back to the original photo instead of stopping. The old link and remark are kept in history columns, the status becomes “Success-1”, and the row goes back through QC like everything else.',
  },
  {
    type: 'image',
    src: '/assets/media/catalogue/phase-3-re-edit.webp',
    alt: 'The Phase 3 re-editing workflow in n8n',
    caption: 'Phase 3: the failure reason goes back into the prompt.',
  },
  {
    type: 'quote',
    text: 'The trick wasn’t one perfect prompt. It was a loop that catches its own mistakes and tells the next model what they were.',
  },
  {
    type: 'p',
    text: 'That loop took 1 lakh+ catalogue images from raw vendor shots to production-ready. The spreadsheet doubles as the dashboard: every row shows its status, its preview and, if it failed, why.',
  },
];

/* front-most folder on the home stack first */
export const BLOGS: Blog[] = [
  {
    slug: 'ai-image-catalogue-cleaning',
    title: 'AI Image Pipeline',
    dek: 'An AI automation that cleaned 1 lakh+ catalogue images, with AI checking AI’s work',
    readTime: '3m read',
    heading: 'Catalogue Image Editing, End to End',
    date: 'September 8, 2026',
    theme: 'green',
    /* in the strip left of the paper (0 → 207 design px); drag them anywhere */
    stickers: [
      { src: '/assets/stickers/gemini.png', x: 22, y: 56,  w: 166 },
      { src: '/assets/stickers/bloom.png',  x: 14, y: 270, w: 180 },
      { src: '/assets/stickers/n8n.png',    x: 6,  y: 492, w: 192 },
    ],
    blocks: CATALOGUE,
  },
  {
    slug: 'motion-to-code',
    title: 'Motion to Code',
    dek: 'Our dig into how we cracked a workflow to turn motion into production - ready code',
    readTime: '5m read',
    heading: 'Motion Design to Code',
    date: 'October 20, 2026',
    medium: 'https://medium.com/',
    theme: 'blue',
    /* design px from the folder's top-left, in the strip left of the paper
       (0 → 207) since the page was widened; drag them anywhere */
    stickers: [
      { src: '/assets/stickers/bloom.png',  x: 6,  y: 52,  w: 193.35 },
      { src: '/assets/stickers/motion.png', x: 24, y: 282, w: 161.02 },
      { src: '/assets/stickers/figma.png',  x: 42, y: 492, w: 125.44 },
    ],
    blocks: [...PLACEHOLDER_INTRO, { type: 'tv' }, ...PLACEHOLDER_PROBLEM],
  },
  {
    slug: 'figma-ui-to-code',
    title: 'Figma UI to Code',
    dek: 'Designers shouldn’t have to choose between beautiful and buildable anymore',
    readTime: '10m read',
    heading: 'Figma UI to Code',
    date: 'October 20, 2026',
    medium: 'https://medium.com/',
    theme: 'orange',
    stickers: [
      { src: '/assets/stickers/figma.png', x: 28, y: 56,  w: 149.49 },
      { src: '/assets/stickers/arc.png',   x: 24, y: 290, w: 159.14 },
      { src: '/assets/stickers/bloom.png', x: 40, y: 500, w: 125.44 },
    ],
    blocks: [...PLACEHOLDER_INTRO, ...PLACEHOLDER_PROBLEM],
  },
];

export function getBlog(slug: string): Blog | undefined {
  return BLOGS.find((b) => b.slug === slug);
}

/** the blog after this one, wrapping round to the first */
export function nextBlog(blog: Blog): Blog {
  return BLOGS[(BLOGS.indexOf(blog) + 1) % BLOGS.length];
}
