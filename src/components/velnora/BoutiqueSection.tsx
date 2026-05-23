import { Plus } from "lucide-react";
import { Reveal } from "./Reveal";
import { Link } from "@tanstack/react-router";

export type Product = { id?: string; name: string; note: string; price: string; image: string };

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
  featured: { id?: string; name: string; tag: string; price: string };
  products: Product[];
  reverse?: boolean;
}) {
  return (
    <section id={id} className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
        {/* Section header */}
        <Reveal>
          <div className="mb-14 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4">{index} — {eyebrow}</p>
              <h2 className="font-serif text-4xl leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
                {title}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>
          </div>
        </Reveal>

        {/* Featured 60 / Grid 40 */}
        <div className={`grid gap-8 md:gap-10 lg:grid-cols-5 ${reverse ? "lg:[direction:rtl]" : ""}`}>
          <Reveal className="lg:col-span-3 lg:[direction:ltr]">
            <article className="group relative overflow-hidden rounded-sm bg-muted">
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
                  {featured.id ? (
                    <Link to="/product/$id" params={{ id: featured.id }}>
                      <h3 className="mt-2 font-serif text-2xl md:text-4xl hover:underline">{featured.name}</h3>
                    </Link>
                  ) : (
                    <h3 className="mt-2 font-serif text-2xl md:text-4xl">{featured.name}</h3>
                  )}
                  <p className="mt-2 text-sm opacity-90">{featured.price}</p>
                </div>
                <Link
                  to="/category/$slug"
                  params={{ slug: id }}
                  className="pill-btn pill-btn-outline border-background text-background hover:bg-background hover:text-foreground"
                >
                  Shop Now
                </Link>
              </div>
            </article>
          </Reveal>

          <div className="lg:col-span-2 lg:[direction:ltr]">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {products.map((p, i) => (
                <Reveal key={p.name} delay={i * 80}>
                  {p.id ? (
                    <article className="group relative flex h-full flex-col">
                      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                        <Link to="/product/$id" params={{ id: p.id }} className="absolute inset-0 h-full w-full">
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            width={768}
                            height={768}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Link>
                        <Link
                          to="/category/$slug"
                          params={{ slug: id }}
                          aria-label={`View ${p.name} in category`}
                          className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-md transition hover:bg-foreground hover:text-background"
                        >
                          <Plus className="h-4 w-4" strokeWidth={1.8} />
                        </Link>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-2">
                        <div>
                          <Link to="/product/$id" params={{ id: p.id }} className="hover:underline">
                            <h4 className="font-serif text-base text-foreground">{p.name}</h4>
                          </Link>
                          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{p.note}</p>
                        </div>
                        <span className="font-sans text-sm text-foreground">{p.price}</span>
                      </div>
                    </article>
                  ) : (
                    <article className="group flex h-full flex-col">
                      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          width={768}
                          height={768}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <button
                          aria-label={`Quick add ${p.name}`}
                          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-md transition hover:bg-foreground hover:text-background"
                        >
                          <Plus className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-base text-foreground">{p.name}</h4>
                          <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{p.note}</p>
                        </div>
                        <span className="font-sans text-sm text-foreground">{p.price}</span>
                      </div>
                    </article>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

