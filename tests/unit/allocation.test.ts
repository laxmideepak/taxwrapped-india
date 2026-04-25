import { describe, expect, it } from "vitest";
import budget from "@/data/budget-2026-27.json";
import { allocateTax } from "@/lib/allocation";
import { calculateNewRegimeTax } from "@/lib/tax";

describe("allocateTax", () => {
  it("keeps devolution and interest payments as first-class heads", () => {
    const result = allocateTax(100_000, budget);

    expect(result.buckets.map((bucket) => bucket.id)).toContain(
      "states_share",
    );
    expect(result.buckets.map((bucket) => bucket.id)).toContain(
      "interest_payments",
    );
  });

  it.each([750_000, 1_200_000, 1_275_000, 1_800_000, 2_500_000, 5_500_000])(
    "reconciles allocation buckets to tax for salary ₹%s",
    (salary) => {
      const tax = calculateNewRegimeTax({ grossSalary: salary }).totalTax;
      const result = allocateTax(tax, budget);
      const allocated = result.buckets.reduce(
        (sum, bucket) => sum + bucket.amount,
        0,
      );

      expect(Math.abs(allocated - tax)).toBeLessThanOrEqual(1);
    },
  );
});
