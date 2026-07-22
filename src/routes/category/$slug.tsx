import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProductsByCategory, categories } from "@/data/products";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { Reveal } from "@/components/velnora/Reveal";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => {
    const cat = categories.find((c) => c.id === params.slug);
    return {
      meta: [{ title: `${cat?.label ?? "Category"} — Velnora` }],
    };
  },
  loader: ({ params }) => {
    const cat = categories.find((c) => c.id === params.slug);
    if (!cat) throw notFound();
    return { category: cat, products: getProductsByCategory(params.slug) };
  },
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  const formatPriceLabel = (price: string) => {
    return `${price} — View at Retailer`;
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
        <Reveal>
          <p className="eyebrow mb-4">{category.index} — {category.label}</p>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">The {category.label}</h1>
          <p className="text-muted-foreground max-w-lg mb-16">
            Curated selections, editor-tested and linked to retailer listings for reference.
          </p>
        </Reveal>

        {/* Filter bar (optional) */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/category/$slug"
              params={{ slug: c.id }}
              className={`pill-btn text-xs h-9 px-5 whitespace-nowrap ${
                c.id === category.id ? "" : "pill-btn-outline"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <article className="group flex flex-col">
                <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer nofollow" className="block">
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
                </a>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="text-sm">{formatPriceLabel(product.price)}</span>
                  <a
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] border border-foreground/20 rounded-full px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                  >
                    View at Retailer <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                  </a>
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
