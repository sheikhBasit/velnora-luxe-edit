import { Send } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "oklch(0.16 0.003 0)" }} className="text-background">
      <div className="mx-auto max-w-[1400px] px-6 py-24 text-center md:px-12 md:py-32">
        <p className="text-[10px] uppercase tracking-[0.4em] text-background/50">The House of</p>
        <h2 className="mt-6 font-serif text-5xl tracking-[0.18em] md:text-7xl">VELNORA</h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-background/70">
          Join the Glow List. Private editorials, first looks, and curator's notes — delivered with intention.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-10 flex max-w-lg items-center border-b border-background/30 pb-2"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="w-full bg-transparent px-2 py-3 text-sm text-background placeholder:text-background/40 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-background/80 transition hover:bg-background/10 hover:text-background"
          >
            <Send className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </form>

        <nav className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[11px] uppercase tracking-[0.28em] text-background/70">
          <a href="#" className="hover:text-background transition">Shop</a>
          <a href="#" className="hover:text-background transition">About</a>
          <a href="#" className="hover:text-background transition">Disclosure</a>
          <a href="#" className="hover:text-background transition">Contact</a>
        </nav>

        <div className="mt-16 border-t border-background/10 pt-8 text-[11px] leading-relaxed text-background/45">
          <p>Amazon Associate &amp; Skimlinks partner. Earnings via qualifying purchases.</p>
          <p className="mt-2">© {new Date().getFullYear()} Velnora — A Curated House of Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
