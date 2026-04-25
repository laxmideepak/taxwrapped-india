import Link from "next/link";
import sources from "@/data/sources.json";

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#f8f3e8] px-5 py-10 text-[#14120f]">
      <article className="mx-auto max-w-3xl space-y-10">
        <Link className="text-sm font-bold text-[#8d2f20]" href="/">
          ← Tax Wrapped India
        </Link>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8d2f20]">
            Methodology
          </p>
          <h1 className="mt-3 text-5xl font-black">How we calculate your wrap</h1>
        </div>

        <section className="space-y-4 text-lg leading-8 text-black/75">
          <p>
            Tax Wrapped India is built for people filing{" "}
            <strong>FY 2024-25 (AY 2025-26)</strong> returns. Your income tax is
            estimated in the browser under the <strong>new tax regime</strong>{" "}
            using the slab structure that applied that year. We then split your
            tax across <strong>seven functional spending heads</strong> that line
            up with how the <strong>Controller General of Accounts (CGA)</strong>{" "}
            reports <strong>provisional actuals</strong> for the Union Government
            — not Budget Estimates. Until the dataset file is filled with the
            official split, the app uses placeholder ratios (see the JSON TODOs)
            only so the maths still reconciles; do not treat placeholder numbers
            as publication-ready.
          </p>
          <p>
            This product covers <strong>income tax only</strong>. GST, customs,
            excise, and other indirect taxes are not included.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-black">
            (a) FY 2024-25 slab math — worked example
          </h2>
          <div className="space-y-3 text-lg leading-8 text-black/75">
            <p>
              Salaried inputs first take the <strong>standard deduction of ₹75,000</strong>{" "}
              to reach <strong>taxable income</strong>. Tax is then computed in
              bands (each slice is taxed only inside its band):
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>₹0 – ₹3,00,000 at 0%</li>
              <li>₹3,00,001 – ₹7,00,000 at 5%</li>
              <li>₹7,00,001 – ₹10,00,000 at 10%</li>
              <li>₹10,00,001 – ₹12,00,000 at 15%</li>
              <li>₹12,00,001 – ₹15,00,000 at 20%</li>
              <li>Above ₹15,00,000 at 30%</li>
            </ul>
            <p>
              <strong>Worked example:</strong> gross salary{" "}
              <strong>₹12,00,000</strong>. Taxable income = ₹12,00,000 − ₹75,000 ={" "}
              <strong>₹11,25,000</strong>. Slice-by-slice: ₹0 on the first ₹3
              lakh; 5% on the next ₹4 lakh (₹20,000); 10% on the next ₹3 lakh
              (₹30,000); 15% on the remaining ₹1.25 lakh (₹18,750).{" "}
              <strong>Base tax before rebate = ₹68,750.</strong> Education and
              health cess (4%) is applied on the tax figure after rebate and
              surcharge steps.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-black">
            (b) Section 87A rebate and marginal relief
          </h2>
          <div className="space-y-3 text-lg leading-8 text-black/75">
            <p>
              For FY 2024-25 / AY 2025-26 under the new regime,{" "}
              <strong>Section 87A</strong> offers a rebate (capped at{" "}
              <strong>₹25,000</strong>) so that taxpayers with taxable income up
              to <strong>₹7,00,000</strong> can end up with <strong>nil</strong>{" "}
              tax when the slab tax before rebate is fully offset.
            </p>
            <p>
              When taxable income <strong>marginally exceeds ₹7,00,000</strong>,{" "}
              <strong>marginal relief</strong> prevents a cliff: the tax after
              rebate is capped so it does not jump by more than the rupees of
              income above ₹7 lakh. That is why taxable income of ₹7,00,001 can
              produce a total tax of only <strong>₹1</strong> (before rounding
              nuances) instead of tens of thousands — the law is smoothing the
              transition, not punishing the next rupee of income.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-black">
            (c) Why CGA actuals instead of Budget Estimates
          </h2>
          <div className="space-y-3 text-lg leading-8 text-black/75">
            <p>
              <strong>Budget Estimates (BE)</strong> describe what the government
              plans to spend before the year unfolds.{" "}
              <strong>CGA monthly accounts</strong> describe what was actually
              spent as the year closes — still provisional until final
              consolidation, but anchored in cash and accounts rather than the
              budget speech.
            </p>
            <p>
              For a &quot;where did my tax go&quot; story filed against{" "}
              <strong>FY 2024-25</strong>, using <strong>actual spending</strong>{" "}
              matches how people think about their return: last year&apos;s
              money, not next year&apos;s spreadsheet. When you supply the CGA
              ratios for March 2025, the copy can truthfully describe{" "}
              <strong>provisional actuals</strong>; until then the UI should be
              read as a calculator with placeholder weights.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-3xl font-black">
            (d) Seven functional categories (CGA-style)
          </h2>
          <div className="space-y-3 text-lg leading-8 text-black/75">
            <p>
              The simplified split uses seven heads that map cleanly to how CGA
              reports Union outgo (names may differ slightly in official tables,
              but the intent is the same bucket):
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Interest payments</strong> — interest on past
                borrowings.
              </li>
              <li>
                <strong>Major subsidies</strong> — large explicit subsidy
                programmes (food, fertiliser, fuel-type support grouped at the
                macro level).
              </li>
              <li>
                <strong>Defence services</strong> — defence revenue and capital
                spend reported under the defence services head in accounts.
              </li>
              <li>
                <strong>Grants and loans to states</strong> — transfers that flow
                to state governments rather than staying inside central
                ministries.
              </li>
              <li>
                <strong>Pensions</strong> — pension and retirement-related
                outgo.
              </li>
              <li>
                <strong>Other revenue expenditure</strong> — residual current
                spending that is not interest, subsidies, defence, grants, or
                pensions in this simplified map.
              </li>
              <li>
                <strong>Capital expenditure</strong> — asset creation and capital
                outlay in this simplified map.
              </li>
            </ul>
            <p>
              <strong>Ministry view (separate card):</strong> the &quot;top
              ministry&quot; card does <strong>not</strong> read the winner from
              this seven-way split (which would often be dominated by macro heads
              like interest). It uses a <strong>second dataset</strong> of
              ministry-wise actuals so the headline can read like{" "}
              <strong>Defence</strong> or <strong>Railways</strong> when your
              numbers make that true.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black">Sources</h2>
          <ul className="mt-4 space-y-3">
            {sources.map((source) => (
              <li className="rounded-2xl bg-white p-4 shadow-sm" key={source.id}>
                <a
                  className="font-bold text-[#8d2f20]"
                  href={source.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {source.name}
                </a>
                <p className="mt-1 text-sm text-black/60">
                  {source.publisher} - {source.usedFor}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
