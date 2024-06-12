import { platforms, type PlatformName } from "./platforms";

/**
 * Normalize the compatibility dates from input config and defaults.
 */
export function resolveCompatibilityDates(
  input?: CompatibilityDateSpec | undefined,
  defaults?: CompatibilityDateSpec,
): CompatibilityDates {
  // Initialize with defaults object
  const dates = {
    ...(typeof defaults === "string" ? { default: defaults } : defaults),
  } as CompatibilityDates;

  // Normalize default date
  dates.default = formatDate(dates.default || "");

  // Add normalized input values
  const _input = typeof input === "string" ? { default: input } : input || {};
  for (const [key, value] of Object.entries(_input)) {
    if (value) {
      dates[key as PlatformName] = formatDate(value);
    }
  }

  return dates;
}

/**
 * Resolve compatibility dates with environment variables as defaults.
 *
 * Environment variable name format is `COMPATIBILITY_DATE` for default and `COMPATIBILITY_DATE_<PLATFORM>` for specific platforms.
 */
export function resolveCompatibilityDatesFromEnv(
  overridesInput?: CompatibilityDateSpec | undefined,
) {
  const defaults: Partial<CompatibilityDates> = {
    default: process.env.COMPATIBILITY_DATE
      ? formatDate(process.env.COMPATIBILITY_DATE)
      : undefined,
  };
  for (const platform of platforms) {
    const envName = `COMPATIBILITY_DATE_${platform.toUpperCase()}`;
    const env = process.env[envName];
    if (env) {
      defaults[platform] = formatDate(env);
    }
  }
  return resolveCompatibilityDates(overridesInput, defaults);
}

/**
 * Format a date to a `YYYY-MM-DD` string
 *
 * @example
 *
 * ```ts
 * formatDateString(new Date("2021/01/01")) // "2021-01-01"
 * ```
 */
export function formatDate(date: string | Date): DateString {
  const d = normalizeDate(date);
  if (Number.isNaN(d.getDate())) {
    return "";
  }
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}` as DateString;
}

// --- internal ---

function normalizeDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}

// --- Types ---

type Year = `${number}${number}${number}${number}`;
type Month = `${"0" | "1"}${number}`;
type Day = `${"0" | "1" | "2" | "3"}${number}`;

/**
 * Typed date string in `YYYY-MM-DD` format
 *
 * Empty string is used to represent an unspecified date.
 */
export type DateString = "" | `${Year}-${Month}-${Day}`;

/**
 * Last known compatibility dates for platforms
 *
 * @example
 * {
 *  "default": "2024-01-01",
 *  "cloudflare": "2024-03-01",
 * }
 */
export type CompatibilityDates = {
  /**
   * Default compatibility date for all unspecified platforms (required)
   */
  default: DateString;
} & Partial<Record<PlatformName, DateString>>;

/**
 * Last known compatibility date for the used platform
 */
export type CompatibilityDateSpec = DateString | Partial<CompatibilityDates>;
