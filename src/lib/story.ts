import conversions from "@/data/unit-conversions.json";
import type { AllocationResult, MinistryAllocationResult } from "@/lib/allocation";
import { formatINR, formatNumber, formatPercent, type Locale } from "@/lib/format";
import type { TaxResult } from "@/lib/tax";

export const STORY_CARDS = [
  "tax_bill",
  "working_day_cost",
  "centre_vs_states",
  "top_spending_head",
  "interest_payments",
  "schemes_you_funded",
  "subsidies",
  "share_kicker",
] as const;

export type StoryCardId = (typeof STORY_CARDS)[number];

export type StoryCard = {
  id: StoryCardId;
  eyebrow: string;
  title: string;
  body: string;
  stat: string;
  detail?: string;
};

export function createStoryCards(
  tax: TaxResult,
  allocation: AllocationResult,
  ministryAllocation: MinistryAllocationResult,
  locale: Locale,
): StoryCard[] {
  const grants = getBucket(allocation, "grants_loans_states");
  const interest = getBucket(allocation, "interest_payments");
  const subsidies = getBucket(allocation, "major_subsidies");
  const pmKisan = conversions.find((item) => item.schemeId === "pm_kisan");
  const pmPoshan = conversions.find((item) => item.schemeId === "pm_poshan");
  const workingDayCost = tax.totalTax / 250;

  const copy = locale === "hi" ? hiCopy : enCopy;
  const topMinistryLabel =
    locale === "hi"
      ? ministryAllocation.topMinistry.labelHi
      : ministryAllocation.topMinistry.labelEn;

  const topMinistryShare =
    tax.totalTax > 0 ? ministryAllocation.topMinistry.amount / tax.totalTax : 0;

  const schemeUnit =
    pmKisan && tax.totalTax > 0
      ? tax.totalTax / pmKisan.rupeesPerUnit
      : 0;
  const mealUnit =
    pmPoshan && tax.totalTax > 0
      ? tax.totalTax / pmPoshan.rupeesPerUnit
      : 0;

  return [
    {
      id: "tax_bill",
      eyebrow: copy.taxBillEyebrow,
      title: copy.taxBillTitle,
      body: copy.taxBillBody,
      stat: formatINR(tax.totalTax, locale),
    },
    {
      id: "working_day_cost",
      eyebrow: copy.workingDayEyebrow,
      title: copy.workingDayTitle,
      body: copy.workingDayBody,
      stat: formatINR(workingDayCost, locale),
      detail: copy.workingDayDetail,
    },
    {
      id: "centre_vs_states",
      eyebrow: copy.statesEyebrow,
      title: copy.statesTitle,
      body: copy.statesBody(formatINR(grants.amount, locale)),
      stat: formatPercent(grants.ratio),
    },
    {
      id: "top_spending_head",
      eyebrow: copy.topHeadEyebrow,
      title: topMinistryLabel,
      body: copy.topHeadBody(
        formatINR(ministryAllocation.topMinistry.amount, locale),
      ),
      stat: formatPercent(topMinistryShare),
    },
    {
      id: "interest_payments",
      eyebrow: copy.interestEyebrow,
      title: copy.interestTitle,
      body: copy.interestBody(formatINR(interest.amount, locale)),
      stat: formatPercent(interest.ratio),
    },
    {
      id: "schemes_you_funded",
      eyebrow: copy.schemesEyebrow,
      title: copy.schemesTitle,
      body: copy.schemesBody(formatNumber(schemeUnit), formatNumber(mealUnit)),
      stat: pmKisan ? pmKisan.unitLabel[locale] : copy.schemesFallback,
    },
    {
      id: "subsidies",
      eyebrow: copy.subsidiesEyebrow,
      title: copy.subsidiesTitle,
      body: copy.subsidiesBody(formatINR(subsidies.amount, locale)),
      stat: formatPercent(subsidies.ratio),
    },
    {
      id: "share_kicker",
      eyebrow: copy.shareEyebrow,
      title: copy.shareTitle,
      body: copy.shareBody,
      stat: formatINR(tax.totalTax, locale),
    },
  ];
}

function getBucket(allocation: AllocationResult, id: string) {
  const bucket = allocation.buckets.find((item) => item.id === id);
  if (!bucket) {
    throw new Error(`Missing allocation bucket: ${id}`);
  }
  return bucket;
}

const enCopy = {
  taxBillEyebrow: "Your tax bill",
  taxBillTitle: "You contributed this much income tax.",
  taxBillBody: "Calculated under the new regime for FY 2024-25 / AY 2025-26.",
  workingDayEyebrow: "Per working day",
  workingDayTitle: "That is your tax per working day.",
  workingDayBody: "Using a 250 working-day year, before indirect taxes like GST.",
  workingDayDetail: "Income tax only",
  statesEyebrow: "Grants to states",
  statesTitle: "A slice flows to states as grants and loans.",
  statesBody: (amount: string) =>
    `${amount} is allocated to grants and loans to states under the FY 2024-25 CGA functional split (provisional actuals when available).`,
  topHeadEyebrow: "Largest ministry",
  topHeadBody: (amount: string) =>
    `Your contribution to this ministry is about ${amount}, based on FY 2024-25 ministry-wise provisional actuals when available.`,
  interestEyebrow: "Reality check",
  interestTitle: "Interest payments are a major allocation.",
  interestBody: (amount: string) =>
    `${amount} is allocated to interest payments on past borrowings. The product shows this directly.`,
  schemesEyebrow: "Tangible units",
  schemesTitle: "Your tax can be read as real-world units.",
  schemesBody: (farmers: string, meals: string) =>
    `That is roughly ${farmers} PM-KISAN annual transfers, or ${meals} PM POSHAN meals, using sourced per-unit costs.`,
  schemesFallback: "scheme units",
  subsidiesEyebrow: "Subsidies",
  subsidiesTitle: "Food, fertiliser, and LPG support sit in major subsidies.",
  subsidiesBody: (amount: string) =>
    `${amount} is allocated to major subsidies in this CGA functional view.`,
  shareEyebrow: "Share",
  shareTitle: "Your Tax Wrapped is ready.",
  shareBody:
    "Share a rounded, privacy-safe card. Your salary never leaves your browser.",
};

const hiCopy = {
  taxBillEyebrow: "आपका टैक्स",
  taxBillTitle: "आपने इतना इनकम टैक्स योगदान किया।",
  taxBillBody: "FY 2024-25 / AY 2025-26 के नए टैक्स रिजीम के अनुसार।",
  workingDayEyebrow: "हर कार्यदिवस",
  workingDayTitle: "इतना टैक्स प्रति कार्यदिवस हुआ।",
  workingDayBody: "250 कार्यदिवस मानकर; GST जैसे अप्रत्यक्ष कर शामिल नहीं हैं।",
  workingDayDetail: "सिर्फ इनकम टैक्स",
  statesEyebrow: "राज्यों को अनुदान",
  statesTitle: "एक हिस्सा राज्यों को अनुदान और ऋण के रूप में जाता है।",
  statesBody: (amount: string) =>
    `${amount} FY 2024-25 CGA कार्यात्मक बंटवारे के अनुसार राज्यों को अनुदान और ऋण में आवंटित माना गया है (जब आंकड़े उपलब्ध हों)।`,
  topHeadEyebrow: "सबसे बड़ा मंत्रालय",
  topHeadBody: (amount: string) =>
    `इस मंत्रालय में आपका योगदान लगभग ${amount} है — FY 2024-25 मंत्रालय-स्तर के प्राविधिक वास्तविक आंकड़ों पर आधारित जब उपलब्ध हों।`,
  interestEyebrow: "एक जरूरी सच",
  interestTitle: "ब्याज भुगतान बड़ा आवंटन है।",
  interestBody: (amount: string) =>
    `${amount} पिछले उधारों पर ब्याज भुगतान में आवंटित माना गया है। इसे साफ दिखाया गया है।`,
  schemesEyebrow: "वास्तविक इकाइयां",
  schemesTitle: "आपका टैक्स जमीन पर दिखने वाली इकाइयों में।",
  schemesBody: (farmers: string, meals: string) =>
    `यह करीब ${farmers} PM-KISAN वार्षिक ट्रांसफर या ${meals} PM POSHAN भोजन के बराबर है।`,
  schemesFallback: "योजना इकाइयां",
  subsidiesEyebrow: "सब्सिडी",
  subsidiesTitle: "खाद्य, उर्वरक और LPG सहायता प्रमुख सब्सिडी में।",
  subsidiesBody: (amount: string) =>
    `इस CGA कार्यात्मक दृश्य में ${amount} प्रमुख सब्सिडी में आवंटित माना गया है।`,
  shareEyebrow: "शेयर",
  shareTitle: "आपका Tax Wrapped तैयार है।",
  shareBody:
    "गोल किए हुए, privacy-safe कार्ड को शेयर करें। आपकी salary browser से बाहर नहीं जाती।",
};
