import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

const bannedTerms = ["wasted on", "splurged", "burned", "wasteful"];

describe("editorial neutrality", () => {
  it("does not use banned partisan or loaded English framing", () => {
    const copy = JSON.stringify({ en, hi }).toLowerCase();

    for (const term of bannedTerms) {
      expect(copy).not.toContain(term);
    }
  });
});
