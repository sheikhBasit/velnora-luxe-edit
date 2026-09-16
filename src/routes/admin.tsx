import { createFileRoute, Outlet, redirect, useNavigate, Link } from "@tanstack/react-router";
import { checkAdminSession, logout } from "@/lib/admin-auth.server";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: async () => {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) {
      throw redirect({ to: "/admin-login" });
    }
  },
});

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await navigate({ to: "/admin-login" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/admin" className="font-serif text-xl">
            Velnora Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground [&.active]:text-foreground" activeOptions={{ exact: true }}>
              Products
            </Link>
            <Link to="/admin/blog" className="text-muted-foreground hover:text-foreground [&.active]:text-foreground">
              Blogs
            </Link>
          </nav>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </header>
      <div className="px-6 py-8">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}
