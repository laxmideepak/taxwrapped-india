import { describe, expect, it } from "vitest";
import budget from "@/data/budget-2026-27.json";
import { allocateTax } from "@/lib/allocation";
import { STORY_CARDS, createStoryCards } from "@/lib/story";
import { calculateNewRegimeTax } from "@/lib/tax";

describe("story cards", () => {
  it("defines the mandatory wrapped card sequence", () => {
    expect(STORY_CARDS).toEqual([
      "tax_bill",
      "working_day_cost",
      "centre_vs_states",
      "top_spending_head",
      "interest_payments",
      "schemes_you_funded",
      "subsidies",
      "share_kicker",
    ]);
  });

  it("renders every mandatory story card", () => {
    const tax = calculateNewRegimeTax({ grossSalary: 1_800_000 });
    const allocation = allocateTax(tax.totalTax, budget);
    const cards = createStoryCards(tax, allocation, "en");

    expect(cards.map((card) => card.id)).toEqual(STORY_CARDS);
    expect(cards.find((card) => card.id === "centre_vs_states")?.body).toMatch(
      /states/i,
    );
    expect(cards.find((card) => card.id === "interest_payments")?.body).toMatch(
      /interest/i,
    );
  });
});
