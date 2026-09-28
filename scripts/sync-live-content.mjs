import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = "https://www.velnorabeauty.store";
const categories = ["makeup", "skincare", "hair", "body", "tools", "fragrance", "wellness", "tech"];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  const products = [];
  for (const category of categories) {
    await page.goto(`${baseUrl}/category/${category}`, { waitUntil: "networkidle" });
    const categoryProducts = await page.evaluate((categoryId) =>
      [...document.querySelectorAll("article")].flatMap((article, index) => {
        const heading = article.querySelector("h3");
        if (!heading) return [];
        const image = article.querySelector("img");
        const retailerLink = [...article.querySelectorAll('a[href^="http"]')].find((link) =>
          link.rel.includes("sponsored"),
        );
        const name = heading.textContent.trim();
        const note = heading.parentElement.querySelector("p")?.textContent.trim() ?? "";
        const price = article.innerText.match(/\$[\d,.]+/)?.[0] ?? "";
        const id = name
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        return [{
          id,
          name,
          note,
          price,
          image: image?.currentSrc || image?.src || "",
          category: categoryId,
          retailerUrl: retailerLink?.href ?? "",
          description: "",
          features: [],
          featured: index === 0,
          showOnEditorial: true,
          sortOrder: index,
        }];
      }), category);
    products.push(...categoryProducts);
  }

  await page.goto(`${baseUrl}/blog`, { waitUntil: "networkidle" });
  const blogs = await page.evaluate(() =>
    [...document.querySelectorAll("main article")].map((article, index) => {
      const link = article.querySelector('a[href*="/blog/"]');
      const heading = article.querySelector("h2");
      const image = article.querySelector("img");
      const title = heading?.textContent.trim() ?? "";
      const slug = link?.pathname.split("/").filter(Boolean).at(-1) ?? "";
      return {
        id: slug,
        type: "blog",
        title,
        slug,
        category: article.querySelector("p")?.textContent.trim() ?? "",
        excerpt: [...article.querySelectorAll("p")].at(-1)?.textContent.trim() ?? "",
        coverImage: image?.currentSrc || image?.src || "",
        videoUrl: "",
        content: "",
        prerequisites: [],
        steps: [],
        published: true,
        sortOrder: index,
        createdAt: "",
      };
    }),
  );

  for (const blog of blogs) {
    await page.goto(`${baseUrl}/blog/${blog.slug}`, { waitUntil: "networkidle" });
    const detail = await page.evaluate(() => ({
      content: document.querySelector("main article > .mx-auto.max-w-3xl")?.innerHTML ?? "",
      createdAt: document.querySelector("main article time")?.getAttribute("datetime") ?? "",
    }));
    blog.content = detail.content;
    blog.createdAt = detail.createdAt;
    const pageImage = await page.locator("main article img").first().getAttribute("src").catch(() => null);
    blog.coverImage = pageImage ? new URL(pageImage, baseUrl).href : "";
  }

  await writeFile(
    new URL("../src/data/seed-products.mjs", import.meta.url),
    `export const seedProducts = ${JSON.stringify(products, null, 2)};\n`,
  );
  await writeFile(
    new URL("../src/data/seed-blogs.mjs", import.meta.url),
    `export const seedBlogs = ${JSON.stringify(blogs, null, 2)};\n`,
  );
  console.log(`Synced ${products.length} products and ${blogs.length} blog posts from ${baseUrl}.`);
} finally {
  await browser.close();
}