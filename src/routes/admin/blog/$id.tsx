import { useState } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getBlogById, saveBlog, uploadBlogImage, type Blog } from "@/lib/blogs.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/blog/$id")({
  component: AdminBlogForm,
  loader: async ({ params }) => {
    if (params.id === "new") return { blog: null };
    const blog = await getBlogById({ data: params.id });
    if (!blog) throw notFound();
    return { blog };
  },
});

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

const emptyBlog: Blog = {
  id: "",
  title: "",
  slug: "",
  category: "makeup",
  excerpt: "",
  coverImage: "",
  content: "",
  createdAt: "",
};

const blogCategories = [
  { id: "makeup", label: "MAKEUP" },
  { id: "skincare", label: "SKINCARE" },
  { id: "hair", label: "HAIR" },
  { id: "body", label: "BODY" },
  { id: "tools", label: "TOOLS" },
  { id: "fragrance", label: "FRAGRANCE" },
  { id: "wellness", label: "WELLNESS" },
  { id: "beauty-tech", label: "BEAUTY TECH" },
];

function AdminBlogForm() {
  const { blog } = Route.useLoaderData();
  const isNew = blog === null;
  const navigate = useNavigate();

  const [form, setForm] = useState<Blog>(blog ?? { ...emptyBlog, id: crypto.randomUUID() });
  const [slugTouched, setSlugTouched] = useState(!isNew);
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
      const filename = `blogs/${form.slug || "post"}-${Date.now()}.jpg`;
      const { url } = await uploadBlogImage({ data: { filename, dataUrl } });
      setForm((f) => ({ ...f, coverImage: url }));
    } catch {
      toast.error("Couldn't upload that image");
      setPreviewUrl(null);
    } finally {
      setImageBusy(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug) {
      toast.error("Blog needs a slug");
      return;
    }
    setSaving(true);
    try {
      await saveBlog({
        data: {
          id: form.id,
          title: form.title,
          slug: form.slug,
          category: form.category,
          excerpt: form.excerpt,
          coverImage: form.coverImage,
          content: form.content,
        },
      });
      toast.success(isNew ? "Blog created" : "Blog saved");
      await navigate({ to: "/admin/blog" });
    } catch {
      toast.error("Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl">{isNew ? "Add blog post" : `Edit "${blog.title}"`}</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL id)</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
            }}
            required
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
            {blogCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Short Excerpt</Label>
        <textarea
          id="excerpt"
          rows={3}
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <Label htmlFor="image">Cover photo</Label>
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
              : isNew || !form.coverImage
                ? "Choose a photo from your computer or phone."
                : "Choose a new photo to replace the current one, or leave blank to keep it."}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Preview</Label>
          {previewUrl ?? form.coverImage ? (
            <img
              src={previewUrl ?? form.coverImage}
              alt=""
              className="h-24 w-40 rounded-sm border border-border bg-muted object-cover"
            />
          ) : (
            <div className="h-24 w-40 rounded-sm border border-border bg-muted" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Article Content (HTML)</Label>
        <textarea
          id="content"
          rows={15}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="<h1>Heading</h1><p>Content...</p>"
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || imageBusy}>
          {saving ? "Saving…" : isNew ? "Create blog post" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
