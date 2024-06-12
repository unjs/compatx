import { expect, it, describe } from "vitest";
import { formatDate, resolveCompatibilityDates } from "../src/date";
import type {
  DateString,
  CompatibilityDateSpec,
  CompatibilityDates,
} from "../src/date";

describe("date utils", () => {
  describe("formatDate", () => {
    const cases = [
      ["2021-12-31", "2021-12-31"],
      ["2021/12/31", "2021-12-31"],
      ["x", ""],
      [new Date("2021/01/01"), "2021-01-01"],
      [new Date("2021/01/01").toString(), "2021-01-01"],
      [new Date("x").toString(), ""],
    ] as [Date | string, DateString][];
    for (const [date, formattedDate] of cases) {
      it(`should format ${date} to ${formattedDate}`, () => {
        expect(formatDate(date)).toBe(formattedDate);
      });
    }
  });

  describe("resolveCompatibilityDates", () => {
    const cases = [
      {
        input: "2021-01-01",
        defaults: undefined,
        expected: { default: "2021-01-01" },
      },
      {
        input: { cloudflare: "2022-01-01" },
        defaults: "2021-01-01",
        expected: { cloudflare: "2022-01-01", default: "2021-01-01" },
      },
      {
        input: "2021-01-x",
        defaults: undefined,
        expected: { default: "" },
      },
      {
        input: "",
        defaults: { default: "x" },
        expected: { default: "" },
      },
    ] as {
      input?: CompatibilityDateSpec;
      defaults?: CompatibilityDateSpec;
      expected: CompatibilityDates;
    }[];
    for (const { input, defaults, expected } of cases) {
      it(`should resolve ${input} to ${JSON.stringify(expected)}`, () => {
        expect(resolveCompatibilityDates(input, defaults)).toEqual(expected);
      });
    }
  });
});
