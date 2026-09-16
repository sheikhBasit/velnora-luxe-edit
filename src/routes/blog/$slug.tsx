import { createFileRoute, notFound } from "@tanstack/react-router";
import { getBlogBySlug, type Blog } from "@/lib/blogs.server";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { useEffect, useMemo } from "react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  loader: async ({ params }) => {
    const blog = await getBlogBySlug({ data: params.slug });
    if (!blog) throw notFound();
    return { blog };
  },
});

function AdSenseUnit({ className = "" }: { className?: string }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className={`my-8 flex justify-center w-full overflow-hidden bg-muted/20 py-4 min-h-[250px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

function BlogPostContent({ content }: { content: string }) {
  const parts = useMemo(() => {
    // Basic approach: split content by </p> tags to insert an ad after the 2nd paragraph
    const pTagSplit = content.split("</p>");
    
    if (pTagSplit.length > 2) {
      const part1 = pTagSplit.slice(0, 2).join("</p>") + "</p>";
      const part2 = pTagSplit.slice(2).join("</p>");
      return { part1, part2 };
    }
    
    return { part1: content, part2: null };
  }, [content]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-foreground/90 [&>p]:mb-6 [&>h2]:font-serif [&>h2]:text-3xl [&>h2]:mt-12 [&>h2]:mb-4 [&>h3]:font-serif [&>h3]:text-2xl [&>h3]:mt-8 [&>h3]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-muted-foreground transition-colors">
      <div dangerouslySetInnerHTML={{ __html: parts.part1 }} />
      {parts.part2 && (
        <>
          <AdSenseUnit className="my-10" />
          <div dangerouslySetInnerHTML={{ __html: parts.part2 }} />
        </>
      )}
    </div>
  );
}

function BlogPost() {
  const { blog } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-[1400px] px-6 md:px-12">
          <header className="mx-auto max-w-3xl mb-12 text-center">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              {blog.category}
            </p>
            <h1 className="font-serif text-4xl tracking-wide md:text-5xl leading-tight mb-6">
              {blog.title}
            </h1>
            <p className="text-muted-foreground">
              Published on {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </header>

          {blog.coverImage && (
            <div className="mb-16 aspect-video overflow-hidden rounded-sm bg-muted mx-auto max-w-5xl">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mx-auto max-w-3xl">
            <BlogPostContent content={blog.content} />
          </div>
        </article>

        {/* Bottom AdSense Unit just before the footer */}
        <div className="mx-auto max-w-5xl px-6 md:px-12 mt-24">
          <AdSenseUnit />
        </div>
      </main>

      <Footer />
    </div>
  );
}
