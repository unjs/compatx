export interface CompatibilityFlag {
  /**
   * Human friendly name of the flag
   */
  name: string;

  /**
   * The date that this compatibility flag is effective from
   *
   * It should be in `YY/MM/DD` format
   */
  from: string;

  /**
   * The date that this compatibility flag is effective to
   *
   * It should be in `YY/MM/DD` format
   */
  to?: string;
}

/**
 * Compatibility flags spec
 *
 * @see https://github.com/unjs/compat-flags
 */
export interface CompatibilityFlags {
  [key: string]: CompatibilityFlag;
}

// Type utils
function _createDefine<T>(): (input: T) => T {
  return (input) => input;
}
export const defineCompatibilityFlag = _createDefine<CompatibilityFlag>();
export const defineCompatibilityFlags = _createDefine<CompatibilityFlags>();
