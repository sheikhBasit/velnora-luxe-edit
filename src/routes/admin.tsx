import { createFileRoute, Outlet, redirect, useNavigate, Link } from "@tanstack/react-router";
import { checkAdminSession, logout } from "@/lib/admin-auth";
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
        <Link to="/admin" className="font-serif text-xl">
          Velnora Admin
        </Link>
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
