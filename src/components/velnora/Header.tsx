import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: solid ? "var(--color-background)" : "transparent",
        borderBottom: solid ? "1px solid var(--color-border)" : "1px solid transparent",
        backdropFilter: solid ? "saturate(140%) blur(8px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-12">
        <a href="#" className="font-serif text-2xl tracking-[0.2em] text-foreground md:text-[28px]">
          VELNORA
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          <a href="#makeup" className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition">Shop</a>
          <a href="#about" className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition">About</a>
          <a href="#editorial" className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition">Editorial</a>
        </nav>
        <button
          aria-label="Shopping bag"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-foreground transition hover:bg-foreground hover:text-background"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">2</span>
        </button>
      </div>
    </header>
  );
}
