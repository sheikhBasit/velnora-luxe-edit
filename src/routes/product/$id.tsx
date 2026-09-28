import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getProductById } from "@/lib/products.server";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { categories } from "@/data/products";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  loader: async ({ params }) => {
    const product = await getProductById({ data: params.id });
    if (!product) throw notFound();
    return { product };
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const category = categories.find((item) => item.id === product.category);
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />
      <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-28 sm:px-8 md:px-12 md:pb-24 md:pt-32">
        <Link
          to="/category/$slug"
          params={{ slug: product.category }}
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground md:mb-12"
        >
          <ArrowLeft className="h-3 w-3" /> Back to {category?.label ?? product.category}
        </Link>

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="aspect-square overflow-hidden rounded-sm bg-muted">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col items-start py-1 md:py-6">
            <p className="eyebrow mb-4">{category?.label ?? product.category}</p>
            {product.brandName && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {product.brandName}
              </p>
            )}
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            {product.note && <p className="mt-3 text-sm text-muted-foreground">{product.note}</p>}
            <p className="mt-6 text-lg font-medium">{product.price}</p>
            {product.description && (
              <p className="mt-6 max-w-prose text-sm leading-7 text-muted-foreground sm:text-base">
                {product.description}
              </p>
            )}
            {product.features.length > 0 && (
              <ul className="mt-6 grid gap-2 text-sm text-muted-foreground">
                {product.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            )}
            {product.retailerUrl && (
              <a
                href={product.retailerUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="pill-btn mt-8 inline-flex w-full gap-2 sm:w-auto"
              >
                View at retailer <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
