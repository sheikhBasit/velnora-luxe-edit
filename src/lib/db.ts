import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

// Bootstraps the products table on first use so a fresh production database (env vars connected,
// migration never run) self-heals on the first request instead of 500ing. Memoized per cold start
// since `create table if not exists` is cheap but no need to re-run it on every query.
let schemaReady: Promise<void> | null = null;
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = sql`
      create table if not exists products (
        id           text primary key,
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
        sort_order   int not null default 0,
        created_at   timestamptz not null default now()
      )
    `.then(() => undefined);
  }
  return schemaReady;
}
