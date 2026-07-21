<<<<<<< HEAD
﻿export type Product = {
=======
export type Product = {
>>>>>>> 4a85e38 (Refine site to editorial beauty curation UI)
  id: string;
  name: string;
  note: string;
  price: string;
  image: string;
  category: string; // matches the section id: "makeup", "skincare", etc.
<<<<<<< HEAD
  amazonUrl: string; // Amazon affiliate link
=======
  amazonUrl: string; // your Amazon affiliate link
>>>>>>> 4a85e38 (Refine site to editorial beauty curation UI)
  description: string;
  features: string[];
  badge?: string; // e.g. "Editor's Pick", "Best Seller"
};

export const products: Product[] = [
<<<<<<< HEAD
  // --- MAKEUP SUITE (makeup) ---
=======
>>>>>>> 4a85e38 (Refine site to editorial beauty curation UI)
  {
    id: "velvet-noir-lip-lacquer",
    name: "Velvet Noir Lip Lacquer",
    note: "Liquid · Deep Plum",
    price: "$48",
<<<<<<< HEAD
    image: "/assets/makeup.jpg",
    category: "makeup",
    amazonUrl: "https://www.amazon.com/dp/B0716KGFKK?tag=velnora-luxe-20",
    description:
      "A weightless, couture-grade liquid formula delivering a dramatic satin-matte finish. Enriched with botanical oils to provide rich, pigment-polished hydration that lasts all evening.",
    features: ["Satin-matte finish", "Botanical oils", "Long-wear hydration"],
    badge: "Editor's Pick",
  },
  {
    id: "cashmere-blush",
    name: "Cashmere Blush",
    note: "Powder · Rose",
    price: "$38",
    image: "/assets/products/makeup-1.jpg",
    category: "makeup",
    amazonUrl: "https://www.amazon.com/dp/B08HJMRF23?tag=velnora-luxe-20",
    description:
      "An ultra-fine, buildable powder blush that melts seamlessly into the skin for a natural, soft-focus flush. Captures a radiant rose glow with a velvety, modern finish.",
    features: ["Buildable pigment", "Soft-focus texture", "Natural finish"],
  },
  {
    id: "obsidian-liner",
    name: "Obsidian Liner",
    note: "Liquid · Jet",
    price: "$26",
    image: "/assets/products/makeup-2.jpg",
    category: "makeup",
    amazonUrl: "https://www.amazon.com/dp/B07N9D7MTF?tag=velnora-luxe-20",
    description:
      "A precise, high-definition liquid eyeliner in absolute jet black. Delivers an unyielding, molten-lacquer stroke that contours the eyes with art-direction precision.",
    features: ["Precision tip", "Jet-black intensity", "Long-lasting wear"],
  },
  {
    id: "halo-highlighter",
    name: "Halo Highlighter",
    note: "Cream · Champagne",
    price: "$42",
    image: "/assets/products/makeup-3.jpg",
    category: "makeup",
    amazonUrl: "https://www.amazon.com/dp/B01E2E4A98?tag=velnora-luxe-20",
    description:
      "A molten, champagne-toned cream highlighter designed to catch light at the highest points of the face. Creates an ethereal, dew-kissed glow without disruptive glitter.",
    features: ["Champagne luminosity", "Creamy texture", "Glitter-free glow"],
  },
  {
    id: "silk-foundation",
    name: "Silk Foundation",
    note: "Liquid · 30ml",
    price: "$58",
    image: "/assets/products/makeup-4.jpg",
    category: "makeup",
    amazonUrl: "https://www.amazon.com/dp/B01M3W9BIF?tag=velnora-luxe-20",
    description:
      "A fluid, breathable foundation that mimics the natural texture of perfected skin. Offers customizable medium coverage with a luminous, lit-from-within finish.",
    features: ["Breathable coverage", "Luminous finish", "Skin-like texture"],
  },

  // --- SKINCARE SANCTUARY (skincare) ---
  {
    id: "hydra-glass-serum",
    name: "Hydra-Glass Serum",
    note: "Serum · 30ml",
    price: "$92",
    image: "/assets/skincare.jpg",
    category: "skincare",
    amazonUrl: "https://www.amazon.com/dp/B076G5RKKD?tag=velnora-luxe-20",
    description:
      "A deeply hydrating, molecule-dense serum engineered to anchor moisture within the epidermal layers. Leaves the skin with an instant, reflective glass-like clarity.",
    features: ["Glass skin clarity", "Deep hydration", "Lightweight finish"],
    badge: "House Hero",
  },
  {
    id: "retinal-0-1",
    name: "Retinal 0.1%",
    note: "Treatment · 30ml",
    price: "$76",
    image: "/assets/products/skincare-1.jpg",
    category: "skincare",
    amazonUrl: "https://www.amazon.com/dp/B08X1S7F3Z?tag=velnora-luxe-20",
    description:
      "An advanced, atelier-grade nocturnal treatment containing stabilized retinaldehyde. Accelerates cell renewal to visibly refine fine lines and smooth uneven texture gently.",
    features: ["Stabilized retinaldehyde", "Refines texture", "Gentle overnight action"],
  },
  {
    id: "vitamin-c-15",
    name: "Vitamin C 15%",
    note: "Serum · 30ml",
    price: "$68",
    image: "/assets/products/skincare-2.jpg",
    category: "skincare",
    amazonUrl: "https://www.amazon.com/dp/B08N5N5KK3?tag=velnora-luxe-20",
    description:
      "A potent, daily antioxidant shield that aggressively targets dark spots and environmental fatigue. Restores a unified, brilliantly illuminated skin tone.",
    features: ["15% vitamin C", "Brightens uneven tone", "Environmental protection"],
  },
  {
    id: "niacinamide-veil",
    name: "Niacinamide Veil",
    note: "Essence · 50ml",
    price: "$54",
    image: "/assets/products/skincare-3.jpg",
    category: "skincare",
    amazonUrl: "https://www.amazon.com/dp/B09D8RFG6G?tag=velnora-luxe-20",
    description:
      "A soothing, ultra-light botanical essence designed to regulate sebum and reinforce the lipid barrier. Minimizes pores while leaving a weightless, calming hydration veil.",
    features: ["Sebum regulation", "Pore minimization", "Light botanical hydration"],
  },
  {
    id: "marble-cleanser",
    name: "Marble Cleanser",
    note: "Cream · 150ml",
    price: "$44",
    image: "/assets/products/skincare-4.jpg",
    category: "skincare",
    amazonUrl: "https://www.amazon.com/dp/B09GF2NKFG?tag=velnora-luxe-20",
    description:
      "A decadent, conditioning cream cleanser that lifts impurities while preserving natural oils. Transforms a daily necessity into a meditative, spa-grade skin ritual.",
    features: ["Conditioning cream texture", "Preserves natural oils", "Ritualistic cleanse"],
  },

  // --- THE HAIR LAB (hair) ---
  {
    id: "bond-repair-elixir",
    name: "Bond Repair Elixir",
    note: "Oil · 100ml",
    price: "$64",
    image: "/assets/hair.jpg",
    category: "hair",
    amazonUrl: "https://www.amazon.com/dp/B08C4L5L9Y?tag=velnora-luxe-20",
    description:
      "A concentrated, residue-free treatment that targets damaged disulfide bonds from deep within. Reconstructs frayed hair cuticles to restore structural elasticity and mirror-like shine.",
    features: ["Bond reconstruction", "Frizz smoothing", "Shine restoration"],
    badge: "Lab Edition",
  },
  {
    id: "silk-press-mist",
    name: "Silk Press Mist",
    note: "Spray · 200ml",
    price: "$32",
    image: "/assets/products/hair-1.jpg",
    category: "hair",
    amazonUrl: "https://www.amazon.com/dp/B08KHBKKP2?tag=velnora-luxe-20",
    description:
      "An ultra-light, thermal-protective shield engineered to guard delicate strands against high-heat styling. Banishes frizz to deliver an incredibly sleek, fluid movement.",
    features: ["Heat protection", "Frizz elimination", "Weightless finish"],
  },
  {
    id: "density-shampoo",
    name: "Density Shampoo",
    note: "Wash · 250ml",
    price: "$36",
    image: "/assets/products/hair-2.jpg",
    category: "hair",
    amazonUrl: "https://www.amazon.com/dp/B08ZNS7XFD?tag=velnora-luxe-20",
    description:
      "A revitalizing, follicle-stimulating wash that gently clarifies the scalp while thickening the root structure. Imparts airy, voluptuous volume right from the first rinse.",
    features: ["Scalp clarity", "Root thickening", "Volumizing wash"],
  },
  {
    id: "glass-conditioner",
    name: "Glass Conditioner",
    note: "Mask · 250ml",
    price: "$38",
    image: "/assets/products/hair-3.jpg",
    category: "hair",
    amazonUrl: "https://www.amazon.com/dp/B09BDKFF2D?tag=velnora-luxe-20",
    description:
      "A weightless, rinse-out glossing mask that seals down cuticles and locks in essential hydration. Leaves hair feeling impossibly soft with a reflective, high-shine finish.",
    features: ["Cuticle sealing", "Gloss finish", "Hydration boost"],
  },
  {
    id: "heat-veil",
    name: "Heat Veil Primer",
    note: "Primer · 150ml",
    price: "$28",
    image: "/assets/products/hair-4.jpg",
    category: "hair",
    amazonUrl: "https://www.amazon.com/dp/B09J5NDFFF?tag=velnora-luxe-20",
    description:
      "A nourishing, leave-in pre-styling cream packed with UV filters and protective nourishment. Defends against styling damage while acting as a foundation for hold and manageability.",
    features: ["Thermal defense", "UV protection", "Styling support"],
  },

  // --- BATH & BODY RITUALS (bath) ---
  {
    id: "cashmere-body-oil",
    name: "Cashmere Body Oil",
    note: "Oil · 100ml",
    price: "$72",
    image: "/assets/bath.jpg",
    category: "bath",
    amazonUrl: "https://www.amazon.com/dp/B09KGLKKFK?tag=velnora-luxe-20",
    description:
      "A lavish, dry botanical body oil that sinks into dry skin instantly without leaving a greasy trace. Wrapped in an understated, warm sensory fragrance perfect for long evenings.",
    features: ["Dry oil finish", "Warm fragrance notes", "Fast absorption"],
    badge: "Ritual No. 4",
  },
  {
    id: "mineral-soak",
    name: "Mineral Soak",
    note: "Salt · 500g",
    price: "$42",
    image: "/assets/products/bath-1.jpg",
    category: "bath",
    amazonUrl: "https://www.amazon.com/dp/B07T2K5FKK?tag=velnora-luxe-20",
    description:
      "A curative blend of pure, trace-mineral crystals and calming salts harvested for deep relaxation. Relieves physical tension while softening the skin in a comforting bath ritual.",
    features: ["Trace mineral blend", "Soothing relaxation", "Skin-softening ritual"],
  },
  {
    id: "linen-body-wash",
    name: "Linen Body Wash",
    note: "Gel · 300ml",
    price: "$34",
    image: "/assets/products/bath-2.jpg",
    category: "bath",
    amazonUrl: "https://www.amazon.com/dp/B08D3KJJJK?tag=velnora-luxe-20",
    description:
      "A crisp, low-foaming gel cleanser that purifies the body with notes of fresh flax and pale woods. Conditions the skin barrier to leave it clean, soft, and balanced.",
    features: ["Low foam gel", "Barrier conditioning", "Fresh linen fragrance"],
  },
  {
    id: "velour-cream",
    name: "Velour Cream",
    note: "Lotion · 250ml",
    price: "$48",
    image: "/assets/products/bath-3.jpg",
    category: "bath",
    amazonUrl: "https://www.amazon.com/dp/B08GFK66KK?tag=velnora-luxe-20",
    description:
      "A deeply rich, whipped body balm engineered to drench dehydrated skin in lasting moisture. Restores a supple, velvety softness to rough elbows, knees, and limbs.",
    features: ["Whipped balm texture", "Long-lasting moisture", "Velvety finish"],
  },
  {
    id: "hand-balm-no-1",
    name: "Hand Balm No.1",
    note: "Cream · 75ml",
    price: "$26",
    image: "/assets/products/bath-4.jpg",
    category: "bath",
    amazonUrl: "https://www.amazon.com/dp/B07RGLKKFK?tag=velnora-luxe-20",
    description:
      "A protective, fast-absorbing hand cream designed to shield delicate skin from harsh daily elements. Softens cuticles and rough skin texture with a subtle, clean aroma.",
    features: ["Fast absorbing", "Cuticle protection", "Gentle fragrance"],
  },

  // --- THE TOOL BOX (tools) ---
  {
    id: "atelier-brush-set",
    name: "Atelier Brush Set",
    note: "Set · 5 Brushes",
    price: "$220",
    image: "/assets/tools.jpg",
    category: "tools",
    amazonUrl: "https://www.amazon.com/dp/B08N5ND88F?tag=velnora-luxe-20",
    description:
      "A masterfully sculpted collection of premium, handcrafted artisan brushes. Engineered with ultra-soft fibers to pick up and distribute pigment with absolute control.",
    features: ["Handcrafted brush heads", "Precision pigment delivery", "Luxury storage case"],
    badge: "Maison Edit",
  },
  {
    id: "powder-brush-04",
    name: "Powder Brush 04",
    note: "Brush · Goat",
    price: "$58",
    image: "/assets/products/tools-1.jpg",
    category: "tools",
    amazonUrl: "https://www.amazon.com/dp/B07B4FKKFK?tag=velnora-luxe-20",
    description:
      "A plush, domed powder brush tailored to deposit loose setting powders with an invisible touch. Ensures a flawless, airbrushed finish without disturbing base makeup.",
    features: ["Soft goat hair", "Perfect powder diffusion", "Flawless finish"],
  },
  {
    id: "blending-sponge",
    name: "Blending Sponge",
    note: "Tool · Latex-free",
    price: "$22",
    image: "/assets/products/tools-2.jpg",
    category: "tools",
    amazonUrl: "https://www.amazon.com/dp/B01F2EK5FF?tag=velnora-luxe-20",
    description:
      "A zero-latex, water-activated blending tool sculpted with dual flat edges for high-precision mapping. Bounces fluid foundations and creams smoothly onto the skin.",
    features: ["Water-activated expansion", "Precision flat edges", "Latex-free formula"],
  },
  {
    id: "lash-curler",
    name: "Lash Curler",
    note: "Steel · Polished",
    price: "$28",
    image: "/assets/products/tools-3.jpg",
    category: "tools",
    amazonUrl: "https://www.amazon.com/dp/B0007P09B8?tag=velnora-luxe-20",
    description:
      "An ergonomically engineered, polished steel curler that captures every lash without pinching. Delivers a wide-awake, lasting lift that beautifully opens up the gaze.",
    features: ["Comfort-fit pads", "Precision curve", "Lasting lift"],
  },
  {
    id: "brow-comb",
    name: "Brow Comb",
    note: "Brass · Lacquer",
    price: "$24",
    image: "/assets/products/tools-4.jpg",
    category: "tools",
    amazonUrl: "https://www.amazon.com/dp/B07D3KK9FF?tag=velnora-luxe-20",
    description:
      "A dual-sided, brass-lacquered tool built for grooming and separating individual brow hairs and lashes. Sculpts brows into a clean, feather-light symmetry.",
    features: ["Dual-sided design", "Fine grooming teeth", "Brass lacquer finish"],
  },

  // --- THE FRAGRANCE WARDROBE (fragrance) ---
  {
    id: "velnora-no-7-amber-smoke",
    name: "Velnora No.7 — Amber Smoke",
    note: "EDP · 100ml",
    price: "$185",
    image: "/assets/fragrance.jpg",
    category: "fragrance",
    amazonUrl: "https://www.amazon.com/dp/B08V5N8FFD?tag=velnora-luxe-20",
    description:
      "An olfactory heirloom weaving together rich, golden amber with mysterious ribbons of charred vetiver and raw tobacco. A deeply complex, intimate scent tailored like a statement coat.",
    features: ["Warm amber depth", "Dry tobacco nuance", "Long-lasting trail"],
    badge: "Maison Signature",
  },
  {
    id: "iris-pave",
    name: "Iris Pavé",
    note: "EDP · 50ml",
    price: "$140",
    image: "/assets/products/fragrance-1.jpg",
    category: "fragrance",
    amazonUrl: "https://www.amazon.com/dp/B07S8KKFK9?tag=velnora-luxe-20",
    description:
      "A luminous, powdery floral fragrance built around a core of delicate Florentine iris and crisp aldehyde notes. Captures the crisp elegance of a clean, sunlit morning.",
    features: ["Powdery iris heart", "Aldehyde brightness", "Airy freshness"],
  },
  {
    id: "neroli-suite",
    name: "Neroli Suite",
    note: "EDP · 50ml",
    price: "$150",
    image: "/assets/products/fragrance-2.jpg",
    category: "fragrance",
    amazonUrl: "https://www.amazon.com/dp/B0816NKJJF?tag=velnora-luxe-20",
    description:
      "A sparkling, vibrant citrus EDP bursting with sun-drenched orange blossom, clean petitgrain, and bright sea salt. Evokes the timeless romance of a Mediterranean escape.",
    features: ["Citrus blossom sparkle", "Sea salt freshness", "Mediterranean warmth"],
  },
  {
    id: "rose-obscura",
    name: "Rose Obscura",
    note: "EDP · 50ml",
    price: "$165",
    image: "/assets/products/fragrance-3.jpg",
    category: "fragrance",
    amazonUrl: "https://www.amazon.com/dp/B08W5NKKKF?tag=velnora-luxe-20",
    description:
      "A sultry, subverted rose fragrance cutting deep crimson petals with dark patchouli and spicy black pepper. A bold, poetic composition that commands absolute attention.",
    features: ["Deep rose heart", "Patchouli spice", "Bold sensuality"],
  },
  {
    id: "vetiver-noir",
    name: "Vetiver Noir",
    note: "EDP · 50ml",
    price: "$170",
    image: "/assets/products/fragrance-4.jpg",
    category: "fragrance",
    amazonUrl: "https://www.amazon.com/dp/B07Y5KKJFK?tag=velnora-luxe-20",
    description:
      "A crisp, earthy fragrance balancing bright green bergamot against deep, smokey vetiver roots and wet moss. Clean, sharp, and intensely memorable for day or night.",
    features: ["Green bergamot top", "Smoky vetiver base", "Modern earthy finish"],
  },

  // --- INSIDE-OUT BEAUTY (wellness) ---
  {
    id: "inner-glow-capsules",
    name: "Inner Glow Capsules",
    note: "Capsules · 60ct",
    price: "$58",
    image: "/assets/wellness.jpg",
    category: "wellness",
    amazonUrl: "https://www.amazon.com/dp/B09D5ND88F?tag=velnora-luxe-20",
    description:
      "A 30-day ingestible ritual packed with clean, clinical-grade antioxidants and botanical extracts. Fights oxidative stress from within to cultivate a long, healthy arc of skin radiance.",
    features: ["Clinical antioxidants", "Botanical support", "30-day ritual"],
    badge: "30-Day Ritual",
  },
  {
    id: "collagen-pearl",
    name: "Collagen Pearl",
    note: "Powder · 200g",
    price: "$48",
    image: "/assets/products/wellness-1.jpg",
    category: "wellness",
    amazonUrl: "https://www.amazon.com/dp/B08HNSKKF8?tag=velnora-luxe-20",
    description:
      "An exceptionally pure, easily absorbable marine collagen powder designed to mix seamlessly into morning rituals. Supports natural elasticity and structural skin firmness.",
    features: ["Marine collagen purity", "Easily mixable", "Supports elasticity"],
  },
  {
    id: "hair-density",
    name: "Hair Density Capsules",
    note: "Capsules · 60ct",
    price: "$42",
    image: "/assets/products/wellness-2.jpg",
    category: "wellness",
    amazonUrl: "https://www.amazon.com/dp/B0916NKKFK?tag=velnora-luxe-20",
    description:
      "A targeted, nutrient-rich blend of essential biotin, zinc, and amino acids. Directly fortifies the internal root matrix to support thick, vibrant hair growth.",
    features: ["Root matrix support", "Biotin and zinc", "Hair growth nourishment"],
  },
  {
    id: "skin-hydration",
    name: "Skin Hydration Capsules",
    note: "Capsules · 60ct",
    price: "$44",
    image: "/assets/products/wellness-3.jpg",
    category: "wellness",
    amazonUrl: "https://www.amazon.com/dp/B095KKJFK7?tag=velnora-luxe-20",
    description:
      "A moisture-locking phytoceramide complex that hydrates the cellular structure from the inside out. Visibly smooths rough patches and reduces dry flakes over time.",
    features: ["Phytoceramide hydration", "Smooths texture", "Interior moisture support"],
  },
  {
    id: "calm-clear",
    name: "Calm & Clear Tincture",
    note: "Tincture · 30ml",
    price: "$52",
    image: "/assets/products/wellness-4.jpg",
    category: "wellness",
    amazonUrl: "https://www.amazon.com/dp/B08X5NKKF2?tag=velnora-luxe-20",
    description:
      "A concentrated, stress-adaptogenic liquid elixir formulated to regulate internal triggers behind acne flare-ups. Balances and centers the body to promote clear skin harmony.",
    features: ["Stress-adaptogen blend", "Acne trigger support", "Liquid absorption"],
  },

  // --- BEAUTY TECH (tech) ---
  {
    id: "lumione-led-mask",
    name: "LumiOne LED Mask",
    note: "Device · Red/Blue Light",
    price: "$420",
    image: "/assets/tech.jpg",
    category: "tech",
    amazonUrl: "https://www.amazon.com/dp/B09K8NF8FF?tag=velnora-luxe-20",
    description:
      "An advanced, clinic-grade smart device harnessing targeted wavelengths of red and near-infrared light. Stimulates natural collagen synthesis to completely dress your vanity in innovation.",
    features: ["Red + NIR wavelengths", "Collagen stimulation", "Smart device control"],
    badge: "Smart Device",
  },
  {
    id: "microcurrent-wand",
    name: "Microcurrent Wand",
    note: "Device · 5-mode",
    price: "$280",
    image: "/assets/products/tech-1.jpg",
    category: "tech",
    amazonUrl: "https://www.amazon.com/dp/B09F5NKJJK?tag=velnora-luxe-20",
    description:
      "A pocket-sized, intelligent face-contouring wand that uses soft microcurrent waves to stimulate underlying facial muscles. Instantly lifts, defines, and sculpts the jaw and cheekbones.",
    features: ["Soft microcurrent", "Facial contouring", "Portable design"],
  },
  {
    id: "cryo-globes",
    name: "Cryo Globes",
    note: "Tool · Steel",
    price: "$78",
    image: "/assets/products/tech-2.jpg",
    category: "tech",
    amazonUrl: "https://www.amazon.com/dp/B08T3KKKJF?tag=velnora-luxe-20",
    description:
      "Chilled, medical-grade steel globes engineered to instantly de-puff, calm inflammation, and tighten pores. A soothing, ice-cold massage ritual that wakes up tired morning skin.",
    features: ["Steel cooling spheres", "De-puffing relief", "Pore-tightening massage"],
  },
  {
    id: "sonic-cleansing",
    name: "Sonic Cleansing Brush",
    note: "Brush · USB-C",
    price: "$140",
    image: "/assets/products/tech-3.jpg",
    category: "tech",
    amazonUrl: "https://www.amazon.com/dp/B08V5NKKKF?tag=velnora-luxe-20",
    description:
      "A ultra-hygienic silicone brush powered by sonic pulsations to extract hidden dirt and oils deep from pores. Preps the skin texture to maximize skincare product absorption.",
    features: ["Sonic silicone cleansing", "Deep pore extraction", "USB-C rechargeable"],
  },
  {
    id: "red-light-panel",
    name: "Red Light Panel",
    note: "Device · Pro",
    price: "$520",
    image: "/assets/products/tech-4.jpg",
    category: "tech",
    amazonUrl: "https://www.amazon.com/dp/B07T3KLKKF?tag=velnora-luxe-20",
    description:
      "A professional, stationary phototherapy panel engineered for broad-coverage face and chest treatments. Accelerates structural tissue repair and eviscerates widespread skin dullness.",
    features: ["Broad coverage therapy", "Red + NIR phototherapy", "Professional-grade output"],
  },
=======
    image: "/assets/products/makeup-1.jpg",
    category: "makeup",
    amazonUrl: "https://www.amazon.com/dp/XXXXXXXXXX?tag=YOUR-AFFILIATE-TAG",
    description: "A couture-grade lip lacquer with an impossibly smooth matte finish.",
    features: ["Long-wearing formula", "Hydrating base", "16-hour wear"],
    badge: "Editor's Pick",
  },
  // ... add all your products
>>>>>>> 4a85e38 (Refine site to editorial beauty curation UI)
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
