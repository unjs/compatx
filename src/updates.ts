import type { DateString } from "./date";
import type { PlatformCompatibilityDate, PlatformName } from "./platforms";

/**
 * Get compatibility updates applicable for the user given platform and date range.
 */
export function getCompatibilityUpdates(
  updates: CompatibilityUpdates,
  date: PlatformCompatibilityDate,
): CompatibilityUpdates {
  const _date = typeof date === "string" ? { default: date } : date;

  return updates.filter((change) => {
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
  updates: CompatibilityUpdates,
  date1: PlatformCompatibilityDate,
  date2: PlatformCompatibilityDate,
): { added: CompatibilityUpdates; removed: CompatibilityUpdates } {
  const updates1 = getCompatibilityUpdates(updates, date1);
  const updates2 = getCompatibilityUpdates(updates, date2);
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
