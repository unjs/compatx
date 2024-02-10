import { CompatibilityDate } from "./date";
import type { CompatibilityFlags } from "./types";

export function isCompatFlagEnabled<
  CT extends CompatibilityFlags = CompatibilityFlags,
>(
  flag: keyof CT,
  compatFlags: CT,
  userSpec: { date: CompatibilityDate; flags?: Array<keyof CT> },
): boolean | undefined {
  const _flag = compatFlags[flag];
  if (!_flag) {
    return undefined;
  }

  if (userSpec.flags && userSpec.flags.includes(flag)) {
    return true;
  }

  if (!userSpec.date) {
    return undefined;
  }
  const _date = new Date(userSpec.date);

  const _from = _flag.from ? new Date(_flag.from) : undefined;
  if (_from && diffDays(_from, _date) < 0) {
    return false;
  }

  const _to = _flag.to ? new Date(_flag.to) : undefined;
  if (_to && diffDays(_date, _to) >= 0) {
    return false;
  }

  return true;
}

// -- utils --
const A_DAY_MS = 86_400_000; // 1000 * 60 * 60 * 24

function diffDays(d1: Date, d2: Date) {
  return Math.round((d2.getTime() - d1.getTime()) / A_DAY_MS);
}
