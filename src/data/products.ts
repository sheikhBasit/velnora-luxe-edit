export type Product = {
  id: string;
  name: string;
  note: string;
  price: string;
  image: string;
  category: string;
  retailerUrl: string;
  description: string;
  features: string[];
  badge?: string;
  featured: boolean;
  sortOrder: number;
};

export const categories = [
  {
    id: "makeup",
    name: "The Makeup Suite",
    label: "MAKEUP",
    description: "Editorial color stories",
    index: "01",
  },
  {
    id: "skincare",
    name: "Skincare Sanctuary",
    label: "SKINCARE",
    description: "Skin-first rituals",
    index: "02",
  },
  {
    id: "hair",
    name: "The Hair Lab",
    label: "HAIR",
    description: "Gloss and movement",
    index: "03",
  },
  {
    id: "body",
    name: "Bath & Body Rituals",
    label: "BODY",
    description: "Silken rituals",
    index: "04",
  },
  {
    id: "tools",
    name: "The Tool Box",
    label: "TOOLS",
    description: "Precision essentials",
    index: "05",
  },
  {
    id: "fragrance",
    name: "The Fragrance Wardrobe",
    label: "FRAGRANCE",
    description: "Olfactive heirlooms",
    index: "06",
  },
  {
    id: "wellness",
    name: "Inside-Out Beauty",
    label: "WELLNESS",
    description: "Quietly powerful rituals",
    index: "07",
  },
  {
    id: "tech",
    name: "Beauty Tech",
    label: "BEAUTY TECH",
    description: "Clinic-grade devices",
    index: "08",
  },
];
