import { sql, ensureSchema } from "./db.js";
import { seedBlogs } from "../data/seed-blogs.mjs";

async function run() {
  await ensureSchema();

  for (const blog of seedBlogs) {
    await sql`
      insert into blogs (id, type, title, slug, category, excerpt, cover_image, video_url, content, prerequisites, steps, published, created_at)
      values (${blog.id}, ${blog.type}, ${blog.title}, ${blog.slug}, ${blog.category}, ${blog.excerpt}, ${blog.coverImage}, ${blog.videoUrl}, ${blog.content}, ${blog.prerequisites}, ${JSON.stringify(blog.steps)}::jsonb, ${blog.published}, ${blog.createdAt})
      on conflict (id) do update set
        type = excluded.type,
        title = excluded.title,
        slug = excluded.slug,
        category = excluded.category,
        excerpt = excluded.excerpt,
        cover_image = excluded.cover_image,
        video_url = excluded.video_url,
        content = excluded.content,
        prerequisites = excluded.prerequisites,
        steps = excluded.steps,
        published = excluded.published,
        created_at = excluded.created_at
    `;
  }

  console.log(`Seeded ${seedBlogs.length} live editorial posts.`);
}

run().catch(console.error);
