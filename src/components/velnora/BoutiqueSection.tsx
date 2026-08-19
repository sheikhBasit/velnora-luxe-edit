import { Reveal } from "./Reveal";

type ProductPreview = {
  id?: string;
  name: string;
  note: string;
  price: string;
  image: string;
  retailerUrl?: string;
};

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
  featured: { id?: string; name: string; tag: string; price: string; retailerUrl?: string };
  products: ProductPreview[];
  reverse?: boolean;
}) {
  const defaultRetailerUrl = "";
  const featuredHref = featured.retailerUrl ?? defaultRetailerUrl;

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

        <div className={`grid gap-8 md:gap-10 lg:grid-cols-5 ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <Reveal className="lg:col-span-3 lg:[direction:ltr]">
            <article className="group relative overflow-hidden rounded-sm bg-muted">
              <a href={featuredHref || undefined} target="_blank" rel="noopener noreferrer sponsored" className="block">
                <div className="aspect-[4/5] w-full overflow-hidden md:aspect-[5/4]">
                  <img
                    src={image}
                    alt={featured.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                </div>
              </a>
            </article>
          </Reveal>

          <div className="lg:col-span-2 lg:[direction:ltr]">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {products.map((product, index) => {
                const href = product.retailerUrl ?? defaultRetailerUrl;

                return (
                  <Reveal key={product.name} delay={index * 80}>
                    <article className="group relative flex h-full flex-col">
                      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                        <a
                          href={href || undefined}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="product-card-link block h-full"
                        >
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
                          className="product-card-cta pill-btn pill-btn-outline absolute bottom-3 left-1/2 z-10 -translate-x-1/2 border-foreground bg-background px-4 py-2 text-[10px] text-foreground opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 hover:!bg-foreground hover:!text-background"
                        >
                          VIEW AT RETAILER
                        </a>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-base text-foreground">{product.name}</h4>
                          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            {product.note}
                          </p>
                        </div>
                        <span className="font-sans text-sm text-foreground">{product.price}</span>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

