import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = "https://www.velnorabeauty.store";
const coverFallbacks = {
  skincare: "/assets/products/skincare-1.jpg",
};
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

try {
  await page.goto(`${baseUrl}/blog`, { waitUntil: "networkidle" });
  const listings = await page.locator("main article").evaluateAll((articles) =>
    articles.map((article) => {
      const title = article.querySelector("h1, h2, h3")?.textContent?.trim() ?? "";
      const links = [...article.querySelectorAll("a[href]")].map((link) => ({
        href: link.href,
        url: new URL(link.href),
      }));
      const blogLink = links.find(
        ({ url }) => url.hostname.endsWith("velnorabeauty.store") && url.pathname.startsWith("/blog/"),
      );
      const image = article.querySelector("img");
      const retailerLink = links.find(
        ({ url }) => url.protocol.startsWith("http") && !url.hostname.endsWith("velnorabeauty.store"),
      )?.href ?? "";

      return {
        title,
        slug: blogLink?.url.pathname.split("/").filter(Boolean).at(-1) ?? "",
        category: article.querySelector("p")?.textContent?.trim().toLowerCase() ?? "",
        excerpt: [...article.querySelectorAll("p")].at(-1)?.textContent?.trim() ?? "",
        coverImage: image?.src ?? "",
        retailerLink,
      };
    }),
  );

  const blogs = [];
  for (const listing of listings) {
    const slug = listing.slug || slugify(listing.title);
    const response = await page.goto(`${baseUrl}/blog/${slug}`, { waitUntil: "networkidle" });
    if (!response?.ok()) throw new Error(`Unable to fetch blog "${listing.title}" (${response?.status() ?? "no response"})`);

    const detail = await page.locator("main article").evaluate((article) => {
      const header = article.querySelector("header");
      const hero = header?.nextElementSibling;
      const content = hero?.nextElementSibling;
      const image = hero?.querySelector("img");
      const video = hero?.querySelector("video");

      return {
        title: header?.querySelector("h1")?.textContent?.trim() ?? "",
        category: header?.querySelector("span")?.textContent?.trim().toLowerCase() ?? "",
        excerpt: header?.querySelector("p")?.textContent?.trim() ?? "",
        coverImage: image?.src ?? "",
        bodyImage: content?.querySelector("img")?.src ?? "",
        videoUrl: video?.src ?? "",
        content: content?.innerHTML?.trim() ?? "",
        createdAt: header?.querySelector("time")?.getAttribute("datetime") ?? "",
      };
    });

    if (!detail.title || detail.title !== listing.title || !detail.content) {
      throw new Error(`Incomplete or mismatched article content for "${listing.title}"`);
    }

    blogs.push({
      id: slug,
      type: "blog",
      title: detail.title,
      slug,
      retailerLink: listing.retailerLink,
      category: detail.category || listing.category,
      excerpt: detail.excerpt || listing.excerpt,
      coverImage: detail.coverImage || detail.bodyImage || listing.coverImage || coverFallbacks[listing.category] || "",
      videoUrl: detail.videoUrl,
      content: detail.content,
      prerequisites: [],
      steps: [],
      published: true,
      sortOrder: 0,
      createdAt: detail.createdAt,
    });
  }

  if (blogs.length !== listings.length || blogs.length === 0) {
    throw new Error(`Expected ${listings.length} published posts, fetched ${blogs.length}`);
  }

  blogs.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  blogs.forEach((blog, index) => {
    blog.sortOrder = index;
  });

  await writeFile(
    new URL("../src/data/seed-blogs.mjs", import.meta.url),
    `export const seedBlogs = ${JSON.stringify(blogs, null, 2)};\n`,
  );
  console.log(`Synced ${blogs.length} published blog posts from ${baseUrl}.`);
} finally {
  await browser.close();
}
