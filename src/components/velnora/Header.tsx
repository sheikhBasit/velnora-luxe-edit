import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

type HeaderProps = {
  hideMobileBottomNav?: boolean;
};

export function Header({ hideMobileBottomNav }: HeaderProps) {
  const [solid, setSolid] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;
    searchInputRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSearchOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSearchOpen]);

  return (
    <header
      className="pointer-events-auto fixed left-0 right-0 top-0 z-50 transition-all duration-500"
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
              className="text-xs uppercase tracking-[0.2em] text-foreground/80 transition hover:text-foreground"
            >
              The Edits
            </Link>
            <a href="/#about" className="text-xs uppercase tracking-[0.2em] text-foreground/80 transition hover:text-foreground">
              About
            </a>
            <a href="/#editorial" className="text-xs uppercase tracking-[0.2em] text-foreground/80 transition hover:text-foreground">
              Editorial
            </a>
          </nav>

          <button
            type="button"
            aria-label="Search"
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-[#1a1a1a] transition-opacity duration-200 hover:opacity-70 active:opacity-50 focus:outline-none md:ml-0"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] justify-end px-6 pb-3 md:px-12">
        <div
          className={`w-full max-w-md overflow-hidden rounded-full border border-border/70 bg-background/95 shadow-sm backdrop-blur transition-all duration-300 ${
            isSearchOpen ? "max-h-14 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <label className="flex items-center gap-3 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              type="search"
              placeholder="Search the edit"
              className="w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </div>
    </header>
  );
}
