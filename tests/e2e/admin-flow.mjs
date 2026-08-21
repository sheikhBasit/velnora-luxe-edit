// End-to-end check of the admin dashboard against a live deployment: log in, create a product
// with a photo, confirm it live-syncs to the public category page with no redeploy, delete it,
// and confirm the delete syncs too. Run with:
//   BASE_URL=https://www.velnorabeauty.store ADMIN_PASSWORD=... node tests/e2e/admin-flow.mjs
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE_URL = process.env.BASE_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!BASE_URL || !ADMIN_PASSWORD) {
  console.error("BASE_URL and ADMIN_PASSWORD env vars are required");
  process.exit(1);
}

// 2x2 red PNG, for exercising the image-upload-to-Vercel-Blob path.
const TEST_IMAGE_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FAAhKDveMKXTBAAAAAElFTkSuQmCC";
const testImagePath = path.join(os.tmpdir(), "e2e-test-image.png");
fs.writeFileSync(testImagePath, Buffer.from(TEST_IMAGE_B64, "base64"));

const productName = `E2E Test Product ${Date.now()}`;
const category = "makeup";
let failed = false;

function log(msg) {
  console.log(`[e2e] ${msg}`);
}

// TanStack Router re-renders client-side after navigation, so a check right after
// waitForURL can race the DOM update — poll briefly instead of asserting once.
async function assertEventually(check, msg, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await check()) {
      log(`ok: ${msg}`);
      return;
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`ASSERTION FAILED (timed out): ${msg}`);
}

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("response", async (res) => {
  if (res.request().method() === "POST" && res.url().includes("_serverFn")) {
    let body = "";
    try {
      body = (await res.text()).slice(0, 1000);
    } catch {}
    console.log("[debug serverFn]", res.status(), res.url(), "BODY:", body);
  }
});

try {
  log(`logging in at ${BASE_URL}/admin-login`);
  await page.goto(`${BASE_URL}/admin-login`);
  await page.fill("#password", ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/admin`, { timeout: 15000 });
  log("ok: admin login redirects to /admin");

  log("opening add-product form");
  await page.click('a:has-text("Add product")');
  await page.waitForURL(/\/admin\/product\/new/);

  await page.fill("#name", productName);
  await page.fill("#note", "E2E · Automated");
  await page.fill("#price", "$1");
  await page.setInputFiles("#image", testImagePath);
  await assertEventually(
    async () =>
      !(await page.locator('button[type="submit"]:has-text("Create product")').isDisabled()),
    "image upload to Vercel Blob finishes before submit",
    20000,
  );
  await page.click("#category");
  await page.click('[role="option"]:has-text("MAKEUP")');
  await page.fill("#retailerUrl", "https://example.com/e2e-test-product");

  await page.click('button[type="submit"]:has-text("Create product")');
  await page.waitForURL(`${BASE_URL}/admin`, { timeout: 15000 });
  await assertEventually(
    async () => (await page.locator(`text=${productName}`).count()) > 0,
    "new product appears in admin list",
  );

  await assertEventually(async () => {
    const src = await page
      .locator("tr", { hasText: productName })
      .locator("img")
      .getAttribute("src");
    return !!src?.includes("blob.vercel-storage.com");
  }, "product image is hosted on Vercel Blob");

  log("checking live sync on the public category page");
  await page.goto(`${BASE_URL}/category/${category}`);
  await assertEventually(
    async () => (await page.locator(`text=${productName}`).count()) > 0,
    "new product appears on the public category page (live sync, no redeploy)",
  );

  log("cleaning up: deleting the test product");
  await page.goto(`${BASE_URL}/admin`);
  await page.waitForLoadState("networkidle");
  const row = page.locator("tr", { hasText: productName });
  await row.locator('button:has-text("Delete")').click();
  await page.locator('button:has-text("Delete"):visible').last().click();
  await assertEventually(
    async () => (await page.locator(`text=${productName}`).count()) === 0,
    "test product removed from admin list",
  );

  await page.goto(`${BASE_URL}/category/${category}`);
  await assertEventually(
    async () => (await page.locator(`text=${productName}`).count()) === 0,
    "delete also disappears from the public category page (live sync)",
  );

  log("ALL CHECKS PASSED");
} catch (err) {
  failed = true;
  console.error("[e2e] FAILURE:", err.message);
  await page.screenshot({ path: "e2e-failure.png" }).catch(() => {});
} finally {
  await browser.close();
}

process.exit(failed ? 1 : 0);
