# Portfolio rendering

## What is on screen

The home route renders only the viewport-filling book and its Contents control. The subtly highlighted arrows are part of the book itself, vertically centered on its outer edges. The old site header, outside résumé link, chapter ribbons, surrounding slogans, progress toolbar, swipe hint, and site footer have been removed. The résumé download remains inside the contact chapter.

## How the book is actually drawn

- `src/main.tsx` mounts React and routes `/` through `src/App.tsx` to `src/pages/Home.tsx`.
- `Home` owns the active page (0–11), turn direction, outgoing-page snapshot, and Contents menu state. The chapter is derived from the page index. `Spread` selects one of six chapters; each contains two `Page` components, for twelve pages total.
- Pages are ordinary HTML sections with live, selectable text. The CV content was transcribed from `docs/cv.pdf`; the PDF itself is not rendered as the book. Vite imports that PDF as a downloadable asset.
- `src/pages/book.css` draws the parchment, binding, spine, page edges, rules, and ornaments using CSS backgrounds, borders, gradients, and shadows.
- The castle is an inline SVG made of simple paths with `shapeRendering="crispEdges"`. It scales without downloading an image. There is no canvas, WebGL scene, Three.js renderer, or page-flip library involved in this book.
- The book uses `100dvh` to fit the current viewport. On desktop, CSS Grid places the two pages side by side, and each page scrolls when its content is taller than the available height. At widths up to 760px, a matchMedia subscription switches to a single-page view. A React context makes `Page` render only the selected sheet, so the hidden companion is absent from the live DOM and keyboard navigation. Mobile swipes and arrows advance one of twelve pages; desktop advances a two-page spread. Contents links jump to a chapter’s first page. Resizing preserves the current page; desktop shows its containing spread.

## Font and readability

Every text element in the book inherits **IM Fell English SC**, including the Contents menu and buttons. The font is self-hosted at `public/fonts/IMFellEnglishSC-Regular.ttf`, declared with `@font-face` and `font-display: swap`; its OFL license is adjacent. No Google Fonts request is needed to load this face at runtime.

Body text is 20–21px, supporting labels are at least 16px, entry headings are 29–30px, chapter headings are 46–52px, and the title is 70–96px. Long pages scroll rather than shrinking the type. Secondary ink has been darkened for readability.

## Page turns and the lag fix

Previously, navigation blocked further input and waited on a 420ms JavaScript timeout before updating the chapter. The new spread then ran an additional 300ms fade. A large decorative leaf covered content during the wait.

Navigation now updates the active page immediately. There is no timeout, animation lock, or blank covering leaf. A ref tracks the latest page so quick repeated arrow-key events advance reliably. The newly selected spread mounts immediately (its page and layout mode form its React key), resetting its scroll position.

The visible turn is a full, opaque sheet rotating 180 degrees around the spine over 720ms. A `turning-sheet` has two absolutely positioned faces, `transform-style: preserve-3d`, and a parent perspective. The front contains the departing page’s actual HTML; the back contains the new landing page on desktop (parchment on mobile). `backface-visibility: hidden` prevents mirrored text. An old stationary page covers the opposite side until the sheet lands. The new spread is already rendered underneath. On mobile the turning sheet takes the full book width and pivots offscreen, revealing the next single page.

The outgoing front and stationary page preserve their scroll positions. All temporary layers are inert, aria-hidden, and non-interactive. They are removed on the sheet’s own `animationend`; a turn identifier prevents stale events from clearing a newer transition. Shading fades in near the edge-on portion of the turn, while the sheet itself stays opaque. Rapid navigation can interrupt the turn immediately, without a timeout or lock. Reduced-motion users get an immediate change without the temporary layers. This is a rigid CSS 3D sheet, not a simulated flexible paper curl.

Navigation works through horizontal touch swipes, keyboard arrow keys, the in-book arrows, the Contents menu, and links inside the book. Swipe detection requires more than 55px of horizontal movement and rejects mostly vertical gestures so reading can scroll normally. The Contents menu supports Escape, outside-click dismissal, current-chapter indication, and keyboard focus restoration after selection.

## Editing and checking

Edit portfolio content and chapter structure in `src/pages/Home.tsx`; edit the appearance and responsive behavior in `src/pages/book.css`. Keep this book-only layout, font, readable type sizes, and immediate navigation when making future changes.

Use `npm run dev` to preview. Type-check with `npx tsc -b`, lint the edited component with `npx eslint src/pages/Home.tsx`, and use `npm run build` for the normal production build. Browser checks should cover all chapters, rapid navigation, mobile scrolling/swipes, Contents keyboard behavior, reduced motion, font loading, and the résumé download. Repository-wide lint has pre-existing failures in unrelated components.
