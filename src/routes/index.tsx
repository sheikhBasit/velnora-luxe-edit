import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { BoutiqueSection, type Product } from "@/components/velnora/BoutiqueSection";
import { Reveal } from "@/components/velnora/Reveal";
import hero from "@/assets/hero.jpg";
import makeup from "@/assets/makeup.jpg";
import skincare from "@/assets/skincare.jpg";
import hair from "@/assets/hair.jpg";
import bath from "@/assets/bath.jpg";
import tools from "@/assets/tools.jpg";
import fragrance from "@/assets/fragrance.jpg";
import wellness from "@/assets/wellness.jpg";
import tech from "@/assets/tech.jpg";
import makeup1 from "@/assets/products/makeup-1.jpg";
import makeup2 from "@/assets/products/makeup-2.jpg";
import makeup3 from "@/assets/products/makeup-3.jpg";
import makeup4 from "@/assets/products/makeup-4.jpg";
import skincare1 from "@/assets/products/skincare-1.jpg";
import skincare2 from "@/assets/products/skincare-2.jpg";
import skincare3 from "@/assets/products/skincare-3.jpg";
import skincare4 from "@/assets/products/skincare-4.jpg";
import hair1 from "@/assets/products/hair-1.jpg";
import hair2 from "@/assets/products/hair-2.jpg";
import hair3 from "@/assets/products/hair-3.jpg";
import hair4 from "@/assets/products/hair-4.jpg";
import bath1 from "@/assets/products/bath-1.jpg";
import bath2 from "@/assets/products/bath-2.jpg";
import bath3 from "@/assets/products/bath-3.jpg";
import bath4 from "@/assets/products/bath-4.jpg";
import tools1 from "@/assets/products/tools-1.jpg";
import tools2 from "@/assets/products/tools-2.jpg";
import tools3 from "@/assets/products/tools-3.jpg";
import tools4 from "@/assets/products/tools-4.jpg";
import fragrance1 from "@/assets/products/fragrance-1.jpg";
import fragrance2 from "@/assets/products/fragrance-2.jpg";
import fragrance3 from "@/assets/products/fragrance-3.jpg";
import fragrance4 from "@/assets/products/fragrance-4.jpg";
import wellness1 from "@/assets/products/wellness-1.jpg";
import wellness2 from "@/assets/products/wellness-2.jpg";
import wellness3 from "@/assets/products/wellness-3.jpg";
import wellness4 from "@/assets/products/wellness-4.jpg";
import tech1 from "@/assets/products/tech-1.jpg";
import tech2 from "@/assets/products/tech-2.jpg";
import tech3 from "@/assets/products/tech-3.jpg";
import tech4 from "@/assets/products/tech-4.jpg";

export const Route = createFileRoute("/")({
  component: Index,
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
      { property: "og:title", content: "Velnora — The 2026 Beauty Edit" },
      { property: "og:description", content: "A curated house of luxury beauty." },
      { property: "og:type", content: "website" },
    ],
  }),
});

const sections: Array<{
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  featured: { name: string; tag: string; price: string; retailerUrl?: string };
  products: Product[];
}> = [
    {
      id: "makeup",
      index: "01",
      eyebrow: "The Makeup Suite",
      title: "Pigment, polished.",
      description:
        "Couture-grade textures and curated color stories — from the satin matte to the molten lacquer.",
      image: makeup,
      featured: { id: "velvet-noir-lip-lacquer", name: "Velvet Noir Lip Lacquer", tag: "Editor's Pick", price: "$48" },
      products: [
        { id: "cashmere-blush", name: "Cashmere Blush", note: "Powder · Rose", price: "$38", image: makeup1 },
        { id: "obsidian-liner", name: "Obsidian Liner", note: "Liquid · Jet", price: "$26", image: makeup2 },
        { id: "halo-highlighter", name: "Halo Highlighter", note: "Cream · Champagne", price: "$42", image: makeup3 },
        { id: "silk-foundation", name: "Silk Foundation", note: "Liquid · 30ml", price: "$58", image: makeup4 },
      ],
    },
    {
      id: "skincare",
      index: "02",
      eyebrow: "Skincare Sanctuary",
      title: "Clinical poetry.",
      description: "Studied formulas, atelier-grade actives. The ritual of the considered face.",
      image: skincare,
      featured: { id: "hydra-glass-serum", name: "Hydra-Glass Serum", tag: "House Hero", price: "$92" },
      products: [
        { id: "retinal-0-1", name: "Retinal 0.1%", note: "Treatment · 30ml", price: "$76", image: skincare1 },
        { id: "vitamin-c-15", name: "Vitamin C 15%", note: "Serum · 30ml", price: "$68", image: skincare2 },
        { id: "niacinamide-veil", name: "Niacinamide Veil", note: "Essence · 50ml", price: "$54", image: skincare3 },
        { id: "marble-cleanser", name: "Marble Cleanser", note: "Cream · 150ml", price: "$44", image: skincare4 },
      ],
    },
    {
      id: "hair",
      index: "03",
      eyebrow: "The Hair Lab",
      title: "Precision, distilled.",
      description: "A laboratory of liquids and tools for hair that behaves like art direction.",
      image: hair,
      featured: { id: "bond-repair-elixir", name: "Bond Repair Elixir", tag: "Lab Edition", price: "$64" },
      products: [
        { id: "silk-press-mist", name: "Silk Press Mist", note: "Spray · 200ml", price: "$32", image: hair1 },
        { id: "density-shampoo", name: "Density Shampoo", note: "Wash · 250ml", price: "$36", image: hair2 },
        { id: "glass-conditioner", name: "Glass Conditioner", note: "Mask · 250ml", price: "$38", image: hair3 },
        { id: "heat-veil", name: "Heat Veil", note: "Primer · 150ml", price: "$28", image: hair4 },
      ],
    },
    {
      id: "bath",
      index: "04",
      eyebrow: "Bath & Body Rituals",
      title: "Slow water.",
      description: "Spa-grade rituals: oils, salts, and skin balms designed for the long evening.",
      image: bath,
      featured: { id: "cashmere-body-oil", name: "Cashmere Body Oil", tag: "Ritual No. 4", price: "$72" },
      products: [
        { id: "mineral-soak", name: "Mineral Soak", note: "Salt · 500g", price: "$42", image: bath1 },
        { id: "linen-body-wash", name: "Linen Body Wash", note: "Gel · 300ml", price: "$34", image: bath2 },
        { id: "velour-cream", name: "Velour Cream", note: "Lotion · 250ml", price: "$48", image: bath3 },
        { id: "hand-balm-no-1", name: "Hand Balm No.1", note: "Cream · 75ml", price: "$26", image: bath4 },
      ],
    },
    {
      id: "tools",
      index: "05",
      eyebrow: "The Tool Box",
      title: "The maker's hand.",
      description: "Sculpted hardware. Heirloom brushes. Instruments designed for the daily atelier.",
      image: tools,
      featured: { id: "atelier-brush-set", name: "Atelier Brush Set", tag: "Maison Edit", price: "$220" },
      products: [
        { id: "powder-brush-04", name: "Powder Brush 04", note: "Brush · Goat", price: "$58", image: tools1 },
        { id: "blending-sponge", name: "Blending Sponge", note: "Tool · Latex-free", price: "$22", image: tools2 },
        { id: "lash-curler", name: "Lash Curler", note: "Steel · Polished", price: "$28", image: tools3 },
        { id: "brow-comb", name: "Brow Comb", note: "Brass · Lacquer", price: "$24", image: tools4 },
      ],
    },
    {
      id: "fragrance",
      index: "06",
      eyebrow: "The Fragrance Wardrobe",
      title: "Air, made memorable.",
      description: "Olfactive heirlooms in cut glass — to be worn like a tailored coat.",
      image: fragrance,
      featured: { id: "velnora-no-7-amber-smoke", name: "Velnora No.7 — Amber Smoke", tag: "Maison Signature", price: "$185" },
      products: [
        { id: "iris-pave", name: "Iris Pavé", note: "EDP · 50ml", price: "$140", image: fragrance1 },
        { id: "neroli-suite", name: "Neroli Suite", note: "EDP · 50ml", price: "$150", image: fragrance2 },
        { id: "rose-obscura", name: "Rose Obscura", note: "EDP · 50ml", price: "$165", image: fragrance3 },
        { id: "vetiver-noir", name: "Vetiver Noir", note: "EDP · 50ml", price: "$170", image: fragrance4 },
      ],
    },
    {
      id: "wellness",
      index: "07",
      eyebrow: "Inside-Out Beauty",
      title: "Beauty, ingested.",
      description:
        "Quietly powerful supplements, considered for skin, hair, and the long arc of glow.",
      image: wellness,
      featured: { id: "inner-glow-capsules", name: "Inner Glow Capsules", tag: "30-Day Ritual", price: "$58" },
      products: [
        { id: "collagen-pearl", name: "Collagen Pearl", note: "Powder · 200g", price: "$48", image: wellness1 },
        { id: "hair-density", name: "Hair Density", note: "Capsules · 60ct", price: "$42", image: wellness2 },
        { id: "skin-hydration", name: "Skin Hydration", note: "Capsules · 60ct", price: "$44", image: wellness3 },
        { id: "calm-clear", name: "Calm & Clear", note: "Tincture · 30ml", price: "$52", image: wellness4 },
      ],
    },
    {
      id: "tech",
      index: "08",
      eyebrow: "Beauty Tech",
      title: "Light as treatment.",
      description:
        "LED, microcurrent, and intelligent devices — clinic-grade, dressed for the vanity.",
      image: tech,
      featured: { id: "lumione-led-mask", name: "LumiOne LED Mask", tag: "Smart Device", price: "$420" },
      products: [
        { id: "microcurrent-wand", name: "Microcurrent Wand", note: "Device · 5-mode", price: "$280", image: tech1 },
        { id: "cryo-globes", name: "Cryo Globes", note: "Tool · Steel", price: "$78", image: tech2 },
        { id: "sonic-cleansing", name: "Sonic Cleansing", note: "Brush · USB-C", price: "$140", image: tech3 },
        { id: "red-light-panel", name: "Red Light Panel", note: "Device · Pro", price: "$520", image: tech4 },
      ],
    },

  ];

function Hero() {
  return (
    <section id="editorial" className="relative">
      {/* Mobile: full-bleed banner */}
      <div className="relative h-[100svh] min-h-[640px] w-full lg:hidden anti-gravity-section mobile-hero-banner">
        <img
          src={hero}
          alt="Velnora — The 2026 Beauty Edit"
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.85) 100%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-12 text-background">
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-80">
            Maison Velnora · Volume X
          </p>
          <h1 className="mt-4 font-serif text-[3.25rem] leading-[0.95]">
            The 2026
            <br />
            Beauty Edit.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-90">
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
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.75) 100%)",
            }}
          />
          <div className="absolute bottom-8 right-8 rounded-full bg-background/90 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-foreground backdrop-blur">
            Cover · No. 01
          </div>
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
