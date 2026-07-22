export type Product = {
  id: string;
  name: string;
  note: string;
  price: string;
  image: string;
  category: string;
  amazonUrl: string;
  description: string;
  features: string[];
  badge?: string;
};

export const products: Product[] = [
  {
    id: "velvet-noir-lip-lacquer",
    name: "Velvet Noir Lip Lacquer",
    note: "Liquid · Deep Plum",
    price: "$48",
    image: "/assets/products/makeup-1.jpg",
    category: "makeup",
    amazonUrl: "",
    description: "A couture-grade lip lacquer with satin comfort and buildable depth.",
    features: ["Satin-matte finish", "Long-wear comfort", "Rich pigment"],
    badge: "Editor's Pick",
  },
  {
    id: "cashmere-blush",
    name: "Cashmere Blush",
    note: "Powder · Rose",
    price: "$38",
    image: "/assets/products/makeup-2.jpg",
    category: "makeup",
    amazonUrl: "",
    description: "An ultra-fine blush that melts seamlessly into the skin for a soft-focus flush.",
    features: ["Buildable pigment", "Soft-focus finish", "Velvety texture"],
  },
  {
    id: "hydra-glass-serum",
    name: "Hydra-Glass Serum",
    note: "Serum · 30ml",
    price: "$92",
    image: "/assets/products/skincare-1.jpg",
    category: "skincare",
    amazonUrl: "",
    description: "A hydrating serum designed to leave skin clear, calm, and luminous.",
    features: ["Glass-like clarity", "Deep hydration", "Lightweight finish"],
    badge: "House Hero",
  },
  {
    id: "retinal-0-1",
    name: "Retinal 0.1%",
    note: "Treatment · 30ml",
    price: "$76",
    image: "/assets/products/skincare-2.jpg",
    category: "skincare",
    amazonUrl: "",
    description: "A stabilized treatment that supports smoother texture and a renewed glow.",
    features: ["Refines texture", "Supports renewal", "Night treatment"],
  },
  {
    id: "bond-repair-elixir",
    name: "Bond Repair Elixir",
    note: "Oil · 100ml",
    price: "$64",
    image: "/assets/products/hair-1.jpg",
    category: "hair",
    amazonUrl: "",
    description: "A lightweight treatment that restores shine and manageability to stressed strands.",
    features: ["Bond support", "Frizz smoothing", "Mirror-like shine"],
    badge: "Lab Edition",
  },
  {
    id: "silk-press-mist",
    name: "Silk Press Mist",
    note: "Spray · 200ml",
    price: "$32",
    image: "/assets/products/hair-2.jpg",
    category: "hair",
    amazonUrl: "",
    description: "A thermal-protective mist that keeps hair sleek and weightless.",
    features: ["Heat protection", "Frizz control", "Weightless finish"],
  },
  {
    id: "cashmere-body-oil",
    name: "Cashmere Body Oil",
    note: "Oil · 120ml",
    price: "$72",
    image: "/assets/products/bath-1.jpg",
    category: "body",
    amazonUrl: "",
    description: "A velvety body oil for polished, scented ritual from dawn to dusk.",
    features: ["Silky finish", "Layerable scent", "Daily ritual"],
    badge: "Ritual No. 4",
  },
  {
    id: "atelier-brush-set",
    name: "Atelier Brush Set",
    note: "Tool · 8-piece",
    price: "$220",
    image: "/assets/products/tools-1.jpg",
    category: "tools",
    amazonUrl: "",
    description: "A sculpted set of brushes with a soft, precise hand-feel for editorial application.",
    features: ["Precision fibers", "Balanced weight", "Heirloom finish"],
    badge: "Maison Edit",
  },
  {
    id: "velnora-no-7-amber-smoke",
    name: "Velnora No.7 — Amber Smoke",
    note: "EDP · 50ml",
    price: "$185",
    image: "/assets/products/fragrance-1.jpg",
    category: "fragrance",
    amazonUrl: "",
    description: "An enveloping fragrance with amber warmth and polished, smoky depth.",
    features: ["Smoky amber accord", "Long wear", "Tailored finish"],
    badge: "Maison Signature",
  },
  {
    id: "inner-glow-capsules",
    name: "Inner Glow Capsules",
    note: "Capsules · 30-day",
    price: "$58",
    image: "/assets/products/wellness-1.jpg",
    category: "wellness",
    amazonUrl: "",
    description: "A quietly powerful supplement ritual to support radiance and overall wellness.",
    features: ["Daily support", "Clean formulation", "Glow-forward"],
  },
  {
    id: "lumione-led-mask",
    name: "LumiOne LED Mask",
    note: "Device · 5-mode",
    price: "$420",
    image: "/assets/products/tech-1.jpg",
    category: "tech",
    amazonUrl: "",
    description: "A clinic-grade LED device designed for at-home treatments and polished results.",
    features: ["LED therapy", "Portable design", "Smart controls"],
    badge: "Smart Device",
  },
];

export const categories = [
  { id: "makeup", name: "The Makeup Suite", label: "MAKEUP", description: "Editorial color stories", index: "01" },
  { id: "skincare", name: "Skincare Sanctuary", label: "SKINCARE", description: "Skin-first rituals", index: "02" },
  { id: "hair", name: "The Hair Lab", label: "HAIR", description: "Gloss and movement", index: "03" },
  { id: "body", name: "Bath & Body Rituals", label: "BODY", description: "Silken rituals", index: "04" },
  { id: "tools", name: "The Tool Box", label: "TOOLS", description: "Precision essentials", index: "05" },
  { id: "fragrance", name: "The Fragrance Wardrobe", label: "FRAGRANCE", description: "Olfactive heirlooms", index: "06" },
  { id: "wellness", name: "Inside-Out Beauty", label: "WELLNESS", description: "Quietly powerful rituals", index: "07" },
  { id: "tech", name: "Beauty Tech", label: "BEAUTY TECH", description: "Clinic-grade devices", index: "08" },
];

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}
