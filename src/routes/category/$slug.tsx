import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProductsByCategory, categories, type Product } from "@/data/products";
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
  const { category, products } = Route.useLoaderData() as {
    category: (typeof categories)[number];
    products: Product[];
  };
  const formatPriceLabel = (price: string) => `${price} — View at Retailer`;

  const filterOptions = categories.map((c) => ({ id: c.id, label: c.label, slug: c.id }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-32 md:px-12">
        <Reveal>
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Curated edit · {category.label.toUpperCase()}</p>
            <h1 className="mb-6 font-serif text-5xl leading-[0.95] md:text-7xl">The Edits</h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Curated selections, editor-tested and linked to retailer listings for reference.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-3 pb-2">
          {filterOptions.map((option) => {
            const isActive = option.slug === category.id;
            return (
              <Link
                key={option.id}
                to="/category/$slug"
                params={{ slug: option.slug }}
                className={`pill-btn h-10 px-5 text-[11px] uppercase tracking-[0.24em] whitespace-nowrap ${
                  isActive ? "" : "pill-btn-outline"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 60}>
              <article className="group flex flex-col">
                <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-sm bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-background px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-0.5 font-serif text-base">{product.name}</h3>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {product.note}
                  </p>
                </a>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="text-sm">{formatPriceLabel(product.price)}</span>
                  <a
                    href={product.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center gap-1.5 rounded-full border border-foreground/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-background"
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
