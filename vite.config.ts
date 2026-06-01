// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = !!process.env.VERCEL;

// On Vercel, load the nitro/vite plugin for serverless deployment.
// On Cloudflare, the lovable wrapper handles @cloudflare/vite-plugin automatically.
const nitroPlugin = isVercel ? await import("nitro/vite").then((m) => m.nitro()) : null;

export default defineConfig({
  tanstackStart: {
    // On Vercel, use default server entry (nitro handles it).
    // On Cloudflare, use our custom SSR error wrapper.
    server: isVercel ? {} : { entry: "server" },
  },
  // Disable Cloudflare plugin on Vercel; nitro handles deployment instead.
  cloudflare: isVercel ? false : true,
  // Inject nitro plugin for Vercel builds via the standard Vite plugins array.
  vite: nitroPlugin
    ? {
        plugins: [nitroPlugin],
      }
    : {},
});
