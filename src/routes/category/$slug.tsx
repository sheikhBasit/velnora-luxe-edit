import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProductsByCategory, categories, type Product } from "@/data/products";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { Reveal } from "@/components/velnora/Reveal";
import { Link } from "@tanstack/react-router";

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
                <div className="relative mb-4 aspect-square overflow-hidden rounded-sm bg-muted">
                  <a href={product.amazonUrl || undefined} target="_blank" rel="noopener noreferrer sponsored" className="block h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </a>
                  <a
                    href={product.amazonUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="product-card-cta pill-btn pill-btn-outline absolute bottom-3 left-1/2 z-10 -translate-x-1/2 border-foreground bg-background px-4 py-2 text-[10px] text-foreground opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 hover:!bg-foreground hover:!text-background"
                  >
                    VIEW AT RETAILER
                  </a>
                </div>
                <a href={product.amazonUrl || undefined} target="_blank" rel="noopener noreferrer sponsored" className="block">
                  <h3 className="mb-0.5 font-serif text-base">{product.name}</h3>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {product.note}
                  </p>
                  <span className="text-sm">{product.price}</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
