import type cgaData from "@/data/cga-actuals-2024-25.json";
import type ministryRoot from "@/data/ministries-2024-25.json";

export type CgaDataset = typeof cgaData;

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
};

export type MinistryDataset = typeof ministryRoot;

export type MinistryBucket = {
  id: string;
  labelEn: string;
  labelHi: string;
  ratio: number;
  amount: number;
  sourceId: string;
};

export type MinistryAllocationResult = {
  taxAmount: number;
  fiscalYear: string;
  basis: string;
  buckets: MinistryBucket[];
  topMinistry: MinistryBucket;
};

export function allocateTax(
  taxAmount: number,
  budget: CgaDataset,
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
  };
}

export function allocateMinistryTax(
  taxAmount: number,
  data: MinistryDataset,
): MinistryAllocationResult {
  const roundedTax = Math.max(0, Math.round(taxAmount));
  let remaining = roundedTax;

  const buckets = data.ministries.map((ministry, index) => {
    const isLast = index === data.ministries.length - 1;
    const amount = isLast ? remaining : Math.round(roundedTax * ministry.ratio);
    remaining -= amount;

    return {
      id: ministry.id,
      labelEn: ministry.labelEn,
      labelHi: ministry.labelHi,
      ratio: ministry.ratio,
      amount,
      sourceId: ministry.sourceId,
    };
  });

  const topMinistry = buckets.reduce((largest, bucket) =>
    bucket.amount > largest.amount ? bucket : largest,
  );

  return {
    taxAmount: roundedTax,
    fiscalYear: data.fiscalYear,
    basis: data.basis,
    buckets,
    topMinistry,
  };
}
