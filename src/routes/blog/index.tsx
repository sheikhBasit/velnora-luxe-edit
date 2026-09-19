import { createFileRoute, Link } from "@tanstack/react-router";
import { listBlogs, type Blog } from "@/lib/blogs.server";
import { Header } from "@/components/velnora/Header";
import { Footer } from "@/components/velnora/Footer";
import { useEffect, Fragment } from "react";

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  loader: async () => {
    const allBlogs = await listBlogs({ data: { type: 'blog' } });
    return { blogs: allBlogs.filter(b => b.published) };
  },
});

function AdSenseUnit() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className="my-12 flex justify-center w-full overflow-hidden bg-muted/20 py-4 min-h-[250px]">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

function BlogIndex() {
  const { blogs } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <header className="mb-16 text-center">
            <h1 className="font-serif text-4xl tracking-wide md:text-5xl">THE EDITORIAL</h1>
            <p className="mt-4 text-muted-foreground uppercase tracking-widest text-sm">
              Curated beauty insights & rituals
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {blogs.map((blog: Blog, index: number) => {
              // Insert AdSense after the first 3 posts (or any strategic spot)
              const showAd = index === 3;
              
              return (
                <Fragment key={blog.id}>
                  {showAd && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                      <AdSenseUnit />
                    </div>
                  )}
                  <article className="group flex flex-col space-y-4">
                    <Link to="/blog/$slug" params={{ slug: blog.slug }} className="block overflow-hidden rounded-sm aspect-[4/3]">
                      <img
                        src={blog.coverImage || "/placeholder.svg"}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {blog.category}
                      </p>
                      <h2 className="font-serif text-xl tracking-wide group-hover:underline">
                        <Link to="/blog/$slug" params={{ slug: blog.slug }}>
                          {blog.title}
                        </Link>
                      </h2>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {blog.excerpt}
                      </p>
                    </div>
                  </article>
                </Fragment>
              );
            })}
          </div>

          {blogs.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              <p>No articles published yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
