import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPage,
  head: () => ({
    meta: [{ title: "Privacy Policy — Velnora" }],
  }),
});

function PrivacyPage() {
  return (
    <main className="bg-background text-foreground">
      <Header hideMobileBottomNav />

      <div className="mx-auto max-w-[900px] px-6 py-24 md:py-32">
        <h1 className="font-serif text-4xl md:text-6xl">Privacy Policy</h1>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground">
          We respect your privacy. This page outlines our commitment to protecting visitor
          information. It describes what data we collect, how it's used, and how you can manage
          your preferences.
        </p>

        <section className="mt-10 space-y-6 text-sm text-muted-foreground">
          <p>
            Velnora collects minimal analytics to understand site performance and improve the
            editorial experience. We may also use affiliate tracking to attribute commissions on
            purchases made through links on our site.
          </p>
          <p>
            If you have questions about your data or would like more details, please contact us at
            <a className="underline ml-1" href="mailto:hello@velnora.com">hello@velnora.com</a>.
          </p>
        </section>

        <div className="mt-12">
          <Link to="/" className="text-sm underline">
            Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
