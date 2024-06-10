import { expect, it, describe } from "vitest";
import { formatDate, DateString } from "../src/date";

describe("date utils", () => {
  describe("formatDate", () => {
    const cases = [
      ["2021-12-31", "2021-12-31"],
      ["2021/12/31", "2021-12-31"],
      [new Date("2021/01/01"), "2021-01-01"],
      [new Date("2021/01/01").toString(), "2021-01-01"],
    ] as [Date | string, DateString][];
    for (const [date, formattedDate] of cases) {
      it(`should format ${date} to ${formattedDate}`, () => {
        expect(formatDate(date)).toBe(formattedDate);
      });
    }
  });
});
