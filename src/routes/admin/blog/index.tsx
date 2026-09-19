import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { listBlogs, deleteBlog, type Blog } from "@/lib/blogs.server";
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

export const Route = createFileRoute("/admin/blog/")({
  component: AdminBlogList,
  loader: async () => ({ blogs: await listBlogs({ data: undefined }) }),
});

function AdminBlogList() {
  const { blogs } = Route.useLoaderData();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBlog({ data: id });
      toast.success("Item deleted");
      await router.invalidate();
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Blogs & Tutorials ({blogs.length})</h1>
        <Button asChild>
          <Link to="/admin/blog/$id" params={{ id: "new" }}>
            Add New
          </Link>
        </Button>
      </div>

      {blogs.length === 0 && (
        <div className="mb-6 flex items-center justify-between rounded-md border border-border bg-muted/40 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            No items yet. Click the button to create your first post.
          </p>
        </div>
      )}

      {blogs.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog: Blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <img
                    src={blog.coverImage || "/placeholder.svg"}
                    alt={blog.title}
                    className="h-10 w-10 rounded-sm object-cover bg-muted"
                  />
                </TableCell>
                <TableCell>
                  <span className="uppercase text-xs tracking-wider text-muted-foreground font-medium">
                    {blog.type}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${blog.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell>{blog.category}</TableCell>
                <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/blog/$id" params={{ id: blog.id }}>
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={deletingId === blog.id}>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{blog.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This removes the item everywhere on the site. This can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(blog.id)}>
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
      )}
    </div>
  );
}
