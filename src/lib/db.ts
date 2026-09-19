import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL ?? "postgresql://localhost/velnora");

// Bootstraps the products table on first use so a fresh production database (env vars connected,
// migration never run) self-heals on the first request instead of 500ing. Memoized per cold start
// since `create table if not exists` is cheap but no need to re-run it on every query.
let schemaReady: Promise<void> | null = null;
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = sql`
      create table if not exists products (
        id           text primary key,
        brand_name   text not null default '',
        name         text not null,
        note         text not null default '',
        price        text not null default '',
        image        text not null default '',
        category     text not null,
        retailer_url text not null default '',
        description  text not null default '',
        features     text[] not null default '{}',
        badge        text,
        featured     boolean not null default false,
        show_on_editorial boolean not null default true,
        sort_order   int not null default 0,
        created_at   timestamptz not null default now()
      )
    `.then(async () => {
      await sql`alter table products add column if not exists brand_name text not null default ''`;
      await sql`alter table products add column if not exists show_on_editorial boolean not null default true`;
      await sql`
        create table if not exists blogs (
          id           text primary key,
          title        text not null,
          slug         text not null unique,
          category     text not null,
          excerpt      text not null,
          cover_image  text not null,
          video_url    text,
          content      text not null,
          published    boolean not null default true,
          type         text not null default 'blog',
          prerequisites text[] not null default '{}',
          steps        jsonb not null default '[]',
          created_at   timestamptz not null default now()
        )
      `;
      await sql`alter table blogs add column if not exists published boolean not null default true`;
      await sql`alter table blogs add column if not exists type text not null default 'blog'`;
      await sql`alter table blogs add column if not exists prerequisites text[] not null default '{}'`;
      await sql`alter table blogs add column if not exists steps jsonb not null default '[]'`;
      await sql`alter table blogs add column if not exists video_url text`;

      await sql`
        create table if not exists site_settings (
          key text primary key,
          value text not null
        )
      `;
    });
  }
  return schemaReady;
}
