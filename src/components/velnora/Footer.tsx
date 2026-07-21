import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function Footer() {
  const [disclosureOpen, setDisclosureOpen] = useState(false);

  return (
    <footer style={{ backgroundColor: "oklch(0.16 0.003 0)" }} className="text-background">
      <div className="mx-auto max-w-[1400px] px-6 py-24 text-center md:px-12 md:py-32">
        <p className="text-[10px] uppercase tracking-[0.4em] text-background/50">The House of</p>
        <h2 className="mt-6 font-serif text-5xl tracking-[0.18em] md:text-7xl">VELNORA</h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-background/70">
          Join the Glow List. Private editorials, first looks, and curator's notes — delivered with
          intention.
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
            Subscribe
          </button>
        </form>

        <nav className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 text-[11px] uppercase tracking-[0.28em] text-background/70">
<<<<<<< HEAD
          <a href="/category/makeup" className="hover:text-background transition">
            Shop
          </a>
          <a href="/#about" className="hover:text-background transition">
            About
          </a>
          <button
            type="button"
            onClick={() => setDisclosureOpen(true)}
            className="hover:text-background transition"
          >
            Disclosure
          </button>
          <a href="mailto:hello@velnora.com" className="hover:text-background transition">
            Contact
          </a>
=======
          <a href="#" className="hover:text-background transition">The Edits</a>
          <a href="#" className="hover:text-background transition">About</a>
          <a href="#" className="hover:text-background transition">Disclosure</a>
          <a href="#" className="hover:text-background transition">Contact</a>
>>>>>>> 4a85e38 (Refine site to editorial beauty curation UI)
        </nav>

        <div className="mt-16 border-t border-background/10 pt-8 text-[11px] leading-relaxed text-background/45">
          <p>
            As an Amazon Associate, I earn from qualifying purchases. VELNORA is an independent
            curation and a Skimlinks partner.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} velnora — curated beauty edit. all rights reserved.</p>
        </div>
      </div>

      <Dialog open={disclosureOpen} onOpenChange={setDisclosureOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Disclosure</DialogTitle>
          <DialogDescription className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              As an Amazon Associate, I earn from qualifying purchases. VELNORA is an independent
              curation and a Skimlinks partner.
            </p>
            <p>
              This editorial is produced independently and is not a storefront. The selections shown
              represent a curated beauty edit, and affiliate partnerships allow the Maison to
              publish without pay-to-play placement.
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
