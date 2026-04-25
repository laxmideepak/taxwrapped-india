import { expect, test } from "@playwright/test";

test("generates an English tax wrap without sending salary to the share route", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /tax wrapped/i,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: /start/i }).click();
  await page.getByLabel(/gross salary/i).fill("1800000");
  await page.getByRole("button", { name: /^next$/i }).click();

  await expect(page.getByText("₹2,15,800").first()).toBeVisible();
  await expect(page.getByText(/grants to states/i)).toBeVisible();
  await expect(page.getByText(/Defence/i).first()).toBeVisible();
  await expect(page.getByText(/interest payments/i).first()).toBeVisible();

  const shareHref = await page.getByRole("link", { name: /download/i }).getAttribute("href");
  expect(shareHref).toContain("taxBucket=215000");
  expect(shareHref).not.toContain("1800000");
});

test("switches to Hindi welcome copy", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /हिंदी/i }).click();
  await expect(page.getByText("भारत")).toBeVisible();
});

test("methodology and privacy pages explain CGA actuals", async ({ page }) => {
  await page.goto("/methodology");
  await expect(page.getByRole("heading", { name: /how we calculate/i })).toBeVisible();
  await expect(
    page.getByText(/Controller General of Accounts/i).first(),
  ).toBeVisible();

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /how we handle/i })).toBeVisible();
  await expect(page.getByText(/stay in your browser/i)).toBeVisible();
});

test("methodology and privacy links stay visible on a 375px-wide viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: /methodology/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /privacy/i })).toBeVisible();
});

test("share-card route returns a PNG from a rounded tax bucket", async ({
  request,
}) => {
  const response = await request.get(
    "/api/share-card?locale=en&variant=story&taxBucket=215800&top=defence",
  );

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
});
