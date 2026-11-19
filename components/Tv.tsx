/* The retro TV from the Figma frame — traced from the Figma render, one SVG so it
   scales cleanly with the column. Coordinates are the render's px; the viewBox
   crops tight around the set. */

const CABINET =
  'M122 130 L445 130 C481 130 497 141 500.5 172 L507 305 C509 336 500 362 470 366 ' +
  'L98 366 C68 362 60 336 62 305 L69 172 C72 141 88 130 122 130 Z';

const FRONT =
  'M61 330 L507 330 C505 350 492 364 480 376 C467 389 456 396 438 396 ' +
  'L128 396 C111 396 101 389 88 376 C76 364 63 350 61 330 Z';

const SCREEN =
  'M126 144 L444 144 C470 144 480 155 482 181 L487 305 C488 331 478 342 455 342 ' +
  'L113 342 C90 342 80 331 81 305 L86 181 C88 155 99 144 126 144 Z';

const PLAY = 'M249 203 Q249 193 257.5 198 L327.5 239.7 Q334.6 244 327.5 248.3 L257.5 290 Q249 295 249 285 Z';

export default function Tv({ caption }: { caption?: string }) {
  return (
    <figure className="tv-figure">
      <svg className="tv" viewBox="52 122 464 282" role="img" aria-label="A retro TV with a play button">
        <defs>
          {/* cabinet top: red-orange, with amber light catching the top-left */}
          <linearGradient id="tv-cab" x1="0" y1="130" x2="0" y2="366" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#EE7034" />
            <stop offset="0.5" stopColor="#EB5D30" />
            <stop offset="1" stopColor="#D94327" />
          </linearGradient>
          <radialGradient
            id="tv-cab-light"
            cx="175"
            cy="126"
            r="240"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(175 126) scale(1 0.32) translate(-175 -126)"
          >
            <stop offset="0" stopColor="#F8B468" />
            <stop offset="0.45" stopColor="#F39A48" stopOpacity="0.75" />
            <stop offset="1" stopColor="#F08A3E" stopOpacity="0" />
          </radialGradient>
          {/* the lip darkens towards both ends */}
          <linearGradient id="tv-lip-side" x1="61" y1="0" x2="507" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="0.16" />
            <stop offset="0.38" stopColor="#000" stopOpacity="0" />
            <stop offset="0.62" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.14" />
          </linearGradient>
          {/* the rolled lip under the screen, catching the light */}
          <linearGradient id="tv-lip" x1="0" y1="343" x2="0" y2="366" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#DA8F74" />
            <stop offset="0.35" stopColor="#C76C53" />
            <stop offset="0.7" stopColor="#B04A30" />
            <stop offset="1" stopColor="#9A341D" />
          </linearGradient>
          {/* the front of the box, falling into shadow */}
          <linearGradient id="tv-front" x1="0" y1="350" x2="0" y2="396" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8A2E19" />
            <stop offset="0.4" stopColor="#762715" />
            <stop offset="1" stopColor="#4E1A0D" />
          </linearGradient>
          <linearGradient id="tv-front-side" x1="61" y1="0" x2="507" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="0.22" />
            <stop offset="0.25" stopColor="#000" stopOpacity="0" />
            <stop offset="0.75" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.1" />
          </linearGradient>
          {/* the dashed path fades out towards both ends */}
          <linearGradient id="tv-dash" x1="105" y1="0" x2="447" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0.04" />
            <stop offset="0.42" stopColor="#fff" stopOpacity="0.66" />
            <stop offset="0.58" stopColor="#fff" stopOpacity="0.62" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id="tv-play" cx="276" cy="243" r="60" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F8F8F8" />
            <stop offset="0.6" stopColor="#D5D5D5" />
            <stop offset="1" stopColor="#A2A2A2" />
          </radialGradient>
          {/* faint vertical banding on the glass */}
          <pattern id="tv-bands" width="16" height="10" patternUnits="userSpaceOnUse">
            <rect width="8" height="10" fill="#fff" fillOpacity="0.007" />
          </pattern>
          <clipPath id="tv-cab-clip">
            <path d={CABINET} />
          </clipPath>
          <filter id="tv-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="tv-edge" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {/* front of the box, under the top face */}
        <path d={FRONT} fill="url(#tv-front)" />
        <path d={FRONT} fill="url(#tv-front-side)" />

        {/* top face */}
        <path d={CABINET} fill="url(#tv-cab)" />
        <path d={CABINET} fill="url(#tv-cab-light)" />

        {/* bezel darkening into the screen */}
        <path d={SCREEN} fill="none" stroke="#5A1A0C" strokeWidth="5" filter="url(#tv-edge)" />

        {/* the lip under the screen */}
        <g clipPath="url(#tv-cab-clip)">
          <rect x="55" y="341" width="460" height="28" fill="url(#tv-lip)" />
          <rect x="55" y="341" width="460" height="28" fill="url(#tv-lip-side)" />
        </g>

        {/* screen */}
        <path d={SCREEN} fill="#0F0402" />
        <path d={SCREEN} fill="url(#tv-bands)" />

        {/* motion path: dashes, two keyframe dots */}
        <line x1="116" y1="243" x2="447" y2="243" stroke="url(#tv-dash)" strokeWidth="2" strokeDasharray="7 4.25" />
        <circle cx="180" cy="243" r="4.6" fill="#A33A21" />
        <circle cx="392.5" cy="243" r="4.6" fill="#A33A21" />

        {/* the play button and its glow */}
        <path d={PLAY} fill="#fff" opacity="0.45" filter="url(#tv-soft)" />
        <path d={PLAY} fill="url(#tv-play)" />
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
