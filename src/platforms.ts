import { DateString } from "./date";

/**
 * List of known platforms
 */
// prettier-ignore
export type PlatformName = "aws" | "azure" | "cloudflare" | "deno" | "firebase" | "netlify" | "vercel"

/**
 * Last known compatibility dates for platforms
 *
 * @example
 * {
 *  "default": "2024-01-01",
 *  "cloudflare": "2024-03-01",
 * }
 */
export type PlatformCompatibilityDates = {
  /**
   * Default compatibility date for all unspecified platforms (required)
   */
  default: DateString;
} & Partial<Record<PlatformName, DateString>>;

/**
 * Last known compatibility date for the used platform
 */
export type PlatformCompatibilityDate = DateString | PlatformCompatibilityDates;
