import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { BoutiqueSection } from "@/components/velnora/BoutiqueSection";
import { Reveal } from "@/components/velnora/Reveal";
import { listProducts } from "@/lib/products.server";
import { seedProducts } from "@/data/seed-products.mjs";
import hero from "@/assets/hero.jpg";
import makeup from "@/assets/makeup.jpg";
import skincare from "@/assets/skincare.jpg";
import hair from "@/assets/hair.jpg";
import bath from "@/assets/bath.jpg";
import tools from "@/assets/tools.jpg";
import fragrance from "@/assets/fragrance.jpg";
import wellness from "@/assets/wellness.jpg";
import tech from "@/assets/tech.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => ({ allProducts: seedProducts }),
  head: () => ({
    meta: [
      { title: "Velnora — The 2026 Beauty Edit" },
      {
        name: "description",
        content:
          "Velnora is a curated house of luxury beauty: makeup, skincare, fragrance, and beauty tech, edited with intention.",
      },
      {
        name: "fo-verify",
        content: "29fd5c78-ee73-4760-83fa-f1f6953db833"
      },
      {
        name: "verify-admitad",
        content: "e29cc7bdb5",
      },
      {
        name: "p:domain_verify",
        content: "e41e5ff4edbb018d9c2ea72e9c5126c0",
      },
      { property: "og:title", content: "Velnora — The 2026 Beauty Edit" },
      { property: "og:description", content: "A curated house of luxury beauty." },
      { property: "og:type", content: "website" },
    ],
  }),
});

const sectionMeta = [
  {
    category: "makeup",
    index: "01",
    eyebrow: "The Makeup Suite",
    title: "Pigment, polished.",
    description:
      "Couture-grade textures and curated color stories — from the satin matte to the molten lacquer.",
    image: makeup,
  },
  {
    category: "skincare",
    index: "02",
    eyebrow: "Skincare Sanctuary",
    title: "Clinical poetry.",
    description: "Studied formulas, atelier-grade actives. The ritual of the considered face.",
    image: skincare,
  },
  {
    category: "hair",
    index: "03",
    eyebrow: "The Hair Lab",
    title: "Precision, distilled.",
    description: "A laboratory of liquids and tools for hair that behaves like art direction.",
    image: hair,
  },
  {
    category: "body",
    index: "04",
    eyebrow: "Bath & Body Rituals",
    title: "Slow water.",
    description: "Spa-grade rituals: oils, salts, and skin balms designed for the long evening.",
    image: bath,
  },
  {
    category: "tools",
    index: "05",
    eyebrow: "The Tool Box",
    title: "The maker's hand.",
    description: "Sculpted hardware. Heirloom brushes. Instruments designed for the daily atelier.",
    image: tools,
  },
  {
    category: "fragrance",
    index: "06",
    eyebrow: "The Fragrance Wardrobe",
    title: "Air, made memorable.",
    description: "Olfactive heirlooms in cut glass — to be worn like a tailored coat.",
    image: fragrance,
  },
  {
    category: "wellness",
    index: "07",
    eyebrow: "Inside-Out Beauty",
    title: "Beauty, ingested.",
    description:
      "Quietly powerful supplements, considered for skin, hair, and the long arc of glow.",
    image: wellness,
  },
  {
    category: "tech",
    index: "08",
    eyebrow: "Beauty Tech",
    title: "Light as treatment.",
    description:
      "LED, microcurrent, and intelligent devices — clinic-grade, dressed for the vanity.",
    image: tech,
  },
];

function buildSections(allProducts: Awaited<ReturnType<typeof listProducts>>) {
  return sectionMeta.map((meta) => {
    const inCategory = allProducts.filter((p) => p.category === meta.category);
    const featuredProduct = inCategory.find((p) => p.featured) ?? inCategory[0];
    const gridProducts = inCategory.filter((p) => p.id !== featuredProduct?.id).slice(0, 4);

    return {
      ...meta,
      id: meta.category,
      featured: {
        id: featuredProduct?.id,
        name: featuredProduct?.name ?? "",
        tag: featuredProduct?.badge ?? "",
        price: featuredProduct?.price ?? "",
        retailerUrl: featuredProduct?.retailerUrl,
      },
      products: gridProducts.map((p) => ({
        id: p.id,
        brandName: p.brandName,
        name: p.name,
        note: p.note,
        price: p.price,
        image: p.image,
        retailerUrl: p.retailerUrl,
      })),
    };
  });
}

function Hero() {
  return (
    <section id="editorial" className="relative">
      {/* Mobile: full-bleed banner */}
      <div className="lg:hidden">
        <div className="relative h-[65svh] min-h-[460px] w-full overflow-hidden bg-muted">
        <img
          src={hero}
          alt="Velnora — The 2026 Beauty Edit"
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover"
        />
        </div>
        <div className="bg-background px-6 py-12 text-foreground">
          <p className="eyebrow">
            Maison Velnora · Volume X
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.95]">
            The 2026
            <br />
            Beauty Edit.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A private curation of the year's most coveted objects in beauty — from the Maison's
            archive to your vanity.
          </p>
          <div className="mt-8">
            <Link to="/category/$slug" params={{ slug: "makeup" }} className="pill-btn bg-background text-foreground hover:bg-background/90">
              Explore the Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: split-screen editorial */}
      <div className="hidden lg:grid lg:min-h-screen lg:grid-cols-12">
        <div className="col-span-6 flex flex-col justify-between bg-background px-12 py-32 xl:px-20">
          <Reveal>
            <p className="eyebrow">Maison Velnora — Volume X · MMXXVI</p>
          </Reveal>
          <Reveal delay={150}>
            <div>
              <h1 className="font-serif text-[6.5rem] leading-[0.92] tracking-[-0.03em] text-foreground xl:text-[8rem]">
                The 2026
                <br />
                <span className="italic font-light">Beauty</span>
                <br />
                Edit.
              </h1>
              <p className="mt-10 max-w-md text-base leading-relaxed text-muted-foreground">
                A private curation of the year's most coveted objects in beauty — eight chapters,
                one obsession. From the Maison's archive to your vanity.
              </p>
              <div className="mt-12 flex items-center gap-6">
                <Link to="/category/$slug" params={{ slug: "makeup" }} className="pill-btn">
                  Explore the Edit
                </Link>
                <a href="#editorial" className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-foreground">
                  Read the Editorial
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex items-end mt-20 justify-between text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              <span>Eight Chapters</span>
              <span>Curated · Not Sold</span>
              <span>Est. 2026</span>
            </div>
          </Reveal>
        </div>
        <div className="relative col-span-6 overflow-hidden bg-muted">
          <img
            src={hero}
            alt="Velnora editorial still life"
            width={1280}
            height={1600}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Independent Beauty Edit", "Hand-Selected Curation", "Editorial Recommendations", "Weekly Essentials"];
  return (
    <div className="overflow-hidden border-y border-border bg-secondary py-4">
      <div className="flex animate-[marquee_40s_linear_infinite] gap-16 whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-foreground/70">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-16">
            {t}
            <span className="opacity-30">◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
    </div>
  );
}

function Index() {
  const { allProducts } = Route.useLoaderData();
  const sections = buildSections(allProducts);

  return (
    <main className="bg-background text-foreground">
      <Header hideMobileBottomNav />
      <Hero />
      <Marquee />
      {sections.map((s, i) => (
        <BoutiqueSection key={s.id} {...s} reverse={i % 2 === 1} />
      ))}

      {/* About Section */}
      <section id="about" className="border-t border-border/60 bg-background">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-32">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow mb-6">About the Maison</p>
              <h2 className="font-serif text-4xl leading-[1.1] text-foreground md:text-6xl">
                Curated, never sold.
              </h2>
              <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                Velnora is a curated digital shopping house. Every object in our collection is hand-selected for its formula and aesthetic. We earn a small commission through affiliate partnerships, allowing us to keep this curation independent and free. No brand pays for placement. No algorithm decides what you see.
              </p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                Eight chapters. One obsession. From the Maison's archive to your vanity.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
