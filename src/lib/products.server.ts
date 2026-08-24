import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { put } from "@vercel/blob";
import { sql, ensureSchema } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth.server";
import { seedProducts } from "@/data/seed-products.mjs";
import type { Product } from "@/data/products";

export const seedStarterCatalog = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  await ensureSchema();
  let inserted = 0;
  for (const p of seedProducts) {
    const rows = await sql`
      insert into products (id, brand_name, name, note, price, image, category, retailer_url, description, features, badge, featured, show_on_editorial, sort_order)
      values (${p.id}, ${p.brandName ?? ""}, ${p.name}, ${p.note}, ${p.price}, ${p.image}, ${p.category}, ${p.retailerUrl}, ${p.description}, ${p.features}, ${p.badge ?? null}, ${p.featured}, ${p.showOnEditorial ?? true}, ${p.sortOrder})
      on conflict (id) do nothing
      returning id
    `;
    if (rows.length) inserted++;
  }
  return { inserted };
});

export const uploadProductImage = createServerFn({ method: "POST" })
  .inputValidator(z.object({ filename: z.string().min(1), dataUrl: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const match = data.dataUrl.match(/^data:(.+?);base64,(.+)$/);
    if (!match) throw new Error("Invalid image data");
    const [, contentType, base64] = match;
    const { url } = await put(data.filename, Buffer.from(base64, "base64"), {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });
    return { url };
  });

type ProductRow = {
  id: string;
  brand_name: string | null;
  name: string;
  note: string;
  price: string;
  image: string;
  category: string;
  retailer_url: string;
  description: string;
  features: string[];
  badge: string | null;
  featured: boolean;
  show_on_editorial: boolean;
  sort_order: number;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    brandName: row.brand_name ?? "",
    name: row.name,
    note: row.note,
    price: row.price,
    image: row.image,
    category: row.category,
    retailerUrl: row.retailer_url,
    description: row.description,
    features: row.features,
    badge: row.badge ?? undefined,
    featured: row.featured,
    showOnEditorial: row.show_on_editorial,
    sortOrder: row.sort_order,
  };
}

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator(z.object({ category: z.string().optional() }).optional())
  .handler(async ({ data }) => {
    if (!process.env.DATABASE_URL) {
      return data?.category
        ? seedProducts.filter((product) => product.category === data.category)
        : seedProducts;
    }
    await ensureSchema();
    const rows = data?.category
      ? await sql`select * from products where category = ${data.category} order by sort_order, name`
      : await sql`select * from products order by sort_order, name`;
    return (rows as ProductRow[]).map(rowToProduct);
  });

export const getProductById = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    if (!process.env.DATABASE_URL) {
      return seedProducts.find((product) => product.id === id) ?? null;
    }
    await ensureSchema();
    const rows = (await sql`select * from products where id = ${id}`) as ProductRow[];
    return rows[0] ? rowToProduct(rows[0]) : null;
  });

const productInput = z.object({
  id: z.string().min(1),
  brandName: z.string().default(""),
  name: z.string().min(1),
  note: z.string().default(""),
  price: z.string().default(""),
  image: z.string().default(""),
  category: z.string().min(1),
  retailerUrl: z.string().default(""),
  description: z.string().default(""),
  features: z.array(z.string()).default([]),
  badge: z.string().optional(),
  featured: z.boolean().default(false),
  showOnEditorial: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const saveProduct = createServerFn({ method: "POST" })
  .inputValidator(productInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureSchema();
    const rows = (await sql`
      insert into products (id, brand_name, name, note, price, image, category, retailer_url, description, features, badge, featured, show_on_editorial, sort_order)
      values (${data.id}, ${data.brandName}, ${data.name}, ${data.note}, ${data.price}, ${data.image}, ${data.category}, ${data.retailerUrl}, ${data.description}, ${data.features}, ${data.badge ?? null}, ${data.featured}, ${data.showOnEditorial}, ${data.sortOrder})
      on conflict (id) do update set
        brand_name = excluded.brand_name,
        name = excluded.name,
        note = excluded.note,
        price = excluded.price,
        image = excluded.image,
        category = excluded.category,
        retailer_url = excluded.retailer_url,
        description = excluded.description,
        features = excluded.features,
        badge = excluded.badge,
        featured = excluded.featured,
        show_on_editorial = excluded.show_on_editorial,
        sort_order = excluded.sort_order
      returning *
    `) as ProductRow[];
    return rowToProduct(rows[0]);
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    await requireAdmin();
    await sql`delete from products where id = ${id}`;
  });
