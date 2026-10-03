import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { book, chapters, pages, roman } from "../content";
import { BookPage } from "../components/book/BookPage";
import "./book.css";

const mobileQuery = window.matchMedia("(max-width: 760px)");
const subscribeMobile = (callback: () => void) => {
  mobileQuery.addEventListener("change", callback);
  return () => mobileQuery.removeEventListener("change", callback);
};
const getMobile = () => mobileQuery.matches;
type DesktopView = "single" | "spread";
const readDesktopView = (): DesktopView => {
  try {
    return localStorage.getItem("portfolio-book-view") === "single"
      ? "single"
      : "spread";
  } catch {
    return "spread";
  }
};

export default function Home() {
  const [page, setPage] = useState(0);
  const mobile = useSyncExternalStore(subscribeMobile, getMobile);
  const [desktopView, setDesktopView] = useState<DesktopView>(readDesktopView);
  const singlePage = mobile || desktopView === "single";
  const singlePageRef = useRef(singlePage);
  const chapter = chapters.findIndex(
    (chapter) => chapter.id === pages[page].chapterId,
  );
  const spreadStart = Math.floor(page / 2) * 2;
  const [settings, setSettings] = useState(false);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const settingsMenu = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    singlePageRef.current = singlePage;
  }, [singlePage]);
  const currentSpread = useRef<HTMLDivElement>(null);
  const departingSpread = useRef<HTMLDivElement>(null);
  const [departing, setDeparting] = useState<{
    page: number;
    scroll: number[];
    id: number;
  } | null>(null);
  const turnId = useRef(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [contents, setContents] = useState(false);
  const pageRef = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const contentsButton = useRef<HTMLButtonElement>(null);
  const contentsMenu = useRef<HTMLElement>(null);

  const goToPage = useCallback((next: number) => {
    if (next < 0 || next >= pages.length || next === pageRef.current) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setDeparting(
      reducedMotion
        ? null
        : {
            page: pageRef.current,
            scroll: Array.from(
              currentSpread.current?.querySelectorAll<HTMLElement>(".paper") ??
                [],
            ).map((el) => el.scrollTop),
            id: ++turnId.current,
          },
    );
    setDirection(next > pageRef.current ? "next" : "prev");
    pageRef.current = next;
    setPage(next);
    setContents(false);
  }, []);
  const navigate = goToPage;
  const changeView = (view: DesktopView) => {
    setDesktopView(view);
    setDeparting(null);
    try {
      localStorage.setItem("portfolio-book-view", view);
    } catch {
      /* The view still works when storage is blocked. */
    }
  };
  const turnPage = useCallback(
    (delta: number) => {
      goToPage(
        singlePageRef.current
          ? pageRef.current + delta
          : Math.floor(pageRef.current / 2) * 2 + delta * 2,
      );
    },
    [goToPage],
  );

  useLayoutEffect(() => {
    departingSpread.current
      ?.querySelectorAll<HTMLElement>(
        ".sheet-front .paper, .stationary-page .paper",
      )
      .forEach((el) => {
        const pageNumber = Number(el.dataset.page) - 1;
        el.scrollTop = departing?.scroll[singlePage ? 0 : pageNumber % 2] ?? 0;
      });
  }, [departing, singlePage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("#settings-menu, #contents-menu")) {
        if (e.key === "Escape") {
          setContents(false);
          setSettings(false);
          (settings ? settingsButton : contentsButton).current?.focus();
        }
        return;
      }
      if (
        (e.target as HTMLElement).closest(
          'input, textarea, select, [contenteditable="true"]',
        ) ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        turnPage(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        turnPage(-1);
      }
      if (e.key === "Escape" && settings) {
        setSettings(false);
        settingsButton.current?.focus();
      }
      if (e.key === "Escape" && contents) {
        setContents(false);
        contentsButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turnPage, contents, settings]);

  useEffect(() => {
    if (!contents) return;
    contentsMenu.current
      ?.querySelector<HTMLButtonElement>('[aria-current="page"]')
      ?.focus();
    const dismiss = (e: PointerEvent) => {
      if (
        !contentsMenu.current?.contains(e.target as Node) &&
        !contentsButton.current?.contains(e.target as Node)
      )
        setContents(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [contents]);

  useEffect(() => {
    if (!settings || mobile) return;
    settingsMenu.current
      ?.querySelector<HTMLInputElement>("input:checked")
      ?.focus();
    const dismiss = (event: PointerEvent) => {
      if (
        !settingsMenu.current?.contains(event.target as Node) &&
        !settingsButton.current?.contains(event.target as Node)
      )
        setSettings(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [settings, mobile]);

  return (
    <main className={`journal ${singlePage ? "single-page" : "two-page"}`}>
      <div className="book-area">
        <div className="chapter-navigation">
          <button
            ref={contentsButton}
            aria-expanded={contents}
            aria-controls="contents-menu"
            onClick={() => {
              setContents(!contents);
              setSettings(false);
            }}
          >
            <span aria-hidden="true">❧</span> Contents{" "}
            <span className="contents-chevron" aria-hidden="true">
              ⌄
            </span>
          </button>
          {!mobile && (
            <>
              <button
                ref={settingsButton}
                className="settings-trigger"
                aria-expanded={settings}
                aria-controls="settings-menu"
                onClick={() => {
                  setSettings(!settings);
                  setContents(false);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path
                    d="m9 3 1-1h4l1 4 3 1 3-1 2 4-3 3v3l1 3-4 2-3-2h-3l-3 2-3-3 1-3-1-3-3-2 2-4 4 1 2-2Z"
                    transform="translate(1 1) scale(.88)"
                  />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
                Settings
              </button>
              {settings && (
                <div
                  ref={settingsMenu}
                  id="settings-menu"
                  className="settings-menu"
                >
                  <fieldset>
                    <legend>Reading view</legend>
                    <label>
                      <input
                        type="radio"
                        name="book-view"
                        value="single"
                        checked={desktopView === "single"}
                        onChange={() => changeView("single")}
                      />
                      <span>Single page</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="book-view"
                        value="spread"
                        checked={desktopView === "spread"}
                        onChange={() => changeView("spread")}
                      />
                      <span>Two pages</span>
                    </label>
                  </fieldset>
                  <a
                    className="ink-link"
                    href={book.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Portfolio source on GitHub ↗
                  </a>
                </div>
              )}
            </>
          )}

          {contents && (
            <nav
              ref={contentsMenu}
              className="contents-menu"
              id="contents-menu"
              aria-label="Table of contents"
            >
              <div className="scroll-manuscript">
                <div className="scroll-heading" aria-hidden="true">
                  <span>❧</span>
                  <p>The table of contents</p>
                  <span>A guide to these chronicles</span>
                </div>
                {chapters.map((item, i) => (
                  <button
                    key={item.id}
                    aria-current={chapter === i ? "page" : undefined}
                    onClick={() => {
                      navigate(item.pageIndex);
                      setContents(false);
                      contentsButton.current?.focus();
                    }}
                  >
                    <span>{roman(i + 1)}</span>
                    <span className="scroll-chapter-name">{item.title}</span>
                    <span className="scroll-leader" aria-hidden="true" />
                    <span>{String(item.pageIndex + 1).padStart(2, "0")}</span>
                  </button>
                ))}
                <div className="scroll-colophon" aria-hidden="true">
                  <span>AG</span>
                  <p>Turn a page. Begin a tale.</p>
                </div>
              </div>
            </nav>
          )}
        </div>
        <div
          className="book"
          aria-label={`Chapter ${roman(chapter + 1)}: ${chapters[chapter].title}`}
          onTouchStart={(e) => {
            touch.current = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            };
          }}
          onTouchEnd={(e) => {
            if (!touch.current) return;
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4)
              turnPage(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
          onTouchCancel={() => {
            touch.current = null;
          }}
        >
          <div className="page-stage">
            <div
              ref={currentSpread}
              className="book-spread"
              key={`${page}-${singlePage}`}
            >
              <BookPage
                index={singlePage ? page : spreadStart}
                navigate={navigate}
              />
              {!singlePage && (
                <BookPage index={spreadStart + 1} navigate={navigate} />
              )}
            </div>
            {departing && (
              <div
                ref={departingSpread}
                className={`page-turn-layer departing-${direction}`}
                aria-hidden="true"
                inert
              >
                {!singlePage && (
                  <div className="stationary-page">
                    <BookPage
                      index={
                        Math.floor(departing.page / 2) * 2 +
                        (direction === "next" ? 0 : 1)
                      }
                      navigate={navigate}
                    />
                  </div>
                )}
                <div
                  key={departing.id}
                  className={`turning-sheet sheet-${direction}`}
                  onAnimationEnd={(event) => {
                    if (event.target !== event.currentTarget) return;
                    setDeparting((current) =>
                      current?.id === departing.id ? null : current,
                    );
                  }}
                >
                  <div className="sheet-face sheet-front">
                    <BookPage
                      index={
                        singlePage
                          ? departing.page
                          : Math.floor(departing.page / 2) * 2 +
                            (direction === "next" ? 1 : 0)
                      }
                      navigate={navigate}
                    />
                  </div>
                  <div className="sheet-face sheet-back">
                    {!singlePage && (
                      <BookPage
                        index={spreadStart + (direction === "next" ? 0 : 1)}
                        navigate={navigate}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="book-spine" aria-hidden="true" />
          <div className="page-turn-controls">
            <button
              disabled={singlePage ? page === 0 : spreadStart === 0}
              onClick={() => turnPage(-1)}
              aria-label="Previous page"
              title="Previous page (left arrow)"
            >
              ←
            </button>
            <span className="sr-only" aria-live="polite">
              Chapter {roman(chapter + 1)}: {chapters[chapter].title}. Page{" "}
              {page + 1} of {pages.length}.
            </span>
            <button
              disabled={
                singlePage
                  ? page === pages.length - 1
                  : spreadStart + 2 >= pages.length
              }
              onClick={() => turnPage(1)}
              aria-label="Next page"
              title="Next page (right arrow)"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
