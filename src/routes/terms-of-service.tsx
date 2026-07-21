import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";

export const Route = createFileRoute("/terms-of-service")({
  component: TermsPage,
  head: () => ({
    meta: [{ title: "Terms of Service — Velnora" }],
  }),
});

function TermsPage() {
  return (
    <main className="bg-background text-foreground">
      <Header hideMobileBottomNav />

      <div className="mx-auto max-w-[900px] px-6 py-24 md:py-32">
        <h1 className="font-serif text-4xl md:text-6xl">Terms of Service</h1>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground">
          These terms are a placeholder describing use of Velnora. They cover acceptable use,
          intellectual property, and affiliate disclosures. This file will be updated with the
          complete legal terms soon.
        </p>

        <section className="mt-10 space-y-6 text-sm text-muted-foreground">
          <p>
            Use of the Velnora site indicates acceptance of our editorial terms and affiliate
            model. If you disagree with any portion of the terms, please discontinue use of the
            service and contact us at <a className="underline" href="mailto:hello@velnora.com">hello@velnora.com</a>.
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
