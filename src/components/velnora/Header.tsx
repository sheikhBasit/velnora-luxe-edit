import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

export function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-auto"
      style={{
        backgroundColor: solid ? "var(--color-background)" : "rgba(255,255,255,0.78)",
        borderBottom: solid ? "1px solid var(--color-border)" : "1px solid transparent",
        backdropFilter: "saturate(140%) blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-12">
        <Link
          to="/"
          className="font-serif text-2xl tracking-[0.2em] text-foreground md:text-[28px]"
          aria-label="Velnora homepage"
        >
          VELNORA
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-10 md:flex">
            <Link
              to="/category/$slug"
              params={{ slug: "makeup" }}
              className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition"
            >
              The Edits
            </Link>
            <a href="/#about" className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition">
              About
            </a>
            <a href="/#editorial" className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition">
              Editorial
            </a>
          </nav>

          <button
            type="button"
            aria-label="Open search"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-[#1a1a1a] transition-opacity duration-200 hover:opacity-70 active:opacity-50 focus:outline-none md:ml-0"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
