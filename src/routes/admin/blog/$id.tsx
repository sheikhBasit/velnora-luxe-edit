import { useState, useRef, useCallback, useMemo } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getBlogById, saveBlog, uploadBlogImage, type Blog, type BlogStep } from "@/lib/blogs.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, PackagePlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { lazy, Suspense, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = lazy(() => import("react-quill-new"));

function ClientOnly({ children, fallback }: { children: React.ReactNode, fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : <>{fallback}</>;
}

function QuillEditor({ value, onChange, modules, minHeight }: { value: string, onChange: (v: string) => void, modules: any, minHeight: string }) {
  const fallback = <div style={{ minHeight }} className="bg-muted animate-pulse rounded-md w-full" />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} />
      </Suspense>
    </ClientOnly>
  );
}

export const Route = createFileRoute("/admin/blog/$id")({
  component: AdminBlogForm,
  loader: async ({ params }) => {
    const { listProducts } = await import("@/lib/products.server");
    const products = await listProducts({ data: {} });
    if (params.id === "new") return { blog: null, products };
    const blog = await getBlogById({ data: params.id });
    if (!blog) throw notFound();
    return { blog, products };
  },
  errorComponent: ({ error }) => (
    <div className="p-4 text-red-500 font-mono text-sm whitespace-pre-wrap">
      Error: {error.message}
      {'\n\n'}
      {error.stack}
    </div>
  ),
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
  type: "blog",
  title: "",
  slug: "",
  category: "makeup",
  excerpt: "",
  coverImage: "",
  videoUrl: "",
  content: "",
  prerequisites: [""],
  steps: [{ title: "", instructions: "" }],
  published: true,
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

function ProductEmbedButton({ products, onSelect }: { products: any[], onSelect: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="mt-2">
          <PackagePlus className="w-4 h-4 mr-2" />
          Embed Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder="Search products..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {filtered.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelect(p.id);
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-muted text-sm flex items-center space-x-3"
              >
                {p.image && <img src={p.image} alt="" className="w-8 h-8 rounded-sm object-cover" />}
                <span>{p.name}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground p-2">No products found.</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdminBlogForm() {
  const { blog, products } = Route.useLoaderData();
  const isNew = blog === null;
  const navigate = useNavigate();

  const [form, setForm] = useState<Blog>(blog ?? { ...emptyBlog, id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString() });
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [videoBusy, setVideoBusy] = useState(false);
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

  const handleVideoFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video is too large (max 50MB)");
      return;
    }
    setVideoBusy(true);
    const toastId = toast.loading("Uploading featured video...");
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        const filename = `blogs/${form.slug || "post"}-${Date.now()}-${file.name}`;
        const { url } = await uploadBlogImage({ data: { filename, dataUrl } });
        setForm((f) => ({ ...f, videoUrl: url }));
        toast.success("Video uploaded", { id: toastId });
        setVideoBusy(false);
      };
    } catch {
      toast.error("Couldn't upload that video", { id: toastId });
      setVideoBusy(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug) {
      toast.error("Slug is required");
      return;
    }
    setSaving(true);
    try {
      await saveBlog({
        data: {
          id: form.id,
          type: form.type,
          title: form.title,
          slug: form.slug,
          category: form.category,
          excerpt: form.excerpt,
          coverImage: form.coverImage,
          videoUrl: form.videoUrl,
          content: form.content,
          prerequisites: form.prerequisites.filter(Boolean),
          steps: form.steps,
          published: form.published,
        },
      });
      toast.success(isNew ? "Created successfully" : "Saved successfully");
      await navigate({ to: "/admin/blog" });
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addPrerequisite = () => setForm(f => ({ ...f, prerequisites: [...f.prerequisites, ""] }));
  const removePrerequisite = (index: number) => setForm(f => ({ ...f, prerequisites: f.prerequisites.filter((_, i) => i !== index) }));
  const updatePrerequisite = (index: number, val: string) => setForm(f => ({
    ...f,
    prerequisites: f.prerequisites.map((p, i) => i === index ? val : p)
  }));

  const addStep = () => setForm(f => ({ ...f, steps: [...f.steps, { title: "", instructions: "" }] }));
  const removeStep = (index: number) => setForm(f => ({ ...f, steps: f.steps.filter((_, i) => i !== index) }));
  const updateStep = (index: number, field: keyof BlogStep, val: string) => setForm(f => ({
    ...f,
    steps: f.steps.map((s, i) => i === index ? { ...s, [field]: val } : s)
  }));

  const quillRef = useRef<any>(null);
  const stepQuillRefs = useRef<Array<any | null>>([]);

  const imageHandler = useCallback(function(this: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        if (file.size > 12 * 1024 * 1024) {
          toast.error("Image is too large (max 12MB)");
          return;
        }
        const toastId = toast.loading("Uploading image...");
        try {
          const dataUrl = await fileToDataUrl(file);
          const filename = `content/${Date.now()}.jpg`;
          const { url } = await uploadBlogImage({ data: { filename, dataUrl } });
          
          const quill = this.quill;
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', url);
          }
          toast.success("Image uploaded", { id: toastId });
        } catch (error) {
          toast.error("Failed to upload image", { id: toastId });
        }
      }
    };
  }, []);

  const videoHandler = useCallback(function(this: any) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/mp4,video/webm');
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          toast.error("Video is too large (max 50MB)");
          return;
        }
        const toastId = toast.loading("Uploading video...");
        try {
          // Read video as data URL
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const dataUrl = reader.result as string;
            const filename = `content/${Date.now()}-${file.name}`;
            const { url } = await uploadBlogImage({ data: { filename, dataUrl } });
            
            const quill = this.quill;
            if (quill) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'video', url);
            }
            toast.success("Video uploaded", { id: toastId });
          };
        } catch (error) {
          toast.error("Failed to upload video", { id: toastId });
        }
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler
      }
    }
  }), [imageHandler, videoHandler]);

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl">{isNew ? "Add Content" : `Edit "${blog.title}"`}</h1>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Label>Type:</Label>
            <Select
              value={form.type}
              onValueChange={(type: "blog" | "tutorial") => setForm((f) => ({ ...f, type }))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={form.published}
              onCheckedChange={(checked) => setForm((f) => ({ ...f, published: checked }))}
            />
            <Label htmlFor="published">{form.published ? "Published" : "Draft"}</Label>
          </div>
        </div>
      </div>

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
        <Label htmlFor="video">Featured Video (Optional)</Label>
        <Input
          id="video"
          type="file"
          accept="video/mp4,video/webm"
          disabled={videoBusy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleVideoFile(file);
          }}
        />
        <p className="text-xs text-muted-foreground">
          {videoBusy
            ? "Uploading…"
            : form.videoUrl
              ? `Current video uploaded. Choose a new one to replace it.`
              : "Upload a main featured video for this article or tutorial (max 50MB)."}
        </p>
        {form.videoUrl && !videoBusy && (
          <video src={form.videoUrl} controls className="h-32 rounded-md mt-2" />
        )}
      </div>

      {form.type === "blog" && (
        <div className="space-y-2">
          <Label>Article Content</Label>
          <div className="bg-background [&_.ql-container]:min-h-[400px] [&_.ql-container]:text-base [&_.ql-editor]:min-h-[400px]">
            <QuillEditor
              value={form.content}
              onChange={(content) => setForm((f) => ({ ...f, content }))}
              modules={modules}
              minHeight="400px"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Tip: You can also manually type {"{{"}product:PRODUCT_ID{"}}"} to embed a product.
            </p>
            <ProductEmbedButton 
              products={products} 
              onSelect={(id) => {
                const text = `{{product:${id}}}`;
                setForm(f => ({ ...f, content: f.content + `\n<p>${text}</p>\n` }));
              }} 
            />
          </div>
        </div>
      )}

      {form.type === "tutorial" && (
        <>
          <div className="space-y-4 pt-4 border-t border-border">
            <Label className="text-lg">Prerequisites</Label>
            {form.prerequisites.map((p, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Input value={p} onChange={(e) => updatePrerequisite(i, e.target.value)} placeholder="e.g. Moisturizer, Specific Brush..." />
                <Button type="button" variant="ghost" size="sm" onClick={() => removePrerequisite(i)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addPrerequisite}>
              <Plus className="w-4 h-4 mr-2" /> Add Prerequisite
            </Button>
          </div>

          <div className="space-y-8 pt-4 border-t border-border">
            <Label className="text-lg">Steps</Label>
            {form.steps.map((s, i) => (
              <div key={i} className="space-y-4 p-4 border border-border rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Step {i + 1}</h3>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(i)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Step Title</Label>
                  <Input value={s.title} onChange={(e) => updateStep(i, 'title', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <div className="bg-background [&_.ql-container]:min-h-[150px] [&_.ql-container]:text-base [&_.ql-editor]:min-h-[150px]">
                    <QuillEditor
                      value={s.instructions}
                      onChange={(content) => updateStep(i, 'instructions', content)}
                      modules={modules}
                      minHeight="150px"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      Tip: You can also manually type {"{{"}product:PRODUCT_ID{"}}"} to embed a product.
                    </p>
                    <ProductEmbedButton 
                      products={products} 
                      onSelect={(id) => {
                        const text = `{{product:${id}}}`;
                        updateStep(i, 'instructions', s.instructions + `\n<p>${text}</p>\n`);
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addStep}>
              <Plus className="w-4 h-4 mr-2" /> Add Step
            </Button>
          </div>
        </>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || imageBusy}>
          {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
