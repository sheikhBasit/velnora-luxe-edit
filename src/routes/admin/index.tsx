import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { listProducts, deleteProduct, seedStarterCatalog } from "@/lib/products.server";
import { categories, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/")({
  component: AdminProductList,
  loader: async () => ({ products: await listProducts({ data: {} }) }),
});

function AdminProductList() {
  const { products } = Route.useLoaderData();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProduct({ data: id });
      toast.success("Product deleted");
      await router.invalidate();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const { inserted } = await seedStarterCatalog();
      toast.success(`Added ${inserted} starter products`);
      await router.invalidate();
    } catch {
      toast.error("Failed to seed starter catalog");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Products ({products.length})</h1>
        <Button asChild>
          <Link to="/admin/product/$id" params={{ id: "new" }}>
            Add product
          </Link>
        </Button>
      </div>

      {products.length === 0 && (
        <div className="mb-6 flex items-center justify-between rounded-md border border-border bg-muted/40 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            No products yet. Seed the starter catalog to launch with the current site content.
          </p>
          <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding}>
            {seeding ? "Seeding…" : "Seed starter catalog"}
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Editorial</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: Product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-10 w-10 rounded-sm object-cover bg-muted"
                />
              </TableCell>
              <TableCell>{product.brandName}</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{categoryLabel(product.category)}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.featured ? "Yes" : ""}</TableCell>
              <TableCell>{product.showOnEditorial !== false ? "Yes" : ""}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/product/$id" params={{ id: product.id }}>
                    Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deletingId === product.id}>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{product.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes the product everywhere on the site. This can't be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(product.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
