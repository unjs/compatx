import { expect, it, describe } from "vitest";
import { formatDateString } from "../src";

describe("compatx", () => {
  describe("formatDateString", () => {
    const cases = [
      ["2021-12-31", "2021-12-31"],
      ["2021/12/31", "2021-12-31"],
      [new Date("2021/01/01"), "2021-01-01"],
      [new Date("2021/01/01").toString(), "2021-01-01"],
    ];
    for (const [date, formattedDate] of cases) {
      it(`should format ${date} to ${formattedDate}`, () => {
        expect(formatDateString(date)).toBe(formattedDate);
      });
    }
  });
});
