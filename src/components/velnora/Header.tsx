import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

export function Header() {
  const [solid, setSolid] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isSearchVisible) return;
    searchInputRef.current?.focus();
  }, [isSearchVisible]);

  useEffect(() => {
    if (!isSearchVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchVisible]);

  useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const openSearch = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setIsSearchVisible(true);
    openTimer.current = window.setTimeout(() => setIsSearchActive(true), 10);
  };

  const closeSearch = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    setIsSearchActive(false);
    closeTimer.current = window.setTimeout(() => setIsSearchVisible(false), 300);
  };

  return (
    <>
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
                Shop
              </Link>
              <a
                href="/#about"
                className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition"
              >
                About
              </a>
              <Link
                to="/"
                className="nav-editorial text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition"
              >
                Editorial
              </Link>
            </nav>

            <button
              type="button"
              onClick={openSearch}
              aria-label="Open search"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-[#1a1a1a] transition-opacity duration-200 hover:opacity-70 active:opacity-50 focus:outline-none md:ml-0"
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {isSearchVisible ? (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[rgba(250,247,242,0.98)] p-6 transition-opacity duration-300 ease-in-out ${
            isSearchActive ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-[#1a1a1a] transition-opacity duration-200 hover:opacity-70 active:opacity-50 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-full text-center">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              className="w-[85%] md:w-[50%] border-b border-[#1a1a1a] bg-transparent px-0 pb-2 text-[1.45rem] font-medium text-[#1a1a1a] placeholder:text-[#1a1a1a]/50 focus:outline-none focus:ring-0 sm:text-[2rem]"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
