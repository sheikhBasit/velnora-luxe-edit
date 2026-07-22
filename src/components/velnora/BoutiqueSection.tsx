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
  const defaultRetailerUrl = "https://www.amazon.com/";
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
              <a href={featuredHref} target="_blank" rel="noopener noreferrer nofollow" className="block">
                <div className="aspect-[4/5] w-full overflow-hidden md:aspect-[5/4]">
                  <img
                    src={image}
                    alt={featured.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent p-6 md:p-10">
                  <div className="text-background">
                    <p className="text-[10px] uppercase tracking-[0.32em] opacity-80">{featured.tag}</p>
                    <h3 className="mt-2 font-serif text-2xl md:text-4xl">{featured.name}</h3>
                    <p className="mt-2 text-sm opacity-90">{`${featured.price} — View at Retailer`}</p>
                  </div>
                </div>
              </a>
              <a
                href={featuredHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="pill-btn pill-btn-outline absolute bottom-6 right-6 border-background text-background hover:bg-background hover:text-foreground"
              >
                View at Retailer
              </a>
            </article>
          </Reveal>

          <div className="lg:col-span-2 lg:[direction:ltr]">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {products.map((product, index) => {
                const href = product.retailerUrl ?? defaultRetailerUrl;

                return (
                  <Reveal key={product.name} delay={index * 80}>
                    <article className="group flex h-full flex-col">
                      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="block">
                        <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
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
                      </a>
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

