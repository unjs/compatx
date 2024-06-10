/**
 * Format a date to a `YYYY-MM-DD` string
 *
 * @example
 *
 * ```ts
 * formatDateString(new Date("2021/01/01")) // "2021-01-01"
 * ```
 */
export function formatDateString(date: string | Date): DateString {
  const d = new Date(date);
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}` as DateString;
}

// --- Types ---

type Year = `${number}${number}${number}${number}`;
type Month = `${"0" | "1"}${number}`;
type Day = `${"0" | "1" | "2" | "3"}${number}`;

/**
 * Typed date string in `YYYY-MM-DD` format
 */
export type DateString = `${Year}-${Month}-${Day}`;
