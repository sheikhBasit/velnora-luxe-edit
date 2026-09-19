import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sql, ensureSchema } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth.server";

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  if (!process.env.DATABASE_URL) return {};
  await ensureSchema();
  const rows = await sql`select key, value from site_settings`;
  const settings: Record<string, string> = {};
  for (const row of rows as { key: string; value: string }[]) {
    settings[row.key] = row.value;
  }
  return settings;
});

export const saveSiteSettings = createServerFn({ method: "POST" })
  .inputValidator(z.record(z.string()))
  .handler(async ({ data }) => {
    await requireAdmin();
    await ensureSchema();
    for (const [key, value] of Object.entries(data)) {
      await sql`
        insert into site_settings (key, value)
        values (${key}, ${value})
        on conflict (key) do update set value = excluded.value
      `;
    }
    return { success: true };
  });
