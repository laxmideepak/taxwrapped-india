import { describe, expect, it } from "vitest";
import {
  calculateNewRegimeTax,
  getTaxForTaxableIncome,
  roundToShareBucket,
} from "@/lib/tax";

describe("calculateNewRegimeTax", () => {
  it.each([
    { salary: 750_000, taxable: 675_000, tax: 0 },
    { salary: 1_200_000, taxable: 1_125_000, tax: 0 },
    { salary: 1_275_000, taxable: 1_200_000, tax: 0 },
    { salary: 1_800_000, taxable: 1_725_000, tax: 150_800 },
    { salary: 2_500_000, taxable: 2_425_000, tax: 319_800 },
    { salary: 5_500_000, taxable: 5_425_000, tax: 1_381_380 },
    { salary: 12_000_000, taxable: 11_925_000, tax: 3_776_370 },
  ])(
    "calculates FY 2025-26 new-regime tax for gross salary ₹$salary",
    ({ salary, taxable, tax }) => {
      const result = calculateNewRegimeTax({ grossSalary: salary });

      expect(result.taxableIncome).toBe(taxable);
      expect(result.totalTax).toBe(tax);
      expect(result.regime).toBe("new");
      expect(result.assessmentYear).toBe("2026-27");
    },
  );

  it("applies marginal relief at ₹12,00,001 taxable income", () => {
    const result = getTaxForTaxableIncome(1_200_001);

    expect(result.baseTaxBeforeRebate).toBe(60_000);
    expect(result.rebate).toBe(59_999);
    expect(result.cess).toBe(0);
    expect(result.totalTax).toBe(1);
  });

  it.each([
    { taxableIncome: 5_000_001, maxTax: 1_350_001 },
    { taxableIncome: 10_000_001, maxTax: 2_850_001 },
    { taxableIncome: 21_000_000, tax: 7_350_000 },
  ])("handles surcharge boundary for taxable income ₹$taxableIncome", (fixture) => {
    const result = getTaxForTaxableIncome(fixture.taxableIncome);

    if ("maxTax" in fixture) {
      expect(result.taxAfterSurcharge).toBeLessThanOrEqual(
        fixture.maxTax as number,
      );
    }

    if ("tax" in fixture) {
      expect(result.taxAfterSurcharge).toBe(fixture.tax as number);
      expect(result.surchargeRate).toBe(0.25);
    }
  });

  it("returns exact-tax overrides without exposing salary math", () => {
    const result = calculateNewRegimeTax({
      grossSalary: 1_800_000,
      exactTaxPaid: 123_456,
    });

    expect(result.totalTax).toBe(123_456);
    expect(result.usesExactOverride).toBe(true);
  });

  it("rounds share-card tax values to the nearest ₹5,000", () => {
    expect(roundToShareBucket(123_456)).toBe(125_000);
    expect(roundToShareBucket(122_499)).toBe(120_000);
  });
});
