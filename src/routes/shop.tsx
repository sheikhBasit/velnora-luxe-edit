import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getProductsByCategory, categories } from "@/data/products";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { Reveal } from "@/components/velnora/Reveal";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [{ title: "Shop — Velnora" }],
  }),
});

function ShopPage() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const hash = window.location.hash?.replace(/^#/, "");
    const candidate = search.get("category") || hash || categories[0].id;
    const found = categories.find((c) => c.id === candidate.toLowerCase());
    setSelectedCategory(found ?? categories[0]);
  }, []);

  const products = getProductsByCategory(selectedCategory.id);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Reveal>
          <p className="eyebrow mb-4">
            {selectedCategory.index} — {selectedCategory.label}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">The {selectedCategory.label}</h1>
          <p className="text-muted-foreground max-w-lg mb-16">
            Curated selections, editor-tested and affiliate-linked to Amazon.
          </p>
        </Reveal>

        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className={`pill-btn text-xs h-9 px-5 whitespace-nowrap ${
                c.id === selectedCategory.id ? "" : "pill-btn-outline"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <article className="group flex flex-col">
                <Link to="/product/$id" params={{ id: product.id }}>
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-muted mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] bg-background px-2 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base mb-0.5">{product.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    {product.note}
                  </p>
                </Link>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="text-sm">{product.price}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          note: product.note,
                          price: product.price,
                          image: product.image,
                          amazonUrl: product.amazonUrl,
                        })
                      }
                      aria-label={`Add ${product.name} to bag`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 text-foreground transition hover:bg-foreground hover:text-background cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] border border-foreground/20 rounded-full px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                    >
                      Shop <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
