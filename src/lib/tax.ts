export type TaxInput = {
  grossSalary: number;
  exactTaxPaid?: number;
};

export type SlabBreakdown = {
  from: number;
  to: number | null;
  rate: number;
  taxableAmount: number;
  tax: number;
};

export type TaxResult = {
  regime: "new";
  financialYear: "2024-25";
  assessmentYear: "2025-26";
  grossSalary: number;
  standardDeduction: number;
  taxableIncome: number;
  baseTaxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  surchargeRate: number;
  surcharge: number;
  taxAfterSurcharge: number;
  cess: number;
  totalTax: number;
  usesExactOverride: boolean;
  slabs: SlabBreakdown[];
};

const STANDARD_DEDUCTION = 75_000;
const CESS_RATE = 0.04;
const REBATE_TAXABLE_LIMIT = 700_000;
/** Section 87A: rebate is up to ₹25,000 (cap applies even if slabs ever imply higher base tax). */
const MAX_REBATE = 25_000;
const SHARE_BUCKET = 5_000;

const SLABS = [
  { from: 0, to: 300_000, rate: 0 },
  { from: 300_000, to: 700_000, rate: 0.05 },
  { from: 700_000, to: 1_000_000, rate: 0.1 },
  { from: 1_000_000, to: 1_200_000, rate: 0.15 },
  { from: 1_200_000, to: 1_500_000, rate: 0.2 },
  { from: 1_500_000, to: null, rate: 0.3 },
] as const;

const SURCHARGE_TIERS = [
  { threshold: 20_000_000, rate: 0.25 },
  { threshold: 10_000_000, rate: 0.15 },
  { threshold: 5_000_000, rate: 0.1 },
] as const;

export function calculateNewRegimeTax(input: TaxInput): TaxResult {
  const taxableIncome = Math.max(
    0,
    Math.round(input.grossSalary - STANDARD_DEDUCTION),
  );
  const result = getTaxForTaxableIncome(taxableIncome);

  if (typeof input.exactTaxPaid === "number" && input.exactTaxPaid >= 0) {
    return {
      ...result,
      grossSalary: Math.round(input.grossSalary),
      totalTax: Math.round(input.exactTaxPaid),
      usesExactOverride: true,
    };
  }

  return {
    ...result,
    grossSalary: Math.round(input.grossSalary),
    usesExactOverride: false,
  };
}

export function getTaxForTaxableIncome(taxableIncome: number): TaxResult {
  const roundedIncome = Math.max(0, Math.round(taxableIncome));
  const slabs = buildSlabBreakdown(roundedIncome);
  const baseTaxBeforeRebate = sum(slabs.map((slab) => slab.tax));
  const { rebate, taxAfterRebate } = computeRebateAndTaxAfterRebate(
    roundedIncome,
    baseTaxBeforeRebate,
  );
  const surchargeRate = getSurchargeRate(roundedIncome);
  const surchargeBeforeRelief = Math.round(taxAfterRebate * surchargeRate);
  const taxAfterSurcharge = applySurchargeMarginalRelief(
    roundedIncome,
    taxAfterRebate + surchargeBeforeRelief,
  );
  const surcharge = Math.max(0, taxAfterSurcharge - taxAfterRebate);
  const cess = Math.round(taxAfterSurcharge * CESS_RATE);

  return {
    regime: "new",
    financialYear: "2024-25",
    assessmentYear: "2025-26",
    grossSalary: roundedIncome + STANDARD_DEDUCTION,
    standardDeduction: STANDARD_DEDUCTION,
    taxableIncome: roundedIncome,
    baseTaxBeforeRebate,
    rebate,
    taxAfterRebate,
    surchargeRate,
    surcharge,
    taxAfterSurcharge,
    cess,
    totalTax: taxAfterSurcharge + cess,
    usesExactOverride: false,
    slabs,
  };
}

export function roundToShareBucket(amount: number): number {
  return Math.max(0, Math.round(amount / SHARE_BUCKET) * SHARE_BUCKET);
}

function buildSlabBreakdown(taxableIncome: number): SlabBreakdown[] {
  return SLABS.map((slab) => {
    const ceiling = slab.to ?? taxableIncome;
    const taxableAmount = Math.max(
      0,
      Math.min(taxableIncome, ceiling) - slab.from,
    );

    return {
      from: slab.from,
      to: slab.to,
      rate: slab.rate,
      taxableAmount,
      tax: Math.round(taxableAmount * slab.rate),
    };
  });
}

function computeRebateAndTaxAfterRebate(
  taxableIncome: number,
  baseTaxBeforeRebate: number,
): { rebate: number; taxAfterRebate: number } {
  if (taxableIncome <= REBATE_TAXABLE_LIMIT) {
    const rebate = Math.min(MAX_REBATE, baseTaxBeforeRebate);
    return {
      rebate,
      taxAfterRebate: Math.max(0, baseTaxBeforeRebate - rebate),
    };
  }

  const incomeOverSevenLakh = Math.max(0, taxableIncome - REBATE_TAXABLE_LIMIT);
  const taxAfterRebate = Math.min(baseTaxBeforeRebate, incomeOverSevenLakh);
  const rebate = Math.max(0, baseTaxBeforeRebate - taxAfterRebate);

  return { rebate, taxAfterRebate };
}

function getSurchargeRate(taxableIncome: number): number {
  return SURCHARGE_TIERS.find((tier) => taxableIncome > tier.threshold)?.rate ?? 0;
}

function applySurchargeMarginalRelief(
  taxableIncome: number,
  taxWithSurcharge: number,
): number {
  const tier = SURCHARGE_TIERS.find((item) => taxableIncome > item.threshold);
  if (!tier) {
    return taxWithSurcharge;
  }

  const thresholdTax = getTaxForThreshold(tier.threshold);
  const maximumWithRelief = thresholdTax + (taxableIncome - tier.threshold);
  return Math.min(taxWithSurcharge, maximumWithRelief);
}

function getTaxForThreshold(threshold: number): number {
  const slabs = buildSlabBreakdown(threshold);
  const tax = sum(slabs.map((slab) => slab.tax));
  const { rebate, taxAfterRebate } = computeRebateAndTaxAfterRebate(
    threshold,
    tax,
  );
  const rate = getSurchargeRate(threshold);
  return taxAfterRebate + Math.round(taxAfterRebate * rate);
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
