"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import budget from "@/data/budget-2026-27.json";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import { allocateTax } from "@/lib/allocation";
import { formatINR, type Locale } from "@/lib/format";
import { createStoryCards } from "@/lib/story";
import { calculateNewRegimeTax, roundToShareBucket } from "@/lib/tax";

type TaxWrappedAppProps = {
  initialLocale: Locale;
};

export function TaxWrappedApp({ initialLocale }: TaxWrappedAppProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [started, setStarted] = useState(false);
  const [salary, setSalary] = useState("");
  const [useExactTax, setUseExactTax] = useState(false);
  const [exactTax, setExactTax] = useState("");
  const [revealed, setRevealed] = useState(false);
  const copy = locale === "hi" ? hi : en;

  const taxResult = useMemo(() => {
    const salaryNumber = Number(salary);
    const exactTaxNumber = useExactTax ? Number(exactTax) : undefined;
    if (!Number.isFinite(salaryNumber) || salaryNumber <= 0) {
      return null;
    }

    return calculateNewRegimeTax({
      grossSalary: salaryNumber,
      exactTaxPaid:
        exactTaxNumber && Number.isFinite(exactTaxNumber)
          ? exactTaxNumber
          : undefined,
    });
  }, [exactTax, salary, useExactTax]);

  const allocation = useMemo(() => {
    if (!taxResult) {
      return null;
    }
    return allocateTax(taxResult.totalTax, budget);
  }, [taxResult]);

  const cards = useMemo(() => {
    if (!taxResult || !allocation) {
      return [];
    }
    return createStoryCards(taxResult, allocation, locale);
  }, [allocation, locale, taxResult]);

  const taxBucket = roundToShareBucket(taxResult?.totalTax ?? 0);
  const sharePath = `/api/share-card?locale=${locale}&variant=story&taxBucket=${taxBucket}&top=${allocation?.topSpendingHead.id ?? "states_share"}`;

  function reset() {
    setStarted(false);
    setRevealed(false);
    setSalary("");
    setExactTax("");
    setUseExactTax(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f3e8] text-[#14120f]">
      <div className="fixed left-0 right-0 top-0 z-20 border-b border-black/10 bg-[#f8f3e8]/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link className="text-sm font-semibold tracking-[0.18em]" href="/">
            TAX WRAPPED INDIA
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <button
              className="rounded-full border border-black/20 px-3 py-1 transition hover:bg-black hover:text-white"
              onClick={() => setLocale(locale === "en" ? "hi" : "en")}
              type="button"
            >
              {locale === "en" ? "हिंदी" : "English"}
            </button>
            <Link className="hidden sm:inline" href="/methodology">
              {copy.methodology}
            </Link>
            <Link className="hidden sm:inline" href="/privacy">
              {copy.privacy}
            </Link>
          </nav>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto grid min-h-screen max-w-5xl content-center gap-8 px-5 pt-20 md:grid-cols-[1.05fr_0.95fr]"
            exit={{ opacity: 0, y: -16 }}
            initial={{ opacity: 0, y: 16 }}
            key="welcome"
          >
            <div className="space-y-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8d2f20]">
                Kar Kahan Gaya?
              </p>
              <h1 className="text-balance text-5xl font-black leading-[0.95] md:text-7xl">
                {copy.welcomeTitle}
              </h1>
              <p className="max-w-xl text-xl leading-8 text-black/70">
                {copy.welcomeSubtitle}
              </p>
              <div className="space-y-3">
                <button
                  className="inline-flex h-14 items-center rounded-full bg-[#14120f] px-8 text-base font-bold text-white shadow-lg shadow-black/20 transition hover:translate-y-[-1px]"
                  onClick={() => setStarted(true)}
                  type="button"
                >
                  {copy.start} →
                </button>
                <p className="text-sm font-semibold text-[#8d2f20]">
                  {copy.newRegimeOnly}
                </p>
                <p className="text-sm text-black/60">{copy.trust}</p>
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-black/10 bg-[#f06f38] p-6 shadow-2xl shadow-[#8d2f20]/20">
              <div className="absolute inset-x-8 top-8 h-28 rounded-3xl bg-[#ffe9a6]" />
              <div className="absolute bottom-8 left-8 right-8 rounded-3xl bg-[#14120f] p-6 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                  FY 2025-26
                </p>
                <p className="mt-5 text-5xl font-black">₹</p>
                <div className="mt-6 grid grid-cols-4 gap-2">
                  {[22, 20, 17, 16].map((value) => (
                    <div
                      className="rounded-xl bg-white/10 p-3 text-center text-sm font-bold"
                      key={value}
                    >
                      {value}%
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            animate={{ opacity: 1 }}
            className="mx-auto min-h-screen max-w-5xl px-5 pb-10 pt-24"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="app"
          >
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <form
                className="h-fit rounded-3xl border border-black/10 bg-white p-5 shadow-xl shadow-black/5"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (taxResult) {
                    setRevealed(true);
                  }
                }}
              >
                <label className="block text-sm font-bold" htmlFor="salary">
                  {copy.salaryLabel}
                </label>
                <input
                  className="mt-2 h-14 w-full rounded-2xl border border-black/15 bg-[#fbf7ef] px-4 text-xl font-bold outline-none focus:border-[#8d2f20]"
                  id="salary"
                  inputMode="numeric"
                  onChange={(event) => setSalary(event.target.value)}
                  placeholder="1800000"
                  type="number"
                  value={salary}
                />
                <p className="mt-2 text-sm text-black/60">{copy.salaryHint}</p>

                <label className="mt-5 flex items-center gap-3 text-sm font-semibold">
                  <input
                    checked={useExactTax}
                    className="h-5 w-5 accent-[#8d2f20]"
                    onChange={(event) => setUseExactTax(event.target.checked)}
                    type="checkbox"
                  />
                  {copy.exactTaxLabel}
                </label>

                {useExactTax ? (
                  <div className="mt-4">
                    <label className="block text-sm font-bold" htmlFor="exactTax">
                      {copy.exactTaxInput}
                    </label>
                    <input
                      className="mt-2 h-12 w-full rounded-2xl border border-black/15 bg-[#fbf7ef] px-4 text-lg font-bold outline-none focus:border-[#8d2f20]"
                      id="exactTax"
                      inputMode="numeric"
                      onChange={(event) => setExactTax(event.target.value)}
                      placeholder="150800"
                      type="number"
                      value={exactTax}
                    />
                  </div>
                ) : null}

                <button
                  className="mt-6 h-12 w-full rounded-full bg-[#8d2f20] font-bold text-white transition hover:bg-[#14120f] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!taxResult}
                  type="submit"
                >
                  {copy.reveal}
                </button>
                <p className="mt-4 text-xs leading-5 text-black/55">
                  {copy.estimated}
                </p>
              </form>

              <div className="snap-y space-y-4 overflow-y-auto lg:max-h-[calc(100vh-7rem)]">
                {!revealed ? (
                  <EmptyPreview locale={locale} />
                ) : (
                  <>
                    <section className="rounded-3xl bg-[#14120f] p-6 text-white shadow-xl">
                      <p className="text-sm uppercase tracking-[0.18em] text-white/50">
                        FY 2025-26 / AY 2026-27
                      </p>
                      <h2 className="mt-4 text-4xl font-black">
                        {formatINR(taxResult?.totalTax ?? 0, locale)}
                      </h2>
                      <p className="mt-3 text-white/70">{copy.estimated}</p>
                    </section>
                    {cards.map((card, index) => (
                      <motion.article
                        className="snap-start rounded-3xl border border-black/10 bg-white p-6 shadow-lg shadow-black/5"
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 16 }}
                        key={card.id}
                        transition={{ delay: index * 0.03 }}
                      >
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8d2f20]">
                          {card.eyebrow}
                        </p>
                        <h2 className="mt-3 text-3xl font-black leading-tight">
                          {card.title}
                        </h2>
                        <p className="mt-4 text-5xl font-black text-[#f06f38]">
                          {card.stat}
                        </p>
                        <p className="mt-4 text-lg leading-8 text-black/70">
                          {card.body}
                        </p>
                        {card.detail ? (
                          <p className="mt-3 text-sm font-bold text-black/50">
                            {card.detail}
                          </p>
                        ) : null}
                      </motion.article>
                    ))}
                    <section className="rounded-3xl bg-[#ffe9a6] p-6">
                      <h2 className="text-2xl font-black">
                        {locale === "hi" ? "शेयर करें" : "Share"}
                      </h2>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        <a className="share-button" href={sharePath}>
                          {copy.download}
                        </a>
                        <button className="share-button" type="button">
                          {copy.copyLink}
                        </button>
                        <a
                          className="share-button"
                          href={`https://wa.me/?text=${encodeURIComponent("I saw my Tax Wrapped: " + sharePath)}`}
                        >
                          {copy.whatsapp}
                        </a>
                        <a
                          className="share-button"
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("I saw my Tax Wrapped")}&url=${encodeURIComponent(sharePath)}`}
                        >
                          {copy.x}
                        </a>
                        <button
                          className="share-button"
                          onClick={reset}
                          type="button"
                        >
                          {copy.wrapFriend}
                        </button>
                      </div>
                    </section>
                  </>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function EmptyPreview({ locale }: { locale: Locale }) {
  return (
    <section className="grid min-h-[420px] place-items-center rounded-3xl border border-dashed border-black/20 bg-white/50 p-8 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8d2f20]">
          Browser-only
        </p>
        <h2 className="mt-3 text-3xl font-black">
          {locale === "hi"
            ? "Salary डालें और अपना wrap देखें।"
            : "Enter salary to reveal your wrap."}
        </h2>
      </div>
    </section>
  );
}
