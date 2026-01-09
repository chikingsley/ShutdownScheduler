import { describe, expect, test } from "bun:test";
import { getFullDayName, taskNamePrefix, scheduleFileName, DayOfWeek } from "../common";

describe("common module", () => {
  describe("taskNamePrefix", () => {
    test("should be defined", () => {
      expect(taskNamePrefix).toBeDefined();
      expect(typeof taskNamePrefix).toBe("string");
    });

    test("should have expected value", () => {
      expect(taskNamePrefix).toBe("ScheduledTask");
    });
  });

  describe("scheduleFileName", () => {
    test("should be defined", () => {
      expect(scheduleFileName).toBeDefined();
      expect(typeof scheduleFileName).toBe("string");
    });

    test("should have expected value", () => {
      expect(scheduleFileName).toBe("taskDatabase.json");
    });
  });

  describe("getFullDayName", () => {
    test("should return Monday for mon", () => {
      expect(getFullDayName("mon")).toBe("Monday");
    });

    test("should return Tuesday for tue", () => {
      expect(getFullDayName("tue")).toBe("Tuesday");
    });

    test("should return Wednesday for wed", () => {
      expect(getFullDayName("wed")).toBe("Wednesday");
    });

    test("should return Thursday for thu", () => {
      expect(getFullDayName("thu")).toBe("Thursday");
    });

    test("should return Friday for fri", () => {
      expect(getFullDayName("fri")).toBe("Friday");
    });

    test("should return Saturday for sat", () => {
      expect(getFullDayName("sat")).toBe("Saturday");
    });

    test("should return Sunday for sun", () => {
      expect(getFullDayName("sun")).toBe("Sunday");
    });

    test("should return correct day names for all days", () => {
      const days: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      const expectedNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

      days.forEach((day, index) => {
        expect(getFullDayName(day)).toBe(expectedNames[index]);
      });
    });
  });

  describe("DayOfWeek type", () => {
    test("should accept valid day abbreviations", () => {
      const validDays: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      expect(validDays.length).toBe(7);
    });
  });
});
