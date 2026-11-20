'use client';

import { useState } from 'react';

/* Share: the system share sheet where there is one, otherwise copy the link */
export default function ShareButton() {
  const [label, setLabel] = useState('Share');

  async function share() {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLabel('Link copied');
      setTimeout(() => setLabel('Share'), 1800);
    } catch {
      /* the user dismissed the sheet — nothing to do */
    }
  }

  return (
    <button className="share" type="button" onClick={share}>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 10.4V2.3M5.2 5.1 8 2.3l2.8 2.8M2.9 9.9v2.7c0 .5.4.9.9.9h8.4c.5 0 .9-.4.9-.9V9.9" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
