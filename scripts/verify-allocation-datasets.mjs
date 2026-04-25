#!/usr/bin/env node
/**
 * Fails `npm run build` when CGA or ministry allocation ratios are all zero.
 * Placeholder JSON must not reach production looking like a real split.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const cga = JSON.parse(
  readFileSync(join(root, "src/data/cga-actuals-2024-25.json"), "utf8"),
);
const ministries = JSON.parse(
  readFileSync(join(root, "src/data/ministries-2024-25.json"), "utf8"),
);

function sumRatios(rows) {
  return rows.reduce((sum, row) => sum + (typeof row.ratio === "number" ? row.ratio : 0), 0);
}

const cgaSum = sumRatios(cga.topLevelHeads);
const ministrySum = sumRatios(ministries.ministries);

const failures = [];
if (cgaSum <= 0) {
  failures.push(
    `cga-actuals-2024-25.json: topLevelHeads ratios sum to ${cgaSum} (need real CGA split; sum must be > 0)`,
  );
}
if (ministrySum <= 0) {
  failures.push(
    `ministries-2024-25.json: ministries ratios sum to ${ministrySum} (need real ministry split; sum must be > 0)`,
  );
}

if (failures.length > 0) {
  console.error("verify-allocation-datasets: BLOCKED — refusing production build.\n");
  for (const line of failures) {
    console.error(`  • ${line}`);
  }
  console.error(
    "\nPaste provisional actuals from CGA (and ministry shares) so each dataset’s ratios sum to 1.",
  );
  process.exit(1);
}

const nearOne = 0.000_5;
if (Math.abs(cgaSum - 1) > nearOne) {
  console.warn(
    `verify-allocation-datasets: warning — CGA ratios sum to ${cgaSum} (expected ~1)`,
  );
}
if (Math.abs(ministrySum - 1) > nearOne) {
  console.warn(
    `verify-allocation-datasets: warning — ministry ratios sum to ${ministrySum} (expected ~1)`,
  );
}

console.log(
  `verify-allocation-datasets: OK (CGA Σratio=${cgaSum}, ministries Σratio=${ministrySum})`,
);
