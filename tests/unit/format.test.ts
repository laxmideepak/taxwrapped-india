import { describe, expect, it } from "vitest";
import { formatINR } from "@/lib/format";

describe("formatINR", () => {
  it("uses Indian grouping for rupee amounts", () => {
    expect(formatINR(1234567, "en")).toBe("₹12,34,567");
  });

  it("keeps Latin numerals for Hindi by default", () => {
    expect(formatINR(1234567, "hi")).toBe("₹12,34,567");
  });
});
