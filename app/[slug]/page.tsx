import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOGS, getBlog, nextBlog } from '@/lib/content';
import { cardArt } from '@/lib/art';
import OpenFolderArt from '@/components/OpenFolderArt';
import Article from '@/components/Article';
import Stickers from '@/components/Stickers';
import PaperHoles from '@/components/PaperHoles';
import ReaderShell from '@/components/ReaderShell';
import GlyphText from '@/components/GlyphText';
import ShareButton from '@/components/ShareButton';
import NextCard from '@/components/NextCard';

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

/* Geometry is the Figma frame "Frame 2 → when user selects one folder to read"
   (2143:73443) and the article page (2186:83608), measured at 1512 × 951 — see
   the reader section of app/globals.css. */
export default async function ReaderPage({ params }: Props) {
  const blog = getBlog((await params).slug);
  if (!blog) notFound();
  const next = nextBlog(blog);
  const art = cardArt(blog.slug);
  const fileNo = BLOGS.indexOf(blog) + 1;

  return (
    // keyed so moving to the next blog remounts it and plays the turn again
    <ReaderShell key={blog.slug} slug={blog.slug}>
      {/* the black bar above the folder */}
      <header className="reader__bar">
        <Link className="back" href="/">
          <img src="/assets/ui/chevron.svg" alt="" aria-hidden="true" />
          <span>Back to home</span>
        </Link>
        <GlyphText as="h2" className="reader__title" text={blog.title} />
        <GlyphText className="reader__dek" text={blog.dek} />
        <span className="reader__rule" aria-hidden="true" />
        <GlyphText className="reader__read" text={blog.readTime} />
      </header>

      <div className="sheet" data-theme={blog.theme}>
        {/* everything that turns: the folder, its stickers and the paper inside */}
        <div className="sheet__stage">
          {/* the same illustration the closed card uses, laid on its side: the
              art sits in a landscape box that is then turned a quarter clockwise */}
          {/* the art stops at 2097; a longer article carries the folder on with it */}
          <OpenFolderArt src={art.base} />
          {/* the cover-lift beat (FLAP_MS in lib/transition.ts, switched off) */}
          <div className="folder-open folder-open--flap" aria-hidden="true">
            <div className="folder-open__flat">
              <span className="folder-open__sheet" />
              <img className="folder-open__flap" src={art.flap} alt="" draggable={false} />
            </div>
          </div>
          <p className="sheet__tab">{blog.title}</p>
          <Stickers list={blog.stickers} />
          <img className="paper__clip" src="/assets/ui/clip.png" alt="" aria-hidden="true" />

          <article className="paper">
            <PaperHoles />
            <span className="paper__margin" aria-hidden="true" />
            <p className="paper__stamp">· File #{fileNo} ·</p>
            {blog.medium && (
              <p className="paper__also">
                Also find this on
                <a className="medium" href={blog.medium} target="_blank" rel="noopener noreferrer">
                  <svg className="medium__mark" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="24" height="24" rx="4" fill="#000" />
                    <g fill="#fff">
                      <ellipse cx="7.7" cy="12" rx="4.2" ry="4.5" />
                      <ellipse cx="15.7" cy="12" rx="2" ry="4.5" />
                      <ellipse cx="19.7" cy="12" rx=".8" ry="4.5" />
                    </g>
                  </svg>
                  <span>Medium</span>
                </a>
              </p>
            )}
            <div className="paper__content">
              <h1 className="paper__head">{blog.heading ?? blog.title}</h1>
              {blog.date && <p className="paper__date">{blog.date}</p>}
              <ShareButton />
              <span className="paper__hr" aria-hidden="true" />
              <div className="paper__body">
                <Article blocks={blog.blocks} />
              </div>
            </div>
            <p className="paper__end">
              <Spark />
              <span>The End</span>
              <Spark />
            </p>
          </article>
        </div>
      </div>

      <footer className="next">
        <img className="next__rule" src="/assets/ui/divider.svg" alt="" aria-hidden="true" />
        <NextCard next={next} />
      </footer>
    </ReaderShell>
  );
}

function Spark() {
  return (
    <svg className="spark" viewBox="0 0 21 21" aria-hidden="true">
      <path
        d="M10.5 0c1 5.5 5 9.5 10.5 10.5C15.5 11.5 11.5 15.5 10.5 21 9.5 15.5 5.5 11.5 0 10.5 5.5 9.5 9.5 5.5 10.5 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
