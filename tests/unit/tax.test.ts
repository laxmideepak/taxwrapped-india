import { describe, expect, it } from "vitest";
import {
  calculateNewRegimeTax,
  getTaxForTaxableIncome,
  roundToShareBucket,
} from "@/lib/tax";

describe("calculateNewRegimeTax", () => {
  it.each([
    { salary: 750_000, taxable: 675_000, tax: 0 },
    { salary: 1_200_000, taxable: 1_125_000, tax: 71_500 },
    { salary: 1_275_000, taxable: 1_200_000, tax: 83_200 },
    { salary: 1_800_000, taxable: 1_725_000, tax: 215_800 },
    { salary: 2_500_000, taxable: 2_425_000, tax: 434_200 },
    { salary: 5_500_000, taxable: 5_425_000, tax: 1_507_220 },
    { salary: 12_000_000, taxable: 11_925_000, tax: 3_907_930 },
  ])(
    "calculates FY 2024-25 new-regime tax for gross salary ₹$salary",
    ({ salary, taxable, tax }) => {
      const result = calculateNewRegimeTax({ grossSalary: salary });

      expect(result.taxableIncome).toBe(taxable);
      expect(result.totalTax).toBe(tax);
      expect(result.regime).toBe("new");
      expect(result.assessmentYear).toBe("2025-26");
    },
  );

  it("applies marginal relief at ₹7,00,001 taxable income (rebate cliff)", () => {
    const result = getTaxForTaxableIncome(7_00_001);

    expect(result.baseTaxBeforeRebate).toBe(20_000);
    expect(result.rebate).toBe(19_999);
    expect(result.taxAfterRebate).toBe(1);
    expect(result.cess).toBe(0);
    expect(result.totalTax).toBe(1);
  });

  it.each([
    {
      taxableIncome: 5_000_001,
      taxAfterSurcharge: 1_190_001,
      totalTax: 1_237_601,
    },
    {
      taxableIncome: 10_000_001,
      taxAfterSurcharge: 2_959_001,
      totalTax: 3_077_361,
    },
    {
      taxableIncome: 20_000_001,
      taxAfterSurcharge: 6_543_501,
      totalTax: 6_805_241,
    },
  ])(
    "pins surcharge marginal relief at taxable income ₹$taxableIncome",
    ({ taxableIncome, taxAfterSurcharge, totalTax }) => {
      const result = getTaxForTaxableIncome(taxableIncome);

      expect(result.taxAfterSurcharge).toBe(taxAfterSurcharge);
      expect(result.totalTax).toBe(totalTax);
    },
  );

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
    expect(roundToShareBucket(215_800)).toBe(215_000);
  });
});
