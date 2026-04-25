import type budgetData from "@/data/budget-2026-27.json";

export type BudgetDataset = typeof budgetData;

export type AllocationBucket = {
  id: string;
  labelEn: string;
  labelHi: string;
  ratio: number;
  amount: number;
  sourceId: string;
};

export type AllocationResult = {
  taxAmount: number;
  fiscalYear: string;
  basis: string;
  buckets: AllocationBucket[];
  topSpendingHead: AllocationBucket;
};

export function allocateTax(
  taxAmount: number,
  budget: BudgetDataset,
): AllocationResult {
  const roundedTax = Math.max(0, Math.round(taxAmount));
  let remaining = roundedTax;

  const buckets = budget.topLevelHeads.map((head, index) => {
    const isLast = index === budget.topLevelHeads.length - 1;
    const amount = isLast ? remaining : Math.round(roundedTax * head.ratio);
    remaining -= amount;

    return {
      id: head.id,
      labelEn: head.labelEn,
      labelHi: head.labelHi,
      ratio: head.ratio,
      amount,
      sourceId: head.sourceId,
    };
  });

  return {
    taxAmount: roundedTax,
    fiscalYear: budget.fiscalYear,
    basis: budget.basis,
    buckets,
    topSpendingHead: buckets.reduce((largest, bucket) =>
      bucket.amount > largest.amount ? bucket : largest,
    ),
  };
}
