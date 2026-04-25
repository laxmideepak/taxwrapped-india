import Link from "next/link";
import sources from "@/data/sources.json";

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#f8f3e8] px-5 py-10 text-[#14120f]">
      <article className="mx-auto max-w-3xl space-y-8">
        <Link className="text-sm font-bold text-[#8d2f20]" href="/">
          ← Tax Wrapped India
        </Link>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8d2f20]">
            Methodology
          </p>
          <h1 className="mt-3 text-5xl font-black">How we calculate your wrap</h1>
        </div>
        <section className="space-y-3 text-lg leading-8 text-black/75">
          <p>
            Your income tax is calculated in the browser using the Government of
            India slab structure for FY 2025-26 / AY 2026-27 under the new tax
            regime.
          </p>
          <p>
            We then allocate that tax using the Budget at a Glance BE 2026-27
            Rupee Goes To split. This is an estimate based on Budget Estimates;
            actual spending can differ.
          </p>
          <p>
            This shows income tax only. GST, customs, excise, and other indirect
            taxes are not included.
          </p>
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
