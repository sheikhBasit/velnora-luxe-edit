import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getBlogBySlug } from "@/lib/blogs.server";
import { getSiteSettings } from "@/lib/settings.server";
import { getProductById } from "@/lib/products.server";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/tutorial/$slug")({
  component: TutorialPage,
  loader: async ({ params }) => {
    const tutorial = await getBlogBySlug({ data: params.slug });
    if (!tutorial || tutorial.type !== 'tutorial') throw notFound();
    const settings = await getSiteSettings();
    return { tutorial, settings };
  },
});

function AdSenseUnit({ 
  className = "",
  client,
  slot
}: { 
  className?: string;
  client?: string;
  slot?: string;
}) {
  useEffect(() => {
    if (!client || !slot) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <div className={`my-8 flex justify-center w-full overflow-hidden bg-muted/20 py-4 min-h-[250px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

function ProductEmbed({ id }: { id: string }) {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById({ data: id }),
  });

  if (isLoading) return <div className="my-6 p-4 border rounded-md bg-muted/20 animate-pulse h-32" />;
  if (!product) return null;

  return (
    <div className="my-8 flex flex-col sm:flex-row gap-6 p-6 border border-border rounded-lg bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="shrink-0">
        <img src={product.image} alt={product.name} className="w-full sm:w-32 aspect-square object-cover rounded-md" />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h4 className="font-serif text-xl mb-2">{product.brandName} {product.name}</h4>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
        <a 
          href={product.retailerUrl} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center text-sm font-medium hover:underline text-primary"
        >
          Shop Now <ExternalLink className="ml-1 w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function RichTextWithProducts({ content }: { content: string }) {
  const renderPart = (html: string) => {
    const regex = /\{\{product:([a-zA-Z0-9_-]+)\}\}/g;
    const blocks = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(html)) !== null) {
      if (match.index > lastIndex) {
        blocks.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: html.substring(lastIndex, match.index) }} />);
      }
      blocks.push(<ProductEmbed key={`prod-${match[1]}-${match.index}`} id={match[1]} />);
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < html.length) {
      blocks.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: html.substring(lastIndex) }} />);
    }
    
    return blocks.length > 0 ? blocks : <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="text-lg leading-relaxed text-foreground/90 [&>div>p]:mb-6 [&>div>h2]:font-serif [&>div>h2]:text-2xl [&>div>h2]:mt-10 [&>div>h2]:mb-4 [&>div>h3]:font-serif [&>div>h3]:text-xl [&>div>h3]:mt-6 [&>div>h3]:mb-4 [&>div>ul]:list-disc [&>div>ul]:pl-6 [&>div>ul]:mb-6 [&>div>a]:underline [&>div>a]:underline-offset-4 hover:[&>div>a]:text-muted-foreground transition-colors [&>div>iframe]:w-full [&>div>iframe]:aspect-video [&>div>iframe]:rounded-lg [&>div>iframe]:my-8 [&>div>img]:rounded-lg [&>div>img]:my-8 [&>div>p>img]:rounded-lg [&>div>p>img]:my-8 [&>div>p>iframe]:w-full [&>div>p>iframe]:aspect-video [&>div>p>iframe]:rounded-lg [&>div>p>iframe]:my-8">
      {renderPart(content)}
    </div>
  );
}

function TutorialPage() {
  const { tutorial, settings } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-[1400px] px-6 md:px-12">
          <header className="mx-auto max-w-3xl mb-12 text-center">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Step-by-step Tutorial
            </p>
            <h1 className="font-serif text-4xl tracking-wide md:text-5xl leading-tight mb-6">
              {tutorial.title}
            </h1>
            <p className="text-muted-foreground">
              {tutorial.steps.length} Steps &bull; Published on {new Date(tutorial.createdAt).toLocaleDateString()}
            </p>
          </header>

          {/* Hero Media */}
          <div className="mb-16 space-y-8 mx-auto max-w-5xl">
            {tutorial.coverImage && (
              <div className="aspect-video overflow-hidden rounded-sm bg-muted">
                <img
                  src={tutorial.coverImage}
                  alt={tutorial.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {tutorial.videoUrl && (
              <div className="aspect-video overflow-hidden rounded-sm bg-muted">
                <video
                  src={tutorial.videoUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="mx-auto max-w-3xl space-y-16">
            {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
              <div className="bg-muted/30 p-8 rounded-lg border border-border">
                <h2 className="font-serif text-2xl mb-6 text-center">What You'll Need</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {tutorial.prerequisites.map((p: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-16">
              {tutorial.steps.map((step: any, index: number) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-serif text-xl shrink-0">
                      {index + 1}
                    </div>
                    <h2 className="font-serif text-3xl">{step.title}</h2>
                  </div>
                  
                  <div className="pl-0 sm:pl-16">
                    <RichTextWithProducts content={step.instructions} />
                  </div>

                  {/* Show an ad after every 2nd step */}
                  {(index + 1) % 2 === 0 && index !== tutorial.steps.length - 1 && (
                    <div className="pl-0 sm:pl-16 mt-12">
                      <AdSenseUnit client={settings.adsense_client} slot={settings.adsense_slot} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Bottom AdSense Unit just before the footer */}
        <div className="mx-auto max-w-5xl px-6 md:px-12 mt-24">
          <AdSenseUnit client={settings.adsense_client} slot={settings.adsense_slot} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
