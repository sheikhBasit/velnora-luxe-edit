import { chromium, devices } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to homepage to collect links...");
  await page.goto("http://localhost:8080");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Collect all links on the homepage
  const hrefs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a"))
      .map((a) => a.getAttribute("href"))
      .filter((href) => href && href.startsWith("/"));
  });

  // Remove duplicates and filter for product and category links
  const uniqueLinks = [...new Set(hrefs)].filter(
    (href) => href.includes("/product/") || href.includes("/category/"),
  );

  console.log(`Found ${uniqueLinks.length} unique product/category links to test.`);

  let errors = [];

  for (const link of uniqueLinks) {
    const url = `http://localhost:8080${link}`;
    console.log(`Testing: ${url}`);

    try {
      await page.goto(url);
      await page.waitForLoadState("networkidle");

      const is404 = await page.isVisible('text="Page not found"');
      const isError = await page.isVisible('text="This page didn\'t load"');

      if (is404) {
        errors.push(`[404] ${link}`);
      } else if (isError) {
        errors.push(`[Error] ${link}`);
      }
    } catch (e) {
      errors.push(`[Exception] ${link}: ${e.message}`);
    }
  }

  if (errors.length > 0) {
    console.log("\n--- ERRORS FOUND ---");
    errors.forEach((err) => console.log(err));
  } else {
    console.log("\n--- SUCCESS ---");
    console.log("All product and category links returned valid pages with no 404s!");
  }

  await context.close();
  await browser.close();
})();
