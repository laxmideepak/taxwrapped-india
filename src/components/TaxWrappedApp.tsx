"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import cga from "@/data/cga-actuals-2024-25.json";
import ministries from "@/data/ministries-2024-25.json";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import { allocateMinistryTax, allocateTax } from "@/lib/allocation";
import { formatINR, type Locale } from "@/lib/format";
import { createStoryCards } from "@/lib/story";
import { calculateNewRegimeTax, roundToShareBucket } from "@/lib/tax";
import {
  WavyBottom,
  WavyTop,
  WrappedShell,
  YearMosaicFy,
} from "@/components/WrappedChrome";

type TaxWrappedAppProps = {
  initialLocale: Locale;
};

const cardSurfaces = [
  "bg-white/95 border border-black/8 shadow-sm",
  "bg-[#e8f0ff] border border-[#1e4fd6]/15",
  "bg-[#fff5f0] border border-[#c24e3a]/12",
  "bg-[#f7f2ea] border border-black/6",
] as const;

export function TaxWrappedApp({ initialLocale }: TaxWrappedAppProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [started, setStarted] = useState(false);
  const [salary, setSalary] = useState("");
  const [useExactTax, setUseExactTax] = useState(false);
  const [exactTax, setExactTax] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [shareOrigin, setShareOrigin] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const copy = locale === "hi" ? hi : en;

  useEffect(() => {
    setShareOrigin(window.location.origin);
  }, []);

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
    return allocateTax(taxResult.totalTax, cga);
  }, [taxResult]);

  const ministryAllocation = useMemo(() => {
    if (!taxResult) {
      return null;
    }
    return allocateMinistryTax(taxResult.totalTax, ministries);
  }, [taxResult]);

  const cards = useMemo(() => {
    if (!taxResult || !allocation || !ministryAllocation) {
      return [];
    }
    return createStoryCards(taxResult, allocation, ministryAllocation, locale);
  }, [allocation, locale, ministryAllocation, taxResult]);

  const taxBucket = roundToShareBucket(taxResult?.totalTax ?? 0);
  const sharePath = `/api/share-card?locale=${locale}&variant=story&taxBucket=${taxBucket}&top=${ministryAllocation?.topMinistry.id ?? "defence"}`;
  const fullShareUrl = shareOrigin ? `${shareOrigin}${sharePath}` : "";

  async function copyShareLink() {
    if (!fullShareUrl) {
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullShareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = fullShareUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }

  function reset() {
    setStarted(false);
    setRevealed(false);
    setSalary("");
    setExactTax("");
    setUseExactTax(false);
  }

  return (
    <main className="min-h-dvh w-full">
      <div className="mx-auto flex min-h-dvh w-full max-w-[28rem] flex-col sm:min-h-0 sm:max-h-[min(100dvh,58rem)] sm:justify-center sm:px-0 sm:py-4">
        <div
          className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-[#f2f2f0] text-[#0a0a0a] sm:min-h-0 sm:max-h-[min(100dvh,58rem)] sm:rounded-[2.2rem] sm:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_32px_100px_rgba(0,0,0,0.55)]"
        >
          <header className="relative z-20 flex items-center justify-between border-b border-black/6 bg-[#f2f2f0]/90 px-4 py-3 backdrop-blur-sm">
            <Link
              className="text-[0.7rem] font-extrabold tracking-[0.2em] text-[#0a0a0a]/85"
              href="/"
            >
              TAX WRAPPED
            </Link>
            <nav className="flex flex-wrap items-center justify-end gap-2 text-[0.7rem] font-bold text-[#0a0a0a]/60">
              <button
                className="rounded-full border border-black/15 bg-white/70 px-2.5 py-1 transition hover:border-black/25 hover:text-[#0a0a0a]"
                onClick={() => setLocale(locale === "en" ? "hi" : "en")}
                type="button"
              >
                {locale === "en" ? "हिंदी" : "EN"}
              </button>
              <Link className="whitespace-nowrap" href="/methodology">
                {copy.methodology}
              </Link>
              <Link className="whitespace-nowrap" href="/privacy">
                {copy.privacy}
              </Link>
            </nav>
          </header>

          {
            !started ? (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-0 flex-1 flex-col"
                exit={{ opacity: 0, y: -12 }}
                initial={{ opacity: 1, y: 0 }}
                key="welcome"
              >
                <WrappedShell>
                  <WavyTop />
                  <div className="flex min-h-0 flex-1 flex-col px-6 pt-1">
                    <div className="flex min-h-0 flex-1 flex-col justify-center py-4 text-center">
                      <h1
                        className="text-[2.1rem] font-extrabold leading-[0.95] tracking-tight text-[#0a0a0a] sm:text-5xl"
                        style={{ fontFamily: "var(--font-wrapped, sans-serif)" }}
                      >
                        {copy.welcomeTitle}
                      </h1>
                      <p className="mt-2 text-[0.7rem] font-extrabold tracking-[0.4em] text-[#0a0a0a]/45">
                        {copy.welcomeKicker}
                      </p>
                      <p className="mt-5 text-balance text-sm leading-6 text-[#0a0a0a]/70 sm:text-base">
                        {copy.welcomeSubtitle}
                      </p>
                      <div className="mt-7">
                        <button
                          className="wrapped-cta"
                          onClick={() => setStarted(true)}
                          type="button"
                        >
                          {copy.start}
                        </button>
                      </div>
                      <p className="mt-3 text-center text-xs font-semibold text-[#c24e3a]">
                        {copy.newRegimeOnly}
                      </p>
                      <p className="mt-1 text-center text-xs text-[#0a0a0a]/45">
                        {copy.trust}
                      </p>
                    </div>
                    <YearMosaicFy />
                    <WavyBottom />
                  </div>
                </WrappedShell>
              </motion.div>
            ) : !revealed ? (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-0 flex-1 flex-col"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 1, y: 0 }}
                key="income"
              >
                <WrappedShell>
                  <WavyTop />
                  <form
                    className="flex min-h-0 flex-1 flex-col justify-between gap-4 px-6 py-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (taxResult) {
                        setRevealed(true);
                      }
                    }}
                  >
                    <div>
                      <h1
                        className="text-balance text-2xl font-extrabold leading-tight text-[#0a0a0a] sm:text-3xl"
                        style={{ fontFamily: "var(--font-wrapped, sans-serif)" }}
                      >
                        {copy.earnQuestion}
                      </h1>
                      <p className="mt-1 text-sm text-[#0a0a0a]/50">
                        AY 2025-26
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0a0a0a]/45" htmlFor="salary">
                        {copy.salaryLabel}
                      </label>
                      <div className="flex items-stretch overflow-hidden rounded-xl border-2 border-black/12 bg-white shadow-inner">
                        <span className="flex items-center bg-black/[0.04] px-3 text-lg font-extrabold text-[#0a0a0a]/50">
                          ₹
                        </span>
                        <input
                          className="min-h-12 w-full min-w-0 border-0 bg-transparent px-2 text-xl font-extrabold text-[#0a0a0a] outline-none"
                          id="salary"
                          inputMode="numeric"
                          onChange={(event) => setSalary(event.target.value)}
                          placeholder="1800000"
                          type="number"
                          value={salary}
                        />
                      </div>
                      <p className="text-xs text-[#0a0a0a]/45">{copy.salaryHint}</p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-[#0a0a0a]/80">
                        <input
                          checked={useExactTax}
                          className="h-4 w-4 rounded border-[#0a0a0a]/20 accent-[#c24e3a]"
                          onChange={(event) => setUseExactTax(event.target.checked)}
                          type="checkbox"
                        />
                        {copy.exactTaxLabel}
                      </label>
                      {useExactTax ? (
                        <div className="mt-3">
                          <label
                            className="text-xs font-bold text-[#0a0a0a]/45"
                            htmlFor="exactTax"
                          >
                            {copy.exactTaxInput}
                          </label>
                          <input
                            className="mt-1 w-full min-h-11 rounded-xl border-2 border-black/12 bg-white px-3 text-lg font-extrabold outline-none focus:border-[#c24e3a]/50"
                            id="exactTax"
                            inputMode="numeric"
                            onChange={(event) => setExactTax(event.target.value)}
                            placeholder="215800"
                            type="number"
                            value={exactTax}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <button
                        className="wrapped-cta disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={!taxResult}
                        type="submit"
                      >
                        {copy.reveal}
                      </button>
                      <p className="mt-3 text-center text-xs leading-5 text-[#0a0a0a]/40">
                        {copy.actualsNote}
                      </p>
                    </div>
                    <WavyBottom />
                  </form>
                </WrappedShell>
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex min-h-0 flex-1 flex-col overflow-y-auto"
                initial={{ opacity: 1 }}
                key="wrap"
              >
                <div className="space-y-4 px-3 pb-8 pt-2">
                  <section className="rounded-3xl bg-[#0a0a0a] p-5 text-center text-white shadow-lg">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/50">
                      FY 2024-25 / AY 2025-26
                    </p>
                    <h2 className="mt-3 text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
                      {formatINR(taxResult?.totalTax ?? 0, locale)}
                    </h2>
                    <p className="mt-2 text-xs text-white/55">{copy.actualsNote}</p>
                    <button
                      className="mt-3 text-xs font-bold text-white/60 underline decoration-white/30 underline-offset-2 hover:text-white"
                      onClick={reset}
                      type="button"
                    >
                      {copy.wrapFriend}
                    </button>
                  </section>

                  {cards.map((card, index) => {
                    const surface = cardSurfaces[index % cardSurfaces.length];
                    return (
                      <motion.article
                        className={`min-h-[min(58dvh,28rem)] snap-start rounded-3xl p-6 sm:p-7 ${surface}`}
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 1, y: 0 }}
                        key={card.id}
                        transition={{ delay: index * 0.04 }}
                      >
                        <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-[#c24e3a]">
                          {card.eyebrow}
                        </p>
                        <h2
                          className="mt-3 text-balance text-2xl font-extrabold leading-tight sm:text-3xl"
                          style={{ fontFamily: "var(--font-wrapped, sans-serif)" }}
                        >
                          {card.title}
                        </h2>
                        <p
                          className="mt-4 text-4xl font-extrabold leading-none text-[#c24e3a] sm:text-5xl"
                        >
                          {card.stat}
                        </p>
                        <p className="mt-4 text-balance text-base leading-7 text-[#0a0a0a]/70">
                          {card.body}
                        </p>
                        {card.detail ? (
                          <p className="mt-2 text-sm font-bold text-[#0a0a0a]/45">
                            {card.detail}
                          </p>
                        ) : null}
                      </motion.article>
                    );
                  })}

                  <section className="rounded-3xl border border-black/8 bg-gradient-to-b from-[#fff6d0] to-[#ffe0a6] p-5 shadow-sm">
                    <h2
                      className="text-lg font-extrabold"
                      style={{ fontFamily: "var(--font-wrapped, sans-serif)" }}
                    >
                      {locale === "hi" ? "शेयर" : "Share"}
                    </h2>
                    <p className="mt-1 text-xs text-[#0a0a0a]/55">
                      {copy.trust}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                      <a className="share-button" href={sharePath}>
                        {copy.download}
                      </a>
                      <button
                        className="share-button"
                        onClick={() => void copyShareLink()}
                        type="button"
                      >
                        {copyStatus === "copied"
                          ? locale === "hi"
                            ? "कॉपी"
                            : "Copied"
                          : copyStatus === "failed"
                            ? locale === "hi"
                              ? "फेल"
                              : "Failed"
                            : copy.copyLink}
                      </button>
                      <a
                        className="share-button"
                        href={
                          fullShareUrl
                            ? `https://wa.me/?text=${encodeURIComponent(`Tax Wrapped India: ${fullShareUrl}`)}`
                            : "#"
                        }
                        rel="noreferrer"
                        target="_blank"
                      >
                        {copy.whatsapp}
                      </a>
                      <a
                        className="share-button"
                        href={
                          fullShareUrl
                            ? `https://twitter.com/intent/tweet?text=${encodeURIComponent("My Tax Wrapped India")}&url=${encodeURIComponent(fullShareUrl)}`
                            : "#"
                        }
                        rel="noreferrer"
                        target="_blank"
                      >
                        {copy.x}
                      </a>
                      <button className="share-button" onClick={reset} type="button">
                        {copy.wrapFriend}
                      </button>
                    </div>
                  </section>
                </div>
              </motion.div>
            )
          }
        </div>
      </div>
    </main>
  );
}
