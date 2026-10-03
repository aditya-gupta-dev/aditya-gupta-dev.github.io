/** Small, dependency-free schemas: one source for runtime validation, TS types, and editor JSON schemas. */
export interface Schema<T> {
  readonly json: Record<string, unknown>;
  readonly optional?: boolean;
  parse(value: unknown, path?: string): T;
}
export type Infer<S> = S extends Schema<infer T> ? T : never;
const fail = (path: string, expected: string): never => {
  throw new Error(`${path}: expected ${expected}`);
};
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const string: Schema<string> = {
  json: { type: "string", minLength: 1 },
  parse: (value, path = "value") =>
    typeof value === "string" && value.trim()
      ? value
      : fail(path, "a non-empty string"),
};
const boolean: Schema<boolean> = {
  json: { type: "boolean" },
  parse: (value, path = "value") =>
    typeof value === "boolean" ? value : fail(path, "a boolean"),
};
const number: Schema<number> = {
  json: { type: "integer", minimum: 0 },
  parse: (value, path = "value") =>
    typeof value === "number" && Number.isSafeInteger(value) && value >= 0
      ? value
      : fail(path, "a non-negative integer"),
};
function literal<const T extends string>(value: T): Schema<T> {
  return {
    json: { const: value, type: "string" },
    parse: (input, path = "value") =>
      input === value ? value : fail(path, JSON.stringify(value)),
  };
}
function enumeration<const T extends readonly string[]>(
  values: T,
): Schema<T[number]> {
  return {
    json: { type: "string", enum: values },
    parse(input, path = "value") {
      const found = values.find((value) => value === input);
      return found ?? fail(path, values.join(" | "));
    },
  };
}
function optional<T>(schema: Schema<T>): Schema<T | undefined> {
  return {
    json: schema.json,
    optional: true,
    parse: (value, path) =>
      value === undefined ? undefined : schema.parse(value, path),
  };
}
function array<T>(schema: Schema<T>): Schema<T[]> {
  return {
    json: { type: "array", items: schema.json, minItems: 1 },
    parse(value, path = "value") {
      if (!Array.isArray(value) || value.length === 0)
        return fail(path, "a non-empty array");
      return value.map((item: unknown, i) =>
        schema.parse(item, `${path}[${i}]`),
      );
    },
  };
}
function object<const S extends Record<string, Schema<unknown>>>(
  shape: S,
): Schema<{ [K in keyof S]: Infer<S[K]> }> {
  return {
    json: {
      type: "object",
      properties: Object.fromEntries(
        Object.entries(shape).map(([key, schema]) => [key, schema.json]),
      ),
      required: Object.keys(shape).filter((key) => !shape[key].optional),
      additionalProperties: false,
    },
    parse(value, path = "value") {
      if (!record(value)) return fail(path, "an object");
      for (const key of Object.keys(value))
        if (!Object.hasOwn(shape, key))
          throw new Error(`${path}.${key}: unknown field`);
      // The only structural assertion: every property has just been parsed by its corresponding schema.
      return Object.fromEntries(
        Object.entries(shape).map(([key, schema]) => [
          key,
          schema.parse(value[key], `${path}.${key}`),
        ]),
      ) as { [K in keyof S]: Infer<S[K]> };
    },
  };
}
function union<const S extends readonly Schema<unknown>[]>(
  ...schemas: S
): Schema<Infer<S[number]>> {
  return {
    json: { oneOf: schemas.map((schema) => schema.json) },
    parse(value, path = "value") {
      // Match the discriminant first so errors identify the precise field within the selected block.
      const selected = schemas.find((schema) => {
        const properties = schema.json.properties;
        return (
          record(value) &&
          record(properties) &&
          record(properties.type) &&
          properties.type.const === value.type
        );
      });
      if (!selected)
        return fail(`${path}.type`, "a supported content block type");
      return selected.parse(value, path) as Infer<S[number]>;
    },
  };
}
const href: Schema<string> = {
  json: {
    type: "string",
    pattern: "^(https://[^\\s]+|mailto:[^\\s]+|resume)$",
  },
  parse(value, path = "href") {
    const result = string.parse(value, path);
    if (!/^(https:\/\/[^\s]+|mailto:[^\s]+|resume)$/.test(result))
      return fail(path, 'an https:// URL, mailto: address, or "resume"');
    return result;
  },
};
const paragraph = object({
  type: literal("paragraph"),
  text: string,
  style: optional(
    enumeration([
      "body",
      "eyebrow",
      "cover-subtitle",
      "cover-quote",
      "edition",
      "drop-cap",
      "small-note",
    ]),
  ),
});
const heading = object({
  type: literal("heading"),
  level: enumeration(["title", "chapter"]),
  text: string,
});
const flourish = object({ type: literal("flourish"), text: string });
const illustration = object({
  type: literal("illustration"),
  name: literal("castle"),
  small: optional(boolean),
});
const ornament = object({ type: literal("ornament") });
const note = object({ type: literal("note"), symbol: string, text: string });
const skills = object({ type: literal("skills"), items: array(string) });
const stats = object({
  type: literal("stats"),
  items: array(object({ value: string, label: string })),
});
const metric = object({
  type: literal("metric"),
  value: string,
  label: string,
});
const link = object({ type: literal("link"), label: string, href });
const pageLink = object({
  type: literal("page-link"),
  label: string,
  pageId: string,
});
const contents = object({
  type: literal("contents"),
  title: string,
  chapterIds: array(string),
});
const contacts = object({
  type: literal("contacts"),
  items: array(object({ eyebrow: string, label: string, href })),
});
export const leafSchema = union(
  paragraph,
  heading,
  flourish,
  illustration,
  ornament,
  note,
  skills,
  stats,
  metric,
  link,
  pageLink,
  contents,
  contacts,
);
const entry = object({
  type: literal("entry"),
  title: string,
  meta: string,
  blocks: array(leafSchema),
});
const award = object({
  type: literal("award"),
  title: string,
  medal: string,
  blocks: array(leafSchema),
});
export const blockSchema = union(
  paragraph,
  heading,
  flourish,
  illustration,
  ornament,
  note,
  skills,
  stats,
  metric,
  link,
  pageLink,
  contents,
  contacts,
  entry,
  award,
);
export const pageSchema = object({
  $schema: optional(string),
  id: string,
  order: number,
  chapterId: string,
  layout: enumeration(["cover", "standard"]),
  footerLabel: string,
  blocks: array(blockSchema),
});
export const bookSchema = object({
  $schema: optional(string),
  runningTitle: string,
  sourceUrl: href,
  chapters: array(object({ id: string, title: string })),
});
export type ContentBlock = Infer<typeof blockSchema>;
export type BookPageData = Infer<typeof pageSchema>;
export type BookData = Infer<typeof bookSchema>;

/** Validates structure and cross-file references before the renderer sees any content. */
export function parsePortfolio(
  rawBook: unknown,
  rawPages: Record<string, unknown>,
) {
  const book = bookSchema.parse(rawBook, "book.json");
  const pages = Object.entries(rawPages)
    .map(([file, data]) => pageSchema.parse(data, file))
    .sort((a, b) => a.order - b.order);
  if (!pages.length) throw new Error("The book must contain at least one page");
  const unique = (values: (string | number)[], label: string) => {
    if (new Set(values).size !== values.length)
      throw new Error(`Duplicate ${label}`);
  };
  unique(
    pages.map((page) => page.id),
    "page id",
  );
  unique(
    pages.map((page) => page.order),
    "page order",
  );
  unique(
    book.chapters.map((chapter) => chapter.id),
    "chapter id",
  );
  const pageIds = new Set(pages.map((page) => page.id));
  const chapterIds = new Set(book.chapters.map((chapter) => chapter.id));
  const checkBlock = (block: ContentBlock, pageId: string) => {
    if (block.type === "page-link" && !pageIds.has(block.pageId))
      throw new Error(`${pageId}: unknown page reference ${block.pageId}`);
    if (block.type === "contents")
      for (const id of block.chapterIds)
        if (!chapterIds.has(id))
          throw new Error(`${pageId}: unknown chapter reference ${id}`);
    if (block.type === "entry" || block.type === "award")
      block.blocks.forEach((child) => checkBlock(child, pageId));
  };
  pages.forEach((page) => {
    if (!chapterIds.has(page.chapterId))
      throw new Error(`${page.id}: unknown chapter ${page.chapterId}`);
    page.blocks.forEach((block) => checkBlock(block, page.id));
  });
  const chapters = book.chapters.map((chapter) => {
    const pageIndex = pages.findIndex((page) => page.chapterId === chapter.id);
    if (pageIndex < 0) throw new Error(`${chapter.id}: chapter has no pages`);
    return { ...chapter, pageIndex };
  });
  // Chapters must occupy consecutive pages in manifest order, but can contain any number of pages.
  const chapterSequence = pages.map((page) =>
    chapters.findIndex((chapter) => chapter.id === page.chapterId),
  );
  if (
    chapterSequence.some((value, i) => i > 0 && value < chapterSequence[i - 1])
  )
    throw new Error(
      "Page order must keep chapters contiguous and in book.json order",
    );
  return { book, pages, chapters };
}
