export type Product = {
  id: string;
  name: string;
  note: string;
  price: string;
  image: string;
  category: string; // matches the section id: "makeup", "skincare", etc.
  amazonUrl: string; // your Amazon affiliate link
  description: string;
  features: string[];
  badge?: string; // e.g. "Editor's Pick", "Best Seller"
};

export const products: Product[] = [
  {
    id: "velvet-noir-lip-lacquer",
    name: "Velvet Noir Lip Lacquer",
    note: "Liquid · Deep Plum",
    price: "$48",
    image: "/assets/products/makeup-1.jpg",
    category: "makeup",
    amazonUrl: "https://www.amazon.com/dp/XXXXXXXXXX?tag=YOUR-AFFILIATE-TAG",
    description: "A couture-grade lip lacquer with an impossibly smooth matte finish.",
    features: ["Long-wearing formula", "Hydrating base", "16-hour wear"],
    badge: "Editor's Pick",
  },
  // ... add all your products
];

// Helper: get products by category
export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}

// Helper: get a single product
export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export const categories = [
  { id: "makeup", label: "Makeup Suite", index: "01" },
  { id: "skincare", label: "Skincare Sanctuary", index: "02" },
  { id: "hair", label: "Hair Lab", index: "03" },
  { id: "bath", label: "Bath & Body", index: "04" },
  { id: "tools", label: "Tool Box", index: "05" },
  { id: "fragrance", label: "Fragrance", index: "06" },
  { id: "wellness", label: "Wellness", index: "07" },
  { id: "tech", label: "Beauty Tech", index: "08" },
];
