import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

const bannedTermsEn = ["wasted on", "splurged", "burned", "wasteful"];

/** Initial Hindi list — flag for native-speaker editorial review before launch. */
const bannedTermsHi = ["बर्बाद", "फिजूलखर्च", "लूट"];

describe("editorial neutrality", () => {
  it("does not use banned partisan or loaded English framing", () => {
    const copy = JSON.stringify({ en, hi }).toLowerCase();

    for (const term of bannedTermsEn) {
      expect(copy).not.toContain(term);
    }
  });

  it("does not use banned loaded Hindi framing (initial list; needs native review)", () => {
    const copy = JSON.stringify({ en, hi });

    for (const term of bannedTermsHi) {
      expect(copy).not.toContain(term);
    }
  });
});
