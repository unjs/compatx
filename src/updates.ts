import type { CompatibilityDate, DateString } from "./date";
import type { PlatformName } from "./platforms";

/**
 * Get compatibility updates applicable for the user given platform and date range.
 */
export function getCompatibilityUpdates(
  allUpdates: CompatibilityUpdates,
  compatibilityDate: CompatibilityDate,
): CompatibilityUpdates {
  const _date =
    typeof compatibilityDate === "string"
      ? { default: compatibilityDate }
      : compatibilityDate;

  return allUpdates.filter((change) => {
    const _platformDate = _date[change.platform] || _date.default;
    if (!_platformDate) {
      return false;
    }
    if (change.from && _platformDate < change.from) {
      return false;
    }
    if (change.until && _platformDate > change.until) {
      return false;
    }
    return true;
  });
}

/**
 * Get compatibility changes between two dates.
 */
export function getCompatibilityChanges(
  allUpdates: CompatibilityUpdates,
  compatibilityDate1: CompatibilityDate,
  compatibilityDate2: CompatibilityDate,
): { added: CompatibilityUpdates; removed: CompatibilityUpdates } {
  const updates1 = getCompatibilityUpdates(allUpdates, compatibilityDate1);
  const updates2 = getCompatibilityUpdates(allUpdates, compatibilityDate2);
  const added = updates2.filter((update) => !updates1.includes(update));
  const removed = updates1.filter((update) => !updates2.includes(update));
  return {
    added,
    removed,
  };
}

// --- Types ---

/**
 * Compatibility updateinformation.
 */
export interface CompatibilityUpdate {
  /** Applicable platform name */
  platform: PlatformName;

  /** Description */
  description: string;

  /** URL for more information */
  url?: string;

  /** The starting date of updatebeing effective */
  from?: DateString;

  /** The ending date until the updateis effective */
  until?: DateString;
}

export type CompatibilityUpdates = CompatibilityUpdate[];
