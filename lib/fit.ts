/* Page fit, run before first paint (inline in <head>) and again on every resize.

   --s           design px → real px. The design is drawn at 1512 wide.
   --mshift      design px trimmed off the empty space above the logo
   --mk          scale for the logo + "Archive" masthead
   --mh          the masthead's height in design px (where the folder stack starts)
   --front-lift  how far (design px) the front folder rises on hover

   At rest the home page keeps the earlier layout: the Figma masthead, lifted
   40 design px per folder past two. On a short window the stack may show at
   most 20% more of the front folder than that layout did — the masthead gives
   up the space, first the empty band above the logo, then by scaling down.

   On hover, the front folder rises until FRONT_CONTENT of it is on screen,
   never less than the Figma 57.71. The folders behind rise with it so each
   keeps a STRIP showing (its title), never over "Archive". If the window is
   too short for both, the front folder shows less (down to FRONT_MIN, its
   text), then the strips get thinner (down to STRIP_MIN).

   --behind-lift-1, -2, …  how far the folder 1, 2, … places behind the front
                           one rises while the front one is hovered

   Self-contained on purpose: it's stringified into the inline <head> script. */
export function fitPage(folders: number) {
  var root = document.documentElement;
  var s = root.clientWidth / 1512;
  var h = Math.max(window.innerHeight, 620); // .view--home has min-height 620
  var MASTHEAD = 497.38; // Figma masthead height
  var TRIMMABLE = 70; // empty band above the logo we can give up
  var INK_BOTTOM = 418.06; // bottom of the "Archive" line box in the masthead
  var HOVER_GAP = 72; // a hovered back folder lifts 57.71, plus a little air
  var GAP = 118.33; // between folders
  // how much of the front folder shows on hover: the top 70% of the 385 that
  // fits its title, summary and stickers — the text, and the top of the stickers
  var FRONT_CONTENT = 270;
  var LIFT = 57.71; // Figma hover lift
  var GROW = 0.2; // the stack may show at most 20% more than the earlier layout
  var STRIP = 70; // a folder behind the hovered front one keeps its whole title showing…
  var STRIP_MIN = 50; // …or at least most of it, on very short windows
  var FRONT_MIN = 242; // the hovered front folder always shows its summary + read time (ends at 239)

  // the earlier layout
  var shift = Math.min(TRIMMABLE, 40 * Math.max(0, folders - 2));
  var k = 1;
  var stack = (folders - 1) * GAP;
  var visible = h / s - (MASTHEAD - shift) - stack; // front folder on screen at rest

  // only grow when the front folder's content doesn't already fit at rest
  var extra = Math.max(0, Math.min(GROW * visible, FRONT_CONTENT - LIFT - visible));
  var mh = MASTHEAD - shift;
  if (extra > 0) {
    var target = mh - extra;
    shift = Math.min(TRIMMABLE, MASTHEAD - target);
    var T = MASTHEAD - shift; // trimmed masthead height at k = 1
    var I = INK_BOTTOM - shift; // "Archive" bottom at k = 1
    // masthead height at scale k is max(T·k, I·k + HOVER_GAP); solve it for `target`
    k = target / T;
    if (T * k < I * k + HOVER_GAP) k = (target - HOVER_GAP) / I;
    k = Math.min(1, k);
    mh = Math.max(T * k, I * k + HOVER_GAP);
    visible = h / s - mh - stack;
  }

  // ── hovering the front folder: it rises, and the folders behind rise with it
  //    so each keeps a strip (its title) showing above the next one
  var D = h / s; // window height in design px
  var frontRest = mh + stack; // front folder's top at rest
  var ceiling = (INK_BOTTOM - shift) * k + 4; // folders never rise over "Archive"
  var behind = folders - 1;
  var front = Math.max(LIFT, FRONT_CONTENT - visible); // its lift, before sharing room
  var frontTop = frontRest - front;
  var strip = behind ? Math.min(STRIP, (frontTop - ceiling) / behind) : STRIP;
  if (strip < STRIP) {
    // not enough room: the front folder shows less, down to just its text…
    frontTop = Math.min(ceiling + behind * STRIP, D - FRONT_MIN);
    frontTop = Math.max(frontTop, frontRest - front); // …never more than it would have
    strip = Math.max(STRIP_MIN, Math.min(STRIP, (frontTop - ceiling) / behind));
    frontTop = Math.max(frontTop, ceiling + behind * strip);
  }
  var frontLift = Math.max(LIFT, frontRest - frontTop);
  frontTop = frontRest - frontLift;

  root.style.setProperty('--s', String(s));
  root.style.setProperty('--mshift', String(shift));
  root.style.setProperty('--mk', String(k));
  root.style.setProperty('--mh', String(mh));
  root.style.setProperty('--front-lift', String(frontLift));
  // folder d places behind the front (d = 1 … folders-1): how far it rises
  for (var d = 1; d < folders; d++) {
    var rest = frontRest - d * GAP;
    var want = frontTop - d * strip;
    root.style.setProperty('--behind-lift-' + d, String(Math.max(0, rest - want)));
  }
}

export const fitScript = (folders: number) => `(${fitPage.toString()})(${folders});`;
