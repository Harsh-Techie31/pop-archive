import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOGS, getBlog, nextBlog } from '@/lib/content';
import { END_CARD_BOX, END_STICKERS, END_STICKERS_BY_SLUG } from '@/lib/art';
import { CardArt, StickerLayer } from '@/components/Card';
import Article from '@/components/Article';
import Stickers from '@/components/Stickers';
import PaperHoles from '@/components/PaperHoles';
import ReaderShell from '@/components/ReaderShell';
import OpenFolder from '@/components/OpenFolder';

type Props = { params: Promise<{ slug: string }> };

// every blog is built ahead of time; anything else is a 404
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = getBlog((await params).slug);
  return blog ? { title: blog.title, description: blog.dek } : {};
}

export default async function ReaderPage({ params }: Props) {
  const blog = getBlog((await params).slug);
  if (!blog) notFound();
  const next = nextBlog(blog);

  return (
    // keyed so moving to the next blog remounts it and replays the entry motion
    <ReaderShell key={blog.slug}>
      <header className="reader__bar">
        <Link className="back" href="/">
          <img src="/assets/ui/chevron.svg" alt="" aria-hidden="true" />
          <span>Back to home</span>
        </Link>
        <div className="reader__head">
          <h2 className="reader__title">{blog.title}</h2>
          <div className="reader__meta">
            <p className="reader__dek">{blog.dek}</p>
            <span className="reader__rule" />
            <p className="reader__read">{blog.readTime}</p>
          </div>
        </div>
      </header>

      <div className="sheet" data-theme={blog.theme}>
        <div className="sheet__folder">
          <OpenFolder />
          <p className="sheet__tab">{blog.title}</p>
          <Stickers list={blog.stickers} />
          <article className="paper">
            <img className="paper__clip" src="/assets/ui/clip.png" alt="" aria-hidden="true" />
            <PaperHoles />
            <div className="paper__body">
              <Article blocks={blog.blocks} />
            </div>
          </article>
        </div>
      </div>

      <footer className="next">
        <img className="next__rule" src="/assets/ui/divider.svg" alt="" aria-hidden="true" />
        <div className="next__inner">
          <Link className="next__link" href={`/${next.slug}`}>
            <img className="next__arrow" src="/assets/ui/arrow.svg" alt="" aria-hidden="true" />
            <span className="next__text">
              <span className="next__title">{next.title}</span>
              <span className="next__dek">{next.dek}</span>
              <span className="next__read">{next.readTime}</span>
            </span>
          </Link>
          <Link className="next__folder" href={`/${next.slug}`} data-theme={next.theme} aria-label={`Read ${next.title}`}>
            <CardArt slug={next.slug} />
            <StickerLayer list={END_STICKERS_BY_SLUG[next.slug] ?? END_STICKERS} box={END_CARD_BOX} />
          </Link>
        </div>
      </footer>
    </ReaderShell>
  );
}
