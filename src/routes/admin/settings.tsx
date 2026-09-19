import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { getSiteSettings, saveSiteSettings } from "@/lib/settings.server";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
  loader: async () => {
    const settings = await getSiteSettings();
    return { settings };
  },
});

function AdminSettings() {
  const { settings } = Route.useLoaderData();
  const [form, setForm] = useState(settings || {});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteSettings({ data: form });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-serif text-2xl">Site Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="space-y-4 rounded-md border border-border p-4">
          <h2 className="font-medium">Google AdSense</h2>
          <p className="text-sm text-muted-foreground">
            Configure your display ads. Once set, ads will automatically appear in supported locations like between blog paragraphs and at the end of content.
          </p>
          <div className="space-y-2">
            <Label htmlFor="adsense_client">AdSense Client (e.g., ca-pub-1234567890)</Label>
            <Input
              id="adsense_client"
              value={form.adsense_client || ""}
              onChange={(e) => setForm({ ...form, adsense_client: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adsense_slot">AdSense Slot ID (e.g., 1234567890)</Label>
            <Input
              id="adsense_slot"
              value={form.adsense_slot || ""}
              onChange={(e) => setForm({ ...form, adsense_slot: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
