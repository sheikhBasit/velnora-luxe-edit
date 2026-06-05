import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getProduct, Product } from "@/data/products";
import { useIsMobile } from "@/hooks/use-mobile";
import { Reveal } from "./Reveal";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export type ProductPreview = Pick<Product, "id" | "name" | "note" | "price" | "image">;

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
  products: ProductPreview[];
  reverse?: boolean;
}) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const openProduct = (product: ProductPreview) => {
    const fullProduct = product.id ? getProduct(product.id) : null;

    setActiveProduct(
      fullProduct ?? {
        id: product.id || product.name.toLowerCase().replace(/\s+/g, "-"),
        name: product.name,
        note: product.note,
        price: product.price,
        image: product.image,
        category: id,
        amazonUrl: "#",
        description: product.note,
        features: [],
      },
    );
    setDrawerOpen(true);
  };

  return (
    <section
      id={id}
      className="border-t border-border/60 bg-background anti-gravity-section boutique-banner"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-32">
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

        <div
          className={`grid gap-8 md:gap-10 lg:grid-cols-5 ${reverse ? "lg:[direction:rtl]" : ""}`}
        >
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
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-95"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0.4) 45%, rgba(0, 0, 0, 0.8) 90%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-start gap-4 p-6 md:p-10">
                <div className="text-background">
                  <p className="text-[10px] uppercase tracking-[0.32em] opacity-80">{featured.tag}</p>
                  {featured.id ? (
                    <Link to="/product/$id" params={{ id: featured.id }}>
                      <h3 className="mt-2 font-serif text-2xl md:text-4xl hover:underline">
                        {featured.name}
                      </h3>
                    </Link>
                  ) : (
                    <h3 className="mt-2 font-serif text-2xl md:text-4xl">{featured.name}</h3>
                  )}
                  <p className="mt-2 text-sm opacity-90">{featured.price}</p>
                </div>
                <div className="ml-auto flex items-center">
                  <Link
                    to="/shop"
                    params={{}}
                    search={{ category: id }}
                    className="pill-btn pill-btn-outline border-background text-background hover:bg-background hover:text-foreground cta-button image-overlay-button"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>

          <div className="lg:col-span-2 lg:[direction:ltr]">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {products.map((product, index) => (
                <Reveal key={product.name} delay={index * 80}>
                  <article className="group h-full">
                    <button
                      type="button"
                      onClick={() => openProduct(product)}
                      aria-label={`View details for ${product.name}`}
                      className="group flex h-full w-full flex-col text-left"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-sm bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          width={768}
                          height={768}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-95"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0.4) 45%, rgba(0, 0, 0, 0.8) 90%)",
                          }}
                        />
                        <span className="absolute bottom-3 right-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm ring-1 ring-foreground/10 transition group-hover:bg-foreground group-hover:text-background">
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                        </span>
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
                    </button>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={drawerOpen} onOpenChange={(open) => {
        setDrawerOpen(open);
        if (!open) setActiveProduct(null);
      }}>
        <SheetContent
          side={isMobile ? "top" : "right"}
          className={
            isMobile
              ? "w-screen h-screen max-w-none p-0 overflow-hidden"
              : "max-w-[92vw] md:max-w-[46rem] p-6 md:p-8 max-h-[85vh] overflow-y-auto"
          }
        >
          {activeProduct ? (
            <div
              className={
                isMobile
                  ? "flex h-full flex-col overflow-hidden bg-[#F7F3EC]"
                  : "grid gap-6 md:grid-cols-[1.05fr_0.95fr]"
              }
            >
              <div
                className={
                  isMobile
                    ? "relative h-[50vh] w-full overflow-hidden bg-muted"
                    : "overflow-hidden rounded-[32px] bg-muted"
                }
              >
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <SheetClose className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition hover:bg-foreground hover:text-background">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </div>

              <div
                className={
                  isMobile
                    ? "flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F7F3EC] p-6"
                    : "flex min-h-full flex-col justify-between gap-6"
                }
              >
                <div className={isMobile ? "flex min-h-0 flex-1 flex-col overflow-y-auto" : "space-y-6"}>
                  <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                      {activeProduct.note}
                    </p>
                    <SheetTitle
                      className={
                        isMobile
                          ? "font-serif text-[2rem] font-bold leading-tight text-foreground"
                          : "mt-3 font-serif text-4xl leading-tight text-foreground"
                      }
                    >
                      {activeProduct.name}
                    </SheetTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {activeProduct.description}
                    </p>
                  </div>

                  {activeProduct.features?.length ? (
                    <div className="rounded-[28px] border border-border/30 bg-muted p-6">
                      <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Details</p>
                      <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                        {activeProduct.features.map((feature) => (
                          <li key={feature} className="flex gap-3">
                            <span className="text-foreground">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className={isMobile ? "mt-4" : "space-y-6"}>
                  <a
                    href={activeProduct.amazonUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex w-full items-center justify-center rounded-[2rem] bg-foreground px-6 py-4 text-sm uppercase tracking-[0.22em] text-background transition hover:bg-foreground/90 md:w-auto"
                  >
                    Shop on Amazon
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </section>
  );
}
