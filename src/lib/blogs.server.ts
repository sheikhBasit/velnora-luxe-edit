import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sql, ensureSchema } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth.server";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  content: string;
  createdAt: string;
};

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  cover_image: string;
  content: string;
  created_at: Date;
};

function rowToBlog(row: BlogRow): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    coverImage: row.cover_image,
    content: row.content,
    createdAt: row.created_at.toISOString(),
  };
}

export const listBlogs = createServerFn({ method: "GET" }).handler(async () => {
  if (!process.env.DATABASE_URL) return [];
  await ensureSchema();
  const rows = await sql`select * from blogs order by created_at desc`;
  return (rows as BlogRow[]).map(rowToBlog);
});

export const getBlogBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: slug }) => {
    if (!process.env.DATABASE_URL) return null;
    await ensureSchema();
    const rows = await sql`select * from blogs where slug = ${slug}`;
    return (rows as BlogRow[])[0] ? rowToBlog((rows as BlogRow[])[0]) : null;
  });

export const getBlogById = createServerFn({ method: "GET" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    if (!process.env.DATABASE_URL) return null;
    await ensureSchema();
    const rows = await sql`select * from blogs where id = ${id}`;
    return (rows as BlogRow[])[0] ? rowToBlog((rows as BlogRow[])[0]) : null;
  });

const blogInput = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string().default(""),
  coverImage: z.string().default(""),
  content: z.string().default(""),
});

import { put } from "@vercel/blob";

export const uploadBlogImage = createServerFn({ method: "POST" })
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

export const saveBlog = createServerFn({ method: "POST" })
  .inputValidator(blogInput)
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureSchema();
    const rows = await sql`
      insert into blogs (id, title, slug, category, excerpt, cover_image, content)
      values (${data.id}, ${data.title}, ${data.slug}, ${data.category}, ${data.excerpt}, ${data.coverImage}, ${data.content})
      on conflict (id) do update set
        title = excluded.title,
        slug = excluded.slug,
        category = excluded.category,
        excerpt = excluded.excerpt,
        cover_image = excluded.cover_image,
        content = excluded.content
      returning *
    `;
    return rowToBlog((rows as BlogRow[])[0]);
  });

export const deleteBlog = createServerFn({ method: "POST" })
  .inputValidator(z.string())
  .handler(async ({ data: id }) => {
    await requireAdmin();
    await ensureSchema();
    await sql`delete from blogs where id = ${id}`;
  });
