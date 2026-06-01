import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getProduct } from "@/data/products";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { ExternalLink, Check, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    return {
      meta: [
        { title: `${product?.name ?? "Product"} — Velnora` },
        {
          name: "description",
          content: product?.description ?? "Curated luxury beauty product.",
        },
        { property: "og:title", content: `${product?.name ?? "Product"} — Velnora` },
        {
          property: "og:description",
          content: product?.description ?? "Curated luxury beauty product.",
        },
        { property: "og:image", content: product?.image },
      ],
    };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto">
        <Link
          to="/category/$slug"
          params={{ slug: product.category }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-12 hover:text-foreground transition"
        >
          <ArrowLeft className="h-3 w-3" /> Back to {product.category}
        </Link>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="aspect-square overflow-hidden rounded-sm bg-muted">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            {product.badge && <p className="eyebrow mb-4">{product.badge}</p>}
            <h1 className="font-serif text-4xl md:text-5xl mb-3">{product.name}</h1>
            <p className="text-muted-foreground text-sm mb-6">{product.note}</p>
            <p className="font-serif text-3xl mb-8">{product.price}</p>
            <p className="text-sm leading-relaxed text-muted-foreground mb-8">
              {product.description}
            </p>
            <ul className="mb-10 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {f}
                </li>
              ))}
            </ul>
            {/* THE MONEY BUTTON */}
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="pill-btn inline-flex items-center gap-2 w-fit"
            >
              Shop on Amazon <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <p className="mt-4 text-[10px] text-muted-foreground">
              As an Amazon Associate, Velnora earns from qualifying purchases.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
