import { describe, expect, it } from "vitest";
import cga from "@/data/cga-actuals-2024-25.json";
import ministries from "@/data/ministries-2024-25.json";
import { allocateMinistryTax, allocateTax } from "@/lib/allocation";
import { calculateNewRegimeTax } from "@/lib/tax";

describe("allocateTax", () => {
  it("keeps interest and grants as first-class CGA functional heads", () => {
    const result = allocateTax(100_000, cga);

    expect(result.buckets.map((bucket) => bucket.id)).toContain(
      "grants_loans_states",
    );
    expect(result.buckets.map((bucket) => bucket.id)).toContain(
      "interest_payments",
    );
  });

  it.each([750_000, 1_200_000, 1_275_000, 1_800_000, 2_500_000, 5_500_000])(
    "reconciles CGA functional buckets to tax for salary ₹%s",
    (salary) => {
      const tax = calculateNewRegimeTax({ grossSalary: salary }).totalTax;
      const result = allocateTax(tax, cga);
      const allocated = result.buckets.reduce(
        (sum, bucket) => sum + bucket.amount,
        0,
      );

      expect(Math.abs(allocated - tax)).toBeLessThanOrEqual(1);
    },
  );
});

describe("allocateMinistryTax", () => {
  it.each([750_000, 1_200_000, 1_275_000, 1_800_000, 2_500_000, 5_500_000])(
    "reconciles ministry buckets to tax for salary ₹%s",
    (salary) => {
      const tax = calculateNewRegimeTax({ grossSalary: salary }).totalTax;
      const result = allocateMinistryTax(tax, ministries);
      const allocated = result.buckets.reduce(
        (sum, bucket) => sum + bucket.amount,
        0,
      );

      expect(Math.abs(allocated - tax)).toBeLessThanOrEqual(1);
    },
  );
});
