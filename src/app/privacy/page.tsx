import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8f3e8] px-5 py-10 text-[#14120f]">
      <article className="mx-auto max-w-3xl space-y-8">
        <Link className="text-sm font-bold text-[#8d2f20]" href="/">
          ← Tax Wrapped India
        </Link>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8d2f20]">
            Privacy
          </p>
          <h1 className="mt-3 text-5xl font-black">How we handle your data</h1>
        </div>
        <ul className="space-y-4 text-lg leading-8 text-black/75">
          <li>Your salary and tax calculation stay in your browser.</li>
          <li>No login, email, phone number, PAN, Aadhaar, or government ID.</li>
          <li>Share cards use rounded tax buckets, not raw salary.</li>
          <li>Analytics are aggregate funnel events only.</li>
          <li>No cross-border transfer of personal data is needed for V1.</li>
          <li>Under-18 users should not use this tax-filing-oriented product.</li>
        </ul>
        <p className="rounded-2xl bg-white p-4 text-black/70 shadow-sm">
          Grievance contact:{" "}
          <a className="font-bold text-[#8d2f20]" href="mailto:hello@taxwrapped.in">
            hello@taxwrapped.in
          </a>
        </p>
      </article>
    </main>
  );
}
