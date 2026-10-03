import rawBook from "./book.json";
import { parsePortfolio } from "./schema";

// Vite discovers new page files automatically. No imports or fixed page counts to maintain.
const rawPages = import.meta.glob<unknown>("./pages/*.json", {
  eager: true,
  import: "default",
});
export const { book, pages, chapters } = parsePortfolio(rawBook, rawPages);
export function roman(number: number): string {
  const values: [number, string][] = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  for (const [value, symbol] of values)
    while (number >= value) {
      result += symbol;
      number -= value;
    }
  return result;
}
