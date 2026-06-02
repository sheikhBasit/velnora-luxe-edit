import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/velnora/CartDrawer";

export function Header() {
  const [solid, setSolid] = useState(false);
  const { cartItems, openCart } = useCart();

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <a
              href="/#editorial"
              className="text-xs uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground transition"
            >
              Editorial
            </a>
          </nav>
          <button
            type="button"
            onClick={openCart}
            aria-label="Shopping bag"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-foreground transition hover:bg-foreground hover:text-background pointer-events-auto cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
              {totalQuantity}
            </span>
          </button>
        </div>
      </header>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-3 md:hidden">
        <div className="flex items-center gap-3 rounded-full border border-foreground/10 bg-[#f4f0e6]/70 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-foreground/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <Link to="/" className="transition hover:text-foreground">
            Editorial
          </Link>
          <span className="text-foreground/50">•</span>
          <Link to="/shop" className="transition hover:text-foreground">
            Shop
          </Link>
          <span className="text-foreground/50">•</span>
          <a href="/shop#search" className="transition hover:text-foreground">
            Search
          </a>
        </div>
      </nav>
      <CartDrawer />
    </>
  );
}
