import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getBlogBySlug, type Blog } from "@/lib/blogs.server";
import { getSiteSettings } from "@/lib/settings.server";
import { getProductById } from "@/lib/products.server";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  loader: async ({ params }) => {
    const blog = await getBlogBySlug({ data: params.slug });
    if (!blog || blog.type !== 'blog') throw notFound();
    const settings = await getSiteSettings();
    return { blog, settings };
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

function BlogPostContent({ content, settings }: { content: string, settings: Record<string, string> }) {
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

  const pTagSplit = content.split("</p>");
  let part1 = content;
  let part2 = null;
  if (pTagSplit.length > 2) {
    part1 = pTagSplit.slice(0, 2).join("</p>") + "</p>";
    part2 = pTagSplit.slice(2).join("</p>");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-foreground/90 [&>div>p]:mb-6 [&>div>h2]:font-serif [&>div>h2]:text-2xl [&>div>h2]:mt-10 [&>div>h2]:mb-4 [&>div>h3]:font-serif [&>div>h3]:text-xl [&>div>h3]:mt-6 [&>div>h3]:mb-4 [&>div>ul]:list-disc [&>div>ul]:pl-6 [&>div>ul]:mb-6 [&>div>a]:underline [&>div>a]:underline-offset-4 hover:[&>div>a]:text-muted-foreground transition-colors [&>div>iframe]:w-full [&>div>iframe]:aspect-video [&>div>iframe]:rounded-lg [&>div>iframe]:my-8 [&>div>img]:rounded-lg [&>div>img]:my-8 [&>div>p>img]:rounded-lg [&>div>p>img]:my-8 [&>div>p>iframe]:w-full [&>div>p>iframe]:aspect-video [&>div>p>iframe]:rounded-lg [&>div>p>iframe]:my-8">
      {renderPart(part1)}
      {part2 && (
        <>
          <AdSenseUnit className="my-10" client={settings.adsense_client} slot={settings.adsense_slot} />
          {renderPart(part2)}
        </>
      )}
    </div>
  );
}

function BlogPost() {
  const { blog, settings } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-[1400px] px-6 md:px-12">
          {/* Header */}
          <header className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <span className="uppercase tracking-wider text-primary">{blog.category}</span>
              <span>•</span>
              <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleDateString()}</time>
            </div>
            <h1 className="mb-6 font-serif text-4xl md:text-5xl lg:text-6xl">{blog.title}</h1>
            {blog.excerpt && <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{blog.excerpt}</p>}
          </header>

          {/* Hero Media */}
          <div className="mb-16 space-y-8">
            {blog.coverImage && (
              <div className="overflow-hidden rounded-2xl bg-muted">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full object-cover"
                  style={{ maxHeight: "600px" }}
                />
              </div>
            )}
            
            {blog.videoUrl && (
              <div className="overflow-hidden rounded-2xl bg-muted">
                <video 
                  src={blog.videoUrl} 
                  controls 
                  className="w-full object-cover" 
                  style={{ maxHeight: "600px" }} 
                />
              </div>
            )}
          </div>

          <div className="mx-auto max-w-3xl">
            <BlogPostContent content={blog.content} settings={settings} />
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
