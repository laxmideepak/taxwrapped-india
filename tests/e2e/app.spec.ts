import { expect, test } from "@playwright/test";

test("generates an English tax wrap without sending salary to the share route", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /where did your tax go in fy 2025-26/i,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: /start/i }).click();
  await page.getByLabel(/annual gross salary/i).fill("1800000");
  await page.getByRole("button", { name: /reveal/i }).click();

  await expect(page.getByText("₹1,50,800").first()).toBeVisible();
  await expect(page.getByText(/Centre vs States/i)).toBeVisible();
  await expect(page.getByText(/Interest payments/i).first()).toBeVisible();

  const shareHref = await page.getByRole("link", { name: /download/i }).getAttribute("href");
  expect(shareHref).toContain("taxBucket=150000");
  expect(shareHref).not.toContain("1800000");
});

test("switches to Hindi welcome copy", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /हिंदी/i }).click();
  await expect(page.getByText(/आपका टैक्स कहां गया/i)).toBeVisible();
});

test("methodology and privacy pages are available", async ({ page }) => {
  await page.goto("/methodology");
  await expect(page.getByRole("heading", { name: /how we calculate/i })).toBeVisible();
  await expect(page.getByText(/Budget at a Glance BE 2026-27/i)).toBeVisible();

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /how we handle/i })).toBeVisible();
  await expect(page.getByText(/stay in your browser/i)).toBeVisible();
});

test("share-card route returns a PNG from a rounded tax bucket", async ({
  request,
}) => {
  const response = await request.get(
    "/api/share-card?locale=en&variant=story&taxBucket=150800&top=interest_payments",
  );

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
});
