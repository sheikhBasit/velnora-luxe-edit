import { Reveal } from "./Reveal";

type ProductPreview = {
  id?: string;
  brandName?: string;
  name: string;
  note: string;
  price: string;
  image: string;
  retailerUrl?: string;
};

function ProductCard({ product, delay }: { product: ProductPreview; delay: number }) {
  const href = product.retailerUrl ?? "";
  return (
    <Reveal delay={delay} className="h-full">
      <article className="editorial-product-card group relative flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden rounded-md bg-muted shrink-0">
          <a href={href || undefined} target="_blank" rel="noopener noreferrer sponsored" className="product-card-link block h-full">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </a>
          <a
            href={href || undefined}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="product-card-cta pill-btn pointer-events-none absolute bottom-4 left-1/2 z-10 !h-10 w-[85%] max-w-[240px] !min-w-0 -translate-x-1/2 scale-95 !px-2 py-0 !text-[10px] sm:!text-[11px] font-semibold opacity-0 shadow-xl transition-[opacity,transform] duration-300 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
          >
            VIEW AT RETAILER
          </a>
        </div>
        <div className="mt-4 flex flex-1 items-baseline justify-between gap-2">
          <div>
            <h4 className="mb-0 font-serif text-base text-foreground">{product.name}</h4>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {product.brandName && (
                <>
                  <span className="font-bold">{product.brandName}</span>
                  {product.note ? " · " : ""}
                </>
              )}
              {product.note}
            </p>
          </div>
          <span className="font-sans text-sm text-foreground">{product.price}</span>
        </div>
      </article>
    </Reveal>
  );
}

export function BoutiqueSection({
  id,
  index,
  eyebrow,
  title,
  description,
  image,
  featured,
  products,
  reverse = false,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  featured: { id?: string; name: string; tag: string; price: string; retailerUrl?: string } | null;
  products: ProductPreview[];
  reverse?: boolean;
}) {
  const defaultRetailerUrl = "";
  const featuredHref = featured?.retailerUrl ?? defaultRetailerUrl;

  return (
    <section id={id} className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
        <Reveal>
          <div className="mb-14 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4">
                {index} — {eyebrow}
              </p>
              <h2 className="font-serif text-4xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
                {title}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
          </div>
        </Reveal>

        {featured ? (
          <div className={`grid gap-8 md:gap-10 lg:grid-cols-5 ${reverse ? "lg:[direction:rtl]" : ""}`}>
            <Reveal className="lg:col-span-3 lg:[direction:ltr] lg:h-full">
              <article className="group relative overflow-hidden rounded-md bg-muted lg:h-full">
                <a href={featuredHref || undefined} target="_blank" rel="noopener noreferrer sponsored" className="block lg:h-full">
                  {/* lg:h-full grows to match a taller sibling grid (e.g. a full 2x2 grid of 4 cards),
                      with min-h-[620px] as a floor so it never collapses for a sparse/empty grid. */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/4] lg:aspect-auto lg:h-full lg:min-h-[620px]">
                    <img
                      src={image}
                      alt={featured.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                  </div>
                </a>
              </article>
            </Reveal>

            <div className="lg:col-span-2 lg:[direction:ltr]">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.name} product={product} delay={i * 80} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Categories with 3 or fewer products skip the hero photo entirely — with so few
          // products, one occupying the whole hero slot left barely anything for the grid.
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.name} product={product} delay={i * 80} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

