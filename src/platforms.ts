/**
 * Known platform names
 */
export const platforms = [
  "aws",
  "azure",
  "cloudflare",
  "deno",
  "firebase",
  "netlify",
  "vercel",
] as const;

/**
 * Known platform name
 */
export type PlatformName = (typeof platforms)[number] | (string & {});
