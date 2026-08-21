import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { login } from "@/lib/admin-auth.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
  head: () => ({
    meta: [{ title: "Admin Login — Velnora" }],
  }),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ data: { password } });
      await navigate({ to: "/admin" });
    } catch {
      setError("Incorrect password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="font-serif text-3xl">Velnora Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage products.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </main>
  );
}
