import { neon } from "@neondatabase/serverless";
import { seedProducts } from "../src/data/seed-products.mjs";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env scripts/db-setup.mjs");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

await sql`
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
`;

let inserted = 0;
for (const p of seedProducts) {
  const rows = await sql`
    insert into products (id, name, note, price, image, category, retailer_url, description, features, badge, featured, sort_order)
    values (${p.id}, ${p.name}, ${p.note}, ${p.price}, ${p.image}, ${p.category}, ${p.retailerUrl}, ${p.description}, ${p.features}, ${p.badge ?? null}, ${p.featured}, ${p.sortOrder})
    on conflict (id) do nothing
    returning id
  `;
  if (rows.length) inserted++;
}

const [{ count }] = await sql`select count(*)::int as count from products`;
console.log(`Inserted ${inserted} new rows. Table now has ${count} products.`);
