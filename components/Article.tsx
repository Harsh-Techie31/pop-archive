import type { Block } from '@/lib/content';
import Tv from './Tv';

/* the blog itself — one element per content block */
export default function Article({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((bl, i) => {
        switch (bl.type) {
          case 'h2':
            return <h2 key={i}>{bl.text}</h2>;
          case 'h3':
            return <h3 key={i}>{bl.text}</h3>;
          case 'quote':
            return <blockquote key={i}>{bl.text}</blockquote>;
          case 'ol':
          case 'ul': {
            const List = bl.type;
            return (
              <List key={i}>
                {bl.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </List>
            );
          }
          case 'image':
            return (
              <figure key={i}>
                <img src={bl.src} alt={bl.alt ?? ''} loading="lazy" />
                {bl.caption && <figcaption>{bl.caption}</figcaption>}
              </figure>
            );
          case 'tv':
            return <Tv key={i} caption={bl.caption} />;
          case 'video':
            return (
              <figure key={i}>
                <video
                  src={bl.src}
                  poster={bl.poster}
                  controls={!bl.autoplay}
                  playsInline
                  autoPlay={bl.autoplay}
                  muted={bl.autoplay}
                  loop={bl.loop}
                />
                {bl.caption && <figcaption>{bl.caption}</figcaption>}
              </figure>
            );
          default:
            return <p key={i}>{bl.text}</p>;
        }
      })}
    </>
  );
}
