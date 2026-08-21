// End-to-end check of the admin dashboard against a live deployment: log in, create a product
// with a photo, confirm it live-syncs to the public category page with no redeploy, edit it,
// cancel a delete, then delete it for real and confirm the delete syncs too, then log out.
// Only ever touches the one test product this script creates — never the existing catalog.
// Run with:
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

// 64x64 red PNG, for exercising the image-upload-to-Vercel-Blob path. (A 2x2 pixel PNG
// reproducibly fails createImageBitmap in Chromium — real product photos are never that tiny,
// so a realistically-sized fixture is the right test, not chasing that decoder edge case.)
const TEST_IMAGE_B64 =
  "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAYklEQVR4nO3PMQ0AIADAMEAI/qUgCxEcDcmqYJtn7/GzpQNeNaA1oDWgNaA1oDWgNaA1oDWgNaA1oDWgNaA1oDWgNaA1oDWgNaA1oDWgNaA1oDWgNaA1oDWgNaA1oDWgNaBdQ3UBhOjh6FcAAAAASUVORK5CYII=";
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

  log("testing the Edit button");
  const updatedName = `${productName} (edited)`;
  await page.goto(`${BASE_URL}/admin`);
  await page.waitForLoadState("networkidle");
  await page.locator("tr", { hasText: productName }).locator('a:has-text("Edit")').click();
  await page.waitForURL(/\/admin\/product\/e2e-test-product/);
  await assertEventually(
    async () => (await page.locator("#name").inputValue()) === productName,
    "edit form is pre-filled with the product's current name",
  );
  await page.fill("#name", updatedName);
  await page.click('button[type="submit"]:has-text("Save changes")');
  await page.waitForURL(`${BASE_URL}/admin`, { timeout: 15000 });
  await assertEventually(
    async () => (await page.locator(`text=${updatedName}`).count()) > 0,
    "edited name appears in admin list",
  );

  log("testing Cancel on the delete confirmation dialog");
  await page.locator("tr", { hasText: updatedName }).locator('button:has-text("Delete")').click();
  await page.click('button:has-text("Cancel"):visible');
  await assertEventually(
    async () => (await page.locator(`text=${updatedName}`).count()) > 0,
    "Cancel on the delete dialog leaves the product in place",
  );

  log("cleaning up: deleting the test product");
  const row = page.locator("tr", { hasText: updatedName });
  await row.locator('button:has-text("Delete")').click();
  await page.locator('button:has-text("Delete"):visible').last().click();
  await assertEventually(
    async () => (await page.locator(`text=${updatedName}`).count()) === 0,
    "test product removed from admin list",
  );

  await page.goto(`${BASE_URL}/category/${category}`);
  await assertEventually(
    async () => (await page.locator(`text=${updatedName}`).count()) === 0,
    "delete also disappears from the public category page (live sync)",
  );

  log("testing the Log out button");
  await page.goto(`${BASE_URL}/admin`);
  await page.click('button:has-text("Log out")');
  await page.waitForURL(`${BASE_URL}/admin-login`, { timeout: 15000 });
  log("ok: log out redirects to /admin-login");
  await page.goto(`${BASE_URL}/admin`);
  await page.waitForURL(`${BASE_URL}/admin-login`, { timeout: 15000 });
  log("ok: /admin requires login again after logout (session actually cleared)");

  log("ALL CHECKS PASSED");
} catch (err) {
  failed = true;
  console.error("[e2e] FAILURE:", err.message);
  await page.screenshot({ path: "e2e-failure.png" }).catch(() => {});
} finally {
  await browser.close();
}

process.exit(failed ? 1 : 0);
