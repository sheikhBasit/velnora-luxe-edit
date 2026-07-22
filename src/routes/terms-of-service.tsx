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
          Welcome to VELNORA. By accessing or using this site, you agree to the terms below, which govern your use of our editorial curation platform and related content.
        </p>

        <section className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            VELNORA is an independent editorial curation portal. We publish recommendations and links to third-party retailers for informational and discovery purposes only. We do not operate as a storefront, and we do not process orders, arrange shipping, or provide customer support for products featured on the site.
          </p>
          <p>
            Any purchase you make through a retailer link is subject to the third-party merchant&apos;s terms, pricing, shipping, return, and warranty policies. VELNORA may earn a commission when a qualifying purchase is made through our links, at no additional cost to you.
          </p>
          <p>
            The content on this site, including text, imagery, and editorial selections, is protected by copyright and other intellectual property rights. You may view and share content for personal, non-commercial use, but you may not copy, reproduce, or redistribute it without permission.
          </p>
          <p>
            For questions regarding these terms or the operation of the site, please contact us at <a className="underline" href="mailto:hello@velnora.com">hello@velnora.com</a>.
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
