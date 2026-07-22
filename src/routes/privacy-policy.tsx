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
          VELNORA is an independent editorial curation platform. We respect your privacy and are committed to protecting your personal information while you browse our recommendations and retailer links.
        </p>

        <section className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            We collect only the information necessary to operate the site, understand performance, and improve the editorial experience. This may include standard analytics data such as device, browser, and site interaction information, as well as information you voluntarily provide through forms or communications.
          </p>
          <p>
            VELNORA may use affiliate and referral tracking to attribute purchases made through curated retailer links. This helps us maintain our editorial platform at no additional cost to you. We do not sell personal data to third parties for unrelated marketing purposes.
          </p>
          <p>
            VELNORA operates strictly as an editorial curation portal and shopping directory. We do not collect, process, or store personal user accounts, payment data, or order records. Any transactions, data inquiries, support requests, and account-related matters are handled directly on the destination merchant or brand websites.
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
