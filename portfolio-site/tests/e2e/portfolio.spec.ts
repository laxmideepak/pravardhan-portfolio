import { expect, test } from "@playwright/test";

test("desktop anchor navigation reaches experience section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Experience" }).click();
  await expect(page).toHaveURL(/#experience/);
  await expect(page.locator("#experience")).toBeVisible();
});

test("mobile navigation opens and routes to skills", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle navigation menu" }).click();
  await page.getByRole("link", { name: "Skills" }).click();
  await expect(page).toHaveURL(/#skills/);
  await expect(page.locator("#skills")).toBeVisible();
});

test("resume link points to local pdf and file is served", async ({ page }) => {
  await page.goto("/");
  const resumeLink = page.getByRole("link", { name: "Download Resume" }).first();
  await expect(resumeLink).toHaveAttribute("href", "/PravardhanResume_SDE1.pdf");

  const response = await page.request.get("/PravardhanResume_SDE1.pdf");
  expect(response.ok()).toBeTruthy();
});

test("accessibility smoke checks for landmarks and keyboard access", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
});

test("dark theme is default and toggle persists user choice", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
