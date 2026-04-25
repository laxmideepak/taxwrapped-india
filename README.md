# Tax Wrapped India

A **year-in-review** experience for Indian income tax—similar in spirit to [Tax Wrapped](https://taxwrapped.com/) (US), but built for **India**: **Union Budget / CGA-style** spending splits, **₹** formatting, **FY 2024-25 / AY 2025-26**, and the **new tax regime** slab math in the browser.

Your salary and tax inputs **stay on the client**; nothing is sent to a server for calculation (see the **Privacy** page in the app at `/privacy`).

### What this project is about

**Tax Wrapped India** is an **educational** “year in review” for your **income tax**—in the same spirit as a music **Wrapped** playlist recap, but here the story is: *if we estimate your tax (FY 2024-25, **new regime**), how might that amount compare to the way the Union’s books group spending?* The app:

1. **Estimates** tax from your salary (or an optional **Form 16** figure).
2. **Allocates** that amount across **CGA-style functional heads** and **major ministries** using JSON ratio files (illustrative until you swap in **official CGA** provisional actuals).
3. Presents it as **shareable story cards**—**not** professional tax advice.

The same explanation appears on the app **home** screen under **“What this is”** (and **“यह क्या है”** in Hindi).

---

## Features

- **New regime tax estimate** from annual gross salary (optional **Form 16 exact tax** override).
- **Story cards** that allocate your income tax across:
  - **CGA-style functional heads** (interest, subsidies, defence, transfers to states, etc.) using `src/data/cga-actuals-2024-25.json`.
  - **Major Union ministries** using `src/data/ministries-2024-25.json`.
- **English and Hindi** UI (toggle in the header).
- **Share card** (`/api/share-card`) — Open Graph image for a **rounded tax bucket** and top ministry; salary is never part of the URL.
- **Methodology** and **Privacy** static pages for how the numbers work and what leaves the browser.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | React 19, [Tailwind CSS](https://tailwindcss.com/) 4, [Framer Motion](https://www.framer.com/motion/) |
| OG images | [`@vercel/og`](https://vercel.com/docs/functions/og-image-generation) (Edge) |
| Tests | [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/), [Playwright](https://playwright.dev/) |
| Language | TypeScript |

---

## Getting started

**Requirements:** Node.js **20+** and npm.

```bash
git clone <repo-url>
cd taxwrapped-pr
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Use only **one** `next dev` at a time; if the port is busy, stop the other process or pick another port.

### Production

```bash
npm run build
npm start
```

`npm run build` runs **`prebuild` → `verify:data`** (see below). The build will fail if allocation JSON ratios are all zero or missing—this blocks shipping placeholder data by mistake.

---

## Scripts

| Command | Purpose |
|--------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | `verify:data` + `next build` |
| `npm start` | Serve production build |
| `npm run verify:data` | Check CGA + ministry `ratio` fields sum to a valid total |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit + component tests |
| `npm run test:e2e` | Playwright (installs browser on first run if needed) |
| `npm run lint` | ESLint (Next config) |

---

## Data model (important)

- **`src/data/cga-actuals-2024-25.json`** — top-level **functional** expenditure shares. Ratios are **normalized to sum to 1** for the allocator.
- **`src/data/ministries-2024-25.json`** — **ministry** shares; same sum-to-1 rule.
- The **`basis`** field in each file explains whether numbers are **illustrative** (pattern-aligned with published Union Budget material) or **sourced from CGA / official actuals**. For publication-quality copy, **replace** these JSON splits with **Controller General of Accounts** (and other approved) **provisional actuals** and update `basis` + `sourceId` accordingly.
- `scripts/verify-allocation-datasets.mjs` guards `npm run build` so empty placeholder datasets do not go to production unnoticed.

**Income tax** is the only direct tax in scope; **GST and other indirect taxes** are out of scope (called out in the app copy).

---

## Project layout (high level)

```
src/
  app/                 # App Router: page, layout, API route for share OG image
  components/         # TaxWrappedApp, WrappedChrome, etc.
  data/               # CGA + ministry JSON, sources, unit conversions
  lib/                # Tax math, allocation, story cards, formatting
  messages/           # en.json, hi.json
tests/                # unit, components, e2e
```

---

## Disclaimers

- **Not tax advice.** This is an educational visualisation. Verify tax with a qualified professional or your Form 16.
- **Allocation splits** follow the project JSON; illustrative splits should not be read as an official CGA line-by-line statement unless you have pasted official ratios and cited them in `basis`.

---

## Deployment

A typical setup is [Vercel](https://vercel.com/) (Next.js + Edge for `/api/share-card`). Set environment variables only if you add server-side features later; core flows are client-side for tax entry.

---

## Contributing

1. Run `npm run typecheck`, `npm run test`, and `npm run test:e2e` before opening a PR.
2. Keep **editorial** copy neutral; see `tests/unit/editorial.test.ts` for banned terms.
3. If you change allocation JSON, ensure **`npm run verify:data`** passes and **ratios ≈ 1** per dataset.

---

## License

This repository does not include a `LICENSE` file yet. Add one if you intend to open-source the project.
