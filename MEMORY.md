# Project memory and agent handoff

Last reviewed: 2026-10-03. This describes the **working tree**, not just the last commit. Read the current-status section first. Keep this file current when changing architecture, content, commands, assets, or verification results. This is a guide to the source, not a replacement for inspecting a file before editing it.

## Current status — read first

The requested medieval portfolio already exists and its earlier version was committed. Work currently in progress adds desktop reading settings, a repository link, per-page JSON content, type-safe validation, and smaller initial bundles.

The user has now explicitly prioritized making this file a comprehensive handoff **before continuing that work**. This document was expanded first. Do not interpret the documentation request as cancelling the settings/content/performance task.

### Latest requested work

1. Add a gear-icon **Settings** button to the right of Contents.
2. Let desktop users switch between single-page and two-page views. Mobile must remain single-page.
3. Link the actual portfolio repository: `https://github.com/aditya-gupta-dev/aditya-gupta-dev.github.io`.
4. Put each page's content in JSON, make adding/editing pages easy, label everything clearly, and make the content/rendering type-safe.
5. Inspect and reduce bundle size.
6. Document every current project detail/file for other agents in this file.

### Already implemented in the current uncommitted work

- Twelve page JSON files under `src/content/pages/`, plus a book/chapter manifest.
- Dependency-free schema parsing, inferred TypeScript types, generated editor JSON Schemas, cross-file reference validation, and exhaustive rendering.
- Dynamic page discovery/order/counts; no fixed twelve-page/six-chapter logic in the new renderer. Odd total page counts get a blank facing page.
- Split the former 900-line Home component into navigation/state (`Home`), a typed renderer (`BookPage`), and the castle illustration (`Castle`).
- Desktop Settings UI, native single/two-page radio buttons, localStorage preference, and a repository link in Settings. Repository link also appears on the contact page for mobile access.
- Lazy-loaded `/links`, small root CSS, and legacy Tailwind/theme/font CSS moved behind `/links`.
- Removed forced Vite vendor/UI/Firebase chunks in favor of automatic route splitting.
- Removed the root HTML's unused Google Fonts preconnects/Press Start font request.
- Replaced the 175 KB IM Fell TTF with a 56,956-byte WOFF2 file. License retained.
- Six content validation tests pass. Standard app TypeScript check and an additional strict book/content TypeScript check pass.

### Outstanding at this checkpoint

- **Build currently fails** because `src/index.css` imports `@fontsource-variable/inter/latin.css`, which does not exist in the installed package. Actual available CSS files are `index.css`, `opsz.css`, `opsz-italic.css`, `standard.css`, `standard-italic.css`, `wght.css`, and `wght-italic.css`. Resolve using the installed package contents, e.g. a valid existing import or a local Latin `@font-face` referencing its existing WOFF2 asset. Do not claim the latest build is passing until repaired.
- Run browser checks of the refactored book, Settings persistence/keyboard handling, all twelve pages, animation snapshots, resizing, odd counts, and lazy `/links` route.
- Compare production **initial-route** JS/CSS/font loading against the baseline; no final reduction percentage is verified yet.
- Add a concise content-authoring guide under `src/content/` (this document already explains the contract).
- Run final content checks, strict type checks, edited-file lint, production build, and update this status section with actual outcomes.
- Do not overwrite the tracked old `dist/` merely to test builds; use a `/tmp` output directory as below.

## Identity, location, tools, and Git

- Workspace: `/home/adi/dev/js/front/aditya-gupta-dev.github.io`.
- Portfolio owner: Aditya Gupta. Source material: `docs/cv.pdf` (one-page CV).
- Public repository: `https://github.com/aditya-gupta-dev/aditya-gupta-dev.github.io`.
- Package name: `ctoadi`, private, ESM (`"type": "module"`).
- Stack: React 19, React DOM, TypeScript 6, Vite 8, React Router 7. Tailwind 4/shadcn/Radix exist for legacy UI.
- Shell: Bash on Linux. Time zone: Asia/Kolkata. Node verified in this session: `v26.9.0`.
- npm/package-lock are used for current commands. `bun.lock` is also present but ignored by `*.lock`; do not switch package managers casually.
- The content scripts run TypeScript directly with Node's native type stripping. They require a sufficiently recent Node version; verified here with Node 26. They are not compiled by the browser build.
- Branch at the checkpoint: `main`.
- Last user-requested commit: **`892152b` — `Build medieval book portfolio with full-sheet page turns`**.
- Earlier commits shown locally: `ccabc6d` (added build files), `8a61f8f` (clean start).
- `892152b` included the initial portfolio, CV/profile assets, IM Fell TTF/license, initial rendering notes, and previously existing App/package/global-CSS work as a snapshot of current progress. It did not include the later scroll dropdown or current Settings/JSON/bundle work.
- No later commit or push has been made. The user explicitly requested the earlier commit, not an automatic commit on every later turn.
- No deployment has been performed. Existing Firebase config is not a request to deploy.
- No project `AGENTS.md` was found during the original work. Check again if the environment changes.
- User preference: act on authorized work, avoid unnecessary confirmation; keep the book interface simple.

## Product decisions that must be preserved

- The whole screen is the book. No standalone site header, slogans, footer, social toolbar, outside résumé button, side chapter ribbons, or extra page-progress panel.
- Keep the Contents control and, on desktop, Settings immediately to its right.
- Medieval/vintage parchment aesthetic, burgundy ink accents, pixel castle, readable type.
- **IM Fell English SC throughout the book**, including menus/buttons. The original pixel-font request was superseded by this explicit font choice.
- Body copy approximately 20–21px, supporting labels at least 16px, headings approximately 29–52px, title 70–96px. Scroll long pages; do not shrink everything to fit.
- Mobile is a real one-page-at-a-time view, not two pages stacked. Desktop defaults to an open two-page spread and now has an optional single-page view.
- Visible full-sheet page turns, not a blank/fading overlay or only a subtle tilt.
- Navigation must respond immediately. Never reintroduce the old 420ms timeout/input lock.
- Turn arrows are vertically centered on the outer book edges, with a subtle gold background and sufficient click/touch area. Content has side padding to avoid overlap.
- Contents is a dropdown styled as a rolled manuscript scroll, with a 340ms unfurling reveal, chapter leaders, active chapter marking, and a decorative AG wax seal.
- Preserve keyboard navigation, touch scrolling/swipes, reduced motion, and accessible controls.

## Rendering architecture and data flow

`index.html` → `src/main.tsx` → React Router → `src/App.tsx` (`Outlet`) → `src/pages/Home.tsx`.

`Home.tsx` imports `{ book, chapters, pages, roman }` from `src/content/index.ts`. That loader imports `book.json`, eagerly discovers `./pages/*.json` through Vite `import.meta.glob`, parses everything as unknown, validates it, and returns typed data. `BookPage.tsx` renders the selected data through an exhaustive discriminated-union switch.

This is ordinary HTML/React and CSS. Text is live/selectable and links/buttons remain real elements. The CV PDF is **not rendered into pages**: its contents were transcribed, and the PDF is imported with Vite `?url` for downloading. The castle is an inline SVG with crisp edges. The book does not import Three.js, canvas rendering, a page-flip package, Motion, or a large icon library. The Settings gear is a tiny inline SVG.

### Layout and reading state

- The `.journal` uses `height: 100dvh`; the book fills it with a small binding margin.
- `page` is the active zero-based page index. `pageRef` gives event handlers the newest value during rapid input.
- `spreadStart = Math.floor(page / 2) * 2`; a spread shows this page and the next one.
- Chapter identity comes from the active page's `chapterId`, not integer division by two. Chapters may contain any positive number of pages.
- `mobileQuery` is `(max-width: 760px)`, subscribed using `useSyncExternalStore`.
- `desktopView` is `"single" | "spread"`, stored under localStorage key **`portfolio-book-view`**. Invalid/missing storage defaults to `spread`; blocked storage does not break the UI.
- `singlePage = mobile || desktopView === "single"`. It controls `.single-page`/`.two-page` classes and all actual rendered-page/animation geometry. Mobile ignores the desktop choice without erasing it.
- `singlePageRef` keeps keyboard/swipe navigation consistent with the latest effective layout.
- Each visible `.paper` scrolls vertically when necessary. New page/layout keys reset the reader's scroll state. No whole-document horizontal overflow is intended.
- One page moves per turn in single mode; two per turn in spread mode. Contents jumps to a chapter's first actual page.
- Odd total page count: `BookPage` renders an intentionally blank, aria-hidden facing sheet when its index has no data. Last/first navigation states derive from `pages.length`.

### Full-sheet page-turn implementation

- `goToPage` immediately updates active state, direction, and the reference; no delayed page update.
- Unless reduced motion is requested, it captures an outgoing snapshot `{ page, scroll, id }`.
- The new spread is already rendered beneath the animation.
- `.page-turn-layer` is inert, aria-hidden, and non-interactive.
- Two-page mode preserves the old opposite side in `.stationary-page` until the turn finishes.
- `.turning-sheet` rotates **0 → -180 degrees** forward or **0 → +180 degrees** backward over **720ms**, with a spine-side transform origin and CSS 3D perspective.
- `.sheet-front` contains the departing page HTML. `.sheet-back` contains the incoming landing page in spread mode; in single mode it is plain parchment as the full-width sheet pivots out of view.
- `transform-style: preserve-3d` and `backface-visibility: hidden` prevent mirrored text. The sheet stays opaque. A gradient shading layer peaks near the edge-on phase.
- Outgoing front/stationary copies keep the old scrollTop; the incoming back starts at the top.
- Only the sheet's own `animationend` clears the snapshot; bubbled child shading events are ignored. A monotonically increasing turn ID prevents stale events clearing a newer animation.
- New inputs may interrupt/replace a turn. There is no timeout, queued input delay, or disabled-during-animation state.
- Reduced-motion users skip the temporary layer and animations entirely.
- This is a rigid CSS sheet illusion, not physically simulated paper bending/curling.

### Input, menus, and links

- Left/right arrow keys turn pages except when a text field or menu/radio control should own the key.
- Horizontal touch gestures need `abs(dx) > 55` and `abs(dx) > 1.4 * abs(dy)`. Vertical gestures remain normal scrolling (`touch-action: pan-y`).
- `Contents`: native disclosure button; `aria-expanded`/`aria-controls`; a labelled `nav`; real buttons, current chapter via `aria-current`; current item focused on opening; selection closes and returns focus; Escape/outside pointer dismisses.
- Scroll menu roll caps use pseudo-elements and gradients. Its interior scrolls independently on short screens. The reveal clips/unfurls rather than squashing letters.
- `Settings`: desktop-only disclosure button and native `fieldset`/`legend` with radio labels. Chosen radio receives focus. Arrow keys within radios must not turn the book; Escape/outside click closes. Opening either menu closes the other.
- Settings includes the repository link; contact JSON includes it for all screen sizes.
- External HTTPS links use `_blank` and `noreferrer`. Mail uses `mailto:`. `"resume"` resolves to the imported PDF and sets its download filename to `Aditya-Gupta-CV.pdf`.
- No raw HTML is accepted from JSON. Text uses React escaping and `white-space: pre-line` for `\n` line breaks.

## Content editing contract

### Files and ordering

- Global metadata and ordered chapter definitions: `src/content/book.json`.
- One JSON file per page in `src/content/pages/`.
- Numeric prefixes in filenames are for humans; the `order` value determines actual sorting. Existing orders are 10,20,…,120, leaving gaps for inserts.
- Each page has: `$schema` (editor hint), unique `id`, unique non-negative integer `order`, valid `chapterId`, `layout` (`cover`/`standard`), `footerLabel`, and nonempty `blocks` array.
- The manifest has: `$schema`, `runningTitle`, `sourceUrl`, and an ordered nonempty `chapters` array of `{ id, title }`.
- Every declared chapter must contain at least one page. Pages must keep chapters contiguous and in manifest order. IDs/references are strings, not positional indices.
- To add a page: copy a nearby page JSON, change id/order/footer/content, choose a chapter, and run `npm run content:check`. The Vite glob discovers it. No Home import, counter, Roman numeral array, or hardcoded switch needs changing.
- To add a chapter: add its id/title in manifest order and add one or more consecutive pages referencing it. Chapter first-page numbers are computed.
- Link to another page using a `page-link` block's `pageId`. A contents block names `chapterIds`. Validation rejects missing targets.
- Do not edit generated `book.schema.json` or `page.schema.json` manually. Edit `schema.ts` and run `npm run content:schemas`.

### Block types

| `type` | Fields beyond `type` | Rendering |
| --- | --- | --- |
| `paragraph` | `text`; optional `style` | Escaped paragraph; style is one of body, eyebrow, cover-subtitle, cover-quote, edition, drop-cap, small-note. |
| `heading` | `level`: title/chapter; `text` | h1 or h2; terminal dot gets burgundy treatment. `\n` yields authored line breaks. |
| `flourish` | `text` | Decorative title ornament. |
| `illustration` | `name`: castle; optional `small` boolean | Existing SVG castle. |
| `ornament` | none | Decorative separator with star/rules. |
| `note` | `symbol`, `text` | Margin note. |
| `skills` | nonempty string `items` | Skill labels. |
| `stats` | `items`: `{ value, label }[]` | Metric groups. |
| `metric` | `value`, `label` | One large inline result. |
| `link` | `label`, `href` | Ink-styled external/mail/PDF link. |
| `page-link` | `label`, `pageId` | In-book navigation button. |
| `contents` | `title`, string `chapterIds` array | Index of selected chapters. |
| `contacts` | `items`: `{ eyebrow, label, href }[]` | Contact/source/download list. |
| `entry` | `title`, `meta`, `blocks` | Project/experience/education/skills entry. Children must be leaf block types. |
| `award` | `title`, `medal`, `blocks` | Centered medal/award entry. Children must be leaf block types. |

`entry` and `award` cannot recursively contain another entry/award. All arrays are nonempty; optional fields may be omitted. Unknown fields are rejected (including typos such as footerLable). Link href values must be HTTPS, mailto, or the exact token `resume`.

### Type and validation implementation

- `Schema<T>` exposes `parse(unknown, path)` and a JSON Schema representation. `Infer<S>` extracts its TypeScript result.
- Small combinators cover strings, literals, enum values, booleans, non-negative integers, optional fields, arrays, strict objects, and discriminated unions.
- `ContentBlock`, `BookPageData`, and `BookData` are inferred from the actual schemas, avoiding independently maintained interfaces.
- The parser checks real JSON at runtime; it does not cast imported JSON straight to a claimed type.
- Two generic helper assertions are localized to schema construction: validated object reconstruction and the selected union branch result. No `any` or unchecked JSON cast is needed in the content renderer.
- Renderer switch ends in a `never` exhaustiveness check: adding a block requires implementing its rendering.
- `parsePortfolio` also checks duplicate page IDs/orders/chapter IDs, empty collections/chapters, chapter contiguity/order, and all page/chapter references.
- Runtime errors identify paths such as `01-title.json.blocks[0].blocks[0].text`.
- `scripts/content.ts` checks that editor schemas are current and validates actual files before production build.
- `tsconfig.book.json` enables strict TypeScript for the book/components/content without forcing cleanup of unrelated legacy modules. The standard project configs also run.
- JSON Schema files are authoring artifacts, not imported by the browser.

## Current CV-derived pages and factual content

| File | ID / chapter / order | Contents |
| --- | --- | --- |
| `src/content/pages/01-title.json` | title / beginning / 10 | Aditya Gupta; developer/tinkerer/builder; castle; field-journal title/quote/edition. |
| `src/content/pages/02-prologue.json` | prologue / beginning / 20 | Developer introduction; full-stack/native/automation/systems interests; LPU studies; index of craft/creations/journey/honours. |
| `src/content/pages/03-tools.json` | tools / craft / 30 | JavaScript, TypeScript, Python, Go, Rust, C++, Java, Kotlin, C#, pgSQL; React, Next.js, React Native, Svelte, tRPC, Drizzle, Wails, Actix, Fiber, Clerk. |
| `src/content/pages/04-workbench.json` | workbench / craft / 40 | GCP, AWS, Kubernetes, Firebase, Convex, GitHub, Sentry, PostHog, Plausible, GSC; Linux, Vim, Docker, Bun, PostgreSQL, SQLite, Redis, FFmpeg, Ollama; interpersonal skills. |
| `src/content/pages/05-automation.json` | automation / creations / 50 | May 2026 Go/Cobra/Docker/AWS/FFmpeg AI media automation; YouTube OAuth2; 3.52M+ views, 260K+ watch hours, 7 channels, 15.3K+ subscribers; GitHub profile link. |
| `src/content/pages/06-native-projects.json` | native-projects / creations / 60 | June 2026 C/X11/CMake tiling window manager, 12 MB; Kotlin offline-first AI notification tracker, SQLite/Postgres/Compose, 100,000+ daily background events, 99.99% recovery, sub-second UI. |
| `src/content/pages/07-experience.json` | experience / journey / 70 | IGNITE sports club; OBS live cricket auction production; +56% concurrent viewers; +16% subscribers. |
| `src/content/pages/08-education.json` | education / journey / 80 | LPU B.Tech CSE, Phagwara, Aug 2025–present, CGPA 8.56; Don Bosco Senior Secondary School, Gorakhpur, Intermediate Mar 2024–May 2025, 69%. |
| `src/content/pages/09-hackathon.json` | hackathon / honours / 90 | First place, Inter-College ITM Hackathon Gorakhpur; solo against teams of six. |
| `src/content/pages/10-debate.json` | debate / honours / 100 | Third place in campus National Space Day debate. |
| `src/content/pages/11-invitation.json` | invitation / next-chapter / 110 | Collaboration/contact invitation and castle. |
| `src/content/pages/12-contact.json` | contact / next-chapter / 120 | Email, GitHub profile, LinkedIn, CV download, portfolio source, back-to-start page link. |

Email: `adityagupta@tutanota.de`. GitHub profile: `https://github.com/aditya-gupta-dev`. CV LinkedIn: `https://www.linkedin.com/in/aditya-gupta-oss/`. The CV includes a phone number, but the current book contact page does not publish it. Avoid inventing exact project repository links; only the provided profile/source links are used. The legacy `/links` page has a different older LinkedIn URL; it was preserved as existing content.

## File-by-file inventory

Every authored/source/configuration/asset file currently present outside dependencies/Git internals is accounted for below. Generated distribution files are listed separately. Page JSON files are documented individually above.

### Root files

| File | Role and important details |
| --- | --- |
| `MEMORY.md` | This living handoff. Update current status and measured outcomes after work. |
| `README.md` | Original short collection of Paper Shader, Skiper UI, Aceternity ideas/install snippets. It is not the book setup/authoring guide. |
| `package.json` | npm scripts/dependency declarations; private ESM package. See commands/dependency sections. Current edits add content/schema/test/typecheck scripts and build validation. |
| `package-lock.json` | Existing npm dependency lock. No new package dependency was needed for current settings/content features. |
| `bun.lock` | Existing ignored Bun lock (`*.lock`); not the lock used by current npm work. |
| `index.html` | Root element and `/src/main.tsx` module; English language, viewport, title/description, favicon, Open Graph/Twitter metadata, Google verification token. Old social URL is `https://ctoadi.web.app/`. Root external-font links removed in current work. |
| `vite.config.ts` | React + Tailwind Vite plugins, `@` → `src`, terser minification with console/debugger dropping. Current work removes manual vendor/UI/Firebase chunks to allow route-based splitting. |
| `tsconfig.json` | Root references app/node configs, alias mapping. |
| `tsconfig.app.json` | ES2023/DOM, bundler resolution, React JSX, no emit, no-unused checks, alias; includes all `src`. Does not globally enable strict mode. |
| `tsconfig.node.json` | ES2023 Node config for Vite config, no emit/no-unused/bundler settings. |
| `tsconfig.book.json` | New strict overlay for `src/content`, `src/components/book`, `src/pages/Home.tsx`. Included in `npm run typecheck`. |
| `eslint.config.js` | ESLint flat config: JS + TS recommended, React hooks and refresh, browser globals, ignores dist. Broad legacy errors remain. |
| `components.json` | shadcn radix-vega config; Tailwind CSS at `src/index.css`; neutral tokens; lucide library; `@` aliases; aceternity and 8bitcn registries. Do not switch presets for book work. |
| `firebase.json` | Existing hosting config serves dist, SPA rewrite to index.html; immutable year-long asset/font/image cache headers, index no-cache. Not a deployment instruction. |
| `.gitignore` | Ignores Firebase local state, logs, node_modules, dist-ssr, local settings, editor/system files, and `*.lock`. **dist is not ignored and is tracked.** |

### Application and book

| File | Role and dependencies |
| --- | --- |
| `src/main.tsx` | StrictMode/createRoot and browser router. `/` Home eagerly loaded; `/links` now uses route `lazy`; catch-all redirects to `/`. Imports base.css. |
| `src/App.tsx` | Minimal layout containing React Router Outlet. No auth/theme/analytics provider is mounted here. |
| `src/App.css` | Effectively empty legacy file (one byte); unused. |
| `src/base.css` | New tiny root reset/body background/native-control fonts/sr-only utility. Avoid importing legacy Tailwind here. |
| `src/index.css` | Legacy Tailwind/shadcn animation and theme tokens, Geist Pixel face, Inter font. Now imported only by Links. Contains the currently broken Inter latin.css import described above. |
| `src/pages/Home.tsx` | View/page/turn/menu state, desktop Settings storage, input handling, data-driven chapter menu, full-sheet animation composition. No CV copy belongs here now. |
| `src/pages/book.css` | All book styling, IM Fell face, typography, parchment/spine, arrows, scroll dropdown, Settings, responsive modes, CSS page turn/unfurl and reduced motion. Uses explicit `.single-page` view selectors in addition to mobile size rules. |
| `src/components/book/BookPage.tsx` | Typed data-to-HTML renderer; internal exhaustive Block and ContentLink helpers; CV asset import; blank odd facing page; headings/entries/awards/links. |
| `src/components/book/Castle.tsx` | Extracted crisp-edge inline SVG castle; optional small variant. No downloaded image or canvas. |
| `src/pages/Links.tsx` | Legacy social grid with Instagram, YouTube, older LinkedIn, Threads, Facebook, X URLs; pixel cards/labels and Navbar. Lazy route; imports legacy index.css. |

### Content and scripts

| File | Role |
| --- | --- |
| `src/content/book.json` | Chapter manifest, running title, actual source URL. |
| `src/content/index.ts` | Vite JSON glob + validation; exports book/pages/chapters; dynamic Roman-number formatter. |
| `src/content/schema.ts` | Schema combinators, actual book/page/block contracts, inferred types, validation and cross-file integrity checks. Single source of truth. |
| `src/content/book.schema.json` | Generated editor JSON Schema for book manifest. Regenerate, do not hand-edit. |
| `src/content/page.schema.json` | Generated editor JSON Schema for every page/block. Regenerate, do not hand-edit. |
| `src/content/pages/01-title.json` through `12-contact.json` | All individually documented in the page table above. These contain all page copy and content links. |
| `scripts/content.ts` | Node filesystem authoring/build tool. Verifies generated schemas match source (or writes them with --write); parses all real JSON pages; prints validated counts. |
| `scripts/content.test.ts` | Node built-in tests: current book, additional odd-count page, nested type errors, unknown fields/types, duplicate/reference failures, unsafe links and chapter order. No test framework dependency. |

### Legacy layout/providers/libraries (not used by the book)

| File | Role and caveats |
| --- | --- |
| `src/components/layout/Navbar.tsx` | Legacy pixel menubar/dropdown with Home/Links, disabled Projects/About, Google login/logout. Imports auth providers/helpers and therefore Firebase. Reached by lazy Links only. |
| `src/components/providers/auth-provider.tsx` | Firebase auth context, AuthProvider, useAuth, SignedIn/SignedOut, Loading spinner. App currently does not mount AuthProvider. Existing effect lacks a dependency array. Do not assume authentication is newly implemented by this task. |
| `src/components/providers/theme-provider.tsx` | Older local theme context/storage; effect forces html dark despite stored theme. Not used by Home. |
| `src/components/theme-provider.tsx` | Separate next-themes wrapper plus `d` keyboard toggle, ignores typing/modifier events. Not mounted in current main/App. |
| `src/lib/firebase.ts` | Existing Firebase client project initialization (`ctoadi`), analytics and auth singleton exports; initialization has import-time effects. Keep off homepage path. Do not duplicate its configuration into docs. |
| `src/lib/auth.ts` | Google popup login and sign-out wrappers using Firebase auth. |
| `src/lib/useAnalytics.ts` | Legacy usePageTracking hook logging page/campaign/device details to Firebase. Not invoked by the book. Contains existing `any` usage. |
| `src/lib/utils.ts` | `cn` helper using clsx + tailwind-merge for legacy UI. |

### Existing UI component files

| File | Role |
| --- | --- |
| `src/components/ui/button.tsx` | Standard shadcn/Radix Slot button, CVA variants and exported variants helper. |
| `src/components/ui/card.tsx` | Standard Card, Header, Title, Description, Action, Content, Footer composition. |
| `src/components/ui/label.tsx` | Radix Label wrapper. |
| `src/components/ui/dropdown-menu.tsx` | Radix dropdown primitives, items, groups, checkbox/radio items, labels/separators/submenus; lucide indicators. |
| `src/components/ui/glowing-effect.tsx` | Pointer-tracking animated glow effect using motion/react; unused by book. |
| `src/components/ui/retro-mode-switcher.tsx` | Pixel sun/moon toggle using next-themes and 8bit Button. Unused by book. |
| `src/components/ui/8bit/button.tsx` | Pixel-edged wrapper around standard Button; CVA font/variant/size; decoration spans; retro stylesheet. |
| `src/components/ui/8bit/card.tsx` | Pixel card variants/decorations and Card composition wrappers; used by Links. |
| `src/components/ui/8bit/label.tsx` | Retro/pixel label wrapper; used by Links. |
| `src/components/ui/8bit/dropdown-menu.tsx` | Pixel dropdown wrappers/decorations around standard dropdown primitives; used by Navbar. |
| `src/components/ui/8bit/menubar.tsx` | Pixel Radix menubar wrapper/composition; used by Navbar. |
| `src/components/ui/8bit/spinner.tsx` | Pixel loading spinner variants including diamond; used by auth loading component. |
| `src/components/ui/8bit/styles/retro.css` | Retro font utility and pixelated image utility; imports Google Press Start 2P for legacy route. It must not be eagerly included in the book route. |

### Existing experimental visuals (preserved, outside active book path)

| File | Role |
| --- | --- |
| `src/origin-kit/black-hole.tsx` | BlackHole particle visual with canvas/projection, configurable centre and particle defaults. |
| `src/origin-kit/coverflow-carousel.tsx` | CoverflowCarousel with image slats, responsive sizing, transforms/drag/navigation and default imagery. |
| `src/origin-kit/particle-sphere.tsx` | ParticleSphereRefactor; particle sphere/cursor behavior, color and UI control mappings. |
| `src/origin-kit/svg-particle.tsx` | ParticleImage; image/SVG sampling into interactive particles, transition/shape/color helpers. |
| `src/origin-kit/draggablesticker.tsx` | StickerDrag; draggable image/sticker, z ordering, image sizing/shadow/color helpers. |
| `src/origin-kit/pixel-reveal.tsx` | PixelReveal effect with configurable directions, pixel animation/timing. |
| `src/shaders/dither-shader.tsx` | DitherShader; Bayer/halftone/noise/crosshatch modes; original/grayscale/duotone/custom color processing. Not the parchment renderer. |

Do not import these into Home simply because the desired look is vintage/pixelated. They are existing experiments and several have legacy lint errors. Removing unimported source files alone does not reduce the initial bundle.

### SVG icon files

Each is a React SVG component consumed by the old social page, not a remote image: `src/svgs/instagram.tsx` (Instagram), `youtube.tsx` (YouTube), `linkedin.tsx` (LinkedIn), `threads.tsx` (Threads), `facebook.tsx` (Facebook), `x.tsx` (X icon exported as xAI).

### Documentation, images, fonts

| File | Role |
| --- | --- |
| `docs/cv.pdf` | Original CV and actual résumé download source; imported by BookPage via `?url`, emitted hashed by Vite. Approximately 103.8 KB. |
| `docs/profile-pic.png` | User-provided profile image, saved in prior commit; not displayed in book. |
| `docs/GeistPixel-Regular-VariableFont_ELSH.ttf` | Original pixel font source, superseded for book typography. |
| `docs/react-router-guide.md` | Existing router setup/reference notes. |
| `docs/origin-kit-components.md` | Broad catalogue of Origin Kit components and descriptions. Many listed files are not actually installed; use filesystem as authority. |
| `public/profile.png` | Existing favicon/apple-touch/social image, referenced by HTML and copied verbatim into builds. |
| `public/fonts/GeistPixel-Regular-VariableFont_ELSH.ttf` | Legacy pixel font used by old global CSS; no longer book font. |
| `public/fonts/IMFellEnglishSC-Regular.woff2` | New 56,956-byte Latin WOFF2, served locally by book @font-face. Obtained from Fontsource CDN: `https://cdn.jsdelivr.net/fontsource/fonts/im-fell-english-sc@latest/latin-400-normal.woff2`. Actual binary is checked into workspace; no runtime CDN dependency. |
| `public/fonts/IMFellEnglishSC-OFL.txt` | SIL Open Font License for IM Fell, obtained from Google Fonts repository. Keep with redistributed font. |
| `public/fonts/IMFellEnglishSC-Regular.ttf` | Tracked in 892152b, **deleted in current work** after replacing with WOFF2. About 175 KB previously. |

## Generated distribution and excluded internals

`dist/` is a **tracked old build**, not the current source truth. Do not hand-edit it. Previous verification output went under `/tmp` to avoid silently replacing tracked distribution files. Its currently present files are:

- `dist/index.html`: old generated entry HTML.
- `dist/profile.png`, `dist/fonts/GeistPixel-Regular-VariableFont_ELSH.ttf`: copied public assets.
- `dist/assets/index-CDOI2pxw.js`: old app entry bundle.
- `dist/assets/index-DijU4g_Q.css`: old combined stylesheet.
- `dist/assets/vendor-jNvG6wVL.js`: old React/router vendor chunk.
- `dist/assets/ui-CEUMZ9Jg.js`: old UI libraries chunk.
- `dist/assets/firebase-GNLUt36b.js`: old Firebase chunk.
- `dist/assets/black-hole-CK_8rR48.js`: old visual chunk.
- `dist/assets/rolldown-runtime-BwKqro0g.js`: bundler runtime.
- Geist WOFF2 variants: `geist-vietnamese-wght-normal-6IgcOCM7.woff2`, `geist-cyrillic-wght-normal-BEAKL7Jp.woff2`, `geist-cyrillic-ext-wght-normal-DjL33-gN.woff2`, `geist-latin-wght-normal-BgDaEnEv.woff2`, `geist-latin-ext-wght-normal-DC-KSUi6.woff2` (all under dist/assets).
- Inter WOFF2 variants: `inter-greek-wght-normal-CkhJZR-_.woff2`, `inter-greek-ext-wght-normal-DlzME5K_.woff2`, `inter-cyrillic-wght-normal-DqGufNeO.woff2`, `inter-vietnamese-wght-normal-CBcvBZtf.woff2`, `inter-latin-ext-wght-normal-DO1Apj_S.woff2`, `inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2`, `inter-latin-wght-normal-Dx4kXJAl.woff2` (all under dist/assets).

`node_modules/` is the installed dependency tree, not authored project source; `node_modules/.tmp/` holds TS build info and `node_modules/.vite/` Vite caches. `.git/` is Git's own metadata. These are intentionally not documented file-by-file because their contents are generated/tool-owned and change independently of source. Ignored Firebase local config and editor/system files, if present, are not public application source.

## Commands and verification

| Command | Purpose |
| --- | --- |
| `npm run dev -- --host 0.0.0.0` | Vite development server, normally port 5173. |
| `npm run content:check` | Verify generated schemas and all JSON contents/references. |
| `npm run content:schemas` | Regenerate editor schemas from schema.ts, then validate content. |
| `npm run test:content` | Node built-in tests for validation/integrity. |
| `npm run typecheck` | Standard TS project build plus strict book/content TS check. |
| `npm run build` | Content check → typecheck → Vite production build into dist. Beware tracked dist. |
| `npm run build:optimize` | Alias to validated production build; terser already configured. |
| `npm run preview` | Preview default dist build (currently old unless deliberately rebuilt). |
| `npx vite build --outDir /tmp/portfolio-after-settings --manifest` | Non-destructive measured build after separate content/type checks. |
| `npx eslint src/pages/Home.tsx src/components/book src/content scripts/content.ts scripts/content.test.ts` | Targeted lint for edited code. |
| `npm run lint` | Whole-repository lint; known pre-existing failures in legacy files. |
| `git diff --check` | Whitespace/conflict-marker sanity check. |

### Evidence before current refactor

The full-sheet portfolio and scroll menu passed browser checks for: all twelve individual mobile pages; first/last boundaries; forward/back swipes/arrows; desktop two-page view; rapid interruption and animation cleanup; resize continuity; Contents links/Escape/outside-click; centered arrows; 320/390/760/768/1440 widths; reduced motion; PDF availability; no runtime errors. Production build and edited component lint passed then.

A paused-animation inspection confirmed a two-faced opaque 3D sheet, hidden backfaces, and a matrix beyond 90 degrees during the turn.

Whole-repository lint previously reported 61 issues (54 errors, 7 warnings), largely refresh exports in UI/providers, any/unused/hook issues in Origin Kit/analytics/shaders. Do not misreport these as introduced by the book. Current targeted lint and type checks have passed during the refactor, but final browser/build checks are still outstanding at the status checkpoint.

### Browser tooling in this environment

Playwright is available in npm's temporary cache, not installed as a project dependency: `/home/adi/.npm/_npx/420ff84f11983ee5/node_modules/playwright`. Executable used successfully: `/home/adi/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell`. Paths are session/environment-specific and may change.

Temporary helpers (not committed project files): `/tmp/test-book.cjs`, `/tmp/test-page-turns.cjs`, `/tmp/test-full-sheet.cjs`, `/tmp/test-scroll-menu.cjs`, `/tmp/view-turn.cjs`, `/tmp/extract-book.cjs`. Some tests have selectors/assertions for the prior fixed layout, so update them for Settings/new renderer rather than blindly trusting them. Screenshots similarly live in `/tmp` and are not product assets.

## Bundle investigation and measurements

Baseline build at `/tmp/portfolio-before-settings` has a Vite manifest. Before optimization the entry loaded the old Links/Navbar/auth dependencies eagerly, importing Firebase and Radix UI, and global CSS referenced multiple Geist/Inter subsets. Initial chunks measured by build output:

| Asset group | Uncompressed | gzip |
| --- | --- | --- |
| Main entry | 87.59 KB | 25.69 KB |
| Vendor | 272.62 KB | 87.40 KB |
| UI | 97.09 KB | 31.20 KB |
| Firebase | 124.53 KB | 36.78 KB |
| Rolldown runtime | 0.56 KB | 0.36 KB |
| Combined CSS | 76.50 KB | 14.96 KB |

The sum of those JS chunks is about 582 KB raw / 181 KB gzip. This is a baseline, not yet a verified current reduction. The old book font was about 179 KB on disk (175 KiB); new WOFF2 is 56,956 bytes. A hashed résumé asset is emitted but should only download when clicked, not on page load.

Optimization strategy in current work:

- Dynamic route import for Links keeps Navbar/Radix/Firebase out of initial book loading.
- Tiny base.css + book.css for `/`; Tailwind/theme CSS only for `/links`.
- No manual chunk grouping that accidentally reconnects deferred dependencies to entry.
- Book font is local WOFF2; no initial Press Start request; unused Geist font import removed. Inter subset cleanup still needs the build fix described above.
- Keep unused experimental source/dependencies intact unless a separate reason exists; unimported JS is not part of initial output.
- Do not add a runtime validation/UI/animation package just for these features. Current parser and gear are local small code.
- Measure actual recursive initial manifest imports and browser resource requests, not all output directory sizes or node_modules size. Deferred chunks still legitimately exist for Links.

## Dependency roles

- Core: react/react-dom/react-router-dom; Vite React plugin; TypeScript.
- Styling/build: tailwindcss, @tailwindcss/vite, shadcn, tw-animate-css; terser.
- Legacy UI: radix-ui, lucide-react, @tabler/icons-react, class-variance-authority, clsx, tailwind-merge, next-themes.
- Legacy authentication/analytics: firebase.
- Existing visual experiments: framer-motion, motion, three, related types; drawably from earlier work.
- Legacy typography: @fontsource-variable/geist and @fontsource-variable/inter. IM Fell is a static local font, not an npm dependency.
- Tooling: ESLint/TS ESLint, React hook/refresh ESLint plugins, globals, @types/node/react/react-dom/three.

Exact installed/declaration versions belong in package.json/package-lock.json. Avoid copying API secrets, auth tokens, or local credentials into this document. Firebase client project identity is already in source, but its values do not need repetition here.

## Continuation checklist

1. Repair the invalid Inter CSS import without broad changes to unrelated UI.
2. Finish `src/content/README.md` authoring examples/reference.
3. Test Settings, exact page preservation, localStorage reload behavior, mobile override, menu keyboard handling, and repository links.
4. Test content fidelity after extraction; pay attention to whitespace, line breaks, award order, legacy Tailwind reset no longer being loaded at home, and animation layer geometry in desktop single mode.
5. Verify lazy Links works and navigating back to the book does not regress appearance after legacy global CSS loads.
6. Run validation/tests/strict types/edited lint/build. Compare manifests and browser resource loading against baseline. Fix regressions, then stop repeating passed checks without new changes.
7. Update this document's current status, metrics, and file inventory to final reality. Do not leave the build-error checkpoint as the final status after it is resolved.
8. Report concrete outcomes and where the user edits JSON. Do not push/deploy or silently create another commit unless requested.
