import { describe, expect, it } from "vitest";
import cga from "@/data/cga-actuals-2024-25.json";
import ministries from "@/data/ministries-2024-25.json";
import { allocateMinistryTax, allocateTax } from "@/lib/allocation";
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
    const allocation = allocateTax(tax.totalTax, cga);
    const ministryAllocation = allocateMinistryTax(tax.totalTax, ministries);
    const cards = createStoryCards(tax, allocation, ministryAllocation, "en");

    expect(cards.map((card) => card.id)).toEqual(STORY_CARDS);
    expect(cards.find((card) => card.id === "centre_vs_states")?.body).toMatch(
      /grants/i,
    );
    expect(cards.find((card) => card.id === "interest_payments")?.body).toMatch(
      /interest/i,
    );
  });

  it("uses the ministry dataset for the top spending card title", () => {
    const tax = calculateNewRegimeTax({ grossSalary: 1_800_000 });
    const allocation = allocateTax(tax.totalTax, cga);
    const ministryAllocation = allocateMinistryTax(tax.totalTax, ministries);
    const cards = createStoryCards(tax, allocation, ministryAllocation, "en");

    const top = cards.find((card) => card.id === "top_spending_head");
    expect(top?.title).toBe("Defence");
  });
});
