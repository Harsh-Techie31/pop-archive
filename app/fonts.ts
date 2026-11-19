import localFont from 'next/font/local';

export const figtree = localFont({
  variable: '--font-figtree',
  display: 'swap',
  src: [
    { path: './fonts/figtree_regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/figtree_medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/figtree_semibold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/figtree_bold.ttf', weight: '700', style: 'normal' },
  ],
});

export const awesomeSerif = localFont({
  variable: '--font-serif',
  display: 'block',
  src: [{ path: './fonts/awesome-serif-italic-bold-extratall.otf', weight: '700', style: 'italic' }],
});
