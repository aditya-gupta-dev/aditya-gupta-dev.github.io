import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import cvUrl from "../../docs/cv.pdf?url";
import "./book.css";

const chapters = [
  "The beginning",
  "The craft",
  "The creations",
  "The journey",
  "The honours",
  "The next chapter",
];
const roman = ["I", "II", "III", "IV", "V", "VI"];

const VisiblePage = createContext<number | null>(null);
const mobileQuery = window.matchMedia("(max-width: 760px)");
const subscribeMobile = (callback: () => void) => {
  mobileQuery.addEventListener("change", callback);
  return () => mobileQuery.removeEventListener("change", callback);
};
const getMobile = () => mobileQuery.matches;

function Castle({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={small ? "castle small" : "castle"}
      viewBox="0 0 240 150"
      fill="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        d="M18 128h204v4H18zM30 120h180v8H30zM43 112h155v8H43z"
        fill="#88856a"
      />
      <path
        d="M42 111V61h28v50M170 111V61h28v50M78 112V77h84v35M91 78V45h58v33"
        fill="#a29474"
      />
      <path
        d="M39 61h34v7H39zM167 61h34v7h-34zM88 44h64v8H88z"
        fill="#625e4c"
      />
      <path
        d="M39 61V50h7v6h7v-6h7v6h7v-6h6v11M167 61V50h7v6h7v-6h7v6h7v-6h6v11M88 44V33h8v6h8v-6h8v6h8v-6h8v6h8v-6h8v6h8v-6h0v11"
        fill="#625e4c"
      />
      <path d="M113 33V14h3v19" fill="#625e4c" />
      <path d="M116 14h21v5h-5v6h-16z" fill="#803a3b" />
      <path
        d="M108 112V91h5v-6h14v6h5v21zM51 77h9v15h-9zM179 77h9v15h-9zM103 59h6v11h-6zM132 59h6v11h-6z"
        fill="#4f5044"
      />
      <path
        d="M46 101h7v3h-7zM63 72h7v3h-7zM81 87h12v3H81zM146 102h12v3h-12zM174 96h9v3h-9zM121 76h11v3h-11zM94 53h6v3h-6z"
        fill="#c6b994"
      />
      <path
        d="M17 113h4V85h4v28h6v4H11v-4zM10 101V89h6v-8h13v8h6v12zM209 115V89h4v26M201 104V90h5v-9h12v9h5v14z"
        fill="#6d795d"
      />
      <path d="M106 117h28v5h9v5h11v5H91v-5h7v-5h8z" fill="#c2b28a" />
      <path
        d="M36 26h3v3h-3zM190 24h3v3h-3zM205 46h3v3h-3zM67 20h3v3h-3zM161 14h3v3h-3zM24 54h3v3h-3z"
        fill="#a8956b"
      />
      <path
        d="M172 35h5v-5h3v5h5v3h-5v5h-3v-5h-5zM57 36h4v-4h2v4h4v2h-4v4h-2v-4h-4z"
        fill="#a8956b"
      />
    </svg>
  );
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />✦<span />
    </div>
  );
}
function Page({
  children,
  number,
  label,
  cover = false,
}: {
  children: ReactNode;
  number: number;
  label: string;
  cover?: boolean;
}) {
  const visiblePage = useContext(VisiblePage);
  if (visiblePage !== null && visiblePage !== number - 1) return null;
  return (
    <section
      data-page={number}
      className={`paper ${cover ? "cover-page" : ""}`}
    >
      <div className="page-running">
        <span>THE CHRONICLES OF ADITYA</span>
        <span>✧</span>
      </div>
      <div className="page-content">{children}</div>
      <div className="page-footer">
        <span>{label}</span>
        <span>— {String(number).padStart(2, "0")} —</span>
        <span>✦</span>
      </div>
    </section>
  );
}
function Heading({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{children}</h2>
      <Ornament />
    </>
  );
}
function Entry({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <article className="entry">
      <p className="entry-meta">{meta}</p>
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  );
}

function Spread({
  chapter,
  navigate,
}: {
  chapter: number;
  navigate: (page: number) => void;
}) {
  switch (chapter) {
    case 0:
      return (
        <>
          <Page number={1} label="THE TITLE PAGE" cover>
            <p className="eyebrow">A DEVELOPER’S FIELD JOURNAL</p>
            <div className="title-flourish">✦</div>
            <h1>
              Aditya
              <br />
              Gupta<span className="title-dot">.</span>
            </h1>
            <p className="cover-subtitle">Developer. Tinkerer. Builder.</p>
            <Castle />
            <p className="cover-quote">
              A curious mind.
              <br />A keyboard. An endless quest.
            </p>
            <Ornament />
            <p className="edition">
              VOLUME I <span>·</span> THE JOURNEY SO FAR
            </p>
          </Page>
          <Page number={2} label="THE PROLOGUE">
            <Heading eyebrow="CHAPTER I · THE BEGINNING">
              Hello, fellow
              <br />
              traveller<span className="title-dot">.</span>
            </Heading>
            <p className="drop-cap">
              I’m Aditya, a developer who loves getting under the hood of things
              — from the pixels on your screen to the systems that make them
              work.
            </p>
            <p>
              I build across the stack: web experiences, native apps, automation
              pipelines, and the occasional window manager from scratch.
            </p>
            <p>
              Currently studying Computer Science at Lovely Professional
              University, turning curiosity into things you can actually use.
            </p>
            <div className="margin-note">
              <span>✧</span>
              <p>
                Some collect stories.
                <br />I like to build mine.
              </p>
            </div>
            <div className="chapter-index">
              <p className="eyebrow">WITHIN THESE PAGES</p>
              {chapters.slice(1, 5).map((name, i) => (
                <button key={name} onClick={() => navigate(i + 1)}>
                  <span>{roman[i + 1]}.</span>
                  <span>{name}</span>
                  <span className="leader" />
                  <span>↗</span>
                </button>
              ))}
            </div>
          </Page>
        </>
      );
    case 1:
      return (
        <>
          <Page number={3} label="THE TOOLBOX">
            <Heading eyebrow="CHAPTER II · THE CRAFT">
              Tools of
              <br />
              the trade.
            </Heading>
            <p>
              Different problems call for different tools. These are the ones I
              bring to the workbench.
            </p>
            <Entry title="The languages" meta="01 / THE FOUNDATIONS">
              <div className="skill-list">
                {[
                  "JavaScript",
                  "TypeScript",
                  "Python",
                  "Go",
                  "Rust",
                  "C++",
                  "Java",
                  "Kotlin",
                  "C#",
                  "pgSQL",
                ].map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            </Entry>
            <Entry title="The frameworks" meta="02 / THE BUILDING BLOCKS">
              <div className="skill-list">
                {[
                  "React",
                  "Next.js",
                  "React Native",
                  "Svelte",
                  "tRPC",
                  "Drizzle",
                  "Wails",
                  "Actix",
                  "Fiber",
                  "Clerk",
                ].map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            </Entry>
          </Page>
          <Page number={4} label="THE WORKBENCH">
            <Heading eyebrow="AN INVENTORY OF POSSIBILITIES">
              Beyond
              <br />
              the interface.
            </Heading>
            <Entry
              title="Infrastructure & platforms"
              meta="03 / KEEPING THINGS RUNNING"
            >
              <p>
                GCP, AWS, Kubernetes, Firebase, Convex, GitHub, Sentry, PostHog,
                Plausible, and GSC.
              </p>
            </Entry>
            <Entry title="At the workbench" meta="04 / THE EVERYDAY ESSENTIALS">
              <p>
                Linux, Vim, Docker, Bun, PostgreSQL, SQLite, Redis, FFmpeg, and
                Ollama.
              </p>
            </Entry>
            <Entry title="The human side" meta="05 / BETTER TOGETHER">
              <p>
                Communication, leadership, teamwork, analytical thinking, and
                social media marketing.
              </p>
            </Entry>
            <div className="margin-note">
              <span>⚒</span>
              <p>
                Learn the tool.
                <br />
                Understand the system.
              </p>
            </div>
          </Page>
        </>
      );
    case 2:
      return (
        <>
          <Page number={5} label="SELECTED WORKS">
            <Heading eyebrow="CHAPTER III · THE CREATIONS">
              Made with
              <br />
              curiosity.
            </Heading>
            <Entry
              title="Social Media Automation"
              meta="01 / GO · DOCKER · AWS · FFMPEG / MAY 2026"
            >
              <p>
                An AI-powered CLI pipeline for concurrent video downloading,
                audio-video merging, and looped content creation.
              </p>
              <p>
                Built with Go and Cobra, YouTube OAuth2 integration, caching,
                and containerised workflows.
              </p>
              <div className="stats">
                <div>
                  <strong>3.52M+</strong>
                  <span>organic views</span>
                </div>
                <div>
                  <strong>260K+</strong>
                  <span>watch hours</span>
                </div>
                <div>
                  <strong>7</strong>
                  <span>channels</span>
                </div>
              </div>
              <p className="small-note">
                Reaching 15.3K+ subscribers through automated content
                generation.
              </p>
            </Entry>
            <a
              className="ink-link"
              href="https://github.com/aditya-gupta-dev"
              target="_blank"
              rel="noreferrer"
            >
              Explore my GitHub ↗
            </a>
          </Page>
          <Page number={6} label="SELECTED WORKS">
            <Entry
              title="X11 Window Manager"
              meta="02 / C · X11 · CMAKE · LINUX / JUN 2026"
            >
              <p>
                A dynamic tiling window manager built from the ground up.
                Minimal, configurable at source, and designed for
                keyboard-driven workflows.
              </p>
              <p>
                Custom Xlib tiling algorithms and a native C status bar for
                real-time hardware monitoring.
              </p>
              <div className="project-result">
                12 MB <span>memory footprint</span>
              </div>
            </Entry>
            <Entry
              title="Android Notification Tracker"
              meta="03 / KOTLIN · SQLITE · AI / JUN 2026"
            >
              <p>
                An offline-first app that saves notifications, summarises the
                daily clutter with AI, and reveals patterns in your data.
              </p>
              <p>
                Jetpack Compose, a custom SQLite engine, and real-time
                PostgreSQL sync.
              </p>
              <div className="project-result">
                100,000+ <span>background events / day</span>
              </div>
              <p className="small-note">
                99.99% recovery · Sub-second UI rendering
              </p>
            </Entry>
          </Page>
        </>
      );
    case 3:
      return (
        <>
          <Page number={7} label="IN THE FIELD">
            <Heading eyebrow="CHAPTER IV · THE JOURNEY">
              Learning
              <br />
              by doing.
            </Heading>
            <Entry
              title="IGNITE"
              meta="SPORTS CLUB / LIVE BROADCAST PRODUCTION"
            >
              <p>
                Orchestrated a live cricket auction broadcast using OBS Studio,
                bringing scene transitions, dynamic overlays, and multiple
                sources together in real time.
              </p>
              <p>
                Used engagement data to improve streaming performance and
                audience interaction.
              </p>
              <div className="stats">
                <div>
                  <strong>+56%</strong>
                  <span>concurrent viewers</span>
                </div>
                <div>
                  <strong>+16%</strong>
                  <span>subscriber growth</span>
                </div>
              </div>
            </Entry>
            <div className="margin-note">
              <span>✦</span>
              <p>
                Good systems work.
                <br />
                Great ones bring people together.
              </p>
            </div>
          </Page>
          <Page number={8} label="THE FOUNDATIONS">
            <Heading eyebrow="ALWAYS A STUDENT">
              Pages of
              <br />
              learning.
            </Heading>
            <Entry
              title="Lovely Professional University"
              meta="AUG 2025 — PRESENT / PHAGWARA, PUNJAB"
            >
              <p>
                Bachelor of Technology
                <br />
                Computer Science and Engineering
              </p>
              <div className="project-result">
                8.56 <span>CGPA</span>
              </div>
            </Entry>
            <Entry
              title="Don Bosco Senior Secondary School"
              meta="MAR 2024 — MAY 2025 / GORAKHPUR, UP"
            >
              <p>Intermediate</p>
              <div className="project-result">
                69% <span>percentage</span>
              </div>
            </Entry>
            <p className="small-note">
              Every project adds something the classroom can’t. Every lesson
              makes the next project better.
            </p>
          </Page>
        </>
      );
    case 4:
      return (
        <>
          <Page number={9} label="MILESTONES">
            <Heading eyebrow="CHAPTER V · THE HONOURS">
              A few quests
              <br />
              completed.
            </Heading>
            <div className="award">
              <span className="award-medal">I</span>
              <p className="eyebrow">FIRST PLACE</p>
              <h3>
                Inter-College
                <br />
                ITM Hackathon
              </h3>
              <p>Gorakhpur</p>
              <Ornament />
              <p>
                One solo developer. Teams of six.
                <br />A first-place finish.
              </p>
              <p>
                A test of full-stack autonomy, rapid execution, and making an
                idea real.
              </p>
            </div>
          </Page>
          <Page number={10} label="BEYOND THE KEYBOARD">
            <Heading eyebrow="MORE THAN CODE">
              Finding
              <br />
              my voice.
            </Heading>
            <div className="award">
              <span className="award-medal">III</span>
              <p className="eyebrow">THIRD PLACE</p>
              <h3>
                National Space Day
                <br />
                Debate
              </h3>
              <Ornament />
              <p>
                A campus-wide debate competition, putting public speaking and
                argumentation to the test.
              </p>
            </div>
            <div className="margin-note">
              <span>✧</span>
              <p>
                Ideas deserve to be built.
                <br />
                And sometimes, spoken aloud.
              </p>
            </div>
          </Page>
        </>
      );
    default:
      return (
        <>
          <Page number={11} label="AN OPEN INVITATION">
            <Heading eyebrow="CHAPTER VI · THE NEXT CHAPTER">
              Let’s build
              <br />
              something.
            </Heading>
            <p>
              Have an interesting problem, a project in mind, or a curiosity we
              share? I’d love to hear about it.
            </p>
            <Castle small />
            <p className="cover-quote">
              The best stories start
              <br />
              with a simple hello.
            </p>
            <Ornament />
            <p className="edition">THE NEXT PAGE IS STILL UNWRITTEN</p>
          </Page>
          <Page number={12} label="UNTIL NEXT TIME">
            <Heading eyebrow="SEND A RAVEN">
              Find me
              <br />
              in the world.
            </Heading>
            <div className="contact-list">
              <a href="mailto:adityagupta@tutanota.de">
                <span>01 / EMAIL</span>
                <strong>adityagupta@tutanota.de ↗</strong>
              </a>
              <a
                href="https://github.com/aditya-gupta-dev"
                target="_blank"
                rel="noreferrer"
              >
                <span>02 / GITHUB</span>
                <strong>aditya-gupta-dev ↗</strong>
              </a>
              <a
                href="https://www.linkedin.com/in/aditya-gupta-oss/"
                target="_blank"
                rel="noreferrer"
              >
                <span>03 / LINKEDIN</span>
                <strong>Let’s connect ↗</strong>
              </a>
              <a href={cvUrl} download="Aditya-Gupta-CV.pdf">
                <span>04 / THE FULL STORY</span>
                <strong>Download my résumé ↓</strong>
              </a>
            </div>
            <button className="ink-link" onClick={() => navigate(0)}>
              ↶ Back to the beginning
            </button>
          </Page>
        </>
      );
  }
}

export default function Home() {
  const [page, setPage] = useState(0);
  const mobile = useSyncExternalStore(subscribeMobile, getMobile);
  const chapter = Math.floor(page / 2);
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
    if (next < 0 || next >= chapters.length * 2 || next === pageRef.current)
      return;
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
  const navigate = useCallback(
    (nextChapter: number) => goToPage(nextChapter * 2),
    [goToPage],
  );
  const turnPage = useCallback(
    (delta: number) => {
      goToPage(
        mobileQuery.matches
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
        el.scrollTop = departing?.scroll[mobile ? 0 : pageNumber % 2] ?? 0;
      });
  }, [departing, mobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
      if (e.key === "Escape" && contents) {
        setContents(false);
        contentsButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turnPage, contents]);

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

  return (
    <main className="journal">
      <div className="book-area">
        <div className="chapter-navigation">
          <button
            ref={contentsButton}
            aria-expanded={contents}
            aria-controls="contents-menu"
            onClick={() => setContents(!contents)}
          >
            ☷ Contents {contents ? "−" : "+"}
          </button>
          {contents && (
            <nav
              ref={contentsMenu}
              className="contents-menu"
              id="contents-menu"
              aria-label="Table of contents"
            >
              {chapters.map((name, i) => (
                <button
                  key={name}
                  aria-current={chapter === i ? "page" : undefined}
                  onClick={() => {
                    navigate(i);
                    setContents(false);
                    contentsButton.current?.focus();
                  }}
                >
                  <span>{roman[i]}</span>
                  {name}
                  <span>{String(i * 2 + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
        <div
          className="book"
          aria-label={`Chapter ${roman[chapter]}: ${chapters[chapter]}`}
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
              key={`${page}-${mobile}`}
            >
              <VisiblePage.Provider value={mobile ? page : null}>
                <Spread chapter={chapter} navigate={navigate} />
              </VisiblePage.Provider>
            </div>
            {departing && (
              <div
                ref={departingSpread}
                className={`page-turn-layer departing-${direction}`}
                aria-hidden="true"
                inert
              >
                {!mobile && (
                  <div className="stationary-page">
                    <VisiblePage.Provider
                      value={
                        Math.floor(departing.page / 2) * 2 +
                        (direction === "next" ? 0 : 1)
                      }
                    >
                      <Spread
                        chapter={Math.floor(departing.page / 2)}
                        navigate={navigate}
                      />
                    </VisiblePage.Provider>
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
                    <VisiblePage.Provider
                      value={
                        mobile
                          ? departing.page
                          : Math.floor(departing.page / 2) * 2 +
                            (direction === "next" ? 1 : 0)
                      }
                    >
                      <Spread
                        chapter={Math.floor(departing.page / 2)}
                        navigate={navigate}
                      />
                    </VisiblePage.Provider>
                  </div>
                  <div className="sheet-face sheet-back">
                    {!mobile && (
                      <VisiblePage.Provider
                        value={chapter * 2 + (direction === "next" ? 0 : 1)}
                      >
                        <Spread chapter={chapter} navigate={navigate} />
                      </VisiblePage.Provider>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="book-spine" aria-hidden="true" />
          <div className="page-turn-controls">
            <button
              disabled={mobile ? page === 0 : chapter === 0}
              onClick={() => turnPage(-1)}
              aria-label="Previous page"
              title="Previous page (left arrow)"
            >
              ←
            </button>
            <span className="sr-only" aria-live="polite">
              Chapter {roman[chapter]}: {chapters[chapter]}. Page {page + 1} of
              12.
            </span>
            <button
              disabled={mobile ? page === 11 : chapter === chapters.length - 1}
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
