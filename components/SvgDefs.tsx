/* shared SVG: folder shape, gradients, paper noise */
export default function SvgDefs() {
  return (
    <svg className="svg-defs" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="g-blue" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#1C49DE" />
          <stop offset="0.42" stopColor="#102DAE" />
          <stop offset="1" stopColor="#0A1D78" />
        </linearGradient>
        <linearGradient id="g-blue-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5B7CE5" />
          <stop offset="1" stopColor="#0E2262" />
        </linearGradient>

        <linearGradient id="g-orange" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#F15420" />
          <stop offset="0.42" stopColor="#D93E17" />
          <stop offset="1" stopColor="#AC280F" />
        </linearGradient>
        <linearGradient id="g-orange-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FD9D7B" />
          <stop offset="1" stopColor="#6D2910" />
        </linearGradient>

        <linearGradient id="g-green" x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#02CD60" />
          <stop offset="0.42" stopColor="#029F43" />
          <stop offset="1" stopColor="#016C2D" />
        </linearGradient>
        <linearGradient id="g-green-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7BF2AE" />
          <stop offset="1" stopColor="#0B4A26" />
        </linearGradient>

        {/* grain, same recipe as the Figma paper/leather noise */}
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.9"
            numOctaves={3}
            seed={9948}
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix in="n" type="luminanceToAlpha" result="a" />
          <feComponentTransfer in="a" result="c">
            <feFuncA type="discrete" tableValues="0 0 0 0 0 .55 0 0 0 0 .35 0 0 0 0 0 0 0 0 0" />
          </feComponentTransfer>
          <feComposite operator="in" in2="SourceGraphic" in="c" result="clipped" />
          <feFlood floodColor="#000" floodOpacity=".22" result="f" />
          <feComposite operator="in" in2="clipped" in="f" result="shade" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="shade" />
          </feMerge>
        </filter>

        {/* folder silhouette, straight from the Figma vector */}
        <path
          id="folder-path"
          d="M0 71.3435V877.301L1512 879V74.2087C1512 67.5813 1506.63 62.2087 1500
      62.2087H466.236C456.086 62.2087 446.624 57.0764 441.089 48.5683L418.366 13.6404C412.831 5.13232
      403.369 0 393.219 0H75.8875C65.5601 0 55.9588 5.31192 50.4719 14.0612L25.8326 53.3502C22.0443
      59.3909 15.4153 63.0584 8.28507 63.0584C3.70935 63.0584 0 66.7677 0 71.3435Z"
        />
      </defs>
    </svg>
  );
}
