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
    amazonUrl: "https://www.amazon.com/",
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
    amazonUrl: "https://www.amazon.com/",
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
    amazonUrl: "https://www.amazon.com/",
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
    amazonUrl: "https://www.amazon.com/",
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
    amazonUrl: "https://www.amazon.com/",
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
    amazonUrl: "https://www.amazon.com/",
    description: "A thermal-protective mist that keeps hair sleek and weightless.",
    features: ["Heat protection", "Frizz control", "Weightless finish"],
  },
];

export const categories = [
  { id: "makeup", name: "Makeup", label: "Makeup", description: "Editorial color stories", index: "01" },
  { id: "skincare", name: "Skincare", label: "Skincare", description: "Skin-first rituals", index: "02" },
  { id: "hair", name: "Hair", label: "Hair", description: "Gloss and movement", index: "03" },
];

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}
