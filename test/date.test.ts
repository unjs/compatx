import { expect, it, describe } from "vitest";
import {
  formatDate,
  resolveCompatibilityDates,
  formatCompatibilityDate,
} from "../src/date";
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
      ["latest", new Date().toISOString().split("T")[0] as DateString],
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
        input: { cloudflare: "2022-01-01", vercel: "2022-01-02" },
        defaults: "",
        expected: {
          cloudflare: "2022-01-01",
          vercel: "2022-01-02",
          default: "2022-01-02",
        },
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

  describe("formatCompatibilityDate", () => {
    const cases = [
      ["2021-01-01", "2021-01-01"],
      [{ cloudflare: "2022-01-01" }, "2022-01-01"],
      [
        {
          default: "2024-01-01",
          cloudflare: "2022-01-01",
          vercel: "2022-01-2",
        },
        "2024-01-01, cloudflare: 2022-01-01, vercel: 2022-01-02",
      ],
    ] as [CompatibilityDateSpec, string][];
    for (const [input, formatted] of cases) {
      it(`should format ${JSON.stringify(input)} to ${formatted}`, () => {
        expect(formatCompatibilityDate(input)).toBe(formatted);
      });
    }
  });
});
