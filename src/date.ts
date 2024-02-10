/**
 * compatibility date string
 *
 * It should be in `YY/MM/DD` format
 */
export type CompatibilityDate = string;

export function formatDate(date: string): CompatibilityDate {
  const d = new Date(date);
  return `${d.getFullYear()}/${d.getMonth()}/${d.getDay()}`;
}
