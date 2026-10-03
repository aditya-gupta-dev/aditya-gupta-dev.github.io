import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  bookSchema,
  pageSchema,
  parsePortfolio,
} from "../src/content/schema.ts";
const root = new URL("../src/content/", import.meta.url);
const schemas = [
  ["book.schema.json", bookSchema],
  ["page.schema.json", pageSchema],
] as const;
for (const [file, schema] of schemas) {
  const generated =
    JSON.stringify(
      {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        ...schema.json,
      },
      null,
      2,
    ) + "\n";
  const path = new URL(file, root);
  if (process.argv.includes("--write")) writeFileSync(path, generated);
  else if (readFileSync(path, "utf8") !== generated)
    throw new Error(`${file} is stale. Run npm run content:schemas`);
}
const files = readdirSync(new URL("pages/", root)).filter((file) =>
  file.endsWith(".json"),
);
const rawPages = Object.fromEntries(
  files.map((file) => [
    file,
    JSON.parse(readFileSync(new URL(`pages/${file}`, root), "utf8")) as unknown,
  ]),
);
const result = parsePortfolio(
  JSON.parse(readFileSync(new URL("book.json", root), "utf8")) as unknown,
  rawPages,
);
console.log(
  `Validated ${result.pages.length} pages and ${result.chapters.length} chapters in ${fileURLToPath(root)}`,
);
