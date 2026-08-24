import { useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getProductById, saveProduct, uploadProductImage } from "@/lib/products.server";
import { categories, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/product/$id")({
  component: AdminProductForm,
  loader: async ({ params }) => {
    if (params.id === "new") return { product: null };
    const product = await getProductById({ data: params.id });
    if (!product) throw notFound();
    return { product };
  },
});

// Resize/compress client-side before upload so a phone photo doesn't ship multiple MB to Blob storage.
async function fileToDataUrl(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyProduct: Product = {
  id: "",
  brandName: "",
  name: "",
  note: "",
  price: "",
  image: "",
  category: categories[0].id,
  retailerUrl: "",
  description: "",
  features: [],
  badge: "",
  featured: false,
  sortOrder: 0,
};

function AdminProductForm() {
  const { product } = Route.useLoaderData();
  const isNew = product === null;
  const navigate = useNavigate();

  const [form, setForm] = useState<Product>(product ?? emptyProduct);
  const [featuresText, setFeaturesText] = useState((product?.features ?? []).join("\n"));
  const [idTouched, setIdTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageFile = async (file: File) => {
    if (file.size > 12 * 1024 * 1024) {
      toast.error("Image is too large (max 12MB)");
      return;
    }
    setImageBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreviewUrl(dataUrl);
      const filename = `products/${form.id || "product"}-${Date.now()}.jpg`;
      const { url } = await uploadProductImage({ data: { filename, dataUrl } });
      setForm((f) => ({ ...f, image: url }));
    } catch {
      toast.error("Couldn't upload that image");
      setPreviewUrl(null);
    } finally {
      setImageBusy(false);
    }
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, id: idTouched ? f.id : slugify(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) {
      toast.error("Product needs an id/slug");
      return;
    }
    setSaving(true);
    try {
      await saveProduct({
        data: {
          ...form,
          badge: form.badge?.trim() ? form.badge : undefined,
          features: featuresText
            .split("\n")
            .map((line: string) => line.trim())
            .filter(Boolean),
        },
      });
      toast.success(isNew ? "Product created" : "Product saved");
      await navigate({ to: "/admin" });
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h1 className="font-serif text-2xl">{isNew ? "Add product" : `Edit "${product.name}"`}</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="brandName">Brand name</Label>
          <Input
            id="brandName"
            placeholder="SISLEY PARIS"
            value={form.brandName ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="id">Slug (URL id)</Label>
          <Input
            id="id"
            value={form.id}
            disabled={!isNew}
            onChange={(e) => {
              setIdTouched(true);
              setForm((f) => ({ ...f, id: slugify(e.target.value) }));
            }}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="note">Note</Label>
          <Input
            id="note"
            placeholder="Liquid · Deep Plum"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            placeholder="$48"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="badge">Badge (optional)</Label>
          <Input
            id="badge"
            placeholder="Editor's Pick"
            value={form.badge ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={form.category}
          onValueChange={(category) => setForm((f) => ({ ...f, category }))}
        >
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <Label htmlFor="image">Product photo</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            disabled={imageBusy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file);
            }}
          />
          <p className="text-xs text-muted-foreground">
            {imageBusy
              ? "Uploading…"
              : isNew || !form.image
                ? "Choose a photo from your computer or phone."
                : "Choose a new photo to replace the current one, or leave blank to keep it."}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Preview</Label>
          <img
            src={previewUrl ?? form.image}
            alt=""
            className="h-16 w-16 rounded-sm border border-border bg-muted object-cover"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="retailerUrl">Retailer link (Amazon, etc.)</Label>
        <Input
          id="retailerUrl"
          placeholder="https://…"
          value={form.retailerUrl}
          onChange={(e) => setForm((f) => ({ ...f, retailerUrl: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <textarea
          id="features"
          rows={4}
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="featured"
          checked={form.featured}
          onCheckedChange={(featured) => setForm((f) => ({ ...f, featured }))}
        />
        <Label htmlFor="featured">Featured on homepage section</Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="showOnEditorial"
          checked={form.showOnEditorial ?? true}
          onCheckedChange={(showOnEditorial) => setForm((f) => ({ ...f, showOnEditorial }))}
        />
        <Label htmlFor="showOnEditorial">Show on Editorial page</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || imageBusy}>
          {saving ? "Saving…" : isNew ? "Create product" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
