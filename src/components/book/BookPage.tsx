import type { ReactNode } from "react";
import { book, chapters, pages, roman } from "../../content";
import type { ContentBlock } from "../../content/schema";
import cvUrl from "../../../docs/cv.pdf?url";
import { Castle } from "./Castle";

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />✦<span />
    </div>
  );
}
function ContentLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={href === "resume" ? cvUrl : href}
      download={href === "resume" ? "Aditya-Gupta-CV.pdf" : undefined}
      target={href.startsWith("https://") ? "_blank" : undefined}
      rel={href.startsWith("https://") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
function Block({
  block,
  navigate,
}: {
  block: ContentBlock;
  navigate: (page: number) => void;
}) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className={block.style === "body" ? undefined : block.style}>
          {block.text}
        </p>
      );
    case "heading": {
      const Tag = block.level === "title" ? "h1" : "h2";
      return (
        <Tag>
          {block.text.endsWith(".") ? (
            <>
              {block.text.slice(0, -1)}
              <span className="title-dot">.</span>
            </>
          ) : (
            block.text
          )}
        </Tag>
      );
    }
    case "flourish":
      return <div className="title-flourish">{block.text}</div>;
    case "illustration":
      return <Castle small={block.small} />;
    case "ornament":
      return <Ornament />;
    case "note":
      return (
        <div className="margin-note">
          <span aria-hidden="true">{block.symbol}</span>
          <p>{block.text}</p>
        </div>
      );
    case "skills":
      return (
        <div className="skill-list">
          {block.items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      );
    case "stats":
      return (
        <div className="stats">
          {block.items.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      );
    case "metric":
      return (
        <div className="project-result">
          {block.value} <span>{block.label}</span>
        </div>
      );
    case "link":
      return (
        <ContentLink className="ink-link" href={block.href}>
          {block.label}
        </ContentLink>
      );
    case "page-link":
      return (
        <button
          className="ink-link"
          onClick={() =>
            navigate(pages.findIndex((page) => page.id === block.pageId))
          }
        >
          {block.label}
        </button>
      );
    case "contents":
      return (
        <div className="chapter-index">
          <p className="eyebrow">{block.title}</p>
          {block.chapterIds.map((id) => {
            const index = chapters.findIndex((chapter) => chapter.id === id);
            const chapter = chapters[index];
            return (
              <button key={id} onClick={() => navigate(chapter.pageIndex)}>
                <span>{roman(index + 1)}.</span>
                <span>{chapter.title}</span>
                <span className="leader" />
                <span>↗</span>
              </button>
            );
          })}
        </div>
      );
    case "contacts":
      return (
        <div className="contact-list">
          {block.items.map((item) => (
            <ContentLink href={item.href} key={item.eyebrow}>
              <span>{item.eyebrow}</span>
              <strong>{item.label}</strong>
            </ContentLink>
          ))}
        </div>
      );
    case "entry":
      return (
        <article className="entry">
          <p className="entry-meta">{block.meta}</p>
          <h3>{block.title}</h3>
          <div>
            {block.blocks.map((child, i) => (
              <Block key={i} block={child} navigate={navigate} />
            ))}
          </div>
        </article>
      );
    case "award":
      return (
        <div className="award">
          <span className="award-medal">{block.medal}</span>
          <h3>{block.title}</h3>
          {block.blocks.map((child, i) => (
            <Block key={i} block={child} navigate={navigate} />
          ))}
        </div>
      );
    default: {
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}
export function BookPage({
  index,
  navigate,
}: {
  index: number;
  navigate: (page: number) => void;
}) {
  const page = pages[index];
  // An odd page count leaves an intentional blank facing page in two-page mode.
  if (!page) return <section className="paper blank-page" aria-hidden="true" />;
  return (
    <section
      className={`paper ${page.layout === "cover" ? "cover-page" : ""}`}
      data-page={index + 1}
      aria-label={`Page ${index + 1}: ${page.footerLabel}`}
    >
      <div className="page-running">
        <span>{book.runningTitle}</span>
        <span aria-hidden="true">✧</span>
      </div>
      <div className="page-content">
        {page.blocks.map((block, i) => (
          <Block key={i} block={block} navigate={navigate} />
        ))}
      </div>
      <div className="page-footer">
        <span>{page.footerLabel}</span>
        <span>— {String(index + 1).padStart(2, "0")} —</span>
        <span aria-hidden="true">✦</span>
      </div>
    </section>
  );
}
