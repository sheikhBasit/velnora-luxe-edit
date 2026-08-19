import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getProduct } from "@/data/products";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
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
          <a
            href={product.amazonUrl || undefined}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block aspect-square overflow-hidden rounded-sm bg-muted md:col-span-2"
          >
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
