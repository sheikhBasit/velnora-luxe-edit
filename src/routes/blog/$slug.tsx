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
        <Link to="/product/$id" params={{ id: product.id }} className="block w-full sm:w-32">
          <img src={product.image} alt={product.name} className="aspect-square w-full rounded-md object-cover" />
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <Link to="/product/$id" params={{ id: product.id }} className="font-serif text-xl mb-2">
          {product.brandName && `${product.brandName} `}{product.name}
        </Link>
        <p className="mb-3 text-sm font-medium">{product.price}</p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
        {product.retailerUrl && (
          <a
            href={product.retailerUrl}
            target="_blank"
            rel="noreferrer sponsored"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Shop Now <ExternalLink className="ml-1 w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

function BlogPostContent({ content, settings }: { content: string, settings: Record<string, string> }) {
  const renderPart = (html: string) => {
    const normalizedHtml = html.replace(/(?:&nbsp;|&#160;|\u00a0)/gi, " ");
    const regex = /\{\{product:([a-zA-Z0-9_-]+)\}\}/g;
    const blocks = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(normalizedHtml)) !== null) {
      if (match.index > lastIndex) {
        blocks.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: normalizedHtml.substring(lastIndex, match.index) }} />);
      }
      blocks.push(<ProductEmbed key={`prod-${match[1]}-${match.index}`} id={match[1]} />);
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < normalizedHtml.length) {
      blocks.push(<div key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: normalizedHtml.substring(lastIndex) }} />);
    }
    
    return blocks.length > 0 ? blocks : <div dangerouslySetInnerHTML={{ __html: normalizedHtml }} />;
  };

  return (
    <div className="blog-reader-content mx-auto w-full max-w-5xl text-left text-foreground/90">
      {renderPart(content)}
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
          <header className="mx-auto mb-10 w-full max-w-5xl text-left sm:mb-12">
            <div className="mb-4 flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
              <span className="uppercase tracking-wider text-primary">{blog.category}</span>
              <span>•</span>
              <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleDateString()}</time>
            </div>
            <h1 className="font-serif text-[2.125rem] font-semibold leading-[1.12] sm:text-5xl sm:leading-[1.08] md:text-6xl lg:text-7xl">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="mt-5 max-w-4xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {blog.excerpt}
              </p>
            )}
          </header>

          {/* Hero Media */}
          <div className="mx-auto mb-14 w-full max-w-5xl space-y-8 sm:mb-16">
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

          <div className="mx-auto w-full max-w-5xl">
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
