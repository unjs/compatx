import { expect, it, describe } from "vitest";
import { formatDateString, DateString, DateValue } from "../src/date";

describe("date utils", () => {
  describe("formatDateString", () => {
    const cases = [
      ["2021-12-31", "2021-12-31"],
      ["2021/12/31", "2021-12-31"],
      [new Date("2021/01/01"), "2021-01-01"],
      [new Date("2021/01/01").toString(), "2021-01-01"],
    ] as [DateValue, DateString][];
    for (const [date, formattedDate] of cases) {
      it(`should format ${date} to ${formattedDate}`, () => {
        expect(formatDateString(date)).toBe(formattedDate);
      });
    }
  });
});
