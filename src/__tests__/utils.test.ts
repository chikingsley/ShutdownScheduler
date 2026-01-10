import { describe, expect, test } from "bun:test";
import { cn } from "../lib/utils";

describe("cn utility function", () => {
  test("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  test("should handle empty input", () => {
    expect(cn()).toBe("");
  });

  test("should handle single class", () => {
    expect(cn("foo")).toBe("foo");
  });

  test("should handle conditional classes", () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base active"
    );
  });

  test("should merge tailwind classes correctly", () => {
    // twMerge should handle conflicting tailwind classes
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  test("should handle arrays of classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  test("should handle objects with boolean values", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  test("should handle mixed inputs", () => {
    expect(cn("foo", ["bar", "baz"], { qux: true, quux: false })).toBe(
      "foo bar baz qux"
    );
  });

  test("should handle duplicate classes in input", () => {
    // clsx concatenates, doesn't dedupe - this is expected behavior
    expect(cn("foo foo bar")).toBe("foo foo bar");
  });

  test("should handle undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });
});
