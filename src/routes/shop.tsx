import { useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getProductsByCategory, categories } from "@/data/products";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { Reveal } from "@/components/velnora/Reveal";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [{ title: "Shop — Velnora" }],
  }),
});

function ShopPage() {
  const pillListRef = useRef<HTMLDivElement>(null);

  const normalizeCategoryParam = (value?: string) => {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();

    const aliasMap: Record<string, string> = {
      makeup: "makeup",
      "makeup-suite": "makeup",
      skincare: "skincare",
      "skincare-sanctuary": "skincare",
      hair: "hair",
      "hair-lab": "hair",
      body: "body",
      bath: "body",
      "bath-body": "body",
      "bath-and-body": "body",
      tools: "tools",
      "tool-box": "tools",
      fragrance: "fragrance",
      wellness: "wellness",
      tech: "tech",
      "beauty-tech": "tech",
    };

    return aliasMap[normalized] ?? normalized;
  };

  const getSelectedCategoryId = () => {
    if (typeof window === "undefined") return categories[0].id;

    const search = new URLSearchParams(window.location.search);
    const categoryFromQuery = normalizeCategoryParam(search.get("category") ?? undefined);
    if (categoryFromQuery) return categoryFromQuery;

    const hash = window.location.hash?.replace(/^#/, "");
    return normalizeCategoryParam(hash) ?? categories[0].id;
  };

  const selectedCategory =
    categories.find((c) => c.id === getSelectedCategoryId()) ?? categories[0];

  useEffect(() => {
    const pill = document.getElementById(`shop-pill-${selectedCategory.id}`);
    if (pill) {
      pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedCategory.id]);

  const products = getProductsByCategory(selectedCategory.id);

  return (
    <main className="bg-background text-foreground">
      <Header hideMobileBottomNav />
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

        <div className="flex gap-3 mb-12 overflow-x-auto pb-2 no-scrollbar" ref={pillListRef}>
          {categories.map((c) => (
            <Link
              key={c.id}
              id={`shop-pill-${c.id}`}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <article className="group flex flex-col">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-sm bg-muted">
                  <Link to="/product/$id" params={{ id: product.id }} className="block h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <a
                    href={product.amazonUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="product-card-cta pill-btn pill-btn-outline absolute bottom-3 left-1/2 z-10 -translate-x-1/2 border-foreground bg-background px-4 py-2 text-[10px] text-foreground opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 hover:!bg-foreground hover:!text-background"
                  >
                    VIEW AT RETAILER
                  </a>
                </div>
                <Link to="/product/$id" params={{ id: product.id }}>
                  <h3 className="mb-0.5 font-serif text-base">{product.name}</h3>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {product.note}
                  </p>
                  <span className="text-sm text-foreground/80">{product.price}</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
