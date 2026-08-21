import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type AdminSessionData = { isAdmin: boolean };

// Not a React hook despite the name — it's a TanStack Start server utility for reading/sealing
// the session cookie for the current request. Wrapped in createServerOnlyFn so the compiler
// strips this (and its @tanstack/react-start/server import) from the client bundle — a plain
// top-level function using useSession isn't enough for the import-protection plugin.
const adminSession = createServerOnlyFn(function adminSession() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<AdminSessionData>({ password: secret, name: "velnora_admin" });
});

async function timingSafeEqual(a: string, b: string) {
  const enc = new TextEncoder();
  const [digestA, digestB] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const bytesA = new Uint8Array(digestA);
  const bytesB = new Uint8Array(digestB);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) diff |= bytesA[i] ^ bytesB[i];
  return diff === 0;
}

export const login = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string() }))
  .handler(async ({ data }) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) throw new Error("ADMIN_PASSWORD is not set");

    const ok = await timingSafeEqual(data.password, adminPassword);
    if (!ok) throw new Error("Incorrect password");

    const session = await adminSession();
    await session.update({ isAdmin: true });
    return { ok: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await adminSession();
  await session.clear();
});

export const checkAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await adminSession();
  return session.data.isAdmin === true;
});

export async function requireAdmin() {
  const session = await adminSession();
  if (session.data.isAdmin !== true) {
    throw new Error("Not authenticated");
  }
}
