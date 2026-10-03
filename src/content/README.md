# Editing the portfolio

All page content lives in **`pages/*.json`**. You do not need to edit React to change text, links, skills, projects, or page order.

## Change an existing page

1. Open its clearly named file, e.g. `pages/05-automation.json`.
2. Edit `blocks`. Use `\n` inside a text string for a line break. Do not put HTML in strings.
3. Run `npm run content:check`; preview with `npm run dev`.

The `$schema` line enables editor validation/autocomplete. Keep it at `"../page.schema.json"` in page files. The build rejects typos, wrong types, unknown blocks, duplicate IDs/orders, broken internal references, and invalid links with a file/field path.

## Add a page

Create a new `.json` file anywhere directly inside `pages/`. Example to insert a page between the automation and native-project pages:

```json
{
  "$schema": "../page.schema.json",
  "id": "another-project",
  "order": 55,
  "chapterId": "creations",
  "layout": "standard",
  "footerLabel": "ANOTHER CREATION",
  "blocks": [
    { "type": "paragraph", "style": "eyebrow", "text": "A NEW PROJECT" },
    { "type": "heading", "level": "chapter", "text": "Something\nworth building." },
    { "type": "ornament" },
    { "type": "paragraph", "text": "Describe what you built and why." },
    {
      "type": "link",
      "label": "View the project ↗",
      "href": "https://github.com/aditya-gupta-dev"
    }
  ]
}
```

- `id`: unique, stable internal reference; changing it requires updating page links.
- `order`: unique non-negative integer; this controls ordering, not the filename. Existing pages use increments of ten.
- `chapterId`: an existing ID from `book.json`.
- `layout`: `standard` or `cover` (centered title-page presentation).
- `footerLabel`: text at the bottom of the sheet.
- `blocks`: nonempty ordered content blocks.

New files are automatically discovered. Page totals, navigation boundaries, chapter page numbers, and Roman numerals update automatically. Chapters can have any positive page count. An odd total leaves a blank facing page in two-page view. Keep each chapter's pages together and in the chapter order declared in `book.json`.

## Add a chapter

Add `{ "id": "new-chapter", "title": "The new chapter" }` to the `chapters` array in `book.json`. Add at least one page with that `chapterId`, positioned after the preceding chapter and before the next. The main Contents menu is generated automatically. The prologue's smaller inline contents list is intentionally curated: edit its `chapterIds` if you want it to include the new chapter too.

## Block reference

| Type | Required fields | Optional fields |
| --- | --- | --- |
| `paragraph` | `text` | `style`: body, eyebrow, cover-subtitle, cover-quote, edition, drop-cap, small-note |
| `heading` | `level`: title/chapter; `text` | — |
| `flourish` | `text` | — |
| `illustration` | `name`: castle | `small`: boolean |
| `ornament` | — | — |
| `note` | `symbol`, `text` | — |
| `skills` | `items`: strings | — |
| `stats` | `items`: objects with `value`, `label` | — |
| `metric` | `value`, `label` | — |
| `link` | `label`, `href` | — |
| `page-link` | `label`, `pageId` | — |
| `contents` | `title`, `chapterIds`: strings | — |
| `contacts` | `items`: objects with `eyebrow`, `label`, `href` | — |
| `entry` | `title`, `meta`, `blocks` | — |
| `award` | `title`, `medal`, `blocks` | — |

`entry` and `award` contain any of the other block types, but cannot contain nested entries/awards. All arrays must contain at least one item. See existing pages for complete examples.

Links accept `https://…`, `mailto:…`, or the exact string `resume` (the CV download). Use `page-link` for internal book navigation. Text is safely escaped; HTML snippets are displayed as text, never executed.

`book.json` also owns the page running title and Settings repository URL. The contact page has its own source link in its contacts block.

## Type safety and extending the renderer

`schema.ts` is the single schema source; TypeScript data types are inferred from it. JSON is actually parsed/validated before rendering. `BookPage.tsx` has an exhaustive switch: new block types must get a renderer.

To add a new block type:

1. Extend the block schema in `schema.ts`.
2. Add its case to `src/components/book/BookPage.tsx`.
3. Run `npm run content:schemas` to regenerate the editor schemas.
4. Run `npm run content:check`, `npm run test:content`, and `npm run typecheck`.

Do not manually edit generated `book.schema.json` or `page.schema.json`. Normal content edits do not require schema regeneration or package installation. Scripts use Node's native TypeScript support (verified with Node 26 in this workspace).
